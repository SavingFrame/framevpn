import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import {
  useAddWireguardInterfaceMutation,
  useGetCreateInterfaceDefaultValuesQuery,
  // useGetIpTableRulesQuery,
  wireguardApi,
} from '../services';
import { useGetNetworkInterfacesQuery } from '../../network/services';

const AddWireguardInterfaceForm = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetCreateInterfaceDefaultValuesQuery();
  const {
    data: interfacesData,
    isLoading: interfacesIsLoading,
    error: interfacesError,
  } = useGetNetworkInterfacesQuery();
  const initialData = {
    name: '',
    description: '',
    gateway_interface: '',
    ipv4: '',
    listenPort: '',
    onUp: '',
    onDown: '',
  };
  const [interfaceData, setInterfaceData] = useState(initialData);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setInterfaceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [addWireguardInterface] = useAddWireguardInterfaceMutation();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const sendData = {
      name: interfaceData.name,
      description: interfaceData.description,
      gateway_interface: interfaceData.gateway_interface,
      ip_address: interfaceData.ipv4,
      listen_port: parseInt(interfaceData.listenPort, 10),
      on_up: interfaceData.onUp.split('\n'),
      on_down: interfaceData.onDown.split('\n'),
    };
    await addWireguardInterface(sendData);
    setInterfaceData(initialData);
  };
  // const { data: ipTableRulesData, isLoading: ipTableRulesIsLoading } =
  //   useGetIpTableRulesQuery(
  //     {
  //       name: interfaceData.name,
  //       gatewayInterface: interfaceData.gateway_interface,
  //     },
  //     { skip: skipGetIpTableRules }
  //   );
  const handleOnBlurNameOrGateway = async () => {
    // setSkipGetIpTableRules(false);
    dispatch(
      // @ts-ignore
      wireguardApi.endpoints.getIpTableRules.initiate(
        {
          name: interfaceData.name,
          gatewayInterface: interfaceData.gateway_interface,
        },
        { forceRefetch: true }
      )
    )
      .unwrap()
      .then((result: any) => {
        console.log('result', result);
        setInterfaceData((prevData) => ({
          ...prevData,
          onUp: result.on_up.join('\n') || '',
          onDown: result.on_down.join('\n') || '',
        }));
      });
    // });
  };

  useEffect(() => {
    if (!isLoading && data) {
      const iptablesOnUp = data?.on_up.join('\n');
      const iptablesOnDown = data?.on_down.join('\n');
      setInterfaceData({
        name: data?.name || '',
        description: '',
        gateway_interface: data?.gateway_interface || '',
        ipv4: data?.ip_address || '',
        listenPort: data?.port_number || '',
        onUp: iptablesOnUp || '',
        onDown: iptablesOnDown || '',
      });
    }
  }, [isLoading, data]);

  const renderForm = () => {
    if (isLoading || interfacesIsLoading) {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Skeleton variant="text" animation="wave" />
          </Grid>
          {/* Add more skeleton components for other form fields */}
        </Grid>
      );
    }

    if (error || interfacesError) {
      return <>Oh no, there was an error</>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Create Wireguard Interface</Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <TextField
            name="name"
            label="Name"
            value={interfaceData.name}
            onChange={handleChange}
            onBlur={handleOnBlurNameOrGateway}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <TextField
            name="description"
            label="Description"
            rows={3}
            value={interfaceData.description}
            onChange={handleChange}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12} md={4}>
          {interfacesData ? (
            <FormControl fullWidth>
              <InputLabel id="gateway-label">Gateway</InputLabel>
              <Select
                id="gateway"
                labelId="gateway-label"
                name="gateway_interface"
                label="Gateway"
                onChange={handleChange}
                value={interfaceData.gateway_interface}
                onBlur={handleOnBlurNameOrGateway}
              >
                {interfacesData.map((networkInterface) => (
                  <MenuItem
                    key={networkInterface.name}
                    value={networkInterface.name}
                  >
                    {networkInterface.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <TextField
              name="gateway"
              label="Gateway"
              value={interfaceData.gateway_interface}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name="ipv4"
            label="IPv4"
            value={interfaceData.ipv4}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6} md={4}>
          <TextField
            name="listenPort"
            label="Listen Port"
            type="number"
            value={interfaceData.listenPort}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="onUp"
            label="On Up"
            value={interfaceData.onUp}
            onChange={handleChange}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            name="onDown"
            label="On Down"
            value={interfaceData.onDown}
            onChange={handleChange}
            fullWidth
            multiline
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Create Interface
          </Button>
        </Grid>
      </Grid>
    );
  };

  return <form onSubmit={handleSubmit}>{renderForm()}</form>;
};

export default AddWireguardInterfaceForm;
