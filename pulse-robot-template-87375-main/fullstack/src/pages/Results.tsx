import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { Search, Save, MapPin, Clock, Car, Truck, Shield, Plane, AlertTriangle, CheckCircle2 } from "lucide-react";
import { DetectionResults } from "@/services/api";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [detectionResults, setDetectionResults] = useState<DetectionResults | null>(null);
  const [scanLocation, setScanLocation] = useState<string>("");
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Get data from navigation state
  useEffect(() => {
    if (location.state?.imageUrl) {
      setCapturedImageUrl(location.state.imageUrl);
    }
    if (location.state?.detectionResults) {
      setDetectionResults(location.state.detectionResults);
    }
    if (location.state?.location) {
      setScanLocation(location.state.location);
    }
  }, [location.state]);

  // Handle image load to get actual dimensions
  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight
      });
    }
  };

  // Calculate the actual displayed image dimensions and offset
  const getImageDisplayInfo = () => {
    if (!imageRef.current || imageDimensions.width === 0) {
      return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
    }

    const container = imageRef.current.parentElement;
    if (!container) {
      return { scaleX: 1, scaleY: 1, offsetX: 0, offsetY: 0 };
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageAspectRatio = imageDimensions.width / imageDimensions.height;
    const containerAspectRatio = containerWidth / containerHeight;

    let displayedWidth, displayedHeight, offsetX, offsetY;

    if (imageAspectRatio > containerAspectRatio) {
      // Image is wider than container - fit to width
      displayedWidth = containerWidth;
      displayedHeight = containerWidth / imageAspectRatio;
      offsetX = 0;
      offsetY = (containerHeight - displayedHeight) / 2;
    } else {
      // Image is taller than container - fit to height
      displayedHeight = containerHeight;
      displayedWidth = containerHeight * imageAspectRatio;
      offsetX = (containerWidth - displayedWidth) / 2;
      offsetY = 0;
    }

    const scaleX = displayedWidth / imageDimensions.width;
    const scaleY = displayedHeight / imageDimensions.height;

    return { scaleX, scaleY, offsetX, offsetY };
  };

  // Use real detection results or fallback to mock data
  const scanData = detectionResults ? {
    location: scanLocation || "Unknown Location",
    coordinates: scanLocation.includes(',') ? scanLocation : "Coordinates not available",
    timestamp: new Date().toLocaleString(),
    image: capturedImageUrl || "/placeholder.svg",
    detections: {
      total: detectionResults.total_vehicles,
      // Calculate military and civilian vehicle counts
      military: Object.entries(detectionResults.vehicle_counts)
        .filter(([key]) => key.startsWith('A'))
        .reduce((sum, [_, count]) => sum + count, 0),
      civilian: ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
        .reduce((sum, key) => sum + (detectionResults.vehicle_counts[key] || 0), 0),
      // Individual vehicle counts
      SMV: detectionResults.vehicle_counts.SMV || 0,
      LMV: detectionResults.vehicle_counts.LMV || 0,
      AFV: detectionResults.vehicle_counts.AFV || 0,
      CV: detectionResults.vehicle_counts.CV || 0,
      MCV: detectionResults.vehicle_counts.MCV || 0,
      // Legacy support
      cars: detectionResults.vehicle_counts.cars || 0,
      trucks: detectionResults.vehicle_counts.trucks || 0,
      tanks: detectionResults.vehicle_counts.tanks || 0,
      fighter_jets: detectionResults.vehicle_counts.fighter_jets || 0,
      commercial_planes: detectionResults.vehicle_counts.commercial_planes || 0
    },
    alerts: [
      { type: "success", message: "Analysis completed successfully", icon: CheckCircle2 },
      { type: "info", message: `${detectionResults.total_vehicles} vehicles detected`, icon: AlertTriangle }
    ]
  } : {
    location: "No Data",
    coordinates: "N/A",
    timestamp: new Date().toLocaleString(),
    image: "/placeholder.svg",
    detections: {
      total: 0,
      military: 0,
      civilian: 0,
      SMV: 0,
      LMV: 0,
      AFV: 0,
      CV: 0,
      MCV: 0,
      cars: 0,
      trucks: 0,
      tanks: 0,
      fighter_jets: 0,
      commercial_planes: 0
    },
    alerts: [
      { type: "warning", message: "No detection data available", icon: AlertTriangle }
    ]
  };

  const handleDetailedAnalysis = () => {
    navigate("/analysis");
  };

  const handleSaveScan = () => {
    // Save scan logic would go here
    console.log("Scan saved");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchValue={searchValue} 
        onSearchChange={setSearchValue} 
        onSearch={() => {}} 
      />
      
      <main className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left side - Main image */}
            <div className="flex-1">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Satellite Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-muted rounded-lg overflow-hidden">
                    <img 
                      ref={imageRef}
                      src={capturedImageUrl || "/placeholder.svg"} 
                      alt="Satellite image with detections"
                      className="w-full h-auto max-h-96 object-contain"
                      onLoad={handleImageLoad}
                    />
                    {/* Real bounding boxes from detection results */}
                    {detectionResults && detectionResults.detections.map((detection, index) => {
                      const [xmin, ymin, xmax, ymax] = detection.bbox;
                      const width = xmax - xmin;
                      const height = ymax - ymin;
                      const confidence = Math.round(detection.confidence * 100);
                      
                      // Get proper scaling and offset for object-contain
                      const { scaleX, scaleY, offsetX, offsetY } = getImageDisplayInfo();
                      
                      return (
                        <div
                          key={index}
                          className="absolute border-2 border-primary bg-primary/20"
                          style={{
                            left: `${offsetX + (xmin * scaleX)}px`,
                            top: `${offsetY + (ymin * scaleY)}px`,
                            width: `${width * scaleX}px`,
                            height: `${height * scaleY}px`,
                          }}
                        >
                          <div className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-1 rounded">
                            {detection.class.toUpperCase()} {confidence}%
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Analysis panel */}
            <div className="lg:w-96 space-y-6">
              
              {/* Summary section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">{scanData.location}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{scanData.coordinates}</div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{scanData.timestamp}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Counts section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Detection Counts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{scanData.detections.total}</div>
                    <div className="text-sm text-muted-foreground">Total Objects</div>
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="space-y-3">
                    {/* Military Vehicles Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-warning" />
                        <span className="text-sm text-foreground">Military (A1-A19)</span>
                      </div>
                      <Badge variant="secondary">{scanData.detections.military}</Badge>
                    </div>
                    
                    {/* Civilian Vehicles Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Civilian</span>
                      </div>
                      <Badge variant="secondary">{scanData.detections.civilian}</Badge>
                    </div>
                    
                    <Separator className="bg-border" />
                    
                    {/* Individual Vehicle Types */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">Vehicle Breakdown:</div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-3 h-3 text-primary" />
                          <span className="text-xs text-foreground">SMV</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{scanData.detections.SMV}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Truck className="w-3 h-3 text-accent" />
                          <span className="text-xs text-foreground">LMV</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{scanData.detections.LMV}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plane className="w-3 h-3 text-info" />
                          <span className="text-xs text-foreground">AFV</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{scanData.detections.AFV}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Car className="w-3 h-3 text-accent" />
                          <span className="text-xs text-foreground">CV</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{scanData.detections.CV}</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-warning" />
                          <span className="text-xs text-foreground">MCV</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{scanData.detections.MCV}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts section */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {scanData.alerts.map((alert, index) => {
                    const IconComponent = alert.icon;
                    const colorClass = alert.type === 'warning' ? 'text-warning' : 'text-success';
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                        <IconComponent className={`w-5 h-5 ${colorClass}`} />
                        <span className="text-sm text-foreground">{alert.message}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Action buttons */}
              <div className="space-y-3">
                <Button 
                  onClick={handleDetailedAnalysis}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Detailed Analysis
                </Button>
                
                <Button 
                  onClick={handleSaveScan}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;