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

// Create the Express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], // removed extra space
    credentials: true,
}));

app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", authenticate, userRoutes)
app.use("/api/v1/album",  albumRoutes) // Ensure albumRoutes is imported correctly
app.use("/api/v1/upload", uploadRoutes) // Ensure userRoutes is imported correctly



app.use(error)

// Start the server
app.listen(PORT, async () => {
    console.log(`App is running on port ${PORT} in a dev environment`);
    connect(); // Ensure this function is defined and imported correctly
});
