import React from 'react';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import WireguardNetworkInterfaces from './components/Interfaces';

export default function Wireguard() {
  return (
    <ResponsiveDrawer>
      <WireguardNetworkInterfaces />
    </ResponsiveDrawer>
  );
}
