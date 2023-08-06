import {
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import {
  downloadClientConfig,
  useDeleteClientMutation,
  useGetDetailClientQuery,
} from '../services';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const DetailClientInfo = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const { data, isLoading, error } = useGetDetailClientQuery(uuid!);
  const [isClientOnline] = React.useState(false);
  const [isClientBlocked] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [useDeleteClient] = useDeleteClientMutation();

  const handleDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirmed = () => {
    // Perform deletion logic here
    useDeleteClient(uuid!);
    setIsDeleteDialogOpen(false);
  };

  const handleDownloadConfig = async () => {
    await downloadClientConfig(uuid!, 'wg_config.conf');
  };

  if (isLoading) {
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Client Details
          </Typography>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                {isClientOnline ? (
                  <StopIcon color="primary" />
                ) : (
                  <PlayArrowIcon color="primary" />
                )}
              </ListItemIcon>
              <ListItemText primary={isClientOnline ? 'Online' : 'Offline'} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Name: ${data!.name}`}
                secondary={`Description: ${data!.description}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={`Primary DNS: ${data!.dns1}`}
                secondary={`Secondary DNS: ${data!.dns2}`}
              />
            </ListItem>
          </List>
          <Grid container justifyContent="space-between" spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDownloadConfig}
                size="small"
              >
                Download Config
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                // onClick={handleToggleInterface}
                size="small"
              >
                {isClientBlocked ? 'Unblock' : 'Block'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={handleDeleteButtonClick}
                size="small"
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={handleDeleteConfirmed}
      />
    </>
  );
};

export default DetailClientInfo;
