
import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import mediaRoutes from './routes/media.js';
import userRoutes from './routes/users.js';
import publicRoutes from './routes/public.js';


const __dirname = path.resolve();

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://full-stack-blog-five.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow tools like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true // ⬅️ This allows cookies + headers like Authorization
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/upload', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/public', publicRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});

