import React from 'react';
import { Grid, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import ListInterfaces from './components/ListInterfaces';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function Wireguard() {
  useDocumentTitle('Wireguard');
  const navigate = useNavigate();
  return (
    <ResponsiveDrawer>
      <Grid container spacing={3}>
        <Grid item xs={11}>
          <Typography variant="h6"> Interfaces</Typography>
        </Grid>
        <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => {
              navigate('/wireguard/interfaces/add');
            }}
          >
            Create
          </Button>
        </Grid>
        <ListInterfaces />
      </Grid>
    </ResponsiveDrawer>
  );
}
