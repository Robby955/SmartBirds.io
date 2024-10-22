import React, { useState } from 'react';
import { Button, Typography, Grid, Card, CardMedia } from '@mui/material';

const ImageUpload: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      // Prepare the image to send to backend for prediction
      const formData = new FormData();
      formData.append('image', selectedImage);
      // Call backend API (to be implemented)
    }
  };

  return (
    <div>
      <Typography variant="h6">Upload a Bird Image for Prediction</Typography>
      <input
        accept="image/*"
        type="file"
        onChange={handleImageUpload}
        style={{ margin: '20px 0' }}
      />
      {selectedImage && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={URL.createObjectURL(selectedImage)}
                alt="Uploaded Image"
              />
            </Card>
          </Grid>
        </Grid>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        Submit for Prediction
      </Button>
    </div>
  );
};

export default ImageUpload;
