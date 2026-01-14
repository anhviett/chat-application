import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
        token: localStorage.getItem('accessToken') || ''
    }
});

// Update token khi reconnect
socket.on('connect_attempt', () => {
    console.log('🔄 Connect attempt...');
    const token = localStorage.getItem('accessToken');
    socket.auth = { token };
});

socket.on('connect', () => {
    console.log('✅ Connected to WebSocket server');
});

socket.on('connect_error', (err) => {
    console.error('❌ Connection Error:', err);
});

socket.on('disconnect', (reason) => {
    console.warn('⚠️ Disconnected:', reason);
});

const sendMessage = (event: string, data: any) => {
    console.log('event, data: ', event, data);
    socket.emit(event, data);
}