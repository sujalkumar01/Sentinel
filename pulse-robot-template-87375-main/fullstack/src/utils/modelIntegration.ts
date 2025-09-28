// Utility functions for integrating model output with frontend components

import { DetectionResults, VehicleCounts } from '@/services/api';

/**
 * Calculate military vehicle count from model output
 */
export const getMilitaryVehicleCount = (vehicleCounts: VehicleCounts): number => {
  return Object.entries(vehicleCounts)
    .filter(([key]) => key.startsWith('A'))
    .reduce((sum, [_, count]) => sum + count, 0);
};

/**
 * Calculate civilian vehicle count from model output
 */
export const getCivilianVehicleCount = (vehicleCounts: VehicleCounts): number => {
  return ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
    .reduce((sum, key) => sum + (vehicleCounts[key] || 0), 0);
};

/**
 * Calculate airplane count from model output
 */
export const getAirplaneCount = (vehicleCounts: VehicleCounts): number => {
  // Get all keys that are not military vehicles (A1-A19) or civilian vehicles
  const militaryKeys = Array.from({length: 19}, (_, i) => `A${i+1}`);
  const civilianKeys = ['SMV', 'LMV', 'AFV', 'CV', 'MCV'];
  const knownKeys = [...militaryKeys, ...civilianKeys];
  
  return Object.entries(vehicleCounts)
    .filter(([key]) => !knownKeys.includes(key))
    .reduce((sum, [_, count]) => sum + count, 0);
};

/**
 * Get vehicle breakdown for display
 */
export const getVehicleBreakdown = (detectionResults: DetectionResults) => {
  const military = getMilitaryVehicleCount(detectionResults.vehicle_counts);
  const civilian = getCivilianVehicleCount(detectionResults.vehicle_counts);
  const airplanes = getAirplaneCount(detectionResults.vehicle_counts);
  
  // Calculate actual total from individual counts to ensure accuracy
  const calculatedTotal = military + civilian + airplanes;
  
  return {
    total: calculatedTotal, // Use calculated total instead of model's total_vehicles
    military,
    civilian,
    airplanes,
    breakdown: {
      SMV: detectionResults.vehicle_counts.SMV || 0,
      LMV: detectionResults.vehicle_counts.LMV || 0,
      AFV: detectionResults.vehicle_counts.AFV || 0,
      CV: detectionResults.vehicle_counts.CV || 0,
      MCV: detectionResults.vehicle_counts.MCV || 0,
    },
    militaryBreakdown: Object.entries(detectionResults.vehicle_counts)
      .filter(([key]) => key.startsWith('A'))
      .reduce((acc, [key, count]) => {
        acc[key] = count;
        return acc;
      }, {} as Record<string, number>),
    airplaneBreakdown: Object.entries(detectionResults.vehicle_counts)
      .filter(([key]) => {
        const militaryKeys = Array.from({length: 19}, (_, i) => `A${i+1}`);
        const civilianKeys = ['SMV', 'LMV', 'AFV', 'CV', 'MCV'];
        return !militaryKeys.includes(key) && !civilianKeys.includes(key);
      })
      .reduce((acc, [key, count]) => {
        acc[key] = count;
        return acc;
      }, {} as Record<string, number>)
  };
};

/**
 * Generate chart data from detection results
 */
export const generateChartData = (detectionResults: DetectionResults, date: string) => {
  const breakdown = getVehicleBreakdown(detectionResults);
  
  return {
    date,
    total: breakdown.total,
    military: breakdown.military,
    civilian: breakdown.civilian,
    SMV: breakdown.breakdown.SMV,
    LMV: breakdown.breakdown.LMV,
    AFV: breakdown.breakdown.AFV,
    CV: breakdown.breakdown.CV,
    MCV: breakdown.breakdown.MCV,
  };
};

/**
 * Calculate average confidence from detections
 */
export const getAverageConfidence = (detectionResults: DetectionResults): number => {
  if (detectionResults.detections.length === 0) return 0;
  
  const totalConfidence = detectionResults.detections.reduce(
    (sum, detection) => sum + detection.confidence, 
    0
  );
  
  return Math.round((totalConfidence / detectionResults.detections.length) * 100) / 100;
};

/**
 * Generate bounding box styles for rendering on images
 */
export const generateBoundingBoxStyles = (
  detection: { bbox: [number, number, number, number]; class: string; confidence: number },
  imageWidth: number = 800,
  imageHeight: number = 600
) => {
  const [xmin, ymin, xmax, ymax] = detection.bbox;
  const width = xmax - xmin;
  const height = ymax - ymin;
  
  return {
    left: `${(xmin / imageWidth) * 100}%`,
    top: `${(ymin / imageHeight) * 100}%`,
    width: `${(width / imageWidth) * 100}%`,
    height: `${(height / imageHeight) * 100}%`,
  };
};

/**
 * Get vehicle class display name
 */
export const getVehicleClassDisplayName = (vehicleClass: string): string => {
  const displayNames: Record<string, string> = {
    'SMV': 'Small Military Vehicle',
    'LMV': 'Large Military Vehicle', 
    'AFV': 'Air Force Vehicle',
    'CV': 'Civilian Vehicle',
    'MCV': 'Military Civilian Vehicle',
  };
  
  if (vehicleClass.startsWith('A')) {
    return `Military Vehicle ${vehicleClass}`;
  }
  
  return displayNames[vehicleClass] || vehicleClass;
};

/**
 * Determine alert level based on detection results
 */
export const getAlertLevel = (detectionResults: DetectionResults): 'low' | 'medium' | 'high' => {
  const breakdown = getVehicleBreakdown(detectionResults);
  const militaryRatio = breakdown.military / breakdown.total;
  
  if (militaryRatio > 0.5) return 'high';
  if (militaryRatio > 0.2) return 'medium';
  return 'low';
};
