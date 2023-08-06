import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import {
  useAddClientPeerMutation,
  useDeleteClientPeerMutation,
  useGetClientPeersQuery,
  useLazyGetFreeIpAddressQuery,
} from '../services';
import {
  useGetWireguardInterfacesQuery,
  WireguardNetworkInterface,
} from '../../wireguard/services';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const ListInterfacesInClient = () => {
  const { uuid } = useParams();
  const { data, error, isLoading } = useGetClientPeersQuery(uuid!);
  const { data: wgInterfaces, isLoading: wgInterfacesLoading } =
    useGetWireguardInterfacesQuery();
  const [interfacesCanAdd, setInterfacesCanAdd] = useState<
    WireguardNetworkInterface[]
  >([]);
  // eslint-disable-next-line no-unused-vars
  const [disabledIpAddressInput, setDisabledIpAddressInput] = useState(true);
  const [isLoadingIpAddressInput, setIsLoadingIpAddressInput] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [interfaceToAdd, setInterfaceToAdd] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [
    getFreeIpAddressQuery,
    { data: freeIpData, isLoading: freeIpLoading },
  ] = useLazyGetFreeIpAddressQuery();
  const [useAddClientPeer] = useAddClientPeerMutation();
  const [deletePeerUuid, setDeletePeerUuid] = useState<{
    clientId: string;
    interfaceId: string;
  } | null>(null);
  const [deleteClientPeer] = useDeleteClientPeerMutation();

  const handleDeleteButtonClick = (clientId: string, interfaceId: string) => {
    setDeletePeerUuid({ clientId, interfaceId });
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = () => {
    // Perform deletion logic here
    if (deletePeerUuid) {
      deleteClientPeer(deletePeerUuid);
    }
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    if (!isLoading && data && !wgInterfacesLoading && wgInterfaces) {
      const dataInterfaceUUIDs = new Set(
        data.map((item) => item.interface.uuid)
      );

      const filteredWgInterfaces = wgInterfaces.filter(
        (iface) => !dataInterfaceUUIDs.has(iface.uuid)
      );
      setInterfacesCanAdd(filteredWgInterfaces);
    }
  }, [isLoading, data, wgInterfacesLoading, wgInterfaces]);

  const handleOpenFormDialog = () => {
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
  };
  useEffect(() => {
    if (freeIpLoading) {
      setIsLoadingIpAddressInput(true);
    }
    if (freeIpData) {
      setIpAddress(freeIpData?.ip_address || '');
      setIsLoadingIpAddressInput(false);
      setDisabledIpAddressInput(false);
    }
  }, [freeIpData, freeIpLoading]);

  const handleInterfaceChange = (event: SelectChangeEvent) => {
    setInterfaceToAdd(event.target.value);
    getFreeIpAddressQuery(event.target.value);
  };

  const handleIpAddressChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIpAddress(event.target.value);
  };

  const handleSubmit = () => {
    // Handle the form data here as needed
    // For example, you can log the data to the console for now
    useAddClientPeer({
      clientId: uuid!,
      ipAddress,
      interfaceId: interfaceToAdd,
    });
    setIsFormDialogOpen(false); // Close the dialog after form submission
  };

  if (isLoading) {
    return (
      <TableRow>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={120} height={36} />
        </TableCell>
      </TableRow>
    );
  }
  if (error) {
    return (
      <div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Error occurred while fetching data.
        </Typography>
      </div>
    );
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Server IP Address</TableCell>
              <TableCell>Last online</TableCell>
              <TableCell>Client IP Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((peer) => (
              <TableRow key={peer.client_id + peer.interface.uuid}>
                <TableCell>{peer.interface.name}</TableCell>
                <TableCell>{peer.interface.ip_address}</TableCell>
                <TableCell>{peer.last_online}</TableCell>
                <TableCell>{peer.ip_address}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() =>
                      handleDeleteButtonClick(
                        peer.client_id,
                        peer.interface.uuid
                      )
                    }
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell colSpan={4}>
                <Button
                  variant="contained"
                  color="primary"
                  // size="large"
                  startIcon={<AddIcon />}
                  onClick={handleOpenFormDialog}
                >
                  Add Interface
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isFormDialogOpen} onClose={handleCloseFormDialog}>
        <DialogTitle>Add New Interface</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add new interface for your client, please enter client ip address
            and choice interface. Please doesnt use same ip address for each
            client.
          </DialogContentText>
          <FormControl
            variant="standard"
            // sx={{ m: 1, minWidth: 120 }}
            fullWidth
          >
            <InputLabel id="interface-label">Interface</InputLabel>
            <Select
              labelId="interface-label"
              id="interface-label"
              value={interfaceToAdd}
              onChange={handleInterfaceChange}
              label="Interface"
            >
              {interfacesCanAdd.map((networkInterface) => (
                <MenuItem
                  key={networkInterface.uuid}
                  value={networkInterface.uuid}
                >
                  {networkInterface.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="IP Address"
            fullWidth
            variant="standard"
            value={ipAddress}
            onChange={handleIpAddressChange}
            disabled={disabledIpAddressInput || isLoadingIpAddressInput}
          />
          {isLoadingIpAddressInput && (
            <CircularProgress
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px', // Adjust this to center the loader properly
                marginLeft: '-12px', // Adjust this to center the loader properly
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};

export default ListInterfacesInClient;
