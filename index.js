import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

// Delete the database file if it exists
if (fs.existsSync("chat.db")) {
  fs.unlinkSync("chat.db");
}

// open the database file
const db = await open({
  filename: "chat.db",
  driver: sqlite3.Database,
});

// create our 'messages' table (you can ignore the 'client_offset' column for now)
await db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_offset TEXT UNIQUE,
      content TEXT,
      nickname TEXT
  );
`);

const app = express();
const onlineUsers = new Set();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", async (socket) => {
  const username = socket.handshake.auth.username || "Anonymous";

  // Store username in socket data
  socket.data.username = username;

  // Notify other users that someone joined
  socket.broadcast.emit("user joined", username);

  onlineUsers.add(username);
  io.emit("online users", Array.from(onlineUsers));

  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.data.username);
  });
  
  socket.on("stop typing", () => {
    socket.broadcast.emit("stop typing", socket.data.username);
  });

  socket.on("chat message", async (msg, clientOffset, callback) => {
    //console.log("Received message:", msg, "from:", username); // Add this line
    let result;
    try {
      // store the message in the database
      result = await db.run(
        "INSERT INTO messages (content, client_offset, nickname) VALUES (?, ?, ?)",
        msg,
        clientOffset,
        username
      );
    } catch (e) {
      if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
        // the message was already inserted, so we notify the client
        callback();
      } else {
        // nothing to do, just let the client retry
      }
      return;
    }
    // include the offset with the message
    io.emit("chat message", {
      message: msg,
      username: username,
      serverOffset: result.lastID
    });
    callback();
  });

  socket.on("disconnect", () => {
    // Notify other users that someone left
    socket.broadcast.emit("user left", username);
    onlineUsers.delete(username);
    io.emit("online users", Array.from(onlineUsers));
  });

  if (!socket.recovered) {
    // if the connection state recovery was not successful
    try {
      await db.each(
        "SELECT id, content, nickname FROM messages WHERE id > ?",
        [socket.handshake.auth.serverOffset || 0],
        (_err, row) => {
          socket.emit("chat message", {
            message: row.content,
            username: row.nickname,
            serverOffset: row.id
          });
        }
      );
    } catch (e) {
      // something went wrong
    }
  }
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
