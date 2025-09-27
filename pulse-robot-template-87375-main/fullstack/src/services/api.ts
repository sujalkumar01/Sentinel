// API service for vehicle detection and LLM analysis
import { API_CONFIG } from '@/config/api';

const API_BASE_URL = API_CONFIG.BACKEND_API_URL;
const FASTROUTER_API_URL = API_CONFIG.FASTROUTER_API_URL;

export interface VehicleDetection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // [xmin, ymin, xmax, ymax]
}

export interface VehicleCounts {
  A1: number; A2: number; A3: number; A4: number; A5: number; A6: number; A7: number; A8: number; A9: number; A10: number;
  A11: number; A12: number; A13: number; A14: number; A15: number; A16: number; A17: number; A18: number; A19: number;
  SMV: number; LMV: number; AFV: number; CV: number; MCV: number;
  // Legacy support for old naming convention
  cars?: number;
  trucks?: number;
  tanks?: number;
  fighter_jets?: number;
  commercial_planes?: number;
}

export interface DetectionResults {
  total_vehicles: number;
  vehicle_counts: VehicleCounts;
  detections: VehicleDetection[];
  message: string;
}

export interface LLMSummary {
  summary: string;
}

// Check backend API health
export const checkAPIHealth = async (): Promise<{ status: string; model_loaded: boolean }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`API health check failed: ${response.statusText}`);
  }
  return response.json();
};

// Detect vehicles in an uploaded image
export const detectVehicles = async (imageFile: File): Promise<DetectionResults> => {
  console.log('API: Starting vehicle detection for file:', imageFile.name);
  
  const formData = new FormData();
  formData.append("file", imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/detect`, {
      method: "POST",
      body: formData,
    });

    console.log('API: Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Error response:', errorData);
      throw new Error(`Detection failed: ${errorData.detail || response.statusText}`);
    }

    const result = await response.json();
    console.log('API: Detection results received:', result);
    return result;
  } catch (error) {
    console.error('API: Network error:', error);
    throw error;
  }
};

// Analyze coordinates (backend would fetch image and run detection)
export const analyzeCoordinates = async (lat: number, lng: number): Promise<DetectionResults> => {
  const formData = new FormData();
  formData.append("lat", lat.toString());
  formData.append("lng", lng.toString());

  const response = await fetch(`${API_BASE_URL}/analyze_coords`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Coordinate analysis failed: ${errorData.detail || response.statusText}`);
  }

  return response.json();
};

// LLM Analysis API (FastRouter)
export const generateLLMSummary = async (
  detectionResults: DetectionResults,
  location: string
): Promise<LLMSummary> => {
  const apiKey = API_CONFIG.FASTROUTER_API_KEY;
  
  // Create a more detailed breakdown for the LLM
  const militaryVehicles = Object.entries(detectionResults.vehicle_counts)
    .filter(([key]) => key.startsWith('A'))
    .reduce((sum, [_, count]) => sum + count, 0);
  
  const civilianVehicles = ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
    .reduce((sum, key) => sum + (detectionResults.vehicle_counts[key] || 0), 0);
  
  const prompt = `Analyze the following vehicle detection results and provide an intelligence summary:

Location: ${location}
Total Vehicles Detected: ${detectionResults.total_vehicles}
Vehicle Breakdown:
- Military Vehicles (A1-A19): ${militaryVehicles}
- Civilian Vehicles (SMV, LMV, AFV, CV, MCV): ${civilianVehicles}
- Small Military Vehicles (SMV): ${detectionResults.vehicle_counts.SMV || 0}
- Large Military Vehicles (LMV): ${detectionResults.vehicle_counts.LMV || 0}
- Air Force Vehicles (AFV): ${detectionResults.vehicle_counts.AFV || 0}
- Civilian Vehicles (CV): ${detectionResults.vehicle_counts.CV || 0}
- Military Civilian Vehicles (MCV): ${detectionResults.vehicle_counts.MCV || 0}

Detailed Military Vehicle Counts:
${Object.entries(detectionResults.vehicle_counts)
  .filter(([key]) => key.startsWith('A'))
  .map(([key, count]) => `- ${key}: ${count}`)
  .join('\n')}

Provide a concise intelligence report, highlighting any significant observations or changes.
`;

  const formData = new FormData();
  formData.append("detection_results", JSON.stringify(detectionResults));
  formData.append("location", location);
  formData.append("prompt", prompt); // Pass prompt to backend

  const response = await fetch(`${API_BASE_URL}/generate_llm_summary`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`, // FastRouter API key
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`LLM summary generation failed: ${errorData.detail || response.statusText}`);
  }

  return response.json();
};