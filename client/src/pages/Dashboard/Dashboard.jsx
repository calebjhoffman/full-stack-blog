import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts([]);
      }
    };

    loadPosts();
  }, []);
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } else {
        console.error('Failed to delete post');
      }
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name} 👋
      </Typography>

      {posts.length === 0 ? (
        <Box mt={3}>
          <Typography>No posts yet.</Typography>
          <Button
            component={Link}
            to="/create-post"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Create a Post
          </Button>
        </Box>
      ) : (
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item key={post.id}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 360,
                width: 300,
                overflow: 'hidden',
              }}
            >
              {post.meta?.featured_image && (
                <Box
                  component="img"
                  src={`${import.meta.env.VITE_SERVER_PUBLIC_URL}${post.meta.featured_image}`}
                  alt="Featured"
                  sx={{
                    width: '100%',
                    height: 140,
                    objectFit: 'cover',
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
              )}

              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', px: 2, py: 1 }}>
                <Typography variant="h6" gutterBottom noWrap>
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '0.875rem',
                    mb: 2,
                  }}
                >
                  {post.content}
                </Typography>

                <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => navigate(`/posts/${post.slug}`)}
                    aria-label="View Post"
                    sx={{ color: 'primary.main' }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate(`/dashboard/posts/${post.id}`)}
                    aria-label="Edit Post"
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => handleDelete(post.id)}
                    aria-label="Delete Post"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}
    </Box>
  );
}
