const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const PORT = 8002;

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true
}));
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Vehicle detection function with actual model inference
const detectVehicles = async (imageBuffer) => {
  console.log('Processing image with actual YOLO model...');
  
  return new Promise((resolve, reject) => {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Create a temporary file to store the image data
      const tempImagePath = path.join(__dirname, 'temp_image.jpg');
      
      // Write image buffer to temporary file
      fs.writeFileSync(tempImagePath, imageBuffer);
      
      // Run Python model inference script with file path instead of base64 data
      const pythonProcess = spawn('python', ['model_inference.py', tempImagePath], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      let output = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.log('Python stderr:', data.toString());
      });
      
      pythonProcess.on('close', (code) => {
        // Clean up temporary file
        try {
          if (fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath);
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }
        
        if (code !== 0) {
          console.error('Python process exited with code:', code);
          console.error('Error output:', errorOutput);
          reject(new Error(`Model inference failed with code ${code}: ${errorOutput}`));
          return;
        }
        
        try {
          const results = JSON.parse(output);
          console.log('Model detection results:', results);
          resolve(results);
        } catch (parseError) {
          console.error('Failed to parse model output:', parseError);
          console.error('Raw output:', output);
          reject(new Error('Failed to parse model results'));
        }
      });
      
      pythonProcess.on('error', (error) => {
        // Clean up temporary file on error
        try {
          if (fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath);
          }
        } catch (cleanupError) {
          console.warn('Failed to clean up temporary file:', cleanupError);
        }
        
        console.error('Failed to start Python process:', error);
        reject(new Error(`Failed to start model inference: ${error.message}`));
      });
      
    } catch (error) {
      console.error('Error in detectVehicles:', error);
      reject(error);
    }
  });
};

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: "Welcome to the SatelliteWatch Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      detect: "/detect",
      analyze_coords: "/analyze_coords",
      generate_llm_summary: "/generate_llm_summary"
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: "ok", 
    model_loaded: true,
    timestamp: new Date().toISOString()
  });
});

// Image upload and detection endpoint
app.post('/detect', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Processing image:', req.file.originalname);
    
    // Process the image (in real implementation, this would use your best.pt model)
    const detectionResults = await detectVehicles(req.file.buffer);
    
    res.json(detectionResults);
  } catch (error) {
    console.error('Detection error:', error);
    res.status(500).json({ error: 'Detection failed: ' + error.message });
  }
});

// Coordinate analysis endpoint
app.post('/analyze_coords', async (req, res) => {
  try {
    const { lat, lng } = req.body;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    console.log(`Analyzing coordinates: ${lat}, ${lng}`);
    
    // For coordinate analysis, we'll return mock data since we don't have actual satellite imagery
    // In a real implementation, you would fetch satellite imagery from Google Maps or similar service
    const mockResults = {
      total_vehicles: Math.floor(Math.random() * 20) + 5,
      vehicle_counts: {
        "A1": Math.floor(Math.random() * 3),
        "A2": Math.floor(Math.random() * 2),
        "A3": Math.floor(Math.random() * 2),
        "A4": Math.floor(Math.random() * 1),
        "A5": Math.floor(Math.random() * 1),
        "A6": 0, "A7": 0, "A8": 0, "A9": 0, "A10": 0,
        "A11": 0, "A12": 0, "A13": 0, "A14": 0, "A15": 0, "A16": 0, "A17": 0, "A18": 0, "A19": 0,
        "SMV": Math.floor(Math.random() * 8) + 2,
        "LMV": Math.floor(Math.random() * 5) + 1,
        "AFV": Math.floor(Math.random() * 2),
        "CV": Math.floor(Math.random() * 6) + 1,
        "MCV": Math.floor(Math.random() * 2)
      },
      detections: [],
      message: `Coordinate analysis completed for ${lat}, ${lng}. Note: This is mock data for demonstration purposes.`
    };
    
    res.json(mockResults);
  } catch (error) {
    console.error('Coordinate analysis error:', error);
    res.status(500).json({ error: 'Coordinate analysis failed: ' + error.message });
  }
});

// LLM Summary endpoint (for future FastRouter integration)
app.post('/generate_llm_summary', async (req, res) => {
  try {
    const { detection_results, location, prompt } = req.body;
    
    // Calculate military and civilian vehicle counts
    const militaryVehicles = Object.entries(detection_results.vehicle_counts)
      .filter(([key]) => key.startsWith('A'))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const civilianVehicles = ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
      .reduce((sum, key) => sum + (detection_results.vehicle_counts[key] || 0), 0);
    
    // Enhanced LLM response based on actual model output
    const mockSummary = `Intelligence Analysis Report for ${location}
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY:
Total vehicles detected: ${detection_results.total_vehicles}
- Military Vehicles (A1-A19): ${militaryVehicles}
- Civilian Vehicles (SMV, LMV, AFV, CV, MCV): ${civilianVehicles}

DETAILED BREAKDOWN:
Military Vehicle Categories:
${Object.entries(detection_results.vehicle_counts)
  .filter(([key]) => key.startsWith('A'))
  .map(([key, count]) => `- ${key}: ${count}`)
  .join('\n')}

Civilian Vehicle Categories:
- Small Military Vehicles (SMV): ${detection_results.vehicle_counts.SMV || 0}
- Large Military Vehicles (LMV): ${detection_results.vehicle_counts.LMV || 0}
- Air Force Vehicles (AFV): ${detection_results.vehicle_counts.AFV || 0}
- Civilian Vehicles (CV): ${detection_results.vehicle_counts.CV || 0}
- Military Civilian Vehicles (MCV): ${detection_results.vehicle_counts.MCV || 0}

DETECTION CONFIDENCE:
${detection_results.detections.length > 0 ? 
  `Average confidence: ${(detection_results.detections.reduce((sum, d) => sum + d.confidence, 0) / detection_results.detections.length * 100).toFixed(1)}%` :
  'No individual detections available'
}

ASSESSMENT:
${militaryVehicles > civilianVehicles ? 
  'High military presence detected. Monitor for potential security implications.' :
  militaryVehicles > 0 ? 
    'Mixed military and civilian activity. Normal operational patterns observed.' :
    'Primarily civilian activity. No immediate security concerns.'
}

RECOMMENDATIONS:
${militaryVehicles > 10 ? 
  '• High military vehicle concentration - consider increased monitoring\n• Verify vehicle types and operational status' :
  '• Continue routine monitoring\n• Schedule follow-up scan in 24-48 hours'
}`;

    res.json({ summary: mockSummary });
  } catch (error) {
    console.error('LLM summary error:', error);
    res.status(500).json({ error: 'LLM summary generation failed: ' + error.message });
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/detect`);
  console.log(`🤖 LLM endpoint: http://localhost:${PORT}/generate_llm_summary`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
  } else {
    console.error('❌ Server error:', error);
  }
  process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});
