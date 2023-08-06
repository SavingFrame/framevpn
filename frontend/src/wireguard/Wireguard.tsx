import React from 'react';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import ListInterfaces from './components/ListInterfaces';

export default function Wireguard() {
  return (
    <ResponsiveDrawer>
      <ListInterfaces />
    </ResponsiveDrawer>
  );
}
