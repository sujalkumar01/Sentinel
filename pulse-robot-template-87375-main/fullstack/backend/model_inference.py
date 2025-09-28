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

# Load the models once when the script starts
vehicle_model = None
airplane_model = None

def load_models():
    """Load both YOLO models"""
    global vehicle_model, airplane_model
    try:
        vehicle_model = YOLO('best.pt')
        airplane_model = YOLO('best2.pt')
        print("Both models loaded successfully", file=sys.stderr)
        return True
    except Exception as e:
        print(f"Error loading models: {e}", file=sys.stderr)
        return False

def calculate_iou(box1, box2):
    """Calculate Intersection over Union (IoU) of two bounding boxes"""
    x1_1, y1_1, x2_1, y2_1 = box1
    x1_2, y1_2, x2_2, y2_2 = box2
    
    # Calculate intersection area
    x1_i = max(x1_1, x1_2)
    y1_i = max(y1_1, y1_2)
    x2_i = min(x2_1, x2_2)
    y2_i = min(y2_1, y2_2)
    
    if x2_i <= x1_i or y2_i <= y1_i:
        return 0.0
    
    intersection = (x2_i - x1_i) * (y2_i - y1_i)
    area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
    area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
    union = area1 + area2 - intersection
    
    return intersection / union if union > 0 else 0.0

def is_overlapping(new_box, processed_boxes, threshold=0.5):
    """Check if a new bounding box overlaps significantly with processed boxes"""
    for processed_box in processed_boxes:
        if calculate_iou(new_box, processed_box) > threshold:
            return True
    return False

def detect_vehicles(image_path):
    """
    Run vehicle and airplane detection on the provided image file using both models
    
    Args:
        image_path: Path to the image file
        
    Returns:
        dict: Detection results with vehicle counts and bounding boxes
    """
    global vehicle_model, airplane_model
    
    if vehicle_model is None or airplane_model is None:
        return {
            "error": "Models not loaded",
            "total_vehicles": 0,
            "vehicle_counts": {},
            "detections": [],
            "message": "Models not available"
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
        
        # Run inference on both models (suppress YOLO output)
        import os
        import sys
        from contextlib import redirect_stdout, redirect_stderr
        
        # Suppress YOLO's verbose output
        with open(os.devnull, 'w') as devnull:
            with redirect_stdout(devnull), redirect_stderr(devnull):
                # Use appropriate thresholds for each model
                # Vehicle model: standard threshold for ground vehicles
                vehicle_results = vehicle_model(opencv_image, conf=0.25, verbose=False)
                vehicle_results_text = vehicle_model(opencv_image, conf=0.25, verbose=False)
                
                # Airplane model: only run if we detect potential aircraft with lower threshold first
                # First check with very high threshold to see if there are any aircraft
                airplane_precheck = airplane_model(opencv_image, conf=0.6, verbose=False)
                has_aircraft = False
                for result in airplane_precheck:
                    if result.boxes is not None and len(result.boxes) > 0:
                        has_aircraft = True
                        break
                
                # Only run full airplane detection if we found potential aircraft
                if has_aircraft:
                    airplane_results = airplane_model(opencv_image, conf=0.4, verbose=False)
                    airplane_results_text = airplane_model(opencv_image, conf=0.5, verbose=False)
                else:
                    # Create empty results if no aircraft detected
                    airplane_results = []
                    airplane_results_text = []
        
        # Merge results from both models
        all_detections = []
        vehicle_counts = {
            "A1": 0, "A2": 0, "A3": 0, "A4": 0, "A5": 0, "A6": 0, "A7": 0, "A8": 0, "A9": 0, "A10": 0,
            "A11": 0, "A12": 0, "A13": 0, "A14": 0, "A15": 0, "A16": 0, "A17": 0, "A18": 0, "A19": 0,
            "SMV": 0, "LMV": 0, "AFV": 0, "CV": 0, "MCV": 0
        }
        
        # Track processed bounding boxes to avoid double counting
        processed_boxes = []
        
        # Process vehicle model results
        for result in vehicle_results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    
                    # Get class name from vehicle model
                    class_name = vehicle_model.names[class_id]
                    
                    # Check for overlap with already processed boxes
                    bbox_coords = [int(x1), int(y1), int(x2), int(y2)]
                    if is_overlapping(bbox_coords, processed_boxes):
                        continue
                    
                    # Count vehicles by actual class name
                    if class_name in vehicle_counts:
                        vehicle_counts[class_name] += 1
                    
                    # Add detection
                    all_detections.append({
                        "class": class_name,
                        "confidence": confidence,
                        "bbox": bbox_coords
                    })
                    
                    # Track this box to avoid double counting
                    processed_boxes.append(bbox_coords)
        
        # Process airplane model results (for visual bounding boxes)
        # Only process if confidence is high enough and it's actually an aircraft
        for result in airplane_results:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    # Get bounding box coordinates
                    x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    
                    # Get class name from airplane model
                    class_name = airplane_model.names[class_id]
                    
                    # Only process if confidence is high enough (0.4+)
                    if confidence < 0.4:
                        continue
                    
                    # Check for overlap with already processed boxes
                    bbox_coords = [int(x1), int(y1), int(x2), int(y2)]
                    if is_overlapping(bbox_coords, processed_boxes):
                        continue
                    
                    # Debug logging for airplane detections
                    print(f"Airplane detection (visual): {class_name} with confidence {confidence:.3f} at [{int(x1)}, {int(y1)}, {int(x2)}, {int(y2)}]", file=sys.stderr)
                    
                    # Count airplanes (add to appropriate category or create new ones)
                    if class_name not in vehicle_counts:
                        vehicle_counts[class_name] = 0
                    vehicle_counts[class_name] += 1
                    
                    # Add detection
                    all_detections.append({
                        "class": class_name,
                        "confidence": confidence,
                        "bbox": bbox_coords
                    })
                    
                    # Track this box to avoid double counting
                    processed_boxes.append(bbox_coords)
        
        # Process text analysis results (higher thresholds for counts and summary)
        text_vehicle_counts = {
            "A1": 0, "A2": 0, "A3": 0, "A4": 0, "A5": 0, "A6": 0, "A7": 0, "A8": 0, "A9": 0, "A10": 0,
            "A11": 0, "A12": 0, "A13": 0, "A14": 0, "A15": 0, "A16": 0, "A17": 0, "A18": 0, "A19": 0,
            "SMV": 0, "LMV": 0, "AFV": 0, "CV": 0, "MCV": 0
        }
        
        # Process vehicle model results for text analysis
        for result in vehicle_results_text:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    class_name = vehicle_model.names[class_id]
                    
                    # Count for text analysis
                    if class_name in text_vehicle_counts:
                        text_vehicle_counts[class_name] += 1
                    
                    print(f"Vehicle detection (text): {class_name} with confidence {confidence:.3f}", file=sys.stderr)
        
        # Process airplane model results for text analysis
        for result in airplane_results_text:
            boxes = result.boxes
            if boxes is not None:
                for box in boxes:
                    confidence = float(box.conf[0].cpu().numpy())
                    class_id = int(box.cls[0].cpu().numpy())
                    class_name = airplane_model.names[class_id]
                    
                    # Only count if confidence is high enough (0.5+)
                    if confidence < 0.5:
                        continue
                    
                    # Count for text analysis
                    if class_name not in text_vehicle_counts:
                        text_vehicle_counts[class_name] = 0
                    text_vehicle_counts[class_name] += 1
                    
                    print(f"Airplane detection (text): {class_name} with confidence {confidence:.3f}", file=sys.stderr)
        
        total_vehicles = sum(vehicle_counts.values())
        total_vehicles_text = sum(text_vehicle_counts.values())
        
        # Debug logging for final counts
        print(f"Visual counts - Total vehicles: {total_vehicles}, Detections array length: {len(all_detections)}", file=sys.stderr)
        print(f"Text analysis counts - Total vehicles: {total_vehicles_text}", file=sys.stderr)
        print(f"Visual vehicle counts: {vehicle_counts}", file=sys.stderr)
        print(f"Text vehicle counts: {text_vehicle_counts}", file=sys.stderr)
        print(f"Detection classes: {[d['class'] for d in all_detections]}", file=sys.stderr)
        
        return {
            "total_vehicles": total_vehicles_text,  # Use text analysis count for summary
            "vehicle_counts": text_vehicle_counts,  # Use text analysis counts for summary
            "detections": all_detections,  # Use visual detections for bounding boxes
            "visual_vehicle_counts": vehicle_counts,  # Keep visual counts for reference
            "message": f"Vehicle and airplane detection completed successfully using both AI models. Found {total_vehicles_text} objects in analysis, {len(all_detections)} visible objects with bounding boxes."
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
    
    # Load both models
    if not load_models():
        print(json.dumps({"error": "Failed to load models"}))
        sys.exit(1)
    
    # Get image path from command line argument
    image_path = sys.argv[1]
    
    # Run detection
    results = detect_vehicles(image_path)
    
    # Output results as JSON
    print(json.dumps(results))

if __name__ == "__main__":
    main()
