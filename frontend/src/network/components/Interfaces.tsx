import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Skeleton } from '@mui/material';
import { ArrowDownward, ArrowUpward, HelpOutline } from '@mui/icons-material';
import { useGetNetworkInterfacesQuery } from '../services';

export default function NetworkInterfaces() {
  const { data, error, isLoading } = useGetNetworkInterfacesQuery();
  const getState = (state: boolean | null) => {
    if (state === true) {
      return (
        <Typography color="success.main">
          <ArrowUpward />
          UP
        </Typography>
      );
    }
    if (state === false) {
      return (
        <Typography color="error.main">
          <ArrowDownward />
          DOWN
        </Typography>
      );
    }
    return (
      <Typography color="warning.main">
        <HelpOutline />
        UNKNOWN
      </Typography>
    );
  };

  if (isLoading) {
    // Show Skeleton while loading
    return (
      <Grid container spacing={3} sx={{ border: 1 }}>
        {Array.from(new Array(4)).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid item xs={3} key={`skeleton-${index}`}>
            <Card sx={{ minWidth: 230 }}>
              <CardContent>
                <Skeleton height={50} />
                <Skeleton height={30} />
              </CardContent>
              <CardActions>
                <Button size="small">
                  <Skeleton variant="text" width={80} />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!data || data.length === 0 || error) {
    // Show message when there is no data
    return (
      <Grid container spacing={3} sx={{ border: 1 }}>
        <Grid item xs={11}>
          <h2> Interfaces</h2>
        </Grid>
        <Grid xs={1}>
          <Button variant="contained">Test button</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">No data available.</Typography>
        </Grid>
      </Grid>
    );
  }

  // Render the data when not loading and data is available
  return (
    <Grid container spacing={3} sx={{ border: 1 }}>
      <Grid item xs={11}>
        <h2> Interfaces</h2>
      </Grid>
      <Grid xs={1}>
        <Button variant="contained">Test button</Button>
      </Grid>
      {data.map((networkInterface) => (
        <Grid item xs={3} key={networkInterface.id}>
          <Card sx={{ minWidth: 230 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {networkInterface.name}
              </Typography>
              {getState(networkInterface.state)}
              <Typography variant="body2">
                IP Address: {networkInterface.ip_address}
                <br />
                Mac Address: {networkInterface.mac_address}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
