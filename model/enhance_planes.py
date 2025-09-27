import cv2, numpy as np
import sys, os

in_path = sys.argv[1] if len(sys.argv) > 1 else "plane only.jpg"
img = cv2.imread(in_path)
if img is None:
    raise SystemExit(f"Could not read {in_path}")

print("Applying 3-step preprocessing for low-contrast jets on bright tarmac...")

# 1) Illumination flattening: subtract a heavy blur (remove large-scale brightness)
print("Step 1: Illumination flattening...")
blur = cv2.GaussianBlur(img, (0, 0), sigmaX=25, sigmaY=25)          # try 15–45
illum = cv2.addWeighted(img, 1.5, blur, -0.5, 0)

# 2) Local contrast + white top-hat on grayscale (bright objects over bright background)
print("Step 2: Local contrast + white top-hat...")
lab  = cv2.cvtColor(illum, cv2.COLOR_BGR2LAB)
L,a,b = cv2.split(lab)
clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
L2 = clahe.apply(L)
clahe_img = cv2.cvtColor(cv2.merge((L2,a,b)), cv2.COLOR_LAB2BGR)

gray = cv2.cvtColor(clahe_img, cv2.COLOR_BGR2GRAY)
# Structuring element size ≈ width of a wing; tweak 17–41 depending on your image scale
se = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))  # Increased for better plane detection
tophat = cv2.morphologyEx(gray, cv2.MORPH_TOPHAT, se)  # enhances bright plane blobs

# Boost areas where tophat responds
mask = cv2.normalize(tophat, None, 0, 255, cv2.NORM_MINMAX)
boosted = cv2.addWeighted(clahe_img, 1.0, cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR), 0.7, 0)

# 3) Unsharp mask (crisper edges)
print("Step 3: Unsharp mask for edge enhancement...")
soft = cv2.GaussianBlur(boosted, (0,0), 1.2)
sharp = cv2.addWeighted(boosted, 1.5, soft, -0.5, 0)

out_path = os.path.splitext(in_path)[0] + "_enhanced.jpg"
cv2.imwrite(out_path, sharp)
print(f"Saved enhanced image: {out_path}")

# Also save intermediate steps for comparison
cv2.imwrite("step1_illumination.jpg", illum)
cv2.imwrite("step2_tophat.jpg", boosted)
cv2.imwrite("step3_unsharp.jpg", sharp)

print("Enhancement complete! Intermediate steps saved for comparison.")
