import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import ImageUploader from '../../components/media/ImageUploader';
import TinyMCEEditor from '../../components/editor/TinyMCEEditor';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';

export default function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [post, setPost] = useState(null);
  const [meta, setMeta] = useState({});
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');


  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
          credentials: 'include',
        });
        const data = await res.json();

        if (data.meta?.featured_image) {
          setFeaturedImageUrl(`${import.meta.env.VITE_SERVER_PUBLIC_URL}${data.meta.featured_image}`);
        }


        setPost(data.post);
        setMeta(data.meta || {});
        console.log('meta:', data.meta);
        setTitle(data.post.title);
        setContent(data.post.content);
        setSlug(data.post.slug);
      } catch (err) {
        console.error('Failed to load post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

const handleSave = async () => {
  setSaving(true);
  try {
    let featuredImagePath = meta.featured_image;

    if (featuredImageFile) {
      const formData = new FormData();
      formData.append('file', featuredImageFile);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Image upload failed');
      const uploadData = await uploadRes.json();
      featuredImagePath = uploadData.url;
    }

    // ✅ All goes into the PATCH
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        content,
        slug,
        featuredImage: featuredImagePath,
      }),
    });

    if (!res.ok) throw new Error('Failed to save post');
  } catch (err) {
    console.error('Failed to save post:', err);
  } finally {
    setSaving(false);
  }
};

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 8 }, py: 6, width:'70vw'}}>
      <Typography variant="h4" gutterBottom>
        Edit Post
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 4 }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Slug"
          value={slug}
          onChange={(e) =>
            setSlug(slugify(e.target.value, { lower: true, strict: true }))
          }
          fullWidth
          sx={{ mb: 3 }}
          helperText="This becomes part of the URL. Must be unique."
        />

        <Box sx={{ mb: 3 }}>
          <TinyMCEEditor content={content} onChange={setContent} height={1000} />
        </Box>

        <Box sx={{ mb: 4 }}>
        <ImageUploader
          label="Featured Image (recommended: 1600x500)"
          initialUrl={featuredImageUrl}
          uploadType="featured"
          postId={post.id} // 🔥 must be valid!
          onUpload={({ url }) => {
            setFeaturedImageFile(url);
            setFeaturedImageUrl(url);
          }}
        />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/posts/${slug}`)}
          >
            View Post
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
