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
  // Airplane detections (from best2.pt model)
  [key: string]: number; // Allow dynamic airplane class names
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
export const detectVehicles = async (imageFile: File, locationInfo?: { lat?: number; lng?: number; location?: string }): Promise<DetectionResults> => {
  console.log('API: Starting vehicle detection for file:', imageFile.name);
  
  const formData = new FormData();
  formData.append("file", imageFile);
  
  // Add location information if provided
  if (locationInfo?.lat && locationInfo?.lng) {
    formData.append("lat", locationInfo.lat.toString());
    formData.append("lng", locationInfo.lng.toString());
  } else if (locationInfo?.location) {
    formData.append("location", locationInfo.location);
  }

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
  location: string,
  imageUrl?: string
): Promise<LLMSummary> => {
  const response = await fetch(`${API_BASE_URL}/generate_llm_summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      detection_results: detectionResults,
      location: location,
      image_url: imageUrl
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`LLM summary generation failed: ${errorData.error || response.statusText}`);
  }

  return response.json();
};