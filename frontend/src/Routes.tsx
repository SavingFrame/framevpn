import React, { FC } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Login from './auth/Login';
import Home from './views/Home';
import RequireAuth from './core/components/RequireAuth';
import UsersList from './users/Users';
import { setupResponseInterceptor } from './core/services';
import Network from './network/Network';
import Wireguard from './wireguard/Wireguard';
import AddWireguardInterface from './wireguard/AddWireguardInterface';
import WireguardInterfaceDetails from './wireguard/DetailWireguardInterface';
import AddInterfacePeer from './wireguard/AddInterfacePeer';
import ListClients from './clients/ListClients';
import DetailClient from './clients/DetailClient';
import AddClient from './clients/AddClient';
import InitialSetup from './initialSetup/InitialSetup';
import RequireInitialSetup from './core/components/RequireInitialSetup';

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
          path="/wireguard/interfaces/:uuid/peers/add"
          element={
            <RequireAuth>
              <AddInterfacePeer />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/clients"
          element={
            <RequireAuth>
              <ListClients />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/clients/add"
          element={
            <RequireAuth>
              <AddClient />
            </RequireAuth>
          }
        />
        <Route
          path="/wireguard/clients/:uuid"
          element={
            <RequireAuth>
              <DetailClient />
            </RequireAuth>
          }
        />
        <Route
          path="/"
          element={
            <RequireInitialSetup>
              <RequireAuth>
                <Home />
              </RequireAuth>
            </RequireInitialSetup>
          }
        />
        <Route path="initial-setup" element={<InitialSetup />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
