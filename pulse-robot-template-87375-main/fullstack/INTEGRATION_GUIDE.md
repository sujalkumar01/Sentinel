# Vehicle Detection Model Integration Guide

This guide explains how the YOLO vehicle detection model is integrated with both the frontend and backend components of the SatelliteWatch application.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Python Model  │
│   (React/TS)    │◄──►│   (Node.js)     │◄──►│   (YOLO)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Model Output Format

The YOLO model returns detection results in the following format:

```typescript
interface DetectionResults {
  total_vehicles: number;
  vehicle_counts: {
    // Military vehicles (A1-A19)
    A1: number; A2: number; A3: number; ... A19: number;
    // Civilian vehicles
    SMV: number;  // Small Military Vehicle
    LMV: number;  // Large Military Vehicle
    AFV: number;  // Air Force Vehicle
    CV: number;   // Civilian Vehicle
    MCV: number;  // Military Civilian Vehicle
  };
  detections: Array<{
    class: string;
    confidence: number;
    bbox: [number, number, number, number]; // [xmin, ymin, xmax, ymax]
  }>;
  message: string;
}
```

## 🚀 Backend Integration

### Model Inference (`backend/model_inference.py`)

The Python script handles:
- Loading the YOLO model (`best.pt`)
- Processing base64 encoded images
- Running inference and returning structured results
- Error handling and logging

### API Endpoints (`backend/server.js`)

- `POST /detect` - Upload image and get vehicle detection results
- `POST /analyze_coords` - Analyze coordinates (future satellite integration)
- `POST /generate_llm_summary` - Generate AI analysis summary
- `GET /health` - Health check endpoint

### Key Features:
- ✅ Real YOLO model integration
- ✅ Base64 image processing
- ✅ Structured JSON responses
- ✅ Error handling and logging
- ✅ CORS support for frontend

## 🎨 Frontend Integration

### API Service (`src/services/api.ts`)

Handles communication with backend:
- Type-safe interfaces for model output
- Error handling and retry logic
- LLM summary generation

### Utility Functions (`src/utils/modelIntegration.ts`)

Helper functions for:
- Calculating military vs civilian vehicle counts
- Generating chart data
- Bounding box rendering
- Alert level determination

### UI Components

#### Results Page (`src/pages/Results.tsx`)
- Displays detection results with real bounding boxes
- Shows vehicle counts by category
- Real-time confidence scores

#### Analysis Page (`src/pages/Analysis.tsx`)
- Interactive charts showing vehicle trends
- AI-generated intelligence summaries
- Historical data visualization

#### Dashboard (`src/pages/Dashboard.tsx`)
- Overview of all detection results
- Performance metrics
- Alert system

## 🔄 Data Flow

1. **Image Upload**: User uploads image via frontend
2. **Backend Processing**: Node.js receives image and calls Python model
3. **Model Inference**: YOLO processes image and returns structured results
4. **Response Processing**: Backend formats results and sends to frontend
5. **UI Update**: Frontend displays results with bounding boxes and counts
6. **Analysis**: Optional LLM summary generation for intelligence reports

## 🧪 Testing

Run the integration test suite:

```bash
node test_integration.js
```

This will test:
- ✅ Python dependencies
- ✅ Model file availability
- ✅ Model inference functionality
- ✅ Backend server health
- ✅ Frontend build process

## 🚀 Getting Started

### Prerequisites

1. **Python Dependencies**:
   ```bash
   pip install torch ultralytics opencv-python pillow numpy
   ```

2. **Node.js Dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Model File**: Ensure `best.pt` is in the `backend/` directory

### Running the System

1. **Start Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend**:
   ```bash
   npm run dev
   ```

3. **Access Application**: Open `http://localhost:8080`

## 🔧 Configuration

### Environment Variables

Create `.env` file in root directory:

```env
VITE_BACKEND_API_URL=http://localhost:8002
VITE_FASTROUTER_API_KEY=your_fastrouter_key
VITE_FASTROUTER_API_URL=https://api.fastrouter.ai/v1
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Model Configuration

The model can be configured in `src/config/api.ts`:

```typescript
export const MODEL_CONFIG = {
  VEHICLE_CLASSES: {
    // Add custom vehicle class mappings
  },
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Error**:
   - Check if `best.pt` exists in `backend/` directory
   - Verify Python dependencies are installed
   - Check file permissions

2. **Backend Connection Error**:
   - Ensure backend is running on port 8002
   - Check CORS configuration
   - Verify API endpoints

3. **Frontend Build Error**:
   - Run `npm install` to install dependencies
   - Check TypeScript compilation errors
   - Verify environment variables

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm start

# Frontend
npm run dev -- --debug
```

## 📊 Performance Optimization

### Model Optimization
- Use GPU acceleration if available
- Implement model caching
- Optimize image preprocessing

### Frontend Optimization
- Implement image compression
- Add loading states
- Cache detection results

### Backend Optimization
- Add request queuing
- Implement result caching
- Add rate limiting

## 🔒 Security Considerations

- Validate image file types and sizes
- Implement authentication for API endpoints
- Sanitize user inputs
- Use HTTPS in production

## 📈 Monitoring

### Metrics to Track
- Detection accuracy
- Processing time
- API response times
- Error rates

### Logging
- Model inference logs
- API request/response logs
- Error tracking
- Performance metrics

## 🚀 Future Enhancements

- [ ] Real-time satellite image integration
- [ ] Batch processing capabilities
- [ ] Advanced analytics dashboard
- [ ] Mobile app integration
- [ ] Cloud deployment support

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Run the integration tests
3. Review the logs for error messages
4. Check the GitHub issues page

---

**Note**: This integration is designed to work with the specific YOLO model trained for vehicle detection. Ensure your model outputs match the expected format for proper integration.
