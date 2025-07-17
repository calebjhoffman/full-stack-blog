import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from '@mui/material';
import ImageCropDialog from '../../../components/ui/ImageCropDialog';
import UserAvatar from '../../../components/ui/UserAvatar';

export default function AvatarUpload({ avatarUrl, onCrop }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [cropOpen, setCropOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const preview = avatarUrl || '/default-avatar.png';
  const { setPreviewAvatarUrl } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (blob) => {
    setCropOpen(false);
    setProcessing(true);

    try {
      const blobUrl = URL.createObjectURL(blob);
      setPreviewAvatarUrl(blobUrl);  // 💥 show preview everywhere
      onCrop(blob);                  // 💾 save blob for later upload
    } catch (err) {
      console.error('🔥 Error in onCrop callback:', err);
    }

    setProcessing(false);
  };

  return (
    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Profile Image
      </Typography>

      <Stack direction="row" spacing={3} alignItems="center">
      <UserAvatar
        size={72}
        previewOverride={preview} // <-- this is your locally cropped image blob
      />
        <Box>
          <Button
            component="label"
            variant="contained"
            size="small"
            disabled={processing}
          >
            {processing ? <CircularProgress size={18} /> : 'Upload New'}
            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            JPG, PNG, or GIF. Max 2MB.
          </Typography>
        </Box>
      </Stack>

      <ImageCropDialog
        open={cropOpen}
        imageSrc={imageSrc}
        onCancel={() => setCropOpen(false)}
        onCropComplete={handleCropComplete}
      />
    </Paper>
  );
}
