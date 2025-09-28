# Model Files

This project uses YOLO model files for vehicle detection:

- `best.pt` (22.5 MB) - Primary YOLO model
- `best2.pt` (22.5 MB) - Secondary YOLO model

## Important Notes

1. **These files are excluded from Git** due to their large size (22MB each)
2. **Download separately** - Users need to obtain these model files separately
3. **Place in backend/ directory** - Model files should be placed in the `backend/` folder
4. **Required for functionality** - The application will not work without these model files

## How to Get Model Files

1. Train your own YOLO model using the Ultralytics library
2. Or contact the project maintainers for access to pre-trained models
3. Place the `.pt` files in the `backend/` directory

## File Structure

```
backend/
├── best.pt          # Primary model (excluded from Git)
├── best2.pt         # Secondary model (excluded from Git)
├── model_inference.py
└── server.js
```
