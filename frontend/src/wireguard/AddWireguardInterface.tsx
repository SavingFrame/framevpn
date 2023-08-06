import React from 'react';
import { Box } from '@mui/material';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import AddWireguardInterfaceForm from './components/AddWireguardInterfaceForm';

// Your existing code...

export default function AddWireguardInterface() {
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
        <AddWireguardInterfaceForm />
      </Box>
    </ResponsiveDrawer>
    // ...existing code...
  );
}
