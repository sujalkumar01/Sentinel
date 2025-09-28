import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DetectionResults {
  total_vehicles: number;
  vehicle_counts: {
    [key: string]: number;
  };
  detections: Array<{
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
  }>;
  visual_vehicle_counts?: {
    [key: string]: number;
  };
  message: string;
  location_tracking?: {
    location_id: string;
    timestamp: string;
    is_first_scan: boolean;
    changes?: {
      aircraft_diff: number;
      vehicles_diff: number;
      total_diff: number;
    };
    insights: string[];
  };
}

export interface AnalysisResult {
  id: string;
  imageUrl: string;
  detectionResults: DetectionResults;
  location: string;
  timestamp: string;
  fromAnalysis: boolean;
}

interface DetectionContextType {
  analysisResults: AnalysisResult | null;
  scanHistory: AnalysisResult[];
  addAnalysisResult: (result: Omit<AnalysisResult, 'id' | 'timestamp'>) => void;
  clearResults: () => void;
  getLatestResult: () => AnalysisResult | null;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (context === undefined) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};

interface DetectionProviderProps {
  children: ReactNode;
}

export const DetectionProvider: React.FC<DetectionProviderProps> = ({ children }) => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [scanHistory, setScanHistory] = useState<AnalysisResult[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedResults = localStorage.getItem('detection-results');
    const savedHistory = localStorage.getItem('detection-history');
    
    if (savedResults) {
      try {
        const parsed = JSON.parse(savedResults);
        setAnalysisResults(parsed);
      } catch (error) {
        console.error('Error parsing saved detection results:', error);
      }
    }
    
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setScanHistory(parsed);
      } catch (error) {
        console.error('Error parsing saved detection history:', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (analysisResults) {
      localStorage.setItem('detection-results', JSON.stringify(analysisResults));
    }
  }, [analysisResults]);

  useEffect(() => {
    if (scanHistory.length > 0) {
      localStorage.setItem('detection-history', JSON.stringify(scanHistory));
    }
  }, [scanHistory]);

  const addAnalysisResult = (result: Omit<AnalysisResult, 'id' | 'timestamp'>) => {
    const newResult: AnalysisResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setAnalysisResults(newResult);
    
    // Add to scan history (keep last 10 scans)
    setScanHistory(prev => {
      const updated = [newResult, ...prev].slice(0, 10);
      return updated;
    });
  };

  const clearResults = () => {
    setAnalysisResults(null);
    setScanHistory([]);
    localStorage.removeItem('detection-results');
    localStorage.removeItem('detection-history');
  };

  const getLatestResult = () => {
    return analysisResults;
  };

  const value: DetectionContextType = {
    analysisResults,
    scanHistory,
    addAnalysisResult,
    clearResults,
    getLatestResult,
  };

  return (
    <DetectionContext.Provider value={value}>
      {children}
    </DetectionContext.Provider>
  );
};
