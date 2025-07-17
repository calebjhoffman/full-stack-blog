import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import AvatarUpload from './AvatarUpload';

export default function UserSettings() {
  const { user, meta, setMeta, setUser, setPreviewAvatarUrl  } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(meta?.bio || '');
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(meta?.avatar_url || '');

  useEffect(() => {
    if (meta?.avatar_url) {
      setPreviewUrl(`${import.meta.env.VITE_SERVER_PUBLIC_URL}${meta.avatar_url}`);
    } else {
      setPreviewUrl('');
    }
  }, [meta?.avatar_url]);

  const updateMeta = async (updates) => {
    console.log('📡 Calling:', `${import.meta.env.VITE_API_BASE_URL}/auth/meta`);
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/meta`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      setMeta((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    let avatar_media_id = null;

    if (croppedImageBlob) {
      const formData = new FormData();
      formData.append('file', croppedImageBlob);

      const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/media`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (uploadRes.ok) {
        const { mediaId } = await uploadRes.json();
        avatar_media_id = mediaId.toString();
      }
    }

    const updates = {
      name,
      bio,
    };

    if (avatar_media_id) {
      updates.avatar_media_id = avatar_media_id;
    }

    await updateMeta(updates);

    const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
      credentials: 'include',
    });
    const updatedUser = await userRes.json();
    setUser(updatedUser);

    const metaRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/meta`, {
      credentials: 'include',
    });
    const updatedMeta = await metaRes.json();
    setMeta(updatedMeta);
    setPreviewAvatarUrl(null); // use the saved one now
  };


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={(e) => { console.log('Form submit fired'); handleSaveChanges(e); }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value={user?.email || ''}
            fullWidth
            disabled
            sx={{ mb: 2 }}
          />

          <AvatarUpload
            avatarUrl={previewUrl}
            onCrop={(blob) => {
              setCroppedImageBlob(blob);
              setPreviewUrl(URL.createObjectURL(blob));
            }}
          />

          <TextField
            label="Bio"
            multiline
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />

          <Button variant="contained" type="submit">
            Save Changes
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
