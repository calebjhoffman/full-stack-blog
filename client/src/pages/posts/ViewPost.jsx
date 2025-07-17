import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PublicUserAvatar from '../../components/ui/PublicUserAvatar';
import RecentPostsSidebar from '../../components/Post/RecentPostsSidebar';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';

export default function ViewPost() {
  const [authorMeta, setAuthorMeta] = useState({});
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [featuredImage, setFeaturedImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); 
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${slug}`);
        const data = await res.json();
        
        setPost(data.post);
        setAuthorMeta(data.authorMeta || {});
        if (data.meta?.featured_image) {
          setFeaturedImage(`${import.meta.env.VITE_SERVER_PUBLIC_URL}${data.meta.featured_image}`);
        }
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [slug]);


  if (loading) return <CircularProgress />;
  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Box sx={{ backgroundColor: '#fff', overflowX: 'hidden' }}>
      {/* Full-width featured image */}
      {featuredImage && (
        <Box
          sx={{
            position: 'relative',
            width: '100vw',
            height: { xs: 240, md: 360 },
            overflow: 'hidden',
          }}
        >
          {/* Blurred Background */}
          <Box
            component="img"
            src={featuredImage}
            alt="Blurred featured"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(8px)',
              transform: 'scale(1.1)', // zoom to hide blur edge
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
            }}
          />

          {/* Dark Overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 2,
            }}
          />

          {/* Post Title */}
          <Box
            sx={{
              position: 'relative',
              zIndex: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              px: { xs: 2, md: 8 },
              pb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                color: '#fff',
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              {post.title}
            </Typography>
          </Box>
        </Box>
      )}



      {/* Main content + sidebar layout */}
      <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 6 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 4,
            alignItems: 'flex-start',
            gridTemplateColumns: {
              xs: '1fr',
              md: '4fr 1fr',
            },
          }}
        >
          {/* Main article */}
          <Box>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 4 }}>
              <Box
                component="article"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#222',
                  '& h1, h2, h3': {
                    fontWeight: 600,
                    mt: 2,
                    mb: 4,
                    lineHeight: 1.3,
                  },
                  '& p': { mb: 2 },
                  '& ul': { pl: 3, mb: 2 },
                  '& ol': { pl: 3, mb: 2 },
                  '& li': { mb: 1 },
                  '& hr': {
                    my: 4,
                    border: 0,
                    borderTop: '1px solid #ddd',
                  },
                  '& blockquote': {
                    borderLeft: '4px solid #ccc',
                    paddingLeft: '1rem',
                    marginLeft: 0,
                    color: '#666',
                    fontStyle: 'italic',
                    mb: 3,
                  },
                  '& a': {
                    color: '#1976d2',
                    textDecoration: 'underline',
                  },
                }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </Paper>
            <Box
              sx={{
                mt: 6,
                px: 4,
                py: 3,
                backgroundColor: '#f9f9f9',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <PublicUserAvatar userId={post.authorId} size={60} />
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                  {post.author?.name || 'Unknown Author'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {authorMeta.bio || 'No bio provided'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Sidebar */}
          <Box maxWidth={400}>
            <RecentPostsSidebar excludeSlug={post.slug} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
