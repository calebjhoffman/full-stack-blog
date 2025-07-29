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
        flexDirection: { xs: 'column', sm: 'row' },  // ✅ stack on mobile
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1,
        py: 1,
      }}
    >
      {/* Left side */}
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: { xs: 1, sm: 0 }, // space below logo on mobile
        }}
      >
        {user && isProtectedRoute && (
          <>
            <IconButton
              onClick={onMobileToggle}
              sx={{
                mr: 2,
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
                mr: 2,
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

      {/* Right side */}
      <Box   
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
          gap: 1,
        }}
      >
        <IconButton
          color="inherit"
          onClick={handleThemeToggle}
          sx={{ mr: 1, '&:focus': { outline: 'none', boxShadow: 'none' } }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        {user ? (
          <>
            <Button
              component={Link}
              to="/create-post"
              color="inherit"
              sx={{ mr: 2, textTransform: 'none' }}
            >
              Create Post
            </Button>
            <AvatarMenu />
          </>
        ) : (
          <>
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
              sx={{ ml: 1, textTransform: 'none' }}
            >
              Signup
            </Button>
          </>
        )}
      </Box>
    </Toolbar>
  </AppBar>
);

}
