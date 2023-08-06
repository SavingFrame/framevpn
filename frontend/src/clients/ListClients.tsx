import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import ListClientsTable from './components/ListClientsTable';

const ListClients = () => {
  const navigate = useNavigate();
  return (
    <ResponsiveDrawer>
      <Grid container spacing={2}>
        <Grid item xs={11}>
          <Typography variant="h6">Clients</Typography>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate('/wireguard/clients/add');
            }}
          >
            Create
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ListClientsTable />
        </Grid>
      </Grid>
    </ResponsiveDrawer>
  );
};

export default ListClients;
