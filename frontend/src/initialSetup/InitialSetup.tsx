import React, { useState } from 'react';
import {
  Button,
  Grid,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import HubIcon from '@mui/icons-material/Hub';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import { useNavigate } from 'react-router';
import { useSetConfigMutation } from './services';

const SetupPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    connectionType: '',
    mainServerUrl: '',
    nameOfServer: '',
    wireguardEndpoint: '',
    iptablesBinPath: '/usr/sbin/iptables',
    wgBinPath: '/usr/bin/wg',
    wgQuickBinPath: '/usr/bin/wg-quick',
  });

  const [useSetConfig] = useSetConfigMutation();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConnectToServer = (type: string) => {
    setFormData((prevData) => ({
      ...prevData,
      connectionType: type,
    }));
    if (type === 'existing_server') {
      handleNext();
    } else {
      setActiveStep(2);
    }
  };

  const handleSubmit = async () => {
    useSetConfig({
      wg_bin: formData.wgBinPath,
      wg_quick_bin: formData.wgQuickBinPath,
      iptables_bin: formData.iptablesBinPath,
      server_name: formData.nameOfServer,
      wg_endpoint: formData.wireguardEndpoint,
    })
      .unwrap()
      .then(() => {
        navigate('/');
      });
  };

  const handleTestServer = async () => {
    try {
      // Test server connection here
      alert('Server connection successful!');
    } catch (error) {
      alert('Server connection failed.');
      console.error('Error testing server:', error);
    }
  };
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Steps
  const steps = [
    {
      title: 'Choose Connection Type',
      content: (
        <Stack direction="column" spacing={3} alignItems="center">
          <Typography variant="h5">Choose Connection Type</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudQueueIcon />}
              onClick={() => handleConnectToServer('new_server')}
              sx={{ height: 60 }} // Increase button height
            >
              New Server
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<HubIcon />}
              onClick={() => handleConnectToServer('existing_server')}
              sx={{ height: 60 }} // Increase button height
            >
              {/* Add "EXISTS SERVER" icon */}
              Connect Server
            </Button>
          </Stack>
        </Stack>
      ),
    },
    {
      title: 'Server URL',
      content: (
        <Stack direction="column" spacing={3}>
          <Typography variant="h5">Server URL</Typography>
          {formData.connectionType === 'existing_server' && (
            <TextField
              label="Main Server URL"
              variant="outlined"
              fullWidth
              name="mainServerUrl"
              value={formData.mainServerUrl}
              onChange={handleInputChange}
            />
          )}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            {formData.connectionType === 'existing_server' && (
              <Button variant="outlined" onClick={handleTestServer}>
                Test Server
              </Button>
            )}
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Stack>
      ),
    },
    {
      title: 'Path Settings',
      content: (
        <Stack direction="column" spacing={3}>
          <Typography variant="h5">Path Settings</Typography>
          <TextField
            label="Iptables Bin Path"
            variant="outlined"
            fullWidth
            name="iptablesBinPath"
            value={formData.iptablesBinPath}
            onChange={handleInputChange}
          />
          <TextField
            label="Wg Bin Path"
            variant="outlined"
            fullWidth
            name="wgBinPath"
            value={formData.wgBinPath}
            onChange={handleInputChange}
          />
          <TextField
            label="Wg Quick Bin Path"
            variant="outlined"
            fullWidth
            name="wgQuickBinPath"
            value={formData.wgQuickBinPath}
            onChange={handleInputChange}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Stack>
      ),
    },
    {
      title: 'Server Settings',
      content: (
        <Stack direction="column" spacing={3}>
          <Typography variant="h5">Server Settings</Typography>
          <TextField
            label="Name of Server"
            variant="outlined"
            fullWidth
            name="nameOfServer"
            value={formData.nameOfServer}
            onChange={handleInputChange}
          />
          <TextField
            label="Wireguard Endpoint"
            variant="outlined"
            fullWidth
            name="wireguardEndpoint"
            value={formData.wireguardEndpoint}
            onChange={handleInputChange}
          />
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save Configuration
            </Button>
          </Stack>
        </Stack>
      ),
    },
  ];

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={6}>
        <Paper sx={{ padding: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Step key={index}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {steps[activeStep].content}
        </Paper>
      </Grid>
    </Grid>
  );
};
export default SetupPage;
