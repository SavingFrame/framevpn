import React, { FC } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
// import { makeStyles } from 'tss-react/mui';

import Login from './auth/Login';
import Home from './views/Home';
import Protected from './views/Protected';
import RequireAuth from './views/RequireAuth';
import UsersList from './users/Users';
import { setupResponseInterceptor } from './core/services';

// import { logout } from './auth/services';

// const useStyles = makeStyles()(() => ({
//   app: {
//     textAlign: 'center',
//   },
//   header: {
//     backgroundColor: '#282c34',
//     minHeight: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     fontSize: 'calc(10px + 2vmin)',
//     color: 'white',
//   },
// }));

const AppRoutes: FC = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = React.useState(false);

  if (!isLoaded) {
    setIsLoaded(true);
    setupResponseInterceptor(navigate);
  }

  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" />
        <Route
          path="/protected"
          element={
            <RequireAuth>
              <Protected />
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <UsersList />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;
