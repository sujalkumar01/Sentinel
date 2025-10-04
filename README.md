[README (1).md](https://github.com/user-attachments/files/22699337/README.1.md)
# 🛰️ SENTINEL - AI-Powered Vehicle Detection System


A full-stack application for detecting and analyzing vehicles in aerial/satellite imagery using advanced YOLO models and AI-powered intelligence summaries.

<img width="1268" height="1272" alt="image" src="https://github.com/user-attachments/assets/7772064c-f16f-4117-8460-e0ce0a5188af" />


## 🌟 Overview

Sentinel is an intelligent surveillance system designed for military and civilian applications that provides real-time vehicle detection and analysis from aerial imagery. The system combines cutting-edge computer vision with AI-powered intelligence reporting to deliver actionable insights for operational commanders.

## ✨ Key Features

- **🚁 Multi-Model Detection**: Uses dual YOLO models for comprehensive vehicle and aircraft detection
- **🛰️ Aerial Image Analysis**: Optimized for satellite and drone imagery
- **📊 Intelligence Reports**: AI-generated summaries with threat assessment and recommendations
- **🗺️ Interactive Mapping**: Global map interface with coordinate-based analysis
- **📱 Modern UI**: Responsive React-based interface with real-time processing
- **🔒 Secure Processing**: Local model inference with optional cloud intelligence

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Models     │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (YOLO)        │
│                 │    │                 │    │   best.pt        │
│                 │    │                 │    │   best2.pt      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```


### Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Sentinel-1
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd sentinel/fullstack
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   pip install -r requirements.txt
   ```

4. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd sentinel/fullstack/backend
   npm start

   # Terminal 2 - Frontend
   cd sentinel/fullstack
   npm run dev
   ```



## 🎯 Usage

### Image Upload Mode
1. Click "Image Upload" in the main interface
2. Upload an aerial/satellite image
3. Wait for AI processing and detection
4. Review the intelligence report and vehicle counts


## 🤖 AI Models

### Vehicle Detection Model (`best.pt`)
- **Purpose**: Ground vehicle detection
- **Classes**: Cars, Trucks, Tanks, AFVs, etc.


### Aircraft Detection Model (`best2.pt`)
- **Purpose**: Military and civilian aircraft detection
- **Classes**: Fighter jets, commercial planes, helicopters

## 📊 Intelligence Features

- **Real-time Processing**: Sub-second detection and analysis
- **Confidence Scoring**: AI confidence levels for each detection
- **Threat Assessment**: Automated threat level evaluation
- **Operational Reports**: Commander-ready intelligence summaries
- **Pattern Analysis**: Vehicle movement and activity patterns

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Radix UI** components
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **Python** for AI model inference
- **YOLO** (Ultralytics) for object detection
- **OpenCV** for image processing

### AI/ML
- **YOLOv8** models
- **PyTorch** framework
- **OpenCV** for image enhancement
- **FastRouter AI** for intelligence summaries

## 📁 Project Structure

```
Sentinel-1/
├── sentinel/
│   └── fullstack/
│       ├── backend/           # Node.js API server
│       │   ├── best.pt       # Vehicle detection model
│       │   ├── best2.pt      # Aircraft detection model
│       │   ├── model_inference.py
│       │   └── server.js
│       ├── src/              # React frontend
│       │   ├── components/   # UI components
│       │   ├── pages/        # Application pages
│       │   └── services/     # API services
│       └── public/           # Static assets
└── README.md
```

## 🚀 Deployment

### GitHub Pages (Recommended)
The project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages** in repository settings
2. **Push to master/main** branch - automatic deployment via GitHub Actions
3. **Access your app** at: `https://yourusername.github.io/Sentinel-1/`

### Manual Deployment
```bash
# Build for GitHub Pages
npm run build:gh-pages

# Deploy manually (requires gh-pages package)
npm run deploy
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

📖 **Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


**SENTINEL** - *Advanced Aerial Surveillance Intelligence System*

