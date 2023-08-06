import React from 'react';
import { Box } from '@mui/material';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import AddInterfacePeerForm from './components/AddInterfacePeerForm';

// Your existing code...

export default function AddInterfacePeer() {
  // ...existing code...

  return (
    // ...existing code...
    <ResponsiveDrawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <AddInterfacePeerForm />
      </Box>
    </ResponsiveDrawer>
    // ...existing code...
  );
}
