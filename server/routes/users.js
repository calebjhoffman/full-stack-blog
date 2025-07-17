// server/routes/users.js

import express from 'express';
import { getUserMeta, setUserMeta } from '../lib/userMeta.js';
import authenticateToken from '../middleware/authenticateToken.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


// ✅ Public: Get user meta by user ID (for public profile/avatar/bio)
router.get('/:id/meta', async (req, res) => {
  const { id } = req.params;
  try {
    const meta = await getUserMeta(id);
    res.json(meta);
  } catch (err) {
    console.error('Error getting user meta:', err);
    res.status(500).json({ error: 'Failed to fetch user meta' });
  }
});


// 🔐 Protected: Get current user's full profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const meta = await getUserMeta(req.user.userId);

    res.json({ user, meta });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});


// 🔐 Protected: Update current user's meta
router.post('/me/meta', authenticateToken, async (req, res) => {
  const updates = req.body; // { key1: value1, key2: value2, ... }

  try {
    for (const key in updates) {
      await setUserMeta(req.user.userId, key, updates[key]);
    }

    res.status(200).json({ message: 'Meta updated successfully' });
  } catch (err) {
    console.error('Error updating user meta:', err);
    res.status(500).json({ error: 'Failed to update user meta' });
  }
});


export default router;
