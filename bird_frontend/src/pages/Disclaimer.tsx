import React from 'react';
import { Container, Typography, Link } from '@mui/material';

const Disclaimer: React.FC = () => {
  return (
    <Container style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>Disclaimer</Typography>

      <Typography variant="body1" paragraph>
        The SmartBirds project utilizes images and data from the
        <Link href="https://www.vision.caltech.edu/datasets/cub_200_2011/" target="_blank" rel="noopener noreferrer">
           Caltech-UCSD Birds-200-2011 (CUB-200-2011) dataset
        </Link>. These images are used solely for educational and research purposes.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Warning:</strong> Images in this dataset overlap with images in ImageNet, which makes evaluation of the test data not so simple when using pre-trained models.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Details</strong><br />
        The Caltech-UCSD Birds-200-2011 (CUB-200-2011) is a larger version of the CUB-200 dataset. 
        The citation for the technical report of is Welinder P., Branson S., Mita T., Wah C., Schroff F., Belongie S., Perona, P. "Caltech-UCSD Birds 200". California Institute of Technology. CNS-TR-2010-001. 2010.
      </Typography>

      <Typography variant="body1" paragraph>
        <ul>
          <li>Number of categories: 200</li>
          <li>Number of images: 11,788</li>
          <li>Annotations per image: 15 Part Locations, 312 Binary Attributes, 1 Bounding Box per each image</li>
        </ul>
        For detailed information about the dataset, visit the original webpage for the cal-tech bird data set.
      </Typography>

      <Typography variant="body1" paragraph>
        <strong>Data info</strong><br />
        <ul>
          <li>Images and annotations (1.1 GB) </li>
          <li>Segmentations (37 MB): The Segmentations were created by Ryan Farrell.</li>
        </ul>
      </Typography>
    </Container>
  );
};

export default Disclaimer;
