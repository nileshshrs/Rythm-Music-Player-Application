import express from 'express';
import "dotenv/config"; // loads .env automatically
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT } from './utils/constants/env.js';
import connect from './database/connect.js';
import error from './middleware/error.js';
import authRoutes from './routes/auth.route.js';
import authenticate from './middleware/authenticate.js';
import userRoutes from './routes/user.routes.js';
import albumRoutes from './routes/album.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import songRoutes from './routes/song.routes.js';
import playlistRoutes from './routes/playlist.routes.js';
import { Server as SocketIOServer } from 'socket.io';
import socketHandler from './config/socket.js';
import http from 'http';
import conversationRoutes from './routes/conversation.routes.js';
import messageRoutes from './routes/message.routes.js';


// Create the Express app
const app = express();
const server = http.createServer(app)

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], // removed extra space
    credentials: true,
}));

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", authenticate, userRoutes)
app.use("/api/v1/album", albumRoutes) // Ensure albumRoutes is imported correctly
app.use("/api/v1/upload", authenticate, uploadRoutes) // Ensure userRoutes is imported correctly
app.use("/api/v1/songs", songRoutes) // Ensure albumRoutes is imported correctly
app.use("/api/v1/playlist", authenticate, playlistRoutes)
app.use("/api/v1/conversation", authenticate, conversationRoutes)
app.use("/api/v1/message", authenticate, messageRoutes);

app.use(error)

// ----- SOCKET.IO -----
const io = new SocketIOServer(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true
    }
});

socketHandler(io);
// Start the server
server.listen(PORT, async () => {
    console.log(`App is running on port ${PORT} in a dev environment`);
    connect(); // Ensure this function is defined and imported correctly
});
