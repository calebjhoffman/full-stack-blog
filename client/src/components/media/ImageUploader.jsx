import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
} from '@mui/material';

export default function ImageUploader({
  label = 'Upload Image',
  onUpload,
  initialUrl = ''
}) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    onUpload({ file });
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
        >
          Choose File
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
      </Stack>
    </Box>
  );
}
