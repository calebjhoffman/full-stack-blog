import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import ImageUploader from '../../components/media/ImageUploader';
import TinyMCEEditor from '@/components/editor/TinyMCEEditor';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [featuredImageFile, setFeaturedImageFile] = useState(null);
  const [generating, setGenerating] = useState(false);
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleGenerateContent = async () => {
    const secondary = secondaryKeywords
      .split(',')
      .map((kw) => kw.trim())
      .filter(Boolean);

    const prompt = `Write the inner content of a blog article titled "${title}". The focus keyword is "${focusKeyword}", and the secondary keywords are: ${secondary.join(', ') || 'none'}. 
Do not include <html>, <head>, <body>, or any markdown-style code block formatting. Just return clean HTML that can be directly embedded inside a content editor. Use unordered and ordered lists in some parts to keep the format diverse and clean.`;

    try {
      setGenerating(true);

      const res = await fetch(`${import.meta.env.VITE_SERVER_PUBLIC_URL}/openai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok || !res.body) throw new Error('Streaming failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let contentBuffer = '';
      let visibleContent = '';
      const flushBuffer = () => {
        if (editorRef.current && contentBuffer) {
          visibleContent += contentBuffer;
          editorRef.current.setContent(visibleContent);
          contentBuffer = '';
        }
      };

      const interval = setInterval(flushBuffer, 300);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        contentBuffer += chunk;
      }

      clearInterval(interval);

      visibleContent = visibleContent.replace(/^```html\s*/i, '').replace(/```$/, '');
      flushBuffer();
      setContent(visibleContent);
    } catch (err) {
      console.error('Streaming error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const meta = {
        focus_keyword: focusKeyword,
        secondary_keywords: secondaryKeywords
          .split(',')
          .map((kw) => kw.trim())
          .filter(Boolean),
      };

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, meta }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      const newPost = await res.json();

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
    <Container sx={{ mt: 4, maxWidth: '1200px' }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '100%',
          minWidth: { sm: '400px' },
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

        <TextField
          label="Focus Keyword"
          value={focusKeyword}
          onChange={(e) => setFocusKeyword(e.target.value)}
          fullWidth
        />

        <TextField
          label="Secondary Keywords (comma separated)"
          value={secondaryKeywords}
          onChange={(e) => setSecondaryKeywords(e.target.value)}
          fullWidth
        />

        <Button
          variant="outlined"
          onClick={handleGenerateContent}
          disabled={!title || !focusKeyword || generating}
        >
          {generating ? 'Generating...' : 'Generate Content with AI'}
        </Button>

        <TinyMCEEditor
          ref={editorRef}
          content={content}
          onChange={setContent}
          height={600}
        />

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
