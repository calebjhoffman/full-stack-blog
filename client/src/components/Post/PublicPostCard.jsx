import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from '@mui/material';
import stripHtml from '../../lib/sanitize';

export default function PublicPostCard({ post }) {
  const navigate = useNavigate();

  const featuredImage = post.meta?.featured_image
    ? `${import.meta.env.VITE_SERVER_PUBLIC_URL}${post.meta.featured_image}`
    : '/placeholder-banner.jpg';

  const excerpt = stripHtml(post.content).slice(0, 100) + '...';
  const author = post.author?.name || 'Unknown';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 3,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/posts/${post.slug}`)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch', // ✅ Ensures full width usage
        }}
      >
        <CardMedia
          component="img"
          image={featuredImage}
          alt={post.title}
          sx={{
            height: 180,
            width: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />

        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            px: 2,
            pb: 2,
            pt: 2,
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="h6"
              fontWeight={600}
              gutterBottom
              sx={{ width: '100%' }}
            >
              {post.title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              gutterBottom
              sx={{ width: '100%' }}
            >
              By: {author}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              width: '100%',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {excerpt}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
