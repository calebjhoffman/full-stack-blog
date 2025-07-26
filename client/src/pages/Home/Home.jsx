import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import PublicPostCard from '../../components/Post/PublicPostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_PUBLIC_URL}/public/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to fetch posts', err));
  }, []);

  return (
    <Box sx={{ mt: 10, mb: 6, px: 2 }}>
      <Typography variant="h3" marginBottom="30px" textAlign="left">
        📰 Latest Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography textAlign="center">No posts yet.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {posts.map((post) => (
            <PublicPostCard key={post.id} post={post} />
          ))}
        </Box>
      )}
    </Box>
  );
}
