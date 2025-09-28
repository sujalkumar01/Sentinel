import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Globe from "@/components/Globe";
import ProcessingOverlay from "@/components/ProcessingOverlay";
import { Upload, Target, Camera, MapPin, AlertCircle } from "lucide-react";
import { detectVehicles, analyzeCoordinates, checkAPIHealth } from "@/services/api";
import { API_CONFIG } from "@/config/api";
import { useDetection } from "@/contexts/DetectionContext";

const GlobalMap = () => {
  const navigate = useNavigate();
  const { addAnalysisResult } = useDetection();
  const [searchLocation, setSearchLocation] = useState("");
  const [isUploadMode, setIsUploadMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [coordinates, setCoordinates] = useState("");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isValidCoordinates, setIsValidCoordinates] = useState(false);
  const [coordinateError, setCoordinateError] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Google Maps Static API key
  const GOOGLE_MAPS_API_KEY = API_CONFIG.GOOGLE_MAPS_API_KEY;

  // Validate coordinates format
  const validateCoordinates = (coordString: string): {lat: number, lng: number} | null => {
    const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    if (!coordPattern.test(coordString.trim())) {
      return null;
    }
    
    const [latStr, lngStr] = coordString.split(',').map(s => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return null;
    }
    
    return { lat, lng };
  };

  // Capture image from Google Maps Static API
  const captureMapImage = async (lat: number, lng: number): Promise<string> => {
    // For demo purposes, if no API key is provided, return a placeholder
    if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
      console.log(`Demo mode: Would capture image for coordinates ${lat}, ${lng}`);
      // Return a placeholder image URL for demo
      return "/placeholder.svg";
    }
    
    const size = "1280x720"; // 16:9 aspect ratio
    const zoom = 18; // High zoom level for detailed satellite view
    const mapType = "satellite";
    
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${size}&maptype=${mapType}&key=${GOOGLE_MAPS_API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch map image');
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error capturing map image:', error);
      throw error;
    }
  };

  // Handle coordinate input change
  const handleCoordinateChange = (value: string) => {
    setCoordinates(value);
    setCoordinateError("");
    
    if (value.trim()) {
      const coords = validateCoordinates(value);
      if (coords) {
        setIsValidCoordinates(true);
        setCurrentLocation(coords);
      } else {
        setIsValidCoordinates(false);
        setCoordinateError("Invalid coordinates format. Use: lat, lng (e.g., 28.6139, 77.2090)");
      }
    } else {
      setIsValidCoordinates(false);
      setCurrentLocation(null);
    }
  };

  // Handle location search
  const handleLocationSearch = async () => {
    if (!searchLocation.trim()) return;
    
    // For demo purposes, we'll use a simple geocoding approach
    // In a real app, you'd use Google Geocoding API
    const mockLocations: {[key: string]: {lat: number, lng: number}} = {
      "delhi airport": { lat: 28.5562, lng: 77.1000 },
      "mumbai port": { lat: 19.0760, lng: 72.8777 },
      "chennai base": { lat: 13.0827, lng: 80.2707 },
      "bangalore tech": { lat: 12.9716, lng: 77.5946 },
      "kolkata docks": { lat: 22.5726, lng: 88.3639 }
    };
    
    const location = mockLocations[searchLocation.toLowerCase()];
    if (location) {
      setCurrentLocation(location);
      setCoordinates(`${location.lat}, ${location.lng}`);
      setIsValidCoordinates(true);
      setCoordinateError("");
    } else {
      setCoordinateError("Location not found. Please enter coordinates manually.");
    }
  };

  const handleCapture = async () => {
    if (!isValidCoordinates && !uploadedFile) {
      setCoordinateError("Please enter valid coordinates or upload an image");
      return;
    }

    setIsProcessing(true);
    
    try {
      let imageUrl: string;
      let detectionResults;
      
      if (isValidCoordinates && currentLocation) {
        // Capture from Google Maps and analyze coordinates
        imageUrl = await captureMapImage(currentLocation.lat, currentLocation.lng);
        setCapturedImage(imageUrl);
        
        // Analyze coordinates with your model
        detectionResults = await analyzeCoordinates(currentLocation.lat, currentLocation.lng);
      } else if (uploadedFile) {
        // Use uploaded file and detect vehicles
        imageUrl = URL.createObjectURL(uploadedFile);
        setCapturedImage(imageUrl);
        
        // Detect vehicles in uploaded image
        detectionResults = await detectVehicles(uploadedFile, { location: 'Uploaded Image' });
      }
      
      // Store results in context and navigate to dashboard
      setTimeout(() => {
        setIsProcessing(false);
        
        // Store in context for persistent access
        addAnalysisResult({
          imageUrl: capturedImage || imageUrl,
          detectionResults: detectionResults,
          location: isValidCoordinates ? `${currentLocation?.lat}, ${currentLocation?.lng}` : 'Uploaded Image',
          fromAnalysis: true
        });
        
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error('Error during capture:', error);
      setCoordinateError("Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedFile) return;
    console.log('Starting image analysis...');
    setIsProcessing(true);
    
    try {
      const imageUrl = URL.createObjectURL(uploadedFile);
      setCapturedImage(imageUrl);
      console.log('Image URL created:', imageUrl);
      
      // Detect vehicles in uploaded image
      console.log('Calling detectVehicles API...');
      const detectionResults = await detectVehicles(uploadedFile, { location: 'Uploaded Image' });
      console.log('Detection results received:', detectionResults);
      console.log('Total vehicles detected:', detectionResults.total_vehicles);
      console.log('Vehicle counts:', detectionResults.vehicle_counts);
      console.log('Detections array:', detectionResults.detections);
      
      setTimeout(() => {
        console.log('Redirecting to results with detection data...');
        setIsProcessing(false);
        
        // Store in context for persistent access
        addAnalysisResult({
          imageUrl,
          detectionResults,
          location: 'Uploaded Image',
          fromAnalysis: true
        });
        
        navigate("/results");
      }, 3000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchValue={searchLocation} onSearchChange={setSearchLocation} onSearch={handleLocationSearch} />
      
      <main className="relative h-screen pt-16 overflow-hidden">
        {/* Mode Toggle */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
          <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌍</span>
                  <span className="text-sm font-medium text-foreground">Map Mode</span>
                </div>
                <Switch
                  checked={isUploadMode}
                  onCheckedChange={setIsUploadMode}
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  <span className="text-sm font-medium text-foreground">Image Upload</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coordinate Input for Globe Mode */}
        {!isUploadMode && (
          <div className="absolute top-20 right-6 z-20">
            <Card className="bg-card/80 backdrop-blur-sm w-80">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Enter Coordinates</span>
                </div>
                <Input
                  placeholder="e.g., 28.6139, 77.2090"
                  value={coordinates}
                  onChange={(e) => handleCoordinateChange(e.target.value)}
                  className="bg-input border-border text-foreground"
                />
                {coordinateError && (
                  <Alert className="bg-destructive/10 border-destructive/20">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive text-xs">
                      {coordinateError}
                    </AlertDescription>
                  </Alert>
                )}
                {isValidCoordinates && (
                  <div className="flex items-center gap-2 text-success text-xs">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Valid coordinates: {coordinates}
                  </div>
                )}
                {GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY" && (
                  <div className="flex items-center gap-2 text-warning text-xs">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    Demo mode - Add Google Maps API key for real images
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Globe Component */}
        <div className={`transition-all duration-500 ${isUploadMode ? 'hidden' : ''}`}>
          <Globe />
        </div>

        {/* Globe Mode Controls */}
        {!isUploadMode && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <Button
              onClick={handleCapture}
              disabled={!isValidCoordinates}
              size="lg"
              className={`shadow-lg px-8 py-4 text-lg ${
                isValidCoordinates 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              <Camera className="w-6 h-6 mr-2" />
              {isValidCoordinates ? "Capture & Analyze" : "Enter Coordinates First"}
            </Button>
          </div>
        )}

        {/* Upload Mode Controls */}
        {isUploadMode && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pt-12">
            <Card className="w-full max-w-lg bg-card border-2 border-primary/20">
              <CardContent className="p-8 space-y-6">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Upload Image for Analysis
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Upload any aerial/satellite image to detect vehicles using AI
                  </p>
                </div>

                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-primary/5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-muted-foreground">
                      {uploadedFile ? (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                            <Camera className="w-8 h-8 text-success" />
                          </div>
                          <Badge variant="secondary" className="text-success bg-success/20">
                            {uploadedFile.name}
                          </Badge>
                          <p className="text-xs text-success">Click to change file</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <p className="text-sm font-medium">Click to upload or drag and drop</p>
                          <p className="text-xs">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Location (optional)
                  </label>
                  <Input
                    placeholder="e.g., Delhi Airport, Mumbai Port"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>

                <Button
                  onClick={handleAnalyzeImage}
                  disabled={!uploadedFile || isProcessing}
                  className={`w-full ${
                    uploadedFile && !isProcessing
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      {uploadedFile ? "Analyze with AI Model" : "Upload Image First"}
                    </>
                  )}
                </Button>

                {uploadedFile && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Your image will be processed by the AI model to detect vehicles
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {isProcessing && <ProcessingOverlay />}
    </div>
  );
};

export default GlobalMap;
