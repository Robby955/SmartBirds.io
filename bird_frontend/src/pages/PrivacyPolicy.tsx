// src/pages/PrivacyPolicy.tsx

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const PrivacyPolicy: React.FC = () => {
  return (
    <Container maxWidth="md" style={{ padding: '40px 20px' }}>
      <Typography variant="h3" gutterBottom align="center">
        Privacy Policy
      </Typography>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Introduction
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to SmartBirds.io. We value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Information We Collect
        </Typography>
        <Typography variant="body1" paragraph>
          We currently collect no direct information, unless you choose to share it via the feedback functions.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography variant="body1" paragraph>
         We do not sell personal information to third parties.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions or concerns about this Privacy Policy, please feel free to contact us.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
