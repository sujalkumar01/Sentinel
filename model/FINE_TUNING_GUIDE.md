# Fine-Tuning Guide for Jet Detection

## Problem
The current model detects 6 out of 9 planes. The 3 missing planes are very faint and blend with the concrete runway background.

## Solution: Fine-Tuning with Labeled Data

### Step 1: Create Training Data

Run the manual annotation tool:
```bash
python prepare_training_data.py
```

This will open an interactive tool where you can:
1. Click on the corners of each missing plane
2. The tool will create bounding boxes
3. Annotations are saved in YOLO format

### Step 2: Data Augmentation

For better training, create multiple versions of your image:

```python
# Create augmented versions
import cv2
import numpy as np

def create_augmented_dataset(image_path, annotations):
    """Create rotated and flipped versions for more training data"""
    
    # Original image
    img = cv2.imread(image_path)
    
    # Create different versions
    versions = [
        ("original", img, annotations),
        ("rotated_90", cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE), rotate_annotations(annotations, 90)),
        ("rotated_180", cv2.rotate(img, cv2.ROTATE_180), rotate_annotations(annotations, 180)),
        ("rotated_270", cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE), rotate_annotations(annotations, 270)),
        ("flipped_h", cv2.flip(img, 1), flip_annotations_h(annotations)),
        ("flipped_v", cv2.flip(img, 0), flip_annotations_v(annotations))
    ]
    
    for name, img_aug, ann_aug in versions:
        cv2.imwrite(f"augmented_{name}.jpg", img_aug)
        create_roboflow_annotation(f"augmented_{name}.jpg", ann_aug)
```

### Step 3: Upload to Roboflow

1. Go to [Roboflow](https://roboflow.com)
2. Create a new project: "Jet Detection Fine-tuned"
3. Upload your images and annotations
4. Split into train/validation/test (80/10/10)

### Step 4: Train New Model

In Roboflow:
1. Go to "Train" tab
2. Choose YOLOv8 or YOLOv5
3. Set training parameters:
   - Epochs: 100-200
   - Batch size: 16
   - Learning rate: 0.001
   - Image size: 640x640

### Step 5: Test the Fine-tuned Model

```python
# Test with your fine-tuned model
from roboflow import Roboflow

rf = Roboflow(api_key="your_api_key")
project = rf.workspace().project("jet-detection-fine-tuned")
model = project.version(1).model  # Your new fine-tuned version

# Test on original image
predictions = model.predict("plane only.jpg", confidence=70).json()["predictions"]
print(f"Fine-tuned model detected {len(predictions)} planes")
```

## Alternative: Hard Example Mining

If you can't manually annotate, try this approach:

1. **Crop the problematic areas** where you know planes are
2. **Create small training images** (256x256) around each missing plane
3. **Use data augmentation** on these crops
4. **Train a specialized model** for these hard cases

## Expected Results

After fine-tuning, you should see:
- Detection of all 9 planes
- Higher confidence scores for previously missed planes
- Better performance on similar low-contrast images

## Tips for Better Results

1. **Focus on the hard cases** - annotate the 3 missing planes multiple times
2. **Use the 3-step preprocessing** - apply it to all training images
3. **Include negative examples** - add some images with no planes
4. **Test-time augmentation** - run detection on rotated versions and merge results

## Quick Start

1. Run: `python prepare_training_data.py`
2. Manually annotate the 3 missing planes
3. Upload to Roboflow
4. Train new model
5. Test with your enhanced detection pipeline
