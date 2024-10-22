## Welcome to SmartBirds.io

# A Free Bird Detection and Classification Application
<img src='https://github.com/Robby955/SmartBirds.io/blob/main/images/logo.png' width=720>

# Methods: Vision Transformers (ViT) 
For a smaller, yet just as accurate model as modern CNN, I used a vision transformer from HuggingFace (ViT, fine tuned on Cal-tech bird dataset).

We also perform detection using YoloV5 at test time to crop the bird before running through our fine tuned ViT. 

Access the free model now, deployed via Cloud Run and Docker.

<img src='https://github.com/Robby955/SmartBirds.io/blob/main/images/landing_page.png' width=1220>

Explore a large multi-faceted dataset of over 11,800 images visually and dynamically, with additional data information such as attributes and prelabelled bounding boxes.

Plot parts dynamically via the parts button, or visualize the bounding boxes.

Explore all 300+ attributes with color coded certainity levels for each of the 11,800 images.

<img src='https://github.com/Robby955/SmartBirds.io/blob/main/images/predictionpage.png' width=1220>

<img src='https://github.com/Robby955/SmartBirds.io/blob/main/images/bounding_boxes.png' width=1220>

