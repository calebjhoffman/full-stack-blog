import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import ImageUploader from '../../components/media/ImageUploader';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import TinyMCEEditor from '@/components/editor/TinyMCEEditor';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    // 1. Create the post first
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create post');
    }

    const newPost = await res.json();

    // 2. Upload featured image if provided
    if (featuredImageFile) {
      const formData = new FormData();
      formData.append('file', featuredImageFile.file);
      formData.append('type', 'featured');
      formData.append('postId', newPost.id);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || 'Image upload failed');
      }
    }

    navigate('/dashboard');
  } catch (err) {
    setError(err.message);
  }
};


return (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',            // ✅ Fill container
        maxWidth: '100%',         // ✅ Prevent overflow
        minWidth: { sm: '400px' }, // ✅ Prevent over-shrinking on tablet
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <Typography variant="h5" mb={2}>
        Create New Post
      </Typography>
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        margin="normal"
        required
      />
      <TinyMCEEditor content={content} onChange={setContent} height={600} />
      <ImageUploader
        label="Featured Image"
        onUpload={(file) => setFeaturedImageFile(file)}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Submit
      </Button>
    </Box>
  </Container>
);
}
