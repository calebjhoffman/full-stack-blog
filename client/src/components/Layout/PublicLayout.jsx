import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // ✅ added
import TopBar from './TopBar';

export default function PublicLayout() {
  const theme = useTheme(); // ✅ get theme object

  return (
    <>
      <TopBar />
      <Toolbar /> {/* Prevent content from hiding behind fixed AppBar */}
      <Box
        sx={{
          backgroundColor: theme.palette.background.default, // ✅ theme background
          color: theme.palette.text.primary, // ✅ theme text color
          minHeight: '100vh', // ✅ ensure full viewport height
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}
