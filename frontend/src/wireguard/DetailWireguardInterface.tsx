import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import {
  useChangeStatusWireguardInterfaceMutation,
  useDeleteWireguardInterfaceMutation,
  useGetDetailWireguardInterfaceQuery,
  useGetInterfacePeersQuery,
} from './services';
import { isAxiosBaseQueryErrorType } from '../core/store/api';

// Assuming you have imported the required WireguardInterface data and actions

const WireguardInterfaceDetails = () => {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { data, error, isLoading } = useGetDetailWireguardInterfaceQuery(uuid!);
  const {
    data: peersData,
    error: peersError,
    isLoading: peersIsLoading,
  } = useGetInterfacePeersQuery(uuid!);
  const [useDeleteWireguardInterface] = useDeleteWireguardInterfaceMutation();
  const [
    useChangeStatusWireguardInterface,
    { error: changeStatusInterfaceError },
  ] = useChangeStatusWireguardInterfaceMutation();
  const [isInterfaceUp, setIsInterfaceUp] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCloseErrorSnackbar = () => {
    setErrorSnackbarOpen(false);
  };

  useEffect(() => {
    if (!isLoading && data) {
      setIsInterfaceUp(data.state === 'up');
    }
  }, [isLoading, data]);

  const handleToggleInterface = async () => {
    await useChangeStatusWireguardInterface!({
      uuid: uuid!,
      toStatus: !isInterfaceUp,
    });
  };
  useEffect(() => {
    if (changeStatusInterfaceError) {
      if (isAxiosBaseQueryErrorType(changeStatusInterfaceError)) {
        if (changeStatusInterfaceError.data.detail) {
          setErrorSnackbarMessage(changeStatusInterfaceError.data.detail);
        } else {
          const errorMessageParts = JSON.stringify(
            changeStatusInterfaceError.data
          );
          console.log(errorMessageParts);

          setErrorSnackbarMessage(errorMessageParts);
        }
      } else {
        setErrorSnackbarMessage('Unknown error');
      }
      setErrorSnackbarOpen(true);
    }
  }, [changeStatusInterfaceError]);

  const handleRestartInterface = () => {
    // Implement the logic to restart the interface here
    setDialogOpen(false); // Close the confirmation dialog
  };

  const handleDeleteInterface = () => {
    // Implement the logic to delete the interface here
    setDialogOpen(false); // Close the confirmation dialog
    useDeleteWireguardInterface(uuid!).then(() =>
      navigate('/wireguard/interfaces/')
    );
  };

  const handleDownloadConfig = () => {
    console.log('download config');
    // Implement the logic to download the configuration here
  };

  // Handler functions for actions on peers
  // const handleAddPeer = () => {
  //   console.log('handle add peer');
  // Implement the logic to add a new peer here
  // };

  const handleDeletePeer = (peerId: string) => {
    console.log(peerId);
    // Implement the logic to delete a peer here
  };

  if (isLoading || peersIsLoading) {
    return (
      <div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Skeleton width={150} />
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
                <TableCell>
                  <Skeleton />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                  <TableCell>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

  // Show error if there is any error in fetching data
  if (error || peersError) {
    return (
      <div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Error occurred while fetching data.
        </Typography>
      </div>
    );
  }

  return (
    <ResponsiveDrawer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interface Details
              </Typography>
              <Divider />
              <List>
                <ListItem>
                  <ListItemIcon>
                    {isInterfaceUp ? (
                      <StopIcon color="primary" />
                    ) : (
                      <PlayArrowIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={isInterfaceUp ? 'Stop' : 'Start'} />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`Name: ${data!.name}`}
                    secondary={`Description: ${data!.description}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`Listen Port: ${data!.listen_port}`}
                    secondary={`State: ${data!.state}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={`IP Address: ${data!.ip_address}`}
                    secondary={`Gateway Interface: ${data!.gateway_interface}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="On Up:"
                    secondary={
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {data!.on_up.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={index}>{item}</div>
                        ))}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="On Down:"
                    secondary={
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="div"
                      >
                        {data!.on_down.map((item, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <div key={index}>{item}</div>
                        ))}
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
              <Grid container justifyContent="space-between" spacing={1}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleToggleInterface}
                    size="small"
                  >
                    {isInterfaceUp ? 'Stop' : 'Start'}
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() => setDialogOpen(true)}
                    size="small"
                  >
                    Restart
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleDeleteInterface}
                    size="small"
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={handleDownloadConfig}
                    size="small"
                  >
                    Download Config
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interface Peers
              </Typography>
              <Divider />
              <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>DNS</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {peersData!.map((peer) => (
                      <TableRow key={peer.uuid}>
                        <TableCell>{peer.description}</TableCell>
                        <TableCell>{`${peer.dns1}, ${peer.dns2}`}</TableCell>
                        <TableCell>{peer.name}</TableCell>
                        <TableCell>{peer.state}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeletePeer(peer.uuid)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for Restart Interface confirmation */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Restart Interface</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to restart the interface?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRestartInterface} color="primary" autoFocus>
            Restart
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={60000}
        onClose={handleCloseErrorSnackbar}
        message="Note archived"
      >
        <Alert
          onClose={handleCloseErrorSnackbar}
          severity="error"
          sx={{ width: '100%', whiteSpace: 'pre-line' }}
        >
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </ResponsiveDrawer>
  );
};

export default WireguardInterfaceDetails;
