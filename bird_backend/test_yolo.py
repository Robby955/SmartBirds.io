import cv2

# Path to your local image
image_path = 'test_images/American_Goldfinch_0018_32324.jpg'

# YOLO bounding box coordinates (x1, y1, x2, y2) and confidence
bounding_box = [63, 52, 262, 186]
confidence = 0.79
# Load the image using OpenCV
image = cv2.imread(image_path)

if image is None:
    print("Error: Could not load the image.")
else:
    # Draw the bounding box (x1, y1, x2, y2)
    x1, y1, x2, y2 = bounding_box[:4]
    color = (0, 255, 0)  # Green bounding box
    thickness = 2

    # Draw the rectangle around the detected bird
    cv2.rectangle(image, (x1, y1), (x2, y2), color, thickness)

    # Add confidence text near the bounding box
    confidence_text = f'Confidence: {confidence:.2f}'
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 0.6
    text_color = (255, 0, 0)  # Blue text
    cv2.putText(image, confidence_text, (x1, y1 - 10), font, font_scale, text_color, thickness)

    # Display the image in a window
    cv2.imshow('YOLO Bounding Box', image)

    # Wait for a key press to close the window
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Optionally save the image with the bounding box
    cv2.imwrite('output_bird_with_bbox.jpg', image)
