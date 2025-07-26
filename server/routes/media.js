import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authenticateToken.js';
import { setUserMeta } from '../lib/userMeta.js';
import { upsertPostMeta } from '../lib/postMeta.js'; // ✅ Needed for featured_image meta

const router = express.Router();
const prisma = new PrismaClient();

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  // 🧱 Defensive guard
  if (!req.file) {
    console.error('❌ No file uploaded. req.body:', req.body);
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const { type, postId } = req.body;

    // 🔍 Logging incoming form data
    console.log('📨 Incoming upload request');
    console.log('  • Type:', type);
    console.log('  • Post ID:', postId);
    console.log('  • File name:', req.file.originalname);
    console.log('  • MIME type:', req.file.mimetype);

    const fileExt = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    console.log(`📁 Saving ${type || 'image'} to:`, filePath);

    const sharpInstance = sharp(req.file.buffer);
    if (type === 'featured') {
      sharpInstance.resize(1200, 630, { fit: 'cover' }); // ✅ Ultra-wide banner style
    } else {
      sharpInstance.resize(512); // ✅ Avatar or default
    }

    await sharpInstance
      .toFormat('jpeg')
      .jpeg({ quality: 85 })
      .toFile(filePath);

    const fileUrl = `/uploads/${fileName}`;
    const mimetype = req.file.mimetype;
    const userId = req.user.userId;

    const media = await prisma.media.create({
      data: {
        url: fileUrl,
        mimetype,
        userId,
        type,
        postId: postId || null,
      },
    });

    // 🧠 Smart metadata logic
    if (type === 'featured' && postId) {
      console.log(`📌 Storing featured image for post ${postId}`);
      await upsertPostMeta(postId, 'featured_image', fileUrl);
    } else {
      console.log(`👤 Storing avatar image for user ${userId}`);
      await setUserMeta(userId, 'avatar_media_id', media.id);
      await setUserMeta(userId, 'avatar_url', fileUrl);
    }

    console.log('✅ Upload and metadata saved successfully');
    res.status(201).json({ mediaId: media.id, url: media.url });
  } catch (err) {
    console.error('🔥 Upload error:', err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
