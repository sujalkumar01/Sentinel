import cv2
import json
import os
from pathlib import Path

def create_roboflow_annotation(image_path, detections, output_dir="training_data"):
    """
    Create annotation files in Roboflow format for fine-tuning
    """
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Load image to get dimensions
    img = cv2.imread(image_path)
    height, width = img.shape[:2]
    
    # Create annotation file
    annotation_file = os.path.join(output_dir, os.path.splitext(os.path.basename(image_path))[0] + ".txt")
    
    with open(annotation_file, 'w') as f:
        for detection in detections:
            # Convert from center format to YOLO format
            x_center = detection['x'] / width
            y_center = detection['y'] / height
            bbox_width = detection['width'] / width
            bbox_height = detection['height'] / height
            
            # Write in YOLO format (class_id x_center y_center width height)
            # Assuming class_id 0 for planes
            f.write(f"0 {x_center:.6f} {y_center:.6f} {bbox_width:.6f} {bbox_height:.6f}\n")
    
    print(f"Created annotation: {annotation_file}")
    return annotation_file

def create_dataset_info(output_dir="training_data"):
    """
    Create dataset.yaml file for Roboflow
    """
    yaml_content = """# Dataset info for Roboflow fine-tuning
path: {output_dir}
train: images/train
val: images/val
test: images/test

# Classes
nc: 1  # number of classes
names: ['plane']  # class names
"""
    
    with open(os.path.join(output_dir, "dataset.yaml"), 'w') as f:
        f.write(yaml_content.format(output_dir=output_dir))
    
    print(f"Created dataset.yaml in {output_dir}")

def manual_annotation_tool(image_path, output_dir="training_data"):
    """
    Interactive tool to manually annotate the missing planes
    """
    print("Manual Annotation Tool")
    print("Click on the corners of each plane to create bounding boxes")
    print("Press 'q' to quit, 's' to save current annotations")
    
    img = cv2.imread(image_path)
    img_display = img.copy()
    
    annotations = []
    current_bbox = []
    
    def mouse_callback(event, x, y, flags, param):
        nonlocal current_bbox, img_display
        
        if event == cv2.EVENT_LBUTTONDOWN:
            if len(current_bbox) == 0:
                # Start new bounding box
                current_bbox = [(x, y)]
                print(f"Started bbox at ({x}, {y})")
            elif len(current_bbox) == 1:
                # Complete bounding box
                current_bbox.append((x, y))
                x1, y1 = current_bbox[0]
                x2, y2 = current_bbox[1]
                
                # Ensure proper order
                x1, x2 = min(x1, x2), max(x1, x2)
                y1, y2 = min(y1, y2), max(y1, y2)
                
                # Convert to center format
                center_x = (x1 + x2) / 2
                center_y = (y1 + y2) / 2
                bbox_w = x2 - x1
                bbox_h = y2 - y1
                
                annotation = {
                    'x': center_x,
                    'y': center_y,
                    'width': bbox_w,
                    'height': bbox_h,
                    'class': 'plane'
                }
                annotations.append(annotation)
                
                # Draw rectangle
                cv2.rectangle(img_display, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(img_display, f"Plane {len(annotations)}", (x1, y1-10), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
                
                current_bbox = []
                print(f"Added plane {len(annotations)}: center=({center_x:.1f}, {center_y:.1f}), size=({bbox_w:.1f}, {bbox_h:.1f})")
    
    cv2.namedWindow('Manual Annotation')
    cv2.setMouseCallback('Manual Annotation', mouse_callback)
    
    while True:
        cv2.imshow('Manual Annotation', img_display)
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord('q'):
            break
        elif key == ord('s'):
            if annotations:
                # Save annotations
                create_roboflow_annotation(image_path, annotations, output_dir)
                print(f"Saved {len(annotations)} annotations")
            else:
                print("No annotations to save")
    
    cv2.destroyAllWindows()
    return annotations

if __name__ == "__main__":
    # Example usage
    image_path = "plane only.jpg"
    
    print("Choose annotation method:")
    print("1. Manual annotation tool (interactive)")
    print("2. Create from existing detections")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        # Manual annotation
        annotations = manual_annotation_tool(image_path)
        if annotations:
            create_dataset_info()
            print(f"\nManual annotation complete! Found {len(annotations)} planes.")
            print("Next steps:")
            print("1. Review the annotations in training_data/")
            print("2. Upload to Roboflow for fine-tuning")
            print("3. Train a new model version")
    else:
        # Create from existing detections (if you have them)
        print("This would create annotations from existing detection results")
        print("Use manual annotation tool for better results")
