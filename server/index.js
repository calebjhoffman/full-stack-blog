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
import session from 'express-session';
import passport from 'passport';
import './utils/passportGoogle.js';
import openaiRoutes from './routes/openai.js';

const __dirname = path.resolve();
dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === 'production';

const allowedOrigins = [
  process.env.CLIENT_ORIGIN,
  "https://full-stack-blog-five.vercel.app",
  'https://blog.calebhoffman.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow tools like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Session middleware (for passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,
    sameSite: isProd ? 'None' : 'Lax'
  }
}));

// ✅ Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// ✅ Mount your routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/upload', mediaRoutes);
app.use('/api/users', userRoutes);
app.use('/public', publicRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/openai', openaiRoutes);

app.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
});
