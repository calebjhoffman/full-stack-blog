import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ColorModeContext } from '../../context/ColorModeContext';
import { useAuth } from '../../context/AuthContext';
import AvatarMenu from './AvatarMenu';

export default function TopBar({ onMobileToggle, onSidebarToggle }) {
  const { user, updateMeta } = useAuth(); // ✅ include updateMeta
  const theme = useTheme();
  const location = useLocation();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  const isProtectedRoute = [
    '/dashboard',
    '/create-post',
    '/settings',
  ].some((path) => location.pathname.startsWith(path));

  const handleThemeToggle = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    toggleColorMode(); // updates UI + localStorage

    if (user && updateMeta) {
      updateMeta({ theme_preference: newMode });
    }

    console.log('🌗 Topbar theme toggled to:', newMode);
  };

return (
  <AppBar
    position="fixed"
    sx={{
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: 'primary.main',
    }}
  >
    <Toolbar
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 1,
        py: 1,
        px: { xs: 2, sm: 3 },
      }}
    >
      {/* Row 1: Menu + Site Name on left, Avatar on right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && isProtectedRoute && (
            <>
              <IconButton
                onClick={onMobileToggle}
                sx={{
                  display: { md: 'none' },
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <MenuIcon />
              </IconButton>

              <IconButton
                color="inherit"
                onClick={onSidebarToggle}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  '&:focus': { outline: 'none', boxShadow: 'none' },
                }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 600 }}
          >
            📰 Mini Blog
          </Typography>
        </Box>

        {user && <AvatarMenu />}
      </Box>

      {/* Row 2: Theme toggle left, Create Post right */}
      {user && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            sx={{ '&:focus': { outline: 'none', boxShadow: 'none' } }}
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          <Button
            component={Link}
            to="/create-post"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Create Post
          </Button>
        </Box>
      )}

      {/* Guest Buttons */}
      {!user && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            width: '100%',
          }}
        >
          <Button
            component={Link}
            to="/login"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Signup
          </Button>
        </Box>
      )}
    </Toolbar>
  </AppBar>
);

}
