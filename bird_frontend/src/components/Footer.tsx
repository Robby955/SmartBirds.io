// src/components/Footer.tsx

import React from 'react';
import { Container, Typography, Link, Grid } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <footer style={{ padding: '40px 0', backgroundColor: '#f5f5f5', marginTop: '40px' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              SmartBirds
            </Typography>
            <Typography variant="body2" color="textSecondary">
              © 2024 SmartBirds. All rights reserved.
            </Typography>
          </Grid>

          {/* Useful Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Useful Links
            </Typography>
            <Typography variant="body2">
              <Link href="/privacy-policy" underline="none" color="textPrimary">
                Privacy Policy
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="/disclaimer" underline="none" color="textPrimary">
                Disclaimer
              </Link>
            </Typography>
            {/* Other Sites */}
            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Other Sites
            </Typography>
            <Typography variant="body2">
              <Link href="https://smartbookshelf.io" underline="none" color="textPrimary" target="_blank" rel="noopener">
                SmartBookshelf.io
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://smartbreed.io" underline="none" color="textPrimary" target="_blank" rel="noopener">
                Smartbreed.io
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://robbysneiderman.com" underline="none" color="textPrimary" target="_blank" rel="noopener">
                Robbysneiderman.com
              </Link>
            </Typography>
          </Grid>

          {/* Follow Us */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Typography variant="body2">
              <Link href="https://github.com/Robby955" underline="none" target="_blank" rel="noopener">
                GitHub
              </Link>
            </Typography>
            <Typography variant="body2">
              <Link href="https://www.linkedin.com/in/robbysneiderman/" underline="none" target="_blank" rel="noopener">
                LinkedIn
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
