import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, Skeleton } from '@mui/material';
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useGetWireguardInterfacesQuery } from '../services';

export default function ListInterfaces() {
  const { data, error, isLoading } = useGetWireguardInterfacesQuery();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {Array.from(new Array(4)).map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Grid item xs={3} key={index}>
            <Card sx={{ minWidth: 230 }}>
              <CardContent>
                <Skeleton height={50} />
                <Skeleton height={30} />
                <Skeleton height={30} />
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

  // If data is undefined or empty, show fallback message or component
  if (!data || data.length === 0 || error) {
    return (
      <Typography variant="body2" align="center">
        No data available.
      </Typography>
    );
  }

  // If data is available, render the mapped data
  return (
    <Grid container spacing={3}>
      <Grid item xs={11}>
        <h2> Interfaces</h2>
      </Grid>

      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate('/wireguard/interfaces/add');
          }}
        >
          Create
        </Button>
      </Grid>

      {data.map((networkInterface) => (
        <Grid item xs={3} key={networkInterface.uuid}>
          <Card sx={{ minWidth: 230 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {networkInterface.name}
              </Typography>
              {networkInterface.state === 'UP' ? (
                <Typography
                  color="success.main"
                  sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
                >
                  <ArrowUpward />
                  {networkInterface.state}
                </Typography>
              ) : (
                <Typography
                  color="error.main"
                  sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
                >
                  <ArrowDownward />
                  {networkInterface.state}
                </Typography>
              )}

              <Typography variant="body2">
                Description: {networkInterface.description}
                <br />
                Listen Port: {networkInterface.listen_port}
                <br />
                IP Address: {networkInterface.ip_address}
                <br />
                Peers: {networkInterface.count_peers}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() =>
                  navigate(`/wireguard/interfaces/${networkInterface.uuid}`)
                }
              >
                Detail info
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
