import { io } from "socket.io-client";

export const socket = io('http://localhost:3000');
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

// socket.on('messageToClient', (data: any) => {
//     // Display the message in your chat UI
// });

// const sendMessage = () => {
//     // socket.emit('newMessage', { text, username });
// }

// Example usage:
// sendMessage('Hello everyone!', 'JohnDoe');