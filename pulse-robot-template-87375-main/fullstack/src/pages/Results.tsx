import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import { Search, Save, MapPin, Clock, Car, Truck, Shield, Plane, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { getVehicleBreakdown } from "@/utils/modelIntegration";
import { generateLLMSummary } from "@/services/api";
import { useDetection } from "@/contexts/DetectionContext";

const Results = () => {
  const navigate = useNavigate();
  const { analysisResults } = useDetection();
  const [searchValue, setSearchValue] = useState("");
  const [llmSummary, setLlmSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Get data from context
  const capturedImageUrl = analysisResults?.imageUrl || null;
  const detectionResults = analysisResults?.detectionResults || null;
  const scanLocation = analysisResults?.location || "";

  // Generate LLM summary when detection results are available
  useEffect(() => {
    if (detectionResults && scanLocation && !llmSummary) {
      generateIntelligenceSummary();
    }
  }, [detectionResults, scanLocation, llmSummary]);

  const generateIntelligenceSummary = async () => {
    if (!detectionResults || !scanLocation) return;
    
    setIsGeneratingSummary(true);
    try {
      const summary = await generateLLMSummary(
        detectionResults, 
        scanLocation, 
        capturedImageUrl || undefined
      );
      setLlmSummary(summary.summary);
    } catch (error) {
      console.error('Failed to generate LLM summary:', error);
      setLlmSummary("Intelligence analysis unavailable. Please try again later.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

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

  // Calculate vehicle breakdown once to avoid multiple calculations
  const vehicleBreakdown = detectionResults ? getVehicleBreakdown(detectionResults) : null;

  // Filter detections to only show visible ones (same filter as in rendering)
  const visibleDetections = detectionResults ? detectionResults.detections.filter((detection) => {
    const [xmin, ymin, xmax, ymax] = detection.bbox;
    const width = xmax - xmin;
    const height = ymax - ymin;
    return width > 5 && height > 5 && xmin >= 0 && ymin >= 0 && xmax > xmin && ymax > ymin;
  }) : [];

  // Use visual detections count for display (matches bounding boxes)
  const displayCount = visibleDetections.length;

  // Use real detection results or fallback to mock data
  const scanData = detectionResults ? {
    location: scanLocation || "Unknown Location",
    coordinates: scanLocation.includes(',') ? scanLocation : "Coordinates not available",
    timestamp: new Date().toLocaleString(),
    image: capturedImageUrl || "/placeholder.svg",
    detections: {
      ...vehicleBreakdown,
      // Legacy support
      cars: detectionResults.vehicle_counts.cars || 0,
      trucks: detectionResults.vehicle_counts.trucks || 0,
      tanks: detectionResults.vehicle_counts.tanks || 0,
      fighter_jets: detectionResults.vehicle_counts.fighter_jets || 0,
      commercial_planes: detectionResults.vehicle_counts.commercial_planes || 0
    },
    alerts: [
      { type: "success", message: "Analysis completed successfully", icon: CheckCircle2 },
      { type: "info", message: `${displayCount} objects detected with bounding boxes`, icon: AlertTriangle }
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
      airplanes: 0,
      breakdown: { SMV: 0, LMV: 0, AFV: 0, CV: 0, MCV: 0 },
      militaryBreakdown: {},
      airplaneBreakdown: {},
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
                    {detectionResults && detectionResults.detections
                      .filter((detection) => {
                        // Filter out detections that are too small or have invalid coordinates
                        const [xmin, ymin, xmax, ymax] = detection.bbox;
                        const width = xmax - xmin;
                        const height = ymax - ymin;
                        return width > 5 && height > 5 && xmin >= 0 && ymin >= 0 && xmax > xmin && ymax > ymin;
                      })
                      .map((detection, index) => {
                        const [xmin, ymin, xmax, ymax] = detection.bbox;
                        const width = xmax - xmin;
                        const height = ymax - ymin;
                        
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
                              {detection.class.toUpperCase()}
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
                    <div className="text-3xl font-bold text-primary">{displayCount}</div>
                    <div className="text-sm text-muted-foreground">Objects Detected</div>
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="space-y-3">
                    {/* Detection Count */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground">Bounding Boxes</span>
                      </div>
                      <Badge variant="secondary">{displayCount}</Badge>
                    </div>
                    
                    
                    {/* Detection Summary */}
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">Detection Summary</div>
                      <div className="text-sm text-foreground">
                        {displayCount} objects found with bounding boxes
                      </div>
                      {detectionResults && detectionResults.detections.length > visibleDetections.length && (
                        <div className="text-xs text-muted-foreground mt-1">
                          ({detectionResults.detections.length - visibleDetections.length} filtered out)
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* AI Intelligence Analysis */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Intelligence Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isGeneratingSummary ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-foreground">Generating intelligence summary...</span>
                    </div>
                  ) : llmSummary ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="text-sm text-foreground leading-relaxed bg-muted p-4 rounded-lg whitespace-pre-wrap">
                        {llmSummary}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No analysis available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Tracking Insights */}
              {detectionResults?.location_tracking && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Location Tracking Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Location Info */}
                      <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Location ID:</span>
                          <code className="text-xs bg-background px-2 py-1 rounded">
                            {detectionResults.location_tracking.location_id}
                          </code>
                        </div>
                        <Badge variant={detectionResults.location_tracking.is_first_scan ? "default" : "secondary"}>
                          {detectionResults.location_tracking.is_first_scan ? "First Scan" : "Repeat Scan"}
                        </Badge>
                      </div>

                      {/* Changes Summary */}
                      {detectionResults.location_tracking.changes && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {detectionResults.location_tracking.changes.aircraft_diff > 0 ? '+' : ''}
                              {detectionResults.location_tracking.changes.aircraft_diff}
                            </div>
                            <div className="text-xs text-muted-foreground">Aircraft</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {detectionResults.location_tracking.changes.vehicles_diff > 0 ? '+' : ''}
                              {detectionResults.location_tracking.changes.vehicles_diff}
                            </div>
                            <div className="text-xs text-muted-foreground">Vehicles</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {detectionResults.location_tracking.changes.total_diff > 0 ? '+' : ''}
                              {detectionResults.location_tracking.changes.total_diff}
                            </div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>
                      )}

                      {/* Insights */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-primary" />
                          Intelligence Insights
                        </h4>
                        <div className="space-y-2">
                          {detectionResults.location_tracking.insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                              <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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