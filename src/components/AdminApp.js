import { Dashboard as DashboardIcon, ExitToApp, Person, Settings } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminInterface from './AdminInterfaceWithTabs';
import AdminLogin from './AdminLogin';

const AdminApp = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Invalid saved user data');
        handleLogout();
      }
    }
    // Note: Proper authentication would validate against Supabase admin_users table
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
    setToken(null);
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Show login if not authenticated
  if (!user || !token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Admin Header */}
      <AppBar position="static" sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Step Sciences Admin Portal
          </Typography>

          <Button
            color="inherit"
            onClick={handleMenuClick}
            startIcon={
              <Avatar sx={{ width: 32, height: 32 }}>{user.email?.[0]?.toUpperCase()}</Avatar>
            }
          >
            {user.email}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <Person sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <Settings sx={{ mr: 1 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Admin Content */}
      <Box sx={{ flexGrow: 1, bgcolor: 'grey.50' }}>
        <AdminInterface />
      </Box>
    </Box>
  );
};

export default AdminApp;
