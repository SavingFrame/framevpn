import React from 'react';
import { Grid, Typography } from '@mui/material';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import NetworkInterfaces from './components/Interfaces';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function Network() {
  useDocumentTitle('Network');
  return (
    <ResponsiveDrawer>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <Typography variant="h6"> Interfaces</Typography>
        </Grid>
        <NetworkInterfaces />
      </Grid>
    </ResponsiveDrawer>
  );
}
