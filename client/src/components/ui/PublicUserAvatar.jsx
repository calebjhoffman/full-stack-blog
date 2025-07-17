// components/ui/PublicUserAvatar.jsx
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';

export default function PublicUserAvatar({ userId, size = 48, sx = {} }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/meta`);
        const data = await res.json();
        if (data.avatar_url) {
          setAvatarUrl(`${import.meta.env.VITE_SERVER_PUBLIC_URL}${data.avatar_url}`);
        }
      } catch (err) {
        console.error('Failed to fetch user meta:', err);
      }
    };

    if (userId) fetchMeta();
  }, [userId]);

  return (
    <Avatar
      alt="User Avatar"
      src={avatarUrl || '/default-avatar.png'}
      sx={{
        width: size,
        height: size,
        border: '2px solid',
        borderColor: 'divider',
        boxShadow: 1,
        ...sx,
      }}
    />
  );
}
