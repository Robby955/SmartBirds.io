// src/pages/About.tsx

import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const About: React.FC = () => {
  return (
    <Container maxWidth="md" style={{ padding: '40px 20px' }}>
      <Typography variant="h3" gutterBottom align="center">
        About SmartBirds.io
      </Typography>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          This Project
        </Typography>
        <Typography variant="body1" paragraph>
          At SmartBirds.io, our mission is to visualize and learn data science techniques by tackling the computer vision challenge of bird identification. Birds serve as an ideal case study due to the abundance of rich, labeled datasets available, providing ample opportunities to test, learn, and refine data science methodologies. Through this focus, we aim to develop a production-ready application that incorporates a continuous integration (CI) cycle, robust feedback mechanisms, and advancements in detection capabilities, including multi-species identification and improved accuracy on blurry images.
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Current Features
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="📸 Image Upload and Real-time Identification using YOLO" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="🔍 Detailed Species Information powered by Transformers" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="⚙️ Robust Data Pipeline for Efficient Processing" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="💬 User Feedback and Observations Logging" />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Technology Stack
        </Typography>
        <Typography variant="body1" paragraph>
          SmartBirds.io is built with a modern and scalable technology stack to ensure optimal performance and user experience.
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="💻 Frontend: React, TypeScript, Material-UI" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="🐍 Backend: Python, Flask" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="🛠️ Machine Learning: YOLO for Object Detection, Transformers for Classification" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="🔄 Data Pipeline: Streamlined Processing with Efficient Data Flow" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="☁️ Hosting: Google Cloud Run, Artifact Registry" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="🔍 Database: Google Firestore" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="action" />
            </ListItemIcon>
            <ListItemText primary="⚡ GPU Training: Leveraging GPUs for Fast Model Training and Inference" />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Future Plans
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="🦜 Additional Data Sources and Images+Species" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="🔄 Explore Attention Layers and Visualize ViT patching and Embeddings" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="📊 Data Analytics and Visualization Tools" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="secondary" />
            </ListItemIcon>
            <ListItemText primary="🌐 Interact with other APIs" />
          </ListItem>
        </List>
      </Box>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Feedback
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any comments, suggestions, or feedback, please feel free to contact me.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
