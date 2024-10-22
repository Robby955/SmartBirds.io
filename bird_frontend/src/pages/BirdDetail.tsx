// src/pages/BirdDetail.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Switch,
  FormControlLabel,
  Pagination,
  Stack,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { parseClasses } from '../utils/parseClasses';
import { parseImages } from '../utils/parseImages';
import { parseImageClassLabels } from '../utils/parseImageClassLabels';
import { parseBoundingBoxes, BoundingBox } from '../utils/parseBoundingBoxes';
import { parseParts, Part } from '../utils/parseParts';
import { parseAttributes, Attribute } from '../utils/parseAttributes';
import { GCS_BASE_URL } from '../utils/constants';
import PartsOverlay from '../components/PartsOverlay';
import AttributesDisplay from '../components/AttributesDisplay';

interface ClassesData {
  classIdToName: Record<string, string>;
  nameToClassId: Record<string, string>;
}

interface ImageData {
  id: string;
  rawUrl: string;
  segmentationUrl: string;
}

interface ImageState {
  isBoundingBoxShown: boolean;
  isPartsShown: boolean;
  isAttributesShown: boolean;
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
  parts: Part[];
  attributes: Attribute[];
}

const ITEMS_PER_PAGE = 6; // Number of images per page

const BirdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 'id' is the bird name
  const [imageUrls, setImageUrls] = useState<ImageData[]>([]);
  const [boundingBoxes, setBoundingBoxes] = useState<Record<string, BoundingBox>>({});
  const [className, setClassName] = useState<string>('');
  const [imageStates, setImageStates] = useState<Record<string, ImageState>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSegmentationMode, setIsSegmentationMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the main container

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch classes data
        const classesData: ClassesData = await parseClasses();
        const { classIdToName, nameToClassId } = classesData;

        // Normalize the bird name from the route parameter
        const birdNameNormalized = id?.trim().toLowerCase();
        if (!birdNameNormalized) {
          throw new Error('No bird name provided in the URL.');
        }

        // Get the class ID for the bird name
        const classId = nameToClassId[birdNameNormalized];
        if (!classId) {
          throw new Error('Invalid bird name provided.');
        }

        // Set the human-readable class name
        const birdClassName = classIdToName[classId];
        setClassName(birdClassName);

        // Fetch images data
        const imagesData: Record<string, string> = await parseImages();

        // Fetch image class labels
        const imageClassLabels: Record<string, string> = await parseImageClassLabels();

        // Find all image IDs for the given class ID
        const imageIdsForClass = Object.entries(imageClassLabels)
          .filter(([, cId]) => cId === classId)
          .map(([imageId]) => imageId);

        if (imageIdsForClass.length === 0) {
          throw new Error('No images found for this bird.');
        }

        // Fetch bounding boxes, parts, and attributes data
        const [boundingBoxesData, partsData, attributesData] = await Promise.all([
          parseBoundingBoxes(),
          parseParts(),
          parseAttributes(),
        ]);

        setBoundingBoxes(boundingBoxesData);

        // Construct image data list with both raw and segmentation URLs
        const constructedImageData: ImageData[] = imageIdsForClass
          .map((imageId) => {
            const imagePath = imagesData[imageId];
            if (!imagePath) {
              console.error(`Image path not found for image ID: ${imageId}`);
              return null;
            }
            const rawUrl = `${GCS_BASE_URL}/raw_images/${imagePath}`;
            const segmentationPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.png');
            const segmentationUrl = `${GCS_BASE_URL}/segmentations/${segmentationPath}`;
            return { id: imageId, rawUrl, segmentationUrl };
          })
          .filter((data): data is ImageData => data !== null); // Remove nulls

        setImageUrls(constructedImageData);

        // Initialize imageStates with default values for each image
        const initialImageStates = constructedImageData.reduce((acc, image) => {
          acc[image.id] = {
            isBoundingBoxShown: false,
            isPartsShown: false,
            isAttributesShown: false,
            naturalWidth: 0,
            naturalHeight: 0,
            renderedWidth: 0,
            renderedHeight: 0,
            parts: partsData[image.id] || [],
            attributes: attributesData[image.id] || [],
          };
          return acc;
        }, {} as Record<string, ImageState>);
        setImageStates(initialImageStates);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Function to toggle bounding box display for a specific image
  const toggleBoundingBox = (imageId: string) => {
    setImageStates((prev) => {
      const prevState = prev[imageId] || {
        isBoundingBoxShown: false,
        isPartsShown: false,
        isAttributesShown: false,
        naturalWidth: 0,
        naturalHeight: 0,
        renderedWidth: 0,
        renderedHeight: 0,
        parts: [],
        attributes: [],
      };
      return {
        ...prev,
        [imageId]: {
          ...prevState,
          isBoundingBoxShown: !prevState.isBoundingBoxShown,
        },
      };
    });
  };

  // Function to toggle parts display for a specific image
  const toggleParts = (imageId: string) => {
    setImageStates((prev) => {
      const prevState = prev[imageId] || {
        isBoundingBoxShown: false,
        isPartsShown: false,
        isAttributesShown: false,
        naturalWidth: 0,
        naturalHeight: 0,
        renderedWidth: 0,
        renderedHeight: 0,
        parts: [],
        attributes: [],
      };
      return {
        ...prev,
        [imageId]: {
          ...prevState,
          isPartsShown: !prevState.isPartsShown,
        },
      };
    });
  };

  // Function to toggle attributes display for a specific image
  const toggleAttributes = (imageId: string) => {
    setImageStates((prev) => {
      const prevState = prev[imageId] || {
        isBoundingBoxShown: false,
        isPartsShown: false,
        isAttributesShown: false,
        naturalWidth: 0,
        naturalHeight: 0,
        renderedWidth: 0,
        renderedHeight: 0,
        parts: [],
        attributes: [],
      };
      return {
        ...prev,
        [imageId]: {
          ...prevState,
          isAttributesShown: !prevState.isAttributesShown,
        },
      };
    });
  };

  // Function to handle image load and capture natural and rendered dimensions
  const handleImageLoad = (
    imageId: string,
    naturalWidth: number,
    naturalHeight: number,
    renderedWidth: number,
    renderedHeight: number
  ) => {
    setImageStates((prev) => {
      const prevState = prev[imageId] || {
        isBoundingBoxShown: false,
        isPartsShown: false,
        isAttributesShown: false,
        naturalWidth: 0,
        naturalHeight: 0,
        renderedWidth: 0,
        renderedHeight: 0,
        parts: [],
        attributes: [],
      };
      return {
        ...prev,
        [imageId]: {
          ...prevState,
          naturalWidth,
          naturalHeight,
          renderedWidth,
          renderedHeight,
        },
      };
    });
  };

  // Callback ref to capture image dimensions after render
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});

  const setImageRef = useCallback(
    (imageId: string, node: HTMLImageElement | null) => {
      imageRefs.current[imageId] = node;
      if (node) {
        const handleLoad = () => {
          const naturalWidth = node.naturalWidth;
          const naturalHeight = node.naturalHeight;
          const renderedWidth = node.clientWidth;
          const renderedHeight = node.clientHeight;
          handleImageLoad(imageId, naturalWidth, naturalHeight, renderedWidth, renderedHeight);
        };
        node.addEventListener('load', handleLoad);
        // Cleanup
        return () => {
          node.removeEventListener('load', handleLoad);
        };
      }
    },
    []
  );

  // Function to calculate bounding box styles based on image scaling
  const getBoundingBoxStyles = (imageId: string): React.CSSProperties | null => {
    const boundingBox = boundingBoxes[imageId];
    const imageState = imageStates[imageId];

    if (!boundingBox || !imageState) {
      return null;
    }

    const { x, y, width, height } = boundingBox; // Assuming these are in pixels relative to the natural image size

    const scaleX = imageState.renderedWidth / imageState.naturalWidth;
    const scaleY = imageState.renderedHeight / imageState.naturalHeight;

    return {
      position: 'absolute',
      border: '2px solid red',
      backgroundColor: 'rgba(255, 0, 0, 0.2)', // Semi-transparent red
      left: `${x * scaleX}px`,
      top: `${y * scaleY}px`,
      width: `${width * scaleX}px`,
      height: `${height * scaleY}px`,
      pointerEvents: 'none',
      boxSizing: 'border-box',
    };
  };

  // Calculate total pages
  const totalPages = Math.ceil(imageUrls.length / ITEMS_PER_PAGE);

  // Get current page images
  const currentPageImages = imageUrls.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // Scroll to top of the container on page change
    containerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Container style={{ padding: '20px', textAlign: 'center' }} ref={containerRef}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ padding: '20px', textAlign: 'center' }} ref={containerRef}>
        <Typography variant="h5" color="error">
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ padding: '20px' }} ref={containerRef}>
      <Typography variant="h4" gutterBottom align="center">
        {className.replace(/_/g, ' ')}
      </Typography>
      {/* Toggle Segmentation Mode */}
      <Box display="flex" justifyContent="center" marginBottom="20px">
        <FormControlLabel
          control={
            <Switch
              checked={isSegmentationMode}
              onChange={() => setIsSegmentationMode(!isSegmentationMode)}
              color="primary"
            />
          }
          label={isSegmentationMode ? 'Segmentation Mode' : 'Raw Image Mode'}
        />
      </Box>
      {currentPageImages.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {currentPageImages.map((imageData) => {
              const imageState = imageStates[imageData.id];

              return (
                <Grid item xs={12} sm={6} md={4} key={imageData.id}>
                  <Card>
                    <Box
                      position="relative"
                      width="100%"
                      overflow="hidden"
                    >
                      <img
                        ref={(node) => setImageRef(imageData.id, node)}
                        loading="lazy"
                        src={isSegmentationMode ? imageData.segmentationUrl : imageData.rawUrl}
                        alt={`Bird ${className}`}
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          objectFit: 'contain',
                        }}
                        onError={(e) => {
                          console.error(
                            'Image failed to load:',
                            isSegmentationMode ? imageData.segmentationUrl : imageData.rawUrl
                          );
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg'; // Ensure this placeholder exists in your public folder
                        }}
                      />
                      {/* Render Bounding Box */}
                      {imageState?.isBoundingBoxShown && boundingBoxes[imageData.id] && (
                        <Box sx={getBoundingBoxStyles(imageData.id)} />
                      )}
                      {/* Render Parts Overlay if Parts are shown and parts data exists */}
                      {imageState?.isPartsShown && imageState.parts.length > 0 && (
                        <PartsOverlay
                          parts={imageState.parts}
                          naturalWidth={imageState.naturalWidth}
                          naturalHeight={imageState.naturalHeight}
                          renderedWidth={imageState.renderedWidth}
                          renderedHeight={imageState.renderedHeight}
                        />
                      )}
                    </Box>
                    <CardContent>
                      <Grid container spacing={1} justifyContent="center">
                        {/* Bounding Box Toggle Button */}
                        <Grid item>
                          {boundingBoxes[imageData.id] ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => toggleBoundingBox(imageData.id)}
                              aria-label={
                                imageState?.isBoundingBoxShown
                                  ? 'Hide Bounding Box'
                                  : 'Show Bounding Box'
                              }
                            >
                              {imageState?.isBoundingBoxShown
                                ? 'Hide Bounding Box'
                                : 'Show Bounding Box'}
                            </Button>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No bounding box available.
                            </Typography>
                          )}
                        </Grid>
                        {/* Parts Toggle Button */}
                        <Grid item>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => toggleParts(imageData.id)}
                            disabled={imageState?.parts.length === 0}
                            aria-label={
                              imageState?.isPartsShown ? 'Hide Parts' : 'Show Parts'
                            }
                          >
                            {imageState?.isPartsShown ? 'Hide Parts' : 'Show Parts'}
                          </Button>
                        </Grid>
                        {/* Attributes Toggle Button */}
                        <Grid item>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => toggleAttributes(imageData.id)}
                            disabled={imageState?.attributes.length === 0}
                            aria-label={
                              imageState?.isAttributesShown
                                ? 'Hide Attributes'
                                : 'Show Attributes'
                            }
                          >
                            {imageState?.isAttributesShown
                              ? 'Hide Attributes'
                              : 'Show Attributes'}
                          </Button>
                        </Grid>
                      </Grid>
                      {/* Display Attributes */}
                      {imageState?.isAttributesShown && imageState.attributes.length > 0 && (
                        <Box
                          sx={{
                            maxHeight: '150px', // Set a maximum height for the attributes container
                            overflowY: 'auto', // Enable vertical scrolling
                            mt: 2, // Add some top margin
                          }}
                        >
                          <AttributesDisplay attributes={imageState.attributes} />
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
          {/* Pagination Controls */}
          <Box display="flex" justifyContent="center" mt={4}>
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          </Box>
        </>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center">
          No images available.
        </Typography>
      )}
    </Container>
  );
};

export default BirdDetail;
