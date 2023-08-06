import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetWireguardInterfacesQuery } from '../../wireguard/services';
import { useAddClientMutation } from '../services';

const AddInterfacePeerForm = () => {
  const navigate = useNavigate();
  const [interfaces, setInterfaces] = React.useState<string[]>([]);
  const { data, error, isLoading } = useGetWireguardInterfacesQuery();
  const [peerData, setPeerData] = React.useState({
    name: '',
    description: '',
    primaryDns: '8.8.8.8',
    secondaryDns: '8.8.4.4',
  });
  const [useAddClient] = useAddClientMutation();
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setPeerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    useAddClient({
      name: peerData.name,
      description: peerData.description,
      dns1: peerData.primaryDns,
      dns2: peerData.secondaryDns,
      interfaces,
    })
      .unwrap()
      .then((response) => {
        navigate(`/wireguard/clients/${response.uuid}`);
      });
  };

  const handleInputChange = (event: SelectChangeEvent<typeof interfaces>) => {
    const {
      target: { value },
    } = event;
    setInterfaces(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <>
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
        <FormControl fullWidth>
          <InputLabel id="select-interface-label">Interfaces</InputLabel>
          <Select
            labelId="select-interface-label"
            id="select-interface-chip"
            multiple
            value={interfaces}
            onChange={handleInputChange}
            disabled={isLoading || error !== undefined}
            input={
              <OutlinedInput id="select-multiple-chip" label="Interfaces" />
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}

            // MenuProps={MenuProps}
          >
            {data?.map((iface) => (
              <MenuItem
                key={iface.uuid}
                value={iface.uuid}
                // style={getStyles(name, personName, theme)}
              >
                {iface.name} - {iface.ip_address}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
          Create Peer
        </Button>
      </Grid>
    </>
  );
};

export default AddInterfacePeerForm;
