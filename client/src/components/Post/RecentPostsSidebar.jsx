import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';

export default function RecentPostsSidebar({ excludeSlug }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/public?limit=3`);
        const data = await res.json();
        const filtered = excludeSlug
        ? data.filter((p) => p.slug !== excludeSlug)
        : data;

        setPosts(filtered.slice(0, 3)); // still limit to 3 displayed

      } catch (err) {
        console.error('Failed to fetch recent posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <CircularProgress size={24} />;

  return (
    <Box>
      <Typography variant="h6" gutterBottom color='#333'>
        Recent Posts
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {posts.map((post) => {
            console.log('🖼️ Featured image debug:', {
                base: import.meta.env.VITE_SERVER_PUBLIC_URL,
                imagePath: post.meta?.featured_image,
                fullUrl: post.meta?.featured_image
                    ? `${import.meta.env.VITE_SERVER_PUBLIC_URL}${post.meta.featured_image}`
                    : null,
                });
          const featured = post.meta?.featured_image
            ? `${import.meta.env.VITE_SERVER_PUBLIC_URL}${post.meta.featured_image}`
            : '/placeholder-banner.jpg'; // fallback image

          return (
            <Paper
              key={post.id}
              elevation={2}
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(`/posts/${post.slug}`)}
            >
              <Box
                component="img"
                src={featured}
                alt={post.title}
                sx={{
                  width: '100%',
                  height: 120,
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {post.content.replace(/<[^>]+>/g, '').slice(0, 80)}...
                </Typography>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
