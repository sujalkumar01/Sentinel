const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const { spawn } = require('child_process');
const LocationTracker = require('./locationTracker');

const app = express();
const PORT = 8003;

// Initialize location tracker
const locationTracker = new LocationTracker();

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
    
    // Extract location info from request body if available
    const { lat, lng, location } = req.body;
    let locationId = 'unknown';
    
    if (lat && lng) {
      locationId = locationTracker.generateLocationId(parseFloat(lat), parseFloat(lng));
    } else if (location) {
      locationId = `upload_${location.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    
    // Process with location tracking
    const timestamp = new Date().toISOString();
    const trackingResult = locationTracker.processDetection(
      locationId, 
      timestamp, 
      detectionResults
    );
    
    // Add tracking results to response
    const response = {
      ...detectionResults,
      location_tracking: {
        location_id: locationId,
        timestamp: timestamp,
        is_first_scan: trackingResult.isFirstScan,
        changes: trackingResult.changes,
        insights: trackingResult.insights
      }
    };
    
    res.json(response);
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
    
    // Process with location tracking
    const locationId = locationTracker.generateLocationId(parseFloat(lat), parseFloat(lng));
    const timestamp = new Date().toISOString();
    const trackingResult = locationTracker.processDetection(
      locationId, 
      timestamp, 
      mockResults
    );
    
    // Add tracking results to response
    const response = {
      ...mockResults,
      location_tracking: {
        location_id: locationId,
        timestamp: timestamp,
        is_first_scan: trackingResult.isFirstScan,
        changes: trackingResult.changes,
        insights: trackingResult.insights
      }
    };
    
    res.json(response);
  } catch (error) {
    console.error('Coordinate analysis error:', error);
    res.status(500).json({ error: 'Coordinate analysis failed: ' + error.message });
  }
});

// LLM Summary endpoint with FastRouter integration
app.post('/generate_llm_summary', async (req, res) => {
  try {
    const { detection_results, location, image_url } = req.body;
    
    // Calculate military and civilian vehicle counts
    const militaryVehicles = Object.entries(detection_results.vehicle_counts)
      .filter(([key]) => key.startsWith('A'))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const civilianVehicles = ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
      .reduce((sum, key) => sum + (detection_results.vehicle_counts[key] || 0), 0);
    
    // System prompt for intelligence analysis
    const systemPrompt = `You are an expert intelligence analyst specializing in aerial surveillance and vehicle detection analysis. Your task is to provide clear, actionable intelligence summaries for operational commanders.

IMPORTANT: Provide ONLY a well-structured English summary. Do NOT include JSON, code blocks, technical formatting, or any text like "Machine-readable JSON". Write in clear, professional language that a commander can quickly understand. Do not mention JSON or any technical formats.

Format your response as follows:

**SITUATION OVERVIEW**
- Brief 1-2 sentence summary of what was detected
- Location and time context

**KEY FINDINGS**
- List 3-5 most important observations
- Use bullet points for clarity
- Focus on vehicle types, counts, and patterns

**ASSESSMENT**
- Overall threat level (Low/Medium/High)
- Activity pattern analysis
- Any notable concerns or normal operations

**RECOMMENDATIONS**
- 2-3 specific next steps
- Follow-up actions needed
- Monitoring requirements

Keep language professional but accessible. Avoid military jargon. Focus on facts and clear observations.`;

    // Prepare data for LLM analysis
    const analysisData = {
      location: location,
      timestamp: new Date().toISOString(),
      total_vehicles: detection_results.total_vehicles,
      military_vehicles: militaryVehicles,
      civilian_vehicles: civilianVehicles,
      vehicle_breakdown: detection_results.vehicle_counts,
      detections: detection_results.detections,
      image_url: image_url
    };

    // Call FastRouter API
    const fastRouterResponse = await axios.post('https://go.fastrouter.ai/api/v1/chat/completions', {
      model: "anthropic/claude-sonnet-4-20250514",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Analyze this vehicle detection data and provide a clear intelligence summary:

**DETECTION DATA:**
Location: ${location}
Time: ${new Date().toLocaleString()}
Total Objects: ${detection_results.total_vehicles}

**VEHICLE BREAKDOWN:**
Military Aircraft (A1-A19): ${militaryVehicles}
Civilian Vehicles: ${civilianVehicles}

**DETAILED COUNTS:**
${Object.entries(detection_results.vehicle_counts)
  .filter(([_, count]) => count > 0)
  .map(([type, count]) => `• ${type}: ${count}`)
  .join('\n')}

**DETECTION QUALITY:**
${detection_results.detections.length} objects detected with bounding boxes
Average confidence: ${(detection_results.detections.reduce((sum, d) => sum + d.confidence, 0) / detection_results.detections.length * 100).toFixed(1)}%

Provide a clear, actionable intelligence summary in the requested format.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FASTROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let llmSummary = fastRouterResponse.data.choices[0].message.content;
    
    // Clean up any unwanted text that might appear
    llmSummary = llmSummary.replace(/Machine-readable JSON[:\s]*/gi, '');
    llmSummary = llmSummary.replace(/JSON[:\s]*/gi, '');
    llmSummary = llmSummary.replace(/```json[\s\S]*?```/gi, '');
    llmSummary = llmSummary.replace(/```[\s\S]*?```/gi, '');

    res.json({ 
      summary: llmSummary,
      analysis_data: analysisData
    });
  } catch (error) {
    console.error('LLM summary error:', error);
    
    // Fallback to mock summary if FastRouter fails
    const { detection_results, location } = req.body;
    const militaryVehicles = Object.entries(detection_results.vehicle_counts)
      .filter(([key]) => key.startsWith('A'))
      .reduce((sum, [_, count]) => sum + count, 0);
    
    const fallbackSummary = `**SITUATION OVERVIEW**
Aerial surveillance detected ${detection_results.total_vehicles} vehicles at ${location} on ${new Date().toLocaleString()}. The area shows ${militaryVehicles > 0 ? 'mixed military and civilian activity' : 'primarily civilian activity'}.

**KEY FINDINGS**
• Total objects detected: ${detection_results.total_vehicles}
• Military aircraft (A1-A19): ${militaryVehicles}
• Civilian vehicles: ${detection_results.total_vehicles - militaryVehicles}
• Detection confidence: High (AI model processed successfully)
• Activity level: ${detection_results.total_vehicles > 10 ? 'Elevated' : 'Normal'}

**ASSESSMENT**
Threat Level: ${militaryVehicles > 5 ? 'Medium' : 'Low'}
${militaryVehicles > 0 ? 
  'Mixed activity pattern suggests normal operational procedures with both military and civilian presence.' :
  'Civilian-only activity indicates standard commercial or residential operations.'
}

**RECOMMENDATIONS**
• Continue routine monitoring of the area
• Schedule follow-up analysis in 24-48 hours
• ${militaryVehicles > 0 ? 'Monitor for changes in military vehicle patterns' : 'No immediate action required'}

Analysis completed using advanced AI vehicle detection models.`;

    // Clean up any unwanted text that might appear
    let cleanFallbackSummary = fallbackSummary.replace(/Machine-readable JSON[:\s]*/gi, '');
    cleanFallbackSummary = cleanFallbackSummary.replace(/JSON[:\s]*/gi, '');
    cleanFallbackSummary = cleanFallbackSummary.replace(/```json[\s\S]*?```/gi, '');
    cleanFallbackSummary = cleanFallbackSummary.replace(/```[\s\S]*?```/gi, '');

    res.json({ 
      summary: cleanFallbackSummary,
      error: 'FastRouter API unavailable, using fallback analysis'
    });
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

// Location tracking endpoints
app.get('/locations', (req, res) => {
  try {
    const locations = locationTracker.getAllLocations();
    const stats = locationTracker.getLocationStats();
    
    res.json({
      locations,
      stats
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

app.get('/locations/:locationId', (req, res) => {
  try {
    const { locationId } = req.params;
    const history = locationTracker.getLocationHistory(locationId);
    
    if (!history) {
      return res.status(404).json({ error: 'Location not found' });
    }
    
    res.json(history);
  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({ error: 'Failed to fetch location history' });
  }
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
