const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'base_records.json');

class LocationTracker {
  constructor() {
    this.db = this.loadDB();
  }

  loadDB() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    return {};
  }

  saveDB() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  generateLocationId(lat, lng, radius = 0.01) {
    // Round coordinates to create location zones
    const roundedLat = Math.round(lat / radius) * radius;
    const roundedLng = Math.round(lng / radius) * radius;
    return `base_${roundedLat.toFixed(3)}_${roundedLng.toFixed(3)}`;
  }

  extractPositions(detections) {
    return detections.map(detection => detection.bbox);
  }

  analyzeChanges(prevData, currData) {
    const changes = {
      aircraft_diff: currData.aircraft - prevData.aircraft,
      vehicles_diff: currData.vehicles - prevData.vehicles,
      total_diff: (currData.aircraft + currData.vehicles) - (prevData.aircraft + prevData.vehicles)
    };

    const insights = [];
    const timestamp = new Date().toLocaleString();

    // Aircraft analysis
    if (changes.aircraft_diff > 0) {
      insights.push(`🛩️ Aircraft increase (+${changes.aircraft_diff}) — Possible reinforcements or incoming mission detected.`);
    } else if (changes.aircraft_diff < 0) {
      insights.push(`✈️ Aircraft decrease (${changes.aircraft_diff}) — Possible deployment or patrol in progress.`);
    }

    // Vehicle analysis
    if (changes.vehicles_diff > 0) {
      insights.push(`🚗 Vehicle increase (+${changes.vehicles_diff}) — Troop movement or supply loading may be underway.`);
    } else if (changes.vehicles_diff < 0) {
      insights.push(`🚛 Vehicle decrease (${changes.vehicles_diff}) — Some vehicles may have departed the area.`);
    }

    // Overall activity analysis
    if (changes.total_diff > 5) {
      insights.push(`📈 Significant activity increase — Major operational changes detected.`);
    } else if (changes.total_diff < -5) {
      insights.push(`📉 Significant activity decrease — Possible mission completion or relocation.`);
    }

    // Stability analysis
    if (Math.abs(changes.aircraft_diff) <= 1 && Math.abs(changes.vehicles_diff) <= 2) {
      insights.push(`⚖️ Stable activity levels — No major changes detected, base status steady.`);
    }

    // Position analysis (simplified)
    if (prevData.aircraft_positions && currData.aircraft_positions) {
      const aircraftMovement = this.analyzePositionChanges(prevData.aircraft_positions, currData.aircraft_positions);
      if (aircraftMovement.significant) {
        insights.push(`🔄 Aircraft repositioning detected — ${aircraftMovement.description}`);
      }
    }

    if (prevData.vehicle_positions && currData.vehicle_positions) {
      const vehicleMovement = this.analyzePositionChanges(prevData.vehicle_positions, currData.vehicle_positions);
      if (vehicleMovement.significant) {
        insights.push(`🚗 Vehicle repositioning detected — ${vehicleMovement.description}`);
      }
    }

    if (insights.length === 0) {
      insights.push(`📊 No significant changes detected since last scan.`);
    }

    return {
      changes,
      insights,
      timestamp,
      isFirstScan: false
    };
  }

  analyzePositionChanges(prevPositions, currPositions) {
    // Simple position change analysis
    const prevCount = prevPositions.length;
    const currCount = currPositions.length;
    
    if (Math.abs(currCount - prevCount) > 0) {
      return {
        significant: true,
        description: `Position count changed from ${prevCount} to ${currCount}`
      };
    }

    // Could add more sophisticated position analysis here
    return {
      significant: false,
      description: 'No significant position changes'
    };
  }

  processDetection(locationId, timestamp, detectionResults) {
    const aircraftDetections = detectionResults.detections.filter(d => 
      d.class.startsWith('A') && ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19'].includes(d.class)
    );
    
    const vehicleDetections = detectionResults.detections.filter(d => 
      !d.class.startsWith('A') || !['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18', 'A19'].includes(d.class)
    );

    const currentData = {
      location_id: locationId,
      timestamp: timestamp,
      aircraft: aircraftDetections.length,
      vehicles: vehicleDetections.length,
      aircraft_positions: this.extractPositions(aircraftDetections),
      vehicle_positions: this.extractPositions(vehicleDetections),
      total_vehicles: detectionResults.total_vehicles,
      vehicle_counts: detectionResults.vehicle_counts
    };

    let analysisResult;

    if (locationId in this.db) {
      // Compare with previous data
      const prevData = this.db[locationId];
      analysisResult = this.analyzeChanges(prevData, currentData);
    } else {
      // First-time upload
      analysisResult = {
        changes: null,
        insights: [`📍 First scan of location ${locationId} — Baseline data established with ${currentData.aircraft} aircraft and ${currentData.vehicles} vehicles.`],
        timestamp: timestamp,
        isFirstScan: true
      };
    }

    // Store current data
    this.db[locationId] = currentData;
    this.saveDB();

    return {
      ...analysisResult,
      currentData,
      locationId
    };
  }

  getLocationHistory(locationId) {
    return this.db[locationId] || null;
  }

  getAllLocations() {
    return Object.keys(this.db);
  }

  getLocationStats() {
    const locations = Object.values(this.db);
    return {
      totalLocations: locations.length,
      totalScans: locations.length,
      latestScan: locations.length > 0 ? Math.max(...locations.map(l => new Date(l.timestamp).getTime())) : null
    };
  }
}

module.exports = LocationTracker;

