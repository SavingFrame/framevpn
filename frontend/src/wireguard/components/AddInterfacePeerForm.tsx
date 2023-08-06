import { Button, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router';

const AddInterfacePeerForm = () => {
  const { uuid } = useParams();
  console.log(uuid);
  const [peerData, setPeerData] = React.useState({
    name: '',
    description: '',
    ipv4: '',
    primaryDns: '8.8.8.8',
    secondaryDns: '8.8.4.4',
  });
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setPeerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Create Interface Peer</Typography>
      </Grid>
      <Grid item xs={6} md={6}>
        <TextField
          name="name"
          label="Name"
          value={peerData.name}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <TextField
          name="description"
          label="Description"
          rows={3}
          value={peerData.description}
          onChange={handleChange}
          fullWidth
          multiline
        />
      </Grid>
      <Grid item xs={6} md={6}>
        <TextField
          name="ipv4"
          label="IPv4"
          value={peerData.ipv4}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          name="primaryDns"
          label="Primary DNS"
          value={peerData.primaryDns}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          name="secondaryDns"
          label="Secondary DNS"
          value={peerData.secondaryDns}
          onChange={handleChange}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Button type="submit" variant="contained" color="primary">
          Create Peer
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddInterfacePeerForm;
