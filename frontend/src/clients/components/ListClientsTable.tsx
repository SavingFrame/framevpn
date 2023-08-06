import React, { useState } from 'react';
import {
  Button,
  Paper,
  Popover,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useGetClientsQuery } from '../services';
import { ListInterfacesInClientList } from '../types';

const ListClientsTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [currentPopoverInterface, setCurrentPopoverInterface] = React.useState<
    ListInterfacesInClientList[]
  >([]);
  const { data, error, isLoading, refetch } = useGetClientsQuery({
    page: page + 1,
    size,
  });
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: unknown) => {
    setPage(0);
    setSize(
      parseInt((event as React.ChangeEvent<HTMLInputElement>).target.value, 10)
    );
  };

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    interfaces: ListInterfacesInClientList[]
  ) => {
    setCurrentPopoverInterface(interfaces);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  if (error) {
    return (
      <div>
        <h2>Oops, something went wrong!</h2>
        <p>Failed to fetch data. Please try again later.</p>
        <Button onClick={refetch}>Retry</Button>
      </div>
    );
  }

  if (isLoading) {
    // Show skeleton loading state while data is being fetched
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
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
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(Array(5)).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow key={index}>
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
                  <Skeleton variant="text" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>DNS1</TableCell>
              <TableCell>DNS2</TableCell>
              <TableCell>Interfaces</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.items.map((client) => (
              <TableRow key={client.uuid}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.description}</TableCell>
                <TableCell>{client.dns1}</TableCell>
                <TableCell>{client.dns2}</TableCell>
                <TableCell
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  onMouseEnter={(event) =>
                    handlePopoverOpen(event, client.interfaces)
                  }
                  onMouseLeave={handlePopoverClose}
                >
                  {client.interfaces.length > 3
                    ? `${client.interfaces.length} interfaces`
                    : client.interfaces.map((iface) => iface.name).join(', ')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Handle redirection to the detail page using client.uuid
                      // Replace '/client-detail' with the correct path for your detail page
                      navigate(`/wireguard/clients/${client.uuid}`);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[20, 50]}
        component="div"
        count={data!.total}
        rowsPerPage={size}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={currentPopoverInterface.length > 3 ? open : false}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          {currentPopoverInterface.map((iface) => (
            <div>{iface.name}</div>
          ))}
        </Typography>
      </Popover>
    </>
  );
};

export default ListClientsTable;
