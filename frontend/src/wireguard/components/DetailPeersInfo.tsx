import React from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';
import { useGetInterfacePeersQuery } from '../services';
import RelativeDateFromNow from '../../network/components/RelativeDateFromNow';

// Assuming you have imported the required WireguardInterface data and actions

const DetailPeersInfo = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const {
    data: peersData,
    error: peersError,
    isLoading: peersIsLoading,
  } = useGetInterfacePeersQuery(uuid!);

  // Handler functions for actions on peers
  // const handleAddPeer = () => {
  //   console.log('handle add peer');
  // Implement the logic to add a new peer here
  // };

  const handleDeletePeer = (peerId: string) => {
    console.log(peerId);
    // Implement the logic to delete a peer here
  };

  if (peersIsLoading) {
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
  if (peersError) {
    return (
      <div>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Error occurred while fetching data.
        </Typography>
      </div>
    );
  }

  return (
    <Grid item xs={12} sm={6} md={8}>
      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Interface Peers
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/wireguard/interfaces/${uuid}/peers/add`)
              }
              startIcon={<AddIcon />}
              sx={{ marginBottom: '10px' }}
            >
              Add Peer
            </Button>
          </Box>
          <Divider />
          <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>DNS</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {peersData!.map((peer) => (
                  <TableRow key={peer.uuid_pk}>
                    <TableCell>{peer.client.name}</TableCell>
                    <TableCell>{peer.ip_address}</TableCell>
                    <TableCell>
                      <RelativeDateFromNow
                        lastOnline={new Date(`${peer.last_online}Z`)}
                      />
                    </TableCell>
                    <TableCell>{`${peer.client.dns1}, ${peer.client.dns2}`}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeletePeer(peer.uuid_pk)}
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
  );
};

export default DetailPeersInfo;
