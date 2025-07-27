import { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ColorModeContext } from '../../../context/ColorModeContext'; // ✅ ADD THIS
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import AvatarUpload from './AvatarUpload';

export default function UserSettings() {
  const { user, meta, setMeta, setUser, setPreviewAvatarUrl, hasCheckedAuth } = useAuth();
  const { setMode } = useContext(ColorModeContext); // ✅ ADD THIS

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [theme, setTheme] = useState('light'); // ✅ ADD THIS

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (!hasCheckedAuth || formInitialized) return;

    if (!user?.name && !meta?.bio && !meta?.avatar_url && !meta?.theme_preference) return;

    console.log('🎯 Hydrating form with:', { user, meta });

    if (user?.name) setName(user.name);
    if (typeof meta.bio === 'string') setBio(meta.bio);

    if (meta.avatar_url) {
      setPreviewUrl(`${import.meta.env.VITE_SERVER_PUBLIC_URL}${meta.avatar_url}`);
    } else {
      setPreviewUrl('');
    }

    if (meta.theme_preference) setTheme(meta.theme_preference); // ✅ hydrate theme

    setFormInitialized(true);
  }, [user, meta, hasCheckedAuth, formInitialized]);

  useEffect(() => {
    console.log('👁 UserSettings sees meta:', meta);
    if (!formInitialized || !meta) return;

    console.log('🔄 Syncing dropdown theme with meta:', meta.theme_preference);

    const pref = meta.theme_preference;
    if (pref && pref !== theme) {
      setTheme(pref);
    }
  }, [meta, formInitialized]);

  const updateMeta = async (updates) => {
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
      formData.append('type', 'avatar');

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
      theme_preference: theme, // ✅ Save theme to meta
    };

    if (avatar_media_id) {
      updates.avatar_media_id = avatar_media_id;
    }

    await updateMeta(updates);

    // ✅ Apply theme immediately
    localStorage.setItem('theme_preference', theme);
    setMode(theme);

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
    setPreviewAvatarUrl(null);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSaveChanges}>
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

          {/* ✅ Theme Selector */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Theme</InputLabel>
            <Select
              value={theme}
              label="Theme"
              onChange={(e) => setTheme(e.target.value)}
            >
              <MenuItem value="system">System</MenuItem>
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" type="submit">
            Save Changes
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
