import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import PeopleIcon from '@mui/icons-material/People';
import LanIcon from '@mui/icons-material/Lan';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';
import { NavLink, useLocation } from 'react-router-dom';
import DnsIcon from '@mui/icons-material/Dns';

const useStyles = makeStyles()((theme) => ({
  listItemText: {
    color: theme.palette.text.primary, // Set the desired color here
  },
}));

export default function ResponsiveDrawer({ children }: { children: any }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [drawerWidth] = React.useState(240);
  const location = useLocation();

  const { classes } = useStyles();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem component={NavLink} to="/users" key="users" disablePadding>
          <ListItemButton selected={location.pathname === '/users'}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              primary="Users"
              classes={{ primary: classes.listItemText }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          component={NavLink}
          to="/network/interfaces"
          key="network"
          disablePadding
        >
          <ListItemButton
            selected={location.pathname === '/network/interfaces'}
          >
            <ListItemIcon>
              <LanIcon />
            </ListItemIcon>
            <ListItemText
              primary="Network"
              classes={{ primary: classes.listItemText }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          component={NavLink}
          to="/wireguard/interfaces"
          key="wireguardInterfaces"
          disablePadding
        >
          <ListItemButton
            selected={location.pathname === '/wireguard/interfaces'}
          >
            <ListItemIcon>
              <DnsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Wireguard"
              classes={{ primary: classes.listItemText }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
