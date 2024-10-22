import React from 'react';
import { Container, Typography} from '@mui/material';

const Methodology: React.FC = () => {
  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Model Methodology
      </Typography>

      <Typography variant="body1" paragraph>
        The model used for bird species identification is a Vision Transformer (ViT) model, which is state-of-the-art for image classification tasks. ViT leverages attention mechanisms typically used in Natural Language Processing (NLP) models to focus on different parts of the input image, resulting in a highly accurate classification of bird species.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Model Architecture
      </Typography>
      <Typography variant="body1" paragraph>
        The Vision Transformer (ViT) is based on the Transformer architecture, which divides images into patches (in our case, 16x16 pixels) and treats them similarly to tokens in NLP tasks. The model learns to attend to different patches of the image, making it particularly effective for distinguishing between similar bird species.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Dataset
      </Typography>
      <Typography variant="body1" paragraph>
        The model is trained on the Caltech-UCSD Birds 200 (CUB-200-2011) dataset, which contains over 11,000 images of 200 bird species. The dataset is well-known in the computer vision community and is often used for benchmarking image classification algorithms.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Preprocessing
      </Typography>
      <Typography variant="body1" paragraph>
        Each bird image is resized to 224x224 pixels, and we apply standard data augmentation techniques such as random cropping, flipping, and normalization. These augmentations help the model generalize better by simulating variations in the bird images, such as different angles and lighting conditions.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Training Process
      </Typography>
      <Typography variant="body1" paragraph>
        The model was trained using PyTorch, with an Adam optimizer and a learning rate of 1e-4. The training process lasted for 5 epochs, with early stopping implemented to prevent overfitting. A train-test split provided via the data-set was used to check model performance, ensuring the model generalizes well to unseen images.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Evaluation
      </Typography>
      <Typography variant="body1" paragraph>
        The model achieved an accuracy of 99.5% on the test set, making it one of the top-performing models for bird species classification on this dataset. We evaluated the model using standard metrics such as accuracy, precision, recall, and F1-score, with the majority of misclassifications occurring between very similar species.
      </Typography>

      <Typography variant="h5" gutterBottom>
        Future Work
      </Typography>
      <Typography variant="body1" paragraph>
        We plan to enhance the model by incorporating additional data sources and experimenting with more advanced architectures such as EfficientNet and ResNet. Additionally, implementing fine-grained visual analysis could help distinguish between species with only subtle differences.
      </Typography>

  
    </Container>
  );
};

export default Methodology;
