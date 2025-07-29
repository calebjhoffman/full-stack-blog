import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { setUserMeta, getUserMeta } from '../lib/userMeta.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js';

const router = express.Router();
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
//const isProd = process.env.NODE_ENV === 'production';
const isProd = true;

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({ data: { email, password: hashedPassword, name } });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Signup failed. Email may already exist.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) {
    return res.status(401).json({ error: 'Missing refresh token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.sendStatus(404);

    const newAccessToken = generateAccessToken(decoded.userId);

    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'None' : 'Lax',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: 'Access token refreshed' });
  } catch (err) {
    console.error('Refresh failed:', err);
    return res.status(403).json({ error: 'Invalid or expired refresh token' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.sendStatus(401);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.sendStatus(404);

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    return res.sendStatus(401);
  }
});

router.get('/meta', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const meta = await getUserMeta(userId);

    console.log('📦 Loaded meta:', meta);

    const mediaId = meta?.avatar_media_id;

    // ✅ Only attempt lookup if mediaId is a non-empty string
    if (typeof mediaId === 'string' && mediaId.trim() !== '') {
      const media = await prisma.media.findUnique({
        where: { id: mediaId },
      });

      if (media?.url) {
        meta.avatar_url = media.url;
      }
    }

    res.json(meta);
  } catch (err) {
    console.error('❌ Error getting user meta:', err);
    res.status(500).json({ error: 'Failed to load user meta' });
  }
});




router.patch('/meta', authenticateToken, async (req, res) => {
  const updates = req.body;
  const userId = req.user.userId;

  try {
    if ('name' in updates) {
      await prisma.user.update({
        where: { id: userId },
        data: { name: updates.name },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    const userKeys = Object.keys(user);

    for (const key of Object.keys(updates)) {
      if (!userKeys.includes(key)) {
        await setUserMeta(userId, key, updates[key]);
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});


router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  res.json({ message: 'Logged out' });
});

export default router;
