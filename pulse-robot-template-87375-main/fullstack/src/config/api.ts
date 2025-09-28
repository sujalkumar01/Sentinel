export const API_CONFIG = {
  // FastRouter API Configuration
  FASTROUTER_API_KEY: import.meta.env.VITE_FASTROUTER_API_KEY || "",
  FASTROUTER_API_URL: import.meta.env.VITE_FASTROUTER_API_URL || "https://go.fastrouter.ai/api/v1",
  
  // Backend API Configuration
  BACKEND_API_URL: import.meta.env.VITE_BACKEND_API_URL || "http://localhost:8003",
  
  // Google Maps API Configuration
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
};

// Model Configuration
export const MODEL_CONFIG = {
  VEHICLE_CLASSES: {
    cars: "Cars",
    trucks: "Trucks", 
    tanks: "Tanks",
    fighter_jets: "Fighter Jets",
    commercial_planes: "Commercial Planes",
  },
};