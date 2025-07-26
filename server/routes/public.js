import express from 'express';
import { prisma } from '../prisma/client.js';

const router = express.Router();

// GET /public/posts — return all published posts with author and featured image
router.get('/posts', async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        metas: true, // ✅ load all post meta key/values
      },
    });

    const formatted = posts.map(post => {
      const featuredImageMeta = Array.isArray(post.metas)
        ? post.metas.find(m => m.key === 'featured_image')
        : null;

      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        author: post.author,
        meta: {
          featured_image: featuredImageMeta?.value || null, // ✅ flattened format
        },
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Failed to fetch public posts:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
