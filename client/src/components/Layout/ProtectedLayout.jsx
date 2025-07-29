import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useAuth } from '../../context/AuthContext';
import { ColorModeContext } from '../../context/ColorModeContext';
import Sidebar from './Sidebar';
import AvatarMenu from './AvatarMenu';

const drawerWidth = 240;

export default function ProtectedLayout() {
  const { user, loading, hasCheckedAuth } = useAuth(); // ⬅️ add these
  const theme = useTheme();
  const { toggleColorMode, mode } = useContext(ColorModeContext);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarCollapse = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const drawer = <Sidebar />;

  // ✅ Prevent premature rendering until user and meta are loaded
  if (loading || !hasCheckedAuth || !user) {
    return null; // or a loading spinner
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <TopBar
        onMobileToggle={handleDrawerToggle}
        onSidebarToggle={handleSidebarCollapse}
      />

      {/* Sidebar Navigation */}
      <Box
        component="nav"
        sx={{ width: { md: isSidebarOpen ? drawerWidth : 0 }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Sidebar */}
        <Drawer
          variant="persistent"
          open={isSidebarOpen}
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 12, sm: 10 }, // ✅ Top padding adjusts for AppBar height
          width: {
            xs: '100%',
            md: isSidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          },
          transition: theme.transitions.create(['width', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        })}
      >
        <Outlet />
      </Box>
    </Box>
  );

}
