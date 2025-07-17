import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useContext } from 'react';
import { ColorModeContext } from '../../context/ColorModeContext';
import { useAuth } from '../../context/AuthContext';
import AvatarMenu from './AvatarMenu';

export default function TopBar({
  onMobileToggle,
  onSidebarToggle,
}) {
  const { user } = useAuth();
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: 'primary.main',
      }}
    >
      <Toolbar>
        {/* Mobile drawer toggle */}
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

        {/* Desktop sidebar collapse toggle */}
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

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Welcome, {user?.name}
        </Typography>

        <IconButton
          color="inherit"
          onClick={toggleColorMode}
          sx={{ mr: 1, '&:focus': { outline: 'none', boxShadow: 'none' } }}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <AvatarMenu />
      </Toolbar>
    </AppBar>
  );
}
