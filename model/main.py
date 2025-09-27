from roboflow import Roboflow
import cv2
import matplotlib.pyplot as plt
import numpy as np

# --- CONFIG ---
API_KEY = "k6m8pn0f1swN8bI7Ergz"   # <-- replace with your Roboflow API key
IMAGE_PATH = "plane only_enhanced.jpg"    # <-- use the 3-step enhanced image

# --- INIT MODELS ---
rf = Roboflow(api_key=API_KEY)

# Model 1 (military-equipment-detect v1) - for tanks and military equipment
project1 = rf.workspace().project("military-equipment-detect")
model1 = project1.version(1).model

# Model 2 (airplanes-graua v2) - for planes and aircraft
project2 = rf.workspace().project("airplanes-graua")
model2 = project2.version(2).model

# --- MULTIPLE ENHANCEMENT METHODS FOR AERIAL IMAGERY ---
print("Loading and creating multiple enhancement versions...")
img_original = cv2.imread(IMAGE_PATH)

# Create different enhancement versions
enhancements = {}

# Version 1: Original (baseline)
enhancements['original'] = img_original.copy()

# Version 2: Gentle CLAHE only
img_lab = cv2.cvtColor(img_original, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
cl = clahe.apply(l)
img_clahe = cv2.merge((cl, a, b))
enhancements['clahe'] = cv2.cvtColor(img_clahe, cv2.COLOR_LAB2BGR)

# Version 3: HSV saturation boost (for color differences)
img_hsv = cv2.cvtColor(img_original, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(img_hsv)
s = cv2.multiply(s, 1.2)
s = np.clip(s, 0, 255).astype(np.uint8)
img_hsv_enhanced = cv2.merge((h, s, v))
enhancements['hsv'] = cv2.cvtColor(img_hsv_enhanced, cv2.COLOR_HSV2BGR)

# Version 4: Edge enhancement only
kernel = np.array([[0,-1,0], [-1,5,-1], [0,-1,0]])
enhancements['edges'] = cv2.filter2D(img_original, -1, kernel)

# Version 5: Contrast boost only
enhancements['contrast'] = cv2.convertScaleAbs(img_original, alpha=1.15, beta=3)

# Version 6: Combined gentle enhancement
img_combined = img_original.copy()
img_combined = cv2.convertScaleAbs(img_combined, alpha=1.1, beta=2)
img_lab = cv2.cvtColor(img_combined, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe = cv2.createCLAHE(clipLimit=1.5, tileGridSize=(8,8))
cl = clahe.apply(l)
img_lab_enhanced = cv2.merge((cl, a, b))
enhancements['combined'] = cv2.cvtColor(img_lab_enhanced, cv2.COLOR_LAB2BGR)

# Version 7: Aggressive CLAHE for very faint jets
img_aggressive = img_original.copy()
img_lab = cv2.cvtColor(img_aggressive, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe_aggressive = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(4,4))  # More aggressive
cl = clahe_aggressive.apply(l)
img_lab_aggressive = cv2.merge((cl, a, b))
enhancements['aggressive_clahe'] = cv2.cvtColor(img_lab_aggressive, cv2.COLOR_LAB2BGR)

# Version 8: High contrast + edge enhancement
img_high_contrast = cv2.convertScaleAbs(img_original, alpha=1.3, beta=10)
kernel = np.array([[0,-1,0], [-1,5,-1], [0,-1,0]])
enhancements['high_contrast_edges'] = cv2.filter2D(img_high_contrast, -1, kernel)

# Version 9: Grayscale conversion for better edge detection
img_gray = cv2.cvtColor(img_original, cv2.COLOR_BGR2GRAY)
img_gray_3ch = cv2.cvtColor(img_gray, cv2.COLOR_GRAY2BGR)
enhancements['grayscale'] = img_gray_3ch

# Version 10: Histogram equalization
img_hist = cv2.equalizeHist(cv2.cvtColor(img_original, cv2.COLOR_BGR2GRAY))
img_hist_3ch = cv2.cvtColor(img_hist, cv2.COLOR_GRAY2BGR)
enhancements['histogram_eq'] = img_hist_3ch

# Version 11: Very aggressive CLAHE for faint planes
img_very_aggressive = img_original.copy()
img_lab = cv2.cvtColor(img_very_aggressive, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe_very_aggressive = cv2.createCLAHE(clipLimit=6.0, tileGridSize=(2,2))  # Very aggressive
cl = clahe_very_aggressive.apply(l)
img_lab_very_aggressive = cv2.merge((cl, a, b))
enhancements['very_aggressive_clahe'] = cv2.cvtColor(img_lab_very_aggressive, cv2.COLOR_LAB2BGR)

# Version 12: Unsharp masking for better plane definition
img_unsharp = img_original.copy()
gaussian = cv2.GaussianBlur(img_unsharp, (0, 0), 1.0)
enhancements['unsharp'] = cv2.addWeighted(img_unsharp, 2.0, gaussian, -1.0, 0)

# Version 13: Morphological operations to enhance plane shapes
img_morph = img_original.copy()
kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
img_morph = cv2.morphologyEx(img_morph, cv2.MORPH_CLOSE, kernel)
enhancements['morphological'] = img_morph

# Version 14: Focus on blue channel (often better for aircraft)
img_blue_focus = img_original.copy()
b, g, r = cv2.split(img_blue_focus)
b_enhanced = cv2.multiply(b, 1.2)
b_enhanced = np.clip(b_enhanced, 0, 255).astype(np.uint8)
enhancements['blue_focus'] = cv2.merge((b_enhanced, g, r))

# Version 15: Multi-scale enhancement for faint objects
img_multiscale = img_original.copy()
# Apply different scales of enhancement
img_scale1 = cv2.convertScaleAbs(img_multiscale, alpha=1.1, beta=2)
img_scale2 = cv2.convertScaleAbs(img_multiscale, alpha=1.2, beta=5)
img_scale3 = cv2.convertScaleAbs(img_multiscale, alpha=1.3, beta=8)
# Blend them together
enhancements['multiscale'] = cv2.addWeighted(img_scale1, 0.4, cv2.addWeighted(img_scale2, 0.4, img_scale3, 0.2, 0), 0.6, 0)

# Version 16: Advanced CLAHE with different parameters
img_advanced_clahe = img_original.copy()
img_lab = cv2.cvtColor(img_advanced_clahe, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
# Try different CLAHE parameters
clahe1 = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
clahe2 = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(4,4))
clahe3 = cv2.createCLAHE(clipLimit=4.0, tileGridSize=(2,2))
l1 = clahe1.apply(l)
l2 = clahe2.apply(l)
l3 = clahe3.apply(l)
# Combine different CLAHE results
l_combined = cv2.addWeighted(l1, 0.4, cv2.addWeighted(l2, 0.4, l3, 0.2, 0), 0.6, 0)
img_lab_advanced = cv2.merge((l_combined, a, b))
enhancements['advanced_clahe'] = cv2.cvtColor(img_lab_advanced, cv2.COLOR_LAB2BGR)

# Version 17: Edge-preserving filter + contrast
img_edge_preserve = cv2.edgePreservingFilter(img_original, flags=1, sigma_s=50, sigma_r=0.4)
img_edge_preserve = cv2.convertScaleAbs(img_edge_preserve, alpha=1.15, beta=3)
enhancements['edge_preserve'] = img_edge_preserve

# Version 18: Bilateral filter + enhancement
img_bilateral = cv2.bilateralFilter(img_original, 9, 75, 75)
img_bilateral = cv2.convertScaleAbs(img_bilateral, alpha=1.2, beta=5)
enhancements['bilateral'] = img_bilateral

# Version 19: Gamma correction variants
img_gamma1 = np.power(img_original / 255.0, 0.8) * 255.0  # Darker
img_gamma2 = np.power(img_original / 255.0, 1.2) * 255.0  # Brighter
img_gamma3 = np.power(img_original / 255.0, 0.9) * 255.0  # Slightly darker
enhancements['gamma_dark'] = np.uint8(img_gamma1)
enhancements['gamma_bright'] = np.uint8(img_gamma2)
enhancements['gamma_slight'] = np.uint8(img_gamma3)

# Version 20: Laplacian sharpening for plane edges
img_laplacian = img_original.copy()
laplacian_kernel = np.array([[0,1,0], [1,-4,1], [0,1,0]])
img_laplacian = cv2.filter2D(img_laplacian, -1, laplacian_kernel)
img_laplacian = cv2.convertScaleAbs(img_laplacian, alpha=0.5, beta=0)
enhancements['laplacian'] = cv2.addWeighted(img_original, 1.0, img_laplacian, 0.3, 0)

# Version 21: Focus on runway area enhancement (where faint jets are)
img_runway_focus = img_original.copy()
# Convert to HSV and enhance saturation in specific areas
hsv = cv2.cvtColor(img_runway_focus, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)
# Enhance saturation more aggressively
s = cv2.multiply(s, 1.5)
s = np.clip(s, 0, 255).astype(np.uint8)
# Enhance value channel for better contrast
v = cv2.multiply(v, 1.2)
v = np.clip(v, 0, 255).astype(np.uint8)
hsv_enhanced = cv2.merge((h, s, v))
img_runway_focus = cv2.cvtColor(hsv_enhanced, cv2.COLOR_HSV2BGR)
# Apply additional contrast
img_runway_focus = cv2.convertScaleAbs(img_runway_focus, alpha=1.25, beta=8)
enhancements['runway_focus'] = img_runway_focus

# Version 22: Multi-pass enhancement
img_multipass = img_original.copy()
# First pass: CLAHE
img_lab = cv2.cvtColor(img_multipass, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
l = clahe.apply(l)
img_lab = cv2.merge((l, a, b))
img_multipass = cv2.cvtColor(img_lab, cv2.COLOR_LAB2BGR)
# Second pass: Contrast
img_multipass = cv2.convertScaleAbs(img_multipass, alpha=1.15, beta=5)
# Third pass: Edge enhancement
kernel = np.array([[0,-1,0], [-1,5,-1], [0,-1,0]])
img_multipass = cv2.filter2D(img_multipass, -1, kernel)
enhancements['multipass'] = img_multipass

# Version 23: Adaptive thresholding for plane shapes
img_adaptive = img_original.copy()
# Convert to grayscale
gray = cv2.cvtColor(img_adaptive, cv2.COLOR_BGR2GRAY)
# Apply adaptive threshold
adaptive = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
# Use as mask to enhance original image
img_adaptive = cv2.bitwise_and(img_adaptive, img_adaptive, mask=adaptive)
# Apply additional enhancement
img_adaptive = cv2.convertScaleAbs(img_adaptive, alpha=1.3, beta=10)
enhancements['adaptive_thresh'] = img_adaptive

# Version 24: Sobel edge detection + enhancement
img_sobel = img_original.copy()
gray = cv2.cvtColor(img_sobel, cv2.COLOR_BGR2GRAY)
sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
sobel = np.sqrt(sobelx**2 + sobely**2)
sobel = np.uint8(sobel / sobel.max() * 255)
# Use sobel as enhancement mask
img_sobel = cv2.addWeighted(img_sobel, 1.0, cv2.cvtColor(sobel, cv2.COLOR_GRAY2BGR), 0.3, 0)
img_sobel = cv2.convertScaleAbs(img_sobel, alpha=1.2, beta=5)
enhancements['sobel_enhanced'] = img_sobel

# Version 25: Hybrid method - combine best techniques
img_hybrid = img_original.copy()
# Step 1: CLAHE enhancement
img_lab = cv2.cvtColor(img_hybrid, cv2.COLOR_BGR2LAB)
l, a, b = cv2.split(img_lab)
clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(6,6))
l = clahe.apply(l)
img_lab = cv2.merge((l, a, b))
img_hybrid = cv2.cvtColor(img_lab, cv2.COLOR_LAB2BGR)
# Step 2: Gentle contrast boost
img_hybrid = cv2.convertScaleAbs(img_hybrid, alpha=1.1, beta=3)
# Step 3: HSV saturation enhancement
hsv = cv2.cvtColor(img_hybrid, cv2.COLOR_BGR2HSV)
h, s, v = cv2.split(hsv)
s = cv2.multiply(s, 1.2)
s = np.clip(s, 0, 255).astype(np.uint8)
hsv = cv2.merge((h, s, v))
img_hybrid = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)
# Step 4: Gentle edge enhancement
kernel = np.array([[0,-1,0], [-1,5,-1], [0,-1,0]])
img_hybrid = cv2.filter2D(img_hybrid, -1, kernel * 0.3)  # Very gentle
img_hybrid = np.clip(img_hybrid, 0, 255).astype(np.uint8)
enhancements['hybrid'] = img_hybrid

# Version 26: Focus on specific color ranges where planes might be
img_color_focus = img_original.copy()
# Convert to HSV
hsv = cv2.cvtColor(img_color_focus, cv2.COLOR_BGR2HSV)
# Create mask for specific color ranges (planes often have different hues than runway)
lower_plane = np.array([0, 0, 50])
upper_plane = np.array([180, 255, 255])
mask = cv2.inRange(hsv, lower_plane, upper_plane)
# Apply mask to enhance only those areas
img_color_focus = cv2.bitwise_and(img_color_focus, img_color_focus, mask=mask)
# Apply enhancement to the masked areas
img_color_focus = cv2.convertScaleAbs(img_color_focus, alpha=1.3, beta=8)
enhancements['color_focus'] = img_color_focus

# Version 27: Advanced runway suppression + plane enhancement
img_runway_suppress = img_original.copy()
# Convert to grayscale for analysis
gray = cv2.cvtColor(img_runway_suppress, cv2.COLOR_BGR2GRAY)
# Detect runway-like areas (smooth, low gradient)
blur = cv2.GaussianBlur(gray, (15, 15), 0)
laplacian = cv2.Laplacian(blur, cv2.CV_64F)
runway_mask = (laplacian < 10).astype(np.uint8) * 255
# Suppress runway areas
img_runway_suppress = cv2.bitwise_and(img_runway_suppress, img_runway_suppress, mask=255-runway_mask)
# Enhance remaining areas (planes)
img_runway_suppress = cv2.convertScaleAbs(img_runway_suppress, alpha=1.4, beta=15)
enhancements['runway_suppress'] = img_runway_suppress

# Version 28: Multi-scale edge enhancement for plane shapes
img_multiscale_edges = img_original.copy()
# Apply different edge detection scales
gray = cv2.cvtColor(img_multiscale_edges, cv2.COLOR_BGR2GRAY)
edges1 = cv2.Canny(gray, 50, 150)
edges2 = cv2.Canny(gray, 30, 100)
edges3 = cv2.Canny(gray, 70, 200)
# Combine edge maps
combined_edges = cv2.bitwise_or(edges1, cv2.bitwise_or(edges2, edges3))
# Use edges to enhance the original image
img_multiscale_edges = cv2.addWeighted(img_multiscale_edges, 1.0, cv2.cvtColor(combined_edges, cv2.COLOR_GRAY2BGR), 0.4, 0)
img_multiscale_edges = cv2.convertScaleAbs(img_multiscale_edges, alpha=1.2, beta=8)
enhancements['multiscale_edges'] = img_multiscale_edges

# Version 29: Frequency domain enhancement
img_freq = img_original.copy()
# Convert to grayscale
gray = cv2.cvtColor(img_freq, cv2.COLOR_BGR2GRAY)
# Apply FFT
f = np.fft.fft2(gray)
fshift = np.fft.fftshift(f)
# Create high-pass filter
rows, cols = gray.shape
crow, ccol = rows//2, cols//2
# High-pass filter to enhance edges
fshift[crow-30:crow+30, ccol-30:ccol+30] = 0
# Inverse FFT
f_ishift = np.fft.ifftshift(fshift)
img_back = np.fft.ifft2(f_ishift)
img_back = np.abs(img_back)
img_back = np.uint8(img_back / img_back.max() * 255)
# Combine with original
img_freq = cv2.addWeighted(img_freq, 1.0, cv2.cvtColor(img_back, cv2.COLOR_GRAY2BGR), 0.3, 0)
img_freq = cv2.convertScaleAbs(img_freq, alpha=1.15, beta=5)
enhancements['frequency_domain'] = img_freq

# Version 30: Advanced morphological operations for plane detection
img_morph_advanced = img_original.copy()
# Convert to grayscale
gray = cv2.cvtColor(img_morph_advanced, cv2.COLOR_BGR2GRAY)
# Apply morphological operations to enhance plane-like shapes
kernel_ellipse = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
kernel_rect = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
# Opening to remove noise
opening = cv2.morphologyEx(gray, cv2.MORPH_OPEN, kernel_rect)
# Closing to fill gaps in plane shapes
closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel_ellipse)
# Use as enhancement mask
img_morph_advanced = cv2.bitwise_and(img_morph_advanced, img_morph_advanced, mask=closing)
img_morph_advanced = cv2.convertScaleAbs(img_morph_advanced, alpha=1.3, beta=10)
enhancements['morph_advanced'] = img_morph_advanced

# Save all enhancement versions
for name, img in enhancements.items():
    if name != 'original':
        path = f"enhanced_{name}_{IMAGE_PATH.split('/')[-1].split('\\')[-1]}"
        cv2.imwrite(path, img)
        print(f"Saved {name} enhancement: {path}")

# --- RUN PREDICTIONS ON ALL VERSIONS ---
print("Testing all enhancement versions...")
best_detections = 0
best_pred1 = []
best_pred2 = []
best_version = "original"

for name, img in enhancements.items():
    if name == 'original':
        test_path = IMAGE_PATH
    else:
        test_path = f"enhanced_{name}_{IMAGE_PATH.split('/')[-1].split('\\')[-1]}"
    
    print(f"Testing {name} version...")
    # Skip military equipment model - only planes in this image
    pred1_test = []  # No military equipment
    pred2_test = model2.predict(test_path, confidence=20, overlap=45).json()["predictions"]  # Lower confidence, looser NMS
    total_test = len(pred2_test)  # Only count planes
    
    print(f"  {name}: 0 equipment + {len(pred2_test)} planes = {total_test} total")
    
    # Focus only on plane detection
    if len(pred2_test) > best_detections:
        best_detections = len(pred2_test)
        best_pred1 = []
        best_pred2 = pred2_test
        best_version = name

print(f"\nBest version: {best_version} with {best_detections} total detections")
pred1, pred2 = best_pred1, best_pred2
used_image = best_version

# Merge both sets of predictions
merged_preds = pred1 + pred2
print(f"Total merged predictions: {len(merged_preds)}")

# Print details about what was detected
if len(merged_preds) > 0:
    print("Detected objects:")
    for i, pred in enumerate(merged_preds):
        print(f"  {i+1}. {pred['class']} (confidence: {pred['confidence']:.2f})")
else:
    print("No military vehicles detected in the image.")
    print("This could mean:")
    print("  - The image doesn't contain military vehicles")
    print("  - The models need a clearer/more obvious military vehicle image")
    print("  - The confidence threshold is too high")

# --- VISUALIZE ---
# Use original image for display (not enhanced)
img = img_original
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

# Create a copy for overlay
overlay_img = img_rgb.copy()

# Draw bounding boxes and labels
for i, p in enumerate(merged_preds):
    x, y, w, h = int(p["x"]), int(p["y"]), int(p["width"]), int(p["height"])
    label = p["class"]
    conf = p["confidence"]

    # Convert to top-left corner
    x1, y1 = x - w // 2, y - h // 2
    x2, y2 = x + w // 2, y + h // 2

    # Draw bounding box
    cv2.rectangle(overlay_img, (x1, y1), (x2, y2), (0, 255, 0), 3)
    
    # Draw label with background
    label_text = f"{label} ({conf:.2f})"
    font_scale = 0.7
    font_thickness = 2
    
    # Get text size for background rectangle
    (text_width, text_height), baseline = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness)
    
    # Draw background rectangle for text
    cv2.rectangle(overlay_img, (x1, y1 - text_height - 10), (x1 + text_width, y1), (0, 255, 0), -1)
    
    # Draw text
    cv2.putText(overlay_img, label_text, (x1, y1 - 5),
                cv2.FONT_HERSHEY_SIMPLEX, font_scale, (0, 0, 0), font_thickness)

# Add detection summary at the top
if len(merged_preds) > 0:
    summary_text = f"Detected {len(merged_preds)} military objects (equipment + aircraft)"
    cv2.putText(overlay_img, summary_text, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.putText(overlay_img, f"Detection performed on {used_image} image", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
else:
    cv2.putText(overlay_img, "No military equipment or aircraft detected", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2)
    cv2.putText(overlay_img, f"Detection performed on {used_image} image", (10, 60),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

# Save the result image with overlay
cv2.imwrite("detection_result.jpg", cv2.cvtColor(overlay_img, cv2.COLOR_RGB2BGR))
print("Detection result with overlay saved as 'detection_result.jpg'")

# Try to show the image window (may not work on all systems)
try:
    print("Opening image window with detection overlay...")
    cv2.imshow("Military Vehicle Detection Results", overlay_img)
    print("Image window opened! Press any key in the image window to close it...")
    print("(If you don't see the window, check if it's behind other windows)")
    
    # Wait for key press with timeout
    key = cv2.waitKey(3000)  # Wait 3 seconds instead of indefinitely
    if key == -1:
        print("No key pressed within 3 seconds. Closing window automatically...")
    cv2.destroyAllWindows()
    print("Image window closed.")
except Exception as e:
    print(f"Could not display image window: {e}")
    print("The result has been saved as 'detection_result.jpg' - you can open it manually.")

print("Program completed!")

# Alternative: Show with matplotlib (uncomment if OpenCV display doesn't work)
# plt.figure(figsize=(12, 8))
# plt.imshow(img_rgb)
# plt.axis("off")
# plt.title("Military Vehicle Detection Results")
# plt.tight_layout()
# plt.show()
