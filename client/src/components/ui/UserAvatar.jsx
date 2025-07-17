import { Avatar } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

export default function UserAvatar({
  size = 40,
  previewOverride = null,
  sx = {},
  ...props
}) {
  const { meta, user, previewAvatarUrl } = useAuth();

  const avatarUrl = previewOverride
    ?? previewAvatarUrl
    ?? (meta?.avatar_url
      ? `${import.meta.env.VITE_SERVER_PUBLIC_URL}${meta.avatar_url}`
      : '/default-avatar.png');


  return (
    <Avatar
      alt={user?.name || 'User'}
      src={avatarUrl}
      sx={{
        width: size,
        height: size,
        border: '2px solid',
        borderColor: 'divider',
        boxShadow: 1,
        ...sx,
      }}
      {...props}
    />
  );
}
