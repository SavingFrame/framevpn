import React from 'react';
import { Grid, Typography } from '@mui/material';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import AddInterfacePeerForm from './components/AddClientForm';

const AddClient = () => {
  return (
    <ResponsiveDrawer>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Create Client</Typography>
        </Grid>
        <AddInterfacePeerForm />
      </Grid>
    </ResponsiveDrawer>
  );
};

export default AddClient;
