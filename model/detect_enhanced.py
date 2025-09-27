from roboflow import Roboflow
import cv2
import matplotlib.pyplot as plt

# --- CONFIG ---
API_KEY = "k6m8pn0f1swN8bI7Ergz"
IMAGE_PATH = "plane only_enhanced.jpg"    # 3-step enhanced image

# --- INIT MODELS ---
rf = Roboflow(api_key=API_KEY)

# Try both models as suggested
project1 = rf.workspace().project("military-vehicle-recognition")
model1 = project1.version(5).model

project2 = rf.workspace().project("military-vehicle")
model2 = project2.version(2).model

print("Running detection on 3-step enhanced image with both models...")

# Run detection with very low confidence to catch faint jets
pred1 = model1.predict(IMAGE_PATH, confidence=15, overlap=45).json()["predictions"]
pred2 = model2.predict(IMAGE_PATH, confidence=15, overlap=45).json()["predictions"]

# Merge predictions
pred = pred1 + pred2

print(f"Detected {len(pred)} planes")

# --- VISUALIZE ---
img = cv2.imread(IMAGE_PATH)
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Draw bounding boxes and labels
for i, p in enumerate(pred):
    x, y, w, h = int(p["x"]), int(p["y"]), int(p["width"]), int(p["height"])
    label = p["class"]
    conf = p["confidence"]

    # Convert to top-left corner
    x1, y1 = x - w // 2, y - h // 2
    x2, y2 = x + w // 2, y + h // 2

    # Draw bounding box
    cv2.rectangle(img_rgb, (x1, y1), (x2, y2), (0, 255, 0), 3)
    
    # Draw label with background
    label_text = f"{label} ({conf:.2f})"
    font_scale = 0.7
    font_thickness = 2
    
    # Get text size for background rectangle
    (text_width, text_height), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness)
    
    # Draw background rectangle for text
    cv2.rectangle(img_rgb, (x1, y1 - text_height - 10), (x1 + text_width, y1), (0, 255, 0), -1)
    
    # Draw text
    cv2.putText(img_rgb, label_text, (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), font_thickness)

# Add detection summary at the top
summary_text = f"Detected {len(pred)} planes (3-step enhanced image)"
cv2.putText(img_rgb, summary_text, (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)

# Save the result image
cv2.imwrite("detection_result_enhanced.jpg", cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR))
print("Detection result saved as 'detection_result_enhanced.jpg'")

# Show the image
cv2.imshow("Enhanced Plane Detection Results", img_rgb)
print("Press any key to close the image window...")
cv2.waitKey(0)
cv2.destroyAllWindows()

print("Detection completed!")
