import { io } from "socket.io-client";

export const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('messageToClient', (data: any) => {
    console.log(`Received message: ${data.sender}: ${data.message}`);
    // Display the message in your chat UI
});

function sendMessage(text: string, username: string) {
    socket.emit('newMessage', { text, username });
}

// Example usage:
sendMessage('Hello everyone!', 'JohnDoe');