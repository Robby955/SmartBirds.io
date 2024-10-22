// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  CircularProgress,
  TextField,
  Pagination,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { parseClasses, ClassesData } from '../utils/parseClasses';
import { parseImages } from '../utils/parseImages';
import { parseImageClassLabels } from '../utils/parseImageClassLabels';
import { GCS_BASE_URL } from '../utils/constants';

const Home: React.FC = () => {
  const [classesData, setClassesData] = useState<ClassesData | null>(null);
  const [images, setImages] = useState<Record<string, string>>({});
  const [imageClassLabels, setImageClassLabels] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search functionality
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12; // Number of cards per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch classes, images, and image class labels in parallel
        const [classes, imagesData, imageClassLabelsData] = await Promise.all([
          parseClasses(),
          parseImages(),
          parseImageClassLabels(),
        ]);

        setClassesData(classes);
        setImages(imagesData);
        setImageClassLabels(imageClassLabelsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
  };

  // If loading, display loader with background
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: 'url(/mybird.jpg)', // Path to your image in public folder
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)', // Adjust opacity as needed
            zIndex: 1,
          }}
        />
        {/* Loader */}
        <CircularProgress sx={{ zIndex: 2 }} />
      </Box>
    );
  }

  // If there's an error, display error message with background
  if (error || !classesData) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundImage: 'url(/mybird.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            zIndex: 1,
          }}
        />
        {/* Error Message */}
        <Box sx={{ zIndex: 2, textAlign: 'center' }}>
          <Typography variant="h6" color="error" gutterBottom>
            {error ? `Error: ${error}` : 'Failed to load data.'}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  // Destructure classIdToName from classesData
  const { classIdToName } = classesData;

  // Filter classes based on the search term (case-insensitive)
  const filteredClasses = Object.entries(classIdToName).filter(([classId, className]) =>
    className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current items for pagination
  const currentItems = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95)), url(/mybird.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        padding: '40px 20px',
      }}
    >
      {/* Main Content Container */}
      <Container sx={{ position: 'relative', zIndex: 1 }}>
        {/* Page Title */}
        <Typography variant="h3" gutterBottom align="center" color="primary.main">
          Explore Bird Species
        </Typography>

        {/* Search Bar */}
        <Box sx={{ maxWidth: 600, margin: '0 auto', marginBottom: '40px' }}>
          <TextField
            label="Search for a bird species"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </Box>

        {/* Bird Species Grid */}
        <Grid container spacing={4}>
          {currentItems.length > 0 ? (
            currentItems.map(([classId, className]) => {
              const birdNameNormalized = className.replace(/_/g, ' ').toLowerCase();

              // Get image IDs for this class
              const imageIdsForClass = Object.entries(imageClassLabels)
                .filter(([, cId]) => cId === classId)
                .map(([imageId]) => imageId);

              // Select the first image ID as a representative image
              const imageId = imageIdsForClass[0];

              // Get the image path
              const imagePath = images[imageId];

              // Construct the image URL
              const imageUrl = imagePath ? `${GCS_BASE_URL}/raw_images/${imagePath}` : null;

              if (!imageId || !imagePath) {
                console.error(`No image found for class ID ${classId}`);
              }

              return (
                <Grid item xs={12} sm={6} md={4} key={classId}>
                  <Card>
                    {/* Image Container */}
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '75%', // 4:3 aspect ratio
                        overflow: 'hidden',
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={className.replace(/_/g, ' ')}
                          loading="lazy" // Enables native lazy loading
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Ensures the entire image is visible
                            transition: 'transform 0.3s',
                          }}
                          onMouseOver={(e) => {
                            (e.target as HTMLImageElement).style.transform = 'scale(1.1)';
                          }}
                          onMouseOut={(e) => {
                            (e.target as HTMLImageElement).style.transform = 'scale(1)';
                          }}
                          onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; // Fallback image
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: '#e0e0e0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" color="textSecondary">
                            No Image Available
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Card Content */}
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '20px',
                      }}
                    >
                      {/* Bird Species Name */}
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        sx={{ textAlign: 'center', marginBottom: '20px' }}
                      >
                        {className.replace(/_/g, ' ')}
                      </Typography>

                      {/* View Details Button */}
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        to={`/bird/${encodeURIComponent(birdNameNormalized)}`}
                        sx={{
                          alignSelf: 'center',
                          textTransform: 'none',
                          paddingX: '30px',
                          paddingY: '10px',
                          fontSize: '16px',
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            // Display message if no classes match the search term
            <Grid item xs={12}>
              <Typography variant="h6" align="center" color="textSecondary">
                No bird species found matching your search.
              </Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;
