// src/pages/Feedback.tsx

import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const Feedback: React.FC = () => {
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission logic here
    console.log('Feedback submitted:', feedback);
    setFeedback('');
    setSubmitted(true);
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Feedback
      </Typography>
      {submitted ? (
        <Typography variant="body1" color="primary">
          Thank you for your feedback!
        </Typography>
      ) : (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Your Feedback"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Submit
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default Feedback;
