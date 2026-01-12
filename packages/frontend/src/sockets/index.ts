import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
});
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

socket.on('messageToClient', (data: any) => {
    // Display the message in your chat UI
});

const sendMessage = () => {
    // socket.emit('newMessage', { text, username });
}

// Example usage:
// sendMessage('Hello everyone!', 'JohnDoe');