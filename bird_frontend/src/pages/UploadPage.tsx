import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Paper,
  Stack,
  Autocomplete,
} from '@mui/material';
import { styled } from '@mui/system';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone, Accept } from 'react-dropzone';

interface Prediction {
  predicted_class: string;
  confidence: string;
  bounding_box?: [number, number, number, number, number]; // [x1, y1, x2, y2, confidence]
}

const StyledDropzone = styled(Paper)(({ theme }) => ({
  border: '2px dashed #4caf50',
  borderRadius: '12px',
  padding: theme.spacing(4),
  textAlign: 'center',
  color: '#4caf50',
  backgroundColor: '#fafafa',
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
  '&:hover': {
    backgroundColor: '#f0f0f0',
    borderColor: '#388e3c',
  },
}));

const UploadPage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [submittedFeedback, setSubmittedFeedback] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [actualSpecies, setActualSpecies] = useState<string | null>(null);
  const [userKnowsSpecies, setUserKnowsSpecies] = useState<boolean | null>(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);

  // Fetch species list from the URL and process it
  useEffect(() => {
    const fetchSpeciesOptions = async () => {
      try {
        const response = await fetch('https://storage.googleapis.com/smartbirds-assets/classes.txt');
        const textData = await response.text();

        // Process the text data
        const speciesArray = textData
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
          .map((line) => {
            // Remove leading numbers and dots
            const nameWithNumber = line.split(' ')[1];
            const name = nameWithNumber.replace(/^\d+\./, '');
            // Replace underscores with spaces
            return name.replace(/_/g, ' ');
          });

        // Add "Other" option
        speciesArray.push('Other');

        setSpeciesOptions(speciesArray);
      } catch (err) {
        console.error('Error fetching species options:', err);
      }
    };
    fetchSpeciesOptions();
  }, []);

  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setImage(selectedFile);
      setPrediction(null);
      setError(null);
      setFeedback('');
      setSubmittedFeedback(false);
      setImageLoaded(false);
      setActualSpecies(null);
      setUserKnowsSpecies(null);
      setShowFeedbackForm(false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    } as Accept,
    multiple: false,
  });

  const formatSpeciesName = (name: string): string => {
    const nameWithoutNumbers = name.replace(/^\d+\./, '');
    return nameWithoutNumbers.replace(/_/g, ' ');
  };

  const handlePrediction = async () => {
    if (!image) {
      setError('Please upload an image.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(
        'https://bird-vit-flask-app-tylpg5al2a-uc.a.run.app/predict',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Prediction failed.');
      }

      const data: Prediction = await response.json();
      data.predicted_class = formatSpeciesName(data.predicted_class);

      if (data.bounding_box) {
        setPrediction(data);
        // You can fetch attention map here if needed
      } else {
        setError('No bird detected in the image.');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('Error: ' + err.message);
      } else {
        setError('An unknown error occurred.');
      }
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setFeedback('');
    setSubmittedFeedback(false);
    setImageLoaded(false);
    setActualSpecies(null);
    setUserKnowsSpecies(null);
    setShowFeedbackForm(false);
  };

  const handleFeedbackSubmit = async () => {
    // Prepare feedback data
    const feedbackData = {
      predicted_class: prediction?.predicted_class,
      user_knows_species: userKnowsSpecies,
      actual_species: actualSpecies || null,
      user_feedback: feedback || null,
      timestamp: new Date().toISOString(),
    };

    console.log('User feedback:', feedbackData);

    // Simulate successful feedback submission
    setSubmittedFeedback(true);
    setShowFeedbackForm(false);
  };

  const handleImageLoad = () => {
    const img = imageRef.current;
    if (img) {
      setImageDimensions({
        width: img.clientWidth,
        height: img.clientHeight,
      });
      setNaturalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setImageLoaded(true);
    }
  };

  const getBoundingBoxStyles = () => {
    if (!prediction?.bounding_box || !imageDimensions || !naturalDimensions) {
      return {};
    }

    const [x1, y1, x2, y2] = prediction.bounding_box;

    const scaleX = imageDimensions.width / naturalDimensions.width;
    const scaleY = imageDimensions.height / naturalDimensions.height;

    const adjustedX1 = x1 * scaleX;
    const adjustedY1 = y1 * scaleY;
    const adjustedWidth = (x2 - x1) * scaleX;
    const adjustedHeight = (y2 - y1) * scaleY;

    return {
      left: `${adjustedX1}px`,
      top: `${adjustedY1}px`,
      width: `${adjustedWidth}px`,
      height: `${adjustedHeight}px`,
    };
  };

  return (
    // Outer Box with background image
    <Box
      sx={{
        backgroundImage: `url('/mybird.jpg')`, // Replace with your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
      }}
    >
      <Container
        maxWidth="md"
        sx={{
          padding: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '12px',
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" align="center" gutterBottom color="primary">
          Bird Identification
        </Typography>
        <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
          <StyledDropzone {...getRootProps()} elevation={isDragActive ? 6 : 3} sx={{ width: '100%' }}>
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" color="inherit">
              {isDragActive ? 'Drop the image here...' : 'Drag and drop an image here, or click to select one'}
            </Typography>
            {image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected File: {image.name}
              </Typography>
            )}
          </StyledDropzone>

          {previewUrl && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxHeight: '600px',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: 2,
                mt: 3,
              }}
            >
              <img
                ref={imageRef}
                src={previewUrl}
                alt="Uploaded Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  borderRadius: '12px',
                }}
                onLoad={handleImageLoad}
              />
              {prediction?.bounding_box && imageDimensions && naturalDimensions && (
                <Box
                  sx={{
                    position: 'absolute',
                    border: '3px solid red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    left: `${getBoundingBoxStyles().left}`,
                    top: `${getBoundingBoxStyles().top}`,
                    width: `${getBoundingBoxStyles().width}`,
                    height: `${getBoundingBoxStyles().height}`,
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </Box>
          )}

          <Stack direction="row" spacing={2} mt={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePrediction}
              disabled={loading || !image || !imageLoaded}
              sx={{ padding: '12px 36px', fontSize: '16px' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleReset}
              disabled={loading || !image}
              sx={{ padding: '12px 36px', fontSize: '16px' }}
            >
              Reset
            </Button>
          </Stack>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 4 }}>
            {error}
          </Alert>
        )}

        {prediction && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom color="textPrimary">
              Prediction Results
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Predicted Species:</strong> {prediction.predicted_class}
            </Typography>
            <Typography variant="h6" gutterBottom>
              <strong>Confidence:</strong> {prediction.confidence}
            </Typography>

            {!submittedFeedback ? (
              <>
                {!showFeedbackForm ? (
                  <Box sx={{ mt: 4, maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                    <Typography variant="h6" gutterBottom>
                      Do you know the actual species of this bird?
                    </Typography>

                    <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
                      <Button
                        variant={userKnowsSpecies === true ? 'contained' : 'outlined'}
                        color="success"
                        onClick={() => {
                          setUserKnowsSpecies(true);
                          setShowFeedbackForm(true);
                        }}
                        sx={{ width: '100%' }}
                      >
                        Yes
                      </Button>
                      <Button
                        variant={userKnowsSpecies === false ? 'contained' : 'outlined'}
                        color="primary"
                        onClick={() => {
                          setUserKnowsSpecies(false);
                          handleFeedbackSubmit();
                        }}
                        sx={{ width: '100%' }}
                      >
                        No
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  // Feedback form when user knows the species
                  <Box sx={{ mt: 4, maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
                    <Typography variant="body1" gutterBottom>
                      Please select the actual species:
                    </Typography>
                    <Autocomplete
                      options={speciesOptions}
                      getOptionLabel={(option) => option}
                      value={actualSpecies}
                      onChange={(event, newValue) => {
                        setActualSpecies(newValue);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Actual Species" variant="outlined" />
                      )}
                      sx={{ mb: 2 }}
                      // Allow free text input if "Other" is selected
                      freeSolo={actualSpecies === 'Other'}
                    />
                    {actualSpecies === 'Other' && (
                      <TextField
                        label="Please specify the species"
                        variant="outlined"
                        fullWidth
                        value={actualSpecies}
                        onChange={(e) => setActualSpecies(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    )}
                    <TextField
                      label="Additional Comments (optional)"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={3}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleFeedbackSubmit}
                      disabled={submittedFeedback}
                      sx={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                      Submit Feedback
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="success" sx={{ mt: 4 }}>
                Thank you for your feedback!
              </Alert>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UploadPage;
