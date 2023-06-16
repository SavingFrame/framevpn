import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import { getUsers, UserListResponse } from './services';

interface Column {
  id:
| 'id'
| 'first_name'
| 'last_name'
| 'email'
| 'is_active'
| 'is_superuser';
  label: string;
  minWidth?: number;
  align?: 'right';
  // eslint-disable-next-line no-unused-vars
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'email', label: 'Email', minWidth: 100 },
  {
    id: 'first_name',
    label: 'First Name',
  },
  {
    id: 'last_name',
    label: 'Last Name',
  },
  {
    id: 'is_active',
    label: 'Is Active',
    align: 'right',
  },
  {
    id: 'is_superuser',
    label: 'Is Superuser',
    align: 'right',
  },
];

//
export default function UsersList() {
  // @ts-ignore
  const [usersList, setUsersList] = React.useState<UserListResponse[]>([]);
  const [usersCount, setUsersCount] = React.useState(0);

  const [controller, setController] = React.useState({
    page: 0,
    rowsPerPage: 10,
  });
  const handlePageChange = (event: any, newPage: number) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers();
      setUsersList(data.items);
      setUsersCount(data.total);
    };
    fetchData();
  }, [controller]);

  return (
    <ResponsiveDrawer>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {usersList.map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.first_name}</TableCell>
                    <TableCell>{row.last_name}</TableCell>
                    <TableCell>{row.is_active}</TableCell>
                    <TableCell>{row.is_superuser}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={usersCount}
          rowsPerPage={controller.rowsPerPage}
          page={controller.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </ResponsiveDrawer>
  );
}
