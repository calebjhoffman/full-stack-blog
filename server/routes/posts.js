import express from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateToken from '../middleware/authenticateToken.js';
import slugify from 'slugify';
import { upsertPostMeta, getPostMetaMap } from '../lib/postMeta.js';
import { getUserMeta } from '../lib/userMeta.js';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/public', async (req, res) => {
  const limit = parseInt(req.query.limit) || undefined;
  const authorId = req.query.authorId || undefined;

  try {
    const posts = await prisma.post.findMany({
      where: authorId ? { authorId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const meta = await getPostMetaMap(post.id);
        return { ...post, meta };
      })
    );

    res.json(postsWithMeta);
  } catch (err) {
    console.error('❌ Error fetching public posts:', err);
    res.status(500).json({ error: 'Failed to fetch public posts' });
  }
});

// Get all posts for the logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { authorId: req.user.userId },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch metas for each post
    const postsWithMeta = await Promise.all(
      posts.map(async (post) => {
        const meta = await getPostMetaMap(post.id);
        return { ...post, meta };
      })
    );

    res.json(postsWithMeta);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create a post
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, featuredImage } = req.body;

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        author: {
          connect: { id: req.user.userId },
        },
      },
    });

    // ✅ Now handle featuredImage before responding
    if (featuredImage) {
      await upsertPostMeta(post.id, 'featured_image', featuredImage);
    }

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});


router.get('/:param', async (req, res) => {
  const { param } = req.params;

  try {
    const post = await prisma.post.findFirst({
      where: {
        OR: [{ id: param }, { slug: param }],
      },
        include: {
          author: true, // ✅ includes name, id, etc.
        },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const meta = await getPostMetaMap(post.id); // ✅ add this
    const authorMeta = await getUserMeta(post.authorId);

    res.json({ post, meta, authorMeta }); // ✅ now meta is sent to the frontend
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, content, slug, featuredImage } = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: { title, content, slug },
    });

    if (featuredImage) {
      await upsertPostMeta(id, 'featured_image', featuredImage);
    }

    console.log(`✅ Post ${id} updated. New slug: ${updated.slug}`); // 💥 your log

    res.status(200).json(updated);

  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Slug must be unique' });
    }
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});


export default router;
