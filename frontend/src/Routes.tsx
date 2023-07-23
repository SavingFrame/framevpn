import React, { FC } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './auth/Login';
import Home from './views/Home';
import Protected from './views/Protected';
import RequireAuth from './views/RequireAuth';
import UsersList from './users/Users';
import { setupResponseInterceptor } from './core/services';
import Network from './network/Network';
import Wireguard from './wireguard/Wireguard';
import AddWireguardInterface from './wireguard/AddWireguardInterface';
import WireguardInterfaceDetails from './wireguard/DetailWireguardInterface';

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
          path="/network/interfaces"
          element={
            <RequireAuth>
              <Network />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/interfaces"
          element={
            <RequireAuth>
              <Wireguard />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/interfaces/:uuid"
          element={
            <RequireAuth>
              <WireguardInterfaceDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/interfaces/add"
          element={
            <RequireAuth>
              <AddWireguardInterface />
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
