import { Grid } from '@mui/material';
import React from 'react';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import DetailClientInfo from './components/DetailClientInfo';
import ListInterfacesInClient from './components/ListInterfacesInClient';
import useDocumentTitle from '../utils/useDocumentTitle';

const DetailClient = () => {
  useDocumentTitle('Client Details');
  return (
    <ResponsiveDrawer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <DetailClientInfo />
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <ListInterfacesInClient />
        </Grid>
      </Grid>
    </ResponsiveDrawer>
  );
};

export default DetailClient;
