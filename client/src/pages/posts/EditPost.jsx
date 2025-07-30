import { useEffect, useState, useRef } from 'react';
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
  Container,
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
  const [focusKeyword, setFocusKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');

  const [generating, setGenerating] = useState(false);
  const editorRef = useRef(null);


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

        setFocusKeyword(data.meta.focus_keyword || '');

        try {
          const parsedSecondary = JSON.parse(data.meta.secondary_keywords || '[]');
          setSecondaryKeywords(parsedSecondary.join(', '));
        } catch {
          setSecondaryKeywords('');
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
      console.log('🧪 Attempting upload with:', featuredImageFile);

      const formData = new FormData();
      formData.append('file', featuredImageFile);
      formData.append('type', 'featured');
      formData.append('postId', postId);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      console.log('📤 Upload response status:', uploadRes.status);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.error('❌ Upload failed:', errorText);
        throw new Error('Image upload failed');
      }

      const uploadData = await uploadRes.json();
      console.log('✅ Upload success:', uploadData);
      featuredImagePath = uploadData.url;
    }

    // 🧠 Build meta object to send
    const updatedMeta = {
      focus_keyword: focusKeyword,
      secondary_keywords: secondaryKeywords
        .split(',')
        .map((kw) => kw.trim())
        .filter(Boolean),
    };

    // ✅ Send PATCH with all fields
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title,
        content,
        slug,
        featuredImage: featuredImagePath,
        meta: updatedMeta,
      }),
    });

    if (!res.ok) throw new Error('Failed to save post');
  } catch (err) {
    console.error('Failed to save post:', err);
  } finally {
    setSaving(false);
  }
};

const handleGenerateContent = async () => {
  const secondary = secondaryKeywords
    .split(',')
    .map((kw) => kw.trim())
    .filter(Boolean);

  const prompt = `Write the inner content of a blog article titled "${title}". The focus keyword is "${focusKeyword}", and the secondary keywords are: ${secondary.join(', ') || 'none'}. 
  Do not include <html>, <head>, <body>, or any markdown-style code block formatting. Just return clean HTML that can be directly embedded inside a content editor. Use unordered and ordered lists in some parts to keep the format diverse and clean`;

  try {
    setGenerating(true);

    const res = await fetch(`${import.meta.env.VITE_SERVER_PUBLIC_URL}/openai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok || !res.body) {
      throw new Error('Streaming failed');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let contentBuffer = '';
    let visibleContent = '';
    let lastUpdate = Date.now();

    const flushBuffer = () => {
      if (editorRef.current && contentBuffer) {
        visibleContent += contentBuffer;
        editorRef.current.setContent(visibleContent);
        contentBuffer = '';
        lastUpdate = Date.now();
      }
    };

    const interval = setInterval(flushBuffer, 300); // 💡 every 300ms

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      contentBuffer += chunk;
    }

    clearInterval(interval);

    // 🔥 Clean up GPT markdown-style wrappers
    visibleContent = visibleContent.replace(/^```html\s*/i, '').replace(/```$/, '');

    flushBuffer();              // Final TinyMCE update
    setContent(visibleContent); // Sync content state

  } catch (err) {
    console.error('Streaming error:', err);
  } finally {
    setGenerating(false);
  }
};




  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ mt: 6, maxWidth:'1200px' }}>
      <Typography variant="h4" gutterBottom>
        Edit Post
      </Typography>

      <Paper
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          width: '100%',
          maxWidth: '100%',
          minWidth: { sm: '400px' },
        }}
      >
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
        <TextField
          label="Focus Keyword"
          value={focusKeyword}
          onChange={(e) => setFocusKeyword(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Secondary Keywords (comma separated)"
          value={secondaryKeywords}
          onChange={(e) => setSecondaryKeywords(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={handleGenerateContent}
          disabled={!title || !focusKeyword || generating}
          sx={{ mb: 2 }}
        >
          {generating ? 'Generating...' : 'Generate Content with AI'}
        </Button>
        <Box sx={{ mb: 3 }}>
          <TinyMCEEditor
            ref={editorRef}
            content={content}
            onChange={setContent}
            height={1000}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <ImageUploader
            label="Featured Image (recommended: 1600x500)"
            initialUrl={featuredImageUrl}
            uploadType="featured"
            postId={post.id}
            onUpload={(fileObj) => {
              setFeaturedImageFile(fileObj.file);
              setFeaturedImageUrl(fileObj.preview);
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
    </Container>
  );

}
