
# authenticate first to the cloud account, then, this was ran on Colab
from google.cloud import storage

# Initialize the Google Cloud Storage client
client = storage.Client()

# Replace this with your bucket name
BUCKET_NAME = 'smartbirds-assets'  # Your bucket name

# Get the bucket
bucket = client.bucket(BUCKET_NAME)
print('success')

# Install necessary libraries
!pip install torch torchvision timm gcsfs pillow matplotlib seaborn


num_classes = 200  # As per dataset specification


labels = []
valid_indices = []

for idx, line in enumerate(image_class_labels):
    try:
        label = int(line.strip().split()[1]) - 1 
        if 0 <= label < num_classes:
            labels.append(label)
            valid_indices.append(idx)
        else:
            print(f"Invalid label {label} at index {idx}. Skipping this sample.")
    except Exception as e:
        print(f"Error parsing label at index {idx}: {e}. Skipping this sample.")

print(f"Total samples: {len(image_class_labels)}")
print(f"Valid samples: {len(valid_indices)}")
print(f"Invalid samples skipped: {len(image_class_labels) - len(valid_indices)}")

# Filter images and bounding_boxes based on valid_indices
images = [images[idx] for idx in valid_indices]
bounding_boxes = [bounding_boxes[idx] for idx in valid_indices]
image_class_labels = [image_class_labels[idx] for idx in valid_indices]

# Update train_test_split accordingly
train_test_split = {i+1: train_test_split[i+1] for i in valid_indices}


class BirdDataset(Dataset):
    def __init__(self, images, bounding_boxes, image_class_labels, train=True, transform=None):
        self.images = images
        self.bounding_boxes = bounding_boxes
        self.image_class_labels = image_class_labels
        self.train_test_split = train_test_split
        self.transform = transform

        # Extract image IDs and filter based on train/test split
        self.image_ids = [int(line.split()[0]) for line in images]
        if train:
            self.image_ids = [img_id for img_id, is_train in self.train_test_split.items() if is_train == 1]
        else:
            self.image_ids = [img_id for img_id, is_train in self.train_test_split.items() if is_train == 0]

    def __len__(self):
        return len(self.image_ids)

    def __getitem__(self, idx):
        image_id = self.image_ids[idx]
        image_path = self.images[idx - 1].split()[1]  # Assuming image IDs start at 1
        full_image_path = os.path.join(gcs_image_base_url, image_path)

        # Open image from GCS
        try:
            with fs.open(full_image_path, 'rb') as f:
                img = Image.open(f).convert('RGB')
        except Exception as e:
            print(f"Error loading image {full_image_path}: {e}")
            img = Image.new('RGB', (224, 224), (0, 0, 0))
            label = -1
            if self.transform:
                img = self.transform(img)
            return img, label

        # Extract and Crop Bounding Box (optional for now)
        bbox = self.bounding_boxes[idx - 1].split()
        if len(bbox) < 5:
            print(f"Invalid bounding box format for image ID {image_id}. Using full image.")
            cropped_img = img
        else:
            try:
                x, y, w, h = map(float, bbox[1:])
                cropped_img = img.crop((x, y, x + w, y + h))
            except Exception as e:
                print(f"Error cropping image ID {image_id}: {e}. Using full image.")
                cropped_img = img

        # Apply Transformations
        if self.transform:
            cropped_img = self.transform(cropped_img)

        # Extract Label
        try:
            label = int(self.image_class_labels[idx - 1].split()[1]) - 1  # Adjust for 0-based indexing
        except Exception as e:
            print(f"Error parsing label for image ID {image_id}: {e}")
            label = -1  # Assign an invalid label

        return cropped_img, label
# Define image transformations
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # ViT expects 224x224 images
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet mean
                         std=[0.229, 0.224, 0.225])   # ImageNet std
])
# Initialize Datasets
train_dataset = BirdDataset(images, bounding_boxes, image_class_labels, train=True, transform=transform)
test_dataset = BirdDataset(images, bounding_boxes, image_class_labels, train=False, transform=transform)

# Define subset sizes for quick testing (optional)
subset_size = int(len(train_dataset))
train_subset, _ = random_split(train_dataset, [subset_size, len(train_dataset) - subset_size])

subset_size_test = int(len(test_dataset))  # 10% of test data
test_subset, _ = random_split(test_dataset, [subset_size_test, len(test_dataset) - subset_size_test])

# Create DataLoaders
train_loader = DataLoader(train_subset, batch_size=16, shuffle=True, num_workers=0)
test_loader = DataLoader(test_subset, batch_size=16, shuffle=False, num_workers=0)


model = timm.create_model('vit_base_patch16_224', pretrained=True)

# Modify the classification head
num_classes = 200 
model.head = nn.Linear(model.head.in_features, num_classes)

# Move model to GPU 
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f'Using device: {device}')
model.to(device)

# Define Loss Function
criterion = nn.CrossEntropyLoss()

# Define Optimizer
optimizer = optim.AdamW(model.parameters(), lr=5e-5) 

# Define Learning Rate Scheduler
scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=5, gamma=0.1)

def train_one_epoch(epoch, model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct_preds = 0
    total_preds = 0

    for batch_idx, (images, labels) in enumerate(dataloader):
        images, labels = images.to(device), labels.to(device)

        # Filter out invalid labels
        valid = (labels >= 0) & (labels < num_classes)
        if not valid.all():
            valid_indices = valid.nonzero(as_tuple=True)[0]
            images = images[valid]
            labels = labels[valid]

        if len(labels) == 0:
            continue  # Skip batch if no valid labels

        # Forward Pass
        outputs = model(images)
        loss = criterion(outputs, labels)

        # Backward Pass and Optimization
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        # Logging
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total_preds += labels.size(0)
        correct_preds += (predicted == labels).sum().item()

        if (batch_idx + 1) % 10 == 0 or (batch_idx + 1) == len(dataloader):
            print(f'Epoch [{epoch+1}], Batch [{batch_idx+1}/{len(dataloader)}], Loss: {loss.item():.4f}')

    # Calculate epoch metrics
    epoch_loss = running_loss / len(dataloader)
    epoch_accuracy = 100 * correct_preds / total_preds
    print(f'Epoch [{epoch+1}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')
    return epoch_loss, epoch_accuracy

def evaluate(model, dataloader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct_preds = 0
    total_preds = 0

    with torch.no_grad():
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)

            # Filter out invalid labels
            valid = (labels >= 0) & (labels < num_classes)
            if not valid.all():
                valid_indices = valid.nonzero(as_tuple=True)[0]
                images = images[valid]
                labels = labels[valid]

            if len(labels) == 0:
                continue  # Skip batch if no valid labels

            # Forward Pass
            outputs = model(images)
            loss = criterion(outputs, labels)

            running_loss += loss.item()
            _, predicted = torch.max(outputs.data, 1)
            total_preds += labels.size(0)
            correct_preds += (predicted == labels).sum().item()

    epoch_loss = running_loss / len(dataloader)
    epoch_accuracy = 100 * correct_preds / total_preds
    print(f'Validation Loss: {epoch_loss:.4f}, Accuracy: {epoch_accuracy:.2f}%')
    return epoch_loss, epoch_accuracy
# Define number of epochs
num_epochs = 5 

# Lists to store metrics
train_losses = []
train_accuracies = []
val_losses = []
val_accuracies = []

for epoch in range(num_epochs):
    print(f'\n--- Epoch {epoch+1}/{num_epochs} ---')
    train_loss, train_acc = train_one_epoch(epoch, model, train_loader, criterion, optimizer, device)
    val_loss, val_acc = evaluate(model, test_loader, criterion, device)
    scheduler.step()

    # Store metrics
    train_losses.append(train_loss)
    train_accuracies.append(train_acc)
    val_losses.append(val_loss)
    val_accuracies.append(val_acc)

# Save the trained model locally
model_save_path = 'bird_vit_model.pth'
torch.save(model.state_dict(), model_save_path)
print(f'Model saved locally at {model_save_path}')

# Upload the model to GCS
blob = bucket.blob('models/bird_vit_model.pth')  # Specify the path within your bucket
blob.upload_from_filename(model_save_path)
print(f'Model uploaded to GCS at gs://{BUCKET_NAME}/models/bird_vit_model.pth')


