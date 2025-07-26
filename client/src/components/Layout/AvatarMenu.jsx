import { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import UserAvatar from '../ui/UserAvatar';

export default function AvatarMenu() {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <>
      <IconButton
        onClick={handleAvatarClick}
        sx={{
          ml: 2,
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        }}
      >
        <UserAvatar size={36} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/dashboard">
          Dashboard
        </MenuItem>
        <MenuItem
          component={Link}
          to="/settings"
          onClick={handleClose}
        >
          Profile Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
}
