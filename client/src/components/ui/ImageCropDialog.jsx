import React, { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slider,
} from '@mui/material';
import getCroppedImg from '../../utils/cropImage';

export default function ImageCropDialog({ open, imageSrc, onCancel, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef(null);

  const onCropChange = (newCrop) => setCrop(newCrop);
  const onZoomChange = (zoomValue) => setZoom(zoomValue);

  const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
    croppedAreaPixelsRef.current = croppedAreaPixels;
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixelsRef.current);
    onCropComplete(croppedImage);
  };

  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="sm">
      <DialogTitle>Crop your image</DialogTitle>
      <DialogContent>
        <div style={{ position: 'relative', height: 300, background: '#333' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, z) => setZoom(z)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={handleDone} variant="contained">Done</Button>
      </DialogActions>
    </Dialog>
  );
}
