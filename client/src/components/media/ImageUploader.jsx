import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';

export default function ImageUploader({ label = 'Upload Image', onUpload, initialUrl = '' }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    try {
      const blobUrl = URL.createObjectURL(file);
      setPreviewUrl(blobUrl);
      onUpload(file); // Trigger upload
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        {previewUrl && (
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 2 }}
          />
        )}

        <Button
          component="label"
          variant="contained"
          disabled={processing}
        >
          {processing ? <CircularProgress size={18} /> : 'Choose File'}
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Stack>
    </Box>
  );
}
