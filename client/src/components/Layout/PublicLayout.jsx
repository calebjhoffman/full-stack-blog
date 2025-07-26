import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import TopBar from './TopBar';

export default function PublicLayout() {
  return (
    <>
      <TopBar />
      <Toolbar /> {/* Prevent content from hiding behind fixed AppBar */}
      <Box>
        <Outlet />
      </Box>
    </>
  );
}
