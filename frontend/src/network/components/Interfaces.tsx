import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { ArrowDownward, ArrowUpward, HelpOutline } from '@mui/icons-material';
import { NetworkInterface, getInterfaces } from '../services';

export default function NetworkInterfaces() {
  const [interfacesList, setInterfacesList] = React.useState<
    NetworkInterface[]
  >([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getInterfaces();
      setInterfacesList(data);
    };
    fetchData();
  }, []);

  const getState = (state: boolean | null) => {
    if (state) {
      return (
        <Typography
          sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
          color="success.main"
        >
          <ArrowUpward />
          UP
        </Typography>
      );
    }
    if (!state) {
      return (
        <Typography
          sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
          color="error.main"
        >
          <ArrowDownward />
          DOWN
        </Typography>
      );
    }
    return (
      <Typography
        sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}
        color="warning.main"
      >
        <HelpOutline />
        UNKNOWN
      </Typography>
    );
  };

  return (
    <div>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2>Block 1</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log('Create button clicked')}
        >
          Create
        </Button>
      </div>
      <div className="card-block-container">
        <Grid container spacing={3}>
          {interfacesList.map((networkInterface) => {
            return (
              <Grid item xs={3}>
                <Card sx={{ minWidth: 275 }}>
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
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
