#!/usr/bin/env python3
"""
Vehicle Detection Model Inference Script
Integrates with Node.js backend to run actual YOLO model predictions
"""

import sys
import json
import base64
import io
from PIL import Image
import torch
from ultralytics import YOLO
import cv2
import numpy as np

# Load the model once when the script starts
model = None

def load_model():
    """Load the YOLO model"""
    global model
    try:
        model = YOLO('best.pt')
        print("Model loaded successfully", file=sys.stderr)
        return True
    except Exception as e:
        print(f"Error loading model: {e}", file=sys.stderr)
        return False

def detect_vehicles(image_path):
    """
    Run vehicle detection on the provided image file
    
    Args:
        image_path: Path to the image file
        
    Returns:
        dict: Detection results with vehicle counts and bounding boxes
    """
    global model
    
    if model is None:
        return {
            "error": "Model not loaded",
            "total_vehicles": 0,
            "vehicle_counts": {},
            "detections": [],
            "message": "Model not available"
        }
    
    try:
        # Load image from file path
        image = Image.open(image_path)
        
        # Verify image was loaded correctly
        if image.size[0] == 0 or image.size[1] == 0:
            raise ValueError("Invalid image: zero dimensions")
        
        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert PIL to OpenCV format
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Run inference (suppress YOLO output)
        import os
        import sys
        from contextlib import redirect_stdout, redirect_stderr
        
        # Suppress YOLO's verbose output
        with open(os.devnull, 'w') as devnull:
            with redirect_stdout(devnull), redirect_stderr(devnull):
                results = model(opencv_image, verbose=False)
        
        # Process results
        detections = []
        vehicle_counts = {
            "A1": 0, "A2": 0, "A3": 0, "A4": 0, "A5": 0, "A6": 0, "A7": 0, "A8": 0, "A9": 0, "A10": 0,
            "A11": 0, "A12": 0, "A13": 0, "A14": 0, "A15": 0, "A16": 0, "A17": 0, "A18": 0, "A19": 0,
            "SMV": 0, "LMV": 0, "AFV": 0, "CV": 0, "MCV": 0
        }
        
        for result in results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    
                    # Get class name from your model
                    class_name = model.names[class_id]
                    
                    # Count vehicles by actual class name
                    vehicle_counts[class_name] += 1
                    
                    # Add detection
                    detections.append({
                        "class": class_name,
                        "confidence": confidence,
                        "bbox": [int(x1), int(y1), int(x2), int(y2)]
                    })
        
        total_vehicles = sum(vehicle_counts.values())
        
        return {
            "total_vehicles": total_vehicles,
            "vehicle_counts": vehicle_counts,
            "detections": detections,
            "message": f"Vehicle detection completed successfully using AI model. Found {total_vehicles} vehicles."
        }
        
    except Exception as e:
        print(f"Error during detection: {e}", file=sys.stderr)
        return {
            "error": str(e),
            "total_vehicles": 0,
            "vehicle_counts": {},
            "detections": [],
            "message": f"Detection failed: {str(e)}"
        }

def main():
    """Main function to handle command line input"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
    
    # Load model
    if not load_model():
        print(json.dumps({"error": "Failed to load model"}))
        sys.exit(1)
    
    # Get image path from command line argument
    image_path = sys.argv[1]
    
    # Run detection
    results = detect_vehicles(image_path)
    
    # Output results as JSON
    print(json.dumps(results))

if __name__ == "__main__":
    main()
