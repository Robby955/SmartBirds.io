// src/components/Navbar.tsx

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SmartBirdsLogo from '../assets/logo.png'; // Ensure you have a logo.png in the assets folder

const Navbar: React.FC = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Navigation links
  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Predict', path: '/predict' },
    { title: 'Methodology', path: '/methodology' },
    { title: 'Feedback', path: '/feedback' },
    { title: 'Disclaimer', path: '/disclaimer' },
  ];

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        {/* Logo and Brand Name */}
        <Box display="flex" alignItems="center">
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={SmartBirdsLogo}
              alt="SmartBirds.io Logo"
              sx={{ height: 40, width: 40, mr: 1 }}
            />
            <Typography variant="h6" color="primary.main" fontWeight="bold">
              SmartBirds.io
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links */}
        {isMobile ? (
          <>
            {/* Mobile Menu Icon */}
            <IconButton
              edge="end"
              color="primary"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            {/* Mobile Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  key={link.title}
                  component={Link}
                  to={link.path}
                  onClick={handleMenuClose}
                  selected={location.pathname === link.path}
                  sx={{
                    fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  }}
                >
                  {link.title}
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Box>
            {navLinks.map((link) => (
              <Button
                key={link.title}
                component={Link}
                to={link.path}
                color="primary"
                sx={{
                  mx: 1.5,
                  fontWeight: location.pathname === link.path ? 'bold' : 'normal',
                  borderBottom: location.pathname === link.path ? `2px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  },
                }}
              >
                {link.title}
              </Button>
            ))}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
