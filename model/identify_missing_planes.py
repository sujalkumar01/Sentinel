import cv2
import numpy as np

def identify_missing_planes(image_path, current_detections):
    """
    Visual tool to help identify where the missing planes are located
    """
    img = cv2.imread(image_path)
    img_display = img.copy()
    
    # Draw current detections
    for i, detection in enumerate(current_detections):
        x, y, w, h = int(detection['x']), int(detection['y']), int(detection['width']), int(detection['height'])
        x1, y1 = x - w // 2, y - h // 2
        x2, y2 = x + w // 2, y + h // 2
        
        cv2.rectangle(img_display, (x1, y1), (x2, y2), (0, 255, 0), 3)
        cv2.putText(img_display, f"Detected {i+1}", (x1, y1-10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    
    # Add instructions
    cv2.putText(img_display, "GREEN: Currently detected planes", (10, 30), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
    cv2.putText(img_display, "Look for 3 more planes (total should be 9)", (10, 60), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(img_display, "Press any key to close", (10, 90), 
               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    cv2.imshow("Missing Planes Identification", img_display)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def create_enhanced_analysis(image_path):
    """
    Create multiple enhanced versions to help identify faint planes
    """
    img = cv2.imread(image_path)
    
    # Apply the 3-step enhancement
    # Step 1: Illumination flattening
    blur = cv2.GaussianBlur(img, (0, 0), sigmaX=25, sigmaY=25)
    illum = cv2.addWeighted(img, 1.5, blur, -0.5, 0)
    
    # Step 2: CLAHE + Top-hat
    lab = cv2.cvtColor(illum, cv2.COLOR_BGR2LAB)
    L, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
    L2 = clahe.apply(L)
    clahe_img = cv2.cvtColor(cv2.merge((L2, a, b)), cv2.COLOR_LAB2BGR)
    
    gray = cv2.cvtColor(clahe_img, cv2.COLOR_BGR2GRAY)
    se = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))
    tophat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, se)
    
    mask = cv2.normalize(tophat, None, 0, 255, cv2.NORM_MINMAX)
    boosted = cv2.addWeighted(clahe_img, 1.0, cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR), 0.7, 0)
    
    # Step 3: Unsharp mask
    soft = cv2.GaussianBlur(boosted, (0,0), 1.2)
    enhanced = cv2.addWeighted(boosted, 1.5, soft, -0.5, 0)
    
    # Create comparison image
    comparison = np.hstack([img, illum, clahe_img, enhanced])
    
    # Resize for display
    height = 400
    comparison = cv2.resize(comparison, (comparison.shape[1] * height // comparison.shape[0], height))
    
    # Add labels
    labels = ["Original", "Illumination Flattened", "CLAHE + Top-hat", "Final Enhanced"]
    for i, label in enumerate(labels):
        x = i * (comparison.shape[1] // 4)
        cv2.putText(comparison, label, (x + 10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    cv2.imshow("Enhancement Comparison", comparison)
    cv2.imwrite("enhancement_comparison.jpg", comparison)
    print("Saved enhancement_comparison.jpg")
    
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    image_path = "plane only.jpg"
    
    print("Jet Detection Analysis Tool")
    print("1. Identify missing planes")
    print("2. Show enhancement comparison")
    
    choice = input("Enter choice (1 or 2): ").strip()
    
    if choice == "1":
        # Example current detections (you can replace with actual results)
        current_detections = [
            {'x': 200, 'y': 150, 'width': 80, 'height': 40},
            {'x': 400, 'y': 180, 'width': 90, 'height': 45},
            # Add your actual detections here
        ]
        identify_missing_planes(image_path, current_detections)
    else:
        create_enhanced_analysis(image_path)
