import React from 'react';
import ResponsiveDrawer from '../dashboard/components/BasePage';
import NetworkInterfaces from './components/Interfaces';

export default function Network() {
  return (
    <ResponsiveDrawer>
      <NetworkInterfaces />
    </ResponsiveDrawer>
  );
}
