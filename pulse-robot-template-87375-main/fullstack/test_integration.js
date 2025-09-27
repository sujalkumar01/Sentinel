#!/usr/bin/env node

/**
 * Integration Test Script for Vehicle Detection Model
 * Tests the complete pipeline from backend to frontend
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting Integration Test for Vehicle Detection Model...\n');

// Test 1: Check if Python dependencies are available
console.log('1️⃣ Testing Python Dependencies...');
const testPythonDeps = () => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['-c', `
import sys
try:
    import torch
    import cv2
    import numpy as np
    from PIL import Image
    from ultralytics import YOLO
    print("✅ All Python dependencies available")
    print(f"PyTorch version: {torch.__version__}")
    print(f"OpenCV version: {cv2.__version__}")
    print(f"NumPy version: {np.__version__}")
    sys.exit(0)
except ImportError as e:
    print(f"❌ Missing dependency: {e}")
    sys.exit(1)
    `], { stdio: 'pipe' });
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(output);
        resolve(true);
      } else {
        console.log('❌ Python dependencies test failed');
        console.log(errorOutput);
        reject(new Error('Python dependencies missing'));
      }
    });
  });
};

// Test 2: Check if model file exists
console.log('\n2️⃣ Testing Model File...');
const testModelFile = () => {
  const modelPath = path.join(__dirname, 'backend', 'best.pt');
  if (fs.existsSync(modelPath)) {
    const stats = fs.statSync(modelPath);
    console.log(`✅ Model file found: ${modelPath}`);
    console.log(`   Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    return true;
  } else {
    console.log(`❌ Model file not found: ${modelPath}`);
    return false;
  }
};

// Test 3: Test model inference with sample data
console.log('\n3️⃣ Testing Model Inference...');
const testModelInference = () => {
  return new Promise((resolve, reject) => {
    // Create a simple test image (1x1 pixel)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const pythonProcess = spawn('python', ['model_inference.py', testImageData], {
      cwd: path.join(__dirname, 'backend'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          console.log('✅ Model inference test successful');
          console.log(`   Total vehicles: ${result.total_vehicles}`);
          console.log(`   Vehicle counts: ${JSON.stringify(result.vehicle_counts, null, 2)}`);
          console.log(`   Detections: ${result.detections.length}`);
          resolve(result);
        } catch (parseError) {
          console.log('❌ Failed to parse model output');
          console.log('Raw output:', output);
          reject(parseError);
        }
      } else {
        console.log('❌ Model inference test failed');
        console.log('Error output:', errorOutput);
        reject(new Error('Model inference failed'));
      }
    });
  });
};

// Test 4: Test backend server
console.log('\n4️⃣ Testing Backend Server...');
const testBackendServer = () => {
  return new Promise((resolve, reject) => {
    const serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let serverOutput = '';
    let serverError = '';
    
    serverProcess.stdout.on('data', (data) => {
      serverOutput += data.toString();
    });
    
    serverProcess.stderr.on('data', (data) => {
      serverError += data.toString();
    });
    
    // Wait for server to start
    setTimeout(async () => {
      try {
        // Test health endpoint
        const http = await import('http');
        const options = {
          hostname: 'localhost',
          port: 8002,
          path: '/health',
          method: 'GET'
        };
        
        const req = http.default.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          
          res.on('end', () => {
            try {
              const healthData = JSON.parse(data);
              console.log('✅ Backend server test successful');
              console.log(`   Status: ${healthData.status}`);
              console.log(`   Model loaded: ${healthData.model_loaded}`);
              serverProcess.kill();
              resolve(healthData);
            } catch (parseError) {
              console.log('❌ Failed to parse health response');
              serverProcess.kill();
              reject(parseError);
            }
          });
        });
        
        req.on('error', (error) => {
          console.log('❌ Backend server test failed');
          console.log('Error:', error.message);
          serverProcess.kill();
          reject(error);
        });
        
        req.end();
      } catch (error) {
        console.log('❌ Backend server test failed');
        console.log('Error:', error.message);
        serverProcess.kill();
        reject(error);
      }
    }, 3000);
  });
};

// Test 5: Test frontend build
console.log('\n5️⃣ Testing Frontend Build...');
const testFrontendBuild = () => {
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build'], {
      cwd: __dirname,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let buildOutput = '';
    let buildError = '';
    
    buildProcess.stdout.on('data', (data) => {
      buildOutput += data.toString();
    });
    
    buildProcess.stderr.on('data', (data) => {
      buildError += data.toString();
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend build test successful');
        resolve(true);
      } else {
        console.log('❌ Frontend build test failed');
        console.log('Build error:', buildError);
        reject(new Error('Frontend build failed'));
      }
    });
  });
};

// Run all tests
const runAllTests = async () => {
  try {
    console.log('🚀 Starting comprehensive integration tests...\n');
    
    // Test 1: Python dependencies
    await testPythonDeps();
    
    // Test 2: Model file
    if (!testModelFile()) {
      throw new Error('Model file not found');
    }
    
    // Test 3: Model inference
    const inferenceResult = await testModelInference();
    
    // Test 4: Backend server
    await testBackendServer();
    
    // Test 5: Frontend build
    await testFrontendBuild();
    
    console.log('\n🎉 All integration tests passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Python dependencies available');
    console.log('   ✅ Model file present');
    console.log('   ✅ Model inference working');
    console.log('   ✅ Backend server functional');
    console.log('   ✅ Frontend builds successfully');
    
    console.log('\n🚀 Your vehicle detection system is ready to use!');
    console.log('\nTo start the system:');
    console.log('   1. Backend: cd backend && npm start');
    console.log('   2. Frontend: npm run dev');
    
  } catch (error) {
    console.log('\n❌ Integration tests failed:');
    console.log(error.message);
    process.exit(1);
  }
};

// Run the tests
runAllTests();
