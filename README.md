# Socket.IO Chat Application

A real-time chat application built with Socket.IO, featuring username authentication, message persistence, typing indicators, and private messaging capabilities.

## Features

- **Username Authentication**: Users must enter a username before joining the chat
- **Real-time Messaging**: Instant message delivery using WebSocket connections
- **Message Persistence**: Chat history is stored in SQLite database with connection state recovery
- **User Presence**: See who's online and get notified when users join/leave
- **Typing Indicators**: See when other users are typing
- **Private Messaging**: Send private messages to specific users
- **Message History**: Automatic recovery of missed messages when reconnecting

## Tech Stack

- **Backend**: Node.js with Express.js
- **Real-time Communication**: Socket.IO
- **Database**: SQLite with sqlite3
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Styling**: Custom CSS with responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/socket-io-chat.git
cd socket-io-chat
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Enter a username and start chatting!

## Project Structure

```
socket-io-example/
├── index.js          # Main server file
├── index.html        # Client-side HTML
├── styles.css        # Styling
├── package.json      # Dependencies and scripts
├── chat.db           # SQLite database (auto-generated)
└── README.md         # This file
```

## Dependencies

```json
{
  "express": "^4.18.x",
  "socket.io": "^4.7.x",
  "sqlite3": "^5.1.x",
  "sqlite": "^5.0.x"
}
```

## API Events

### Client to Server Events

- `chat message` - Send a chat message
- `private message` - Send a private message to specific user
- `typing` - Notify others that user is typing

### Server to Client Events

- `chat message` - Receive a chat message
- `private message` - Receive a private message
- `user joined` - User joined notification
- `user left` - User left notification
- `online users` - List of currently online users
- `typing` - Someone is typing notification

## Features in Detail

### Username System
- Modal overlay for username entry
- Username validation and trimming
- Persistent username throughout session

### Message Persistence
- SQLite database stores all messages with usernames
- Connection state recovery for missed messages
- Automatic message history loading

### Real-time Features
- Instant message delivery
- Live typing indicators
- Online user list updates
- Join/leave notifications

### Private Messaging
- Click on online users to send private messages
- Visual indication of private message mode
- Encrypted private message delivery

## Database Schema

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_offset TEXT UNIQUE,
    content TEXT,
    nickname TEXT
);
```

## Configuration

The server runs on port 3000 by default. You can modify this in `index.js`:

```javascript
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
```

## Development

To run in development mode with auto-restart:

```bash
npm install -g nodemon
nodemon index.js
```

## Known Issues

- Database file is recreated on each server restart (for development)
- No user authentication persistence across browser sessions
- No message encryption for private messages

## Future Enhancements

- [ ] User registration and authentication
- [ ] Message encryption
- [ ] File sharing capabilities
- [ ] Emoji support
- [ ] Message search functionality
- [ ] User profiles and avatars
- [ ] Chat rooms/channels
- [ ] Message reactions
- [ ] Dark/light theme toggle



## Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Express.js](https://expressjs.com/) for the web framework
- [SQLite](https://www.sqlite.org/) for database functionality
