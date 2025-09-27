# SatelliteWatch Setup Guide

## Backend Setup (Python FastAPI)

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Place your model file:**
   - Copy `best.pt` to the `backend/` directory

3. **Set up environment variables:**
   - Create a `.env` file in the backend directory with:
   ```
   FASTROUTER_API_KEY=your_fastrouter_api_key_here
   ```

4. **Start the backend:**
   ```bash
   # Windows
   start_backend.bat
   
   # Or manually
   cd backend
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

## Frontend Setup (React + Vite)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Create a `.env` file in the root directory with:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyBj1dPeorJoI49RuUABA8YNggkem6n5n58
   VITE_FASTROUTER_API_KEY=your_fastrouter_api_key_here
   VITE_BACKEND_API_URL=http://localhost:8000
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Usage

1. **Upload Mode:** Switch to upload mode and upload a satellite/aerial image
2. **Globe Mode:** Enter coordinates and capture from Google Maps
3. **Results:** View detection results and AI analysis
4. **Dashboard:** See overview of all scans

## Features

- ✅ Image upload and analysis
- ✅ Coordinate-based image capture (Google Maps)
- ✅ YOLO vehicle detection
- ✅ AI-powered intelligence summaries
- ✅ Real-time processing overlay
- ✅ Modern UI with dark theme