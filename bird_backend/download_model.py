# download_model.py
from google.cloud import storage

def download_model(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client(project='smartbirds-438620')
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_blob_name)
    blob.download_to_filename(destination_file_name)
    print(f"Downloaded {source_blob_name} from {bucket_name} to {destination_file_name}.")

if __name__ == "__main__":
    BUCKET_NAME = 'smartbirds-assets'
    SOURCE_BLOB_NAME = 'models/bird_vit_model.pth'
    DESTINATION_FILE_NAME = 'bird_vit_model.pth'
    
    download_model(BUCKET_NAME, SOURCE_BLOB_NAME, DESTINATION_FILE_NAME)
