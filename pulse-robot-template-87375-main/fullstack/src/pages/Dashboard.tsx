import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Activity, MapPin, AlertTriangle, CheckCircle2, Clock, Brain, Car, Truck, Shield, Plane, Info, Image as ImageIcon, Trash2 } from "lucide-react";
import { generateLLMSummary } from "@/services/api";
import { useDetection } from "@/contexts/DetectionContext";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const { analysisResults, scanHistory, clearResults } = useDetection();
  const [llmSummary, setLlmSummary] = useState<string>("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Generate LLM summary when analysis results are available
  useEffect(() => {
    if (analysisResults && !llmSummary) {
      generateIntelligenceSummary();
    }
  }, [analysisResults, llmSummary]);

  const generateIntelligenceSummary = async () => {
    if (!analysisResults) return;
    
    setIsGeneratingSummary(true);
    try {
      const summary = await generateLLMSummary(
        analysisResults.detectionResults, 
        analysisResults.location, 
        analysisResults.imageUrl
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

  // Helper function to calculate accurate vehicle counts
  const calculateVehicleCounts = (vehicleCounts: any) => {
    const military = Object.entries(vehicleCounts)
      .filter(([key]) => key.startsWith('A'))
      .reduce((sum, [_, count]) => sum + count, 0);
    const civilian = ['SMV', 'LMV', 'AFV', 'CV', 'MCV']
      .reduce((sum, key) => sum + (vehicleCounts[key] || 0), 0);
    const airplanes = Object.entries(vehicleCounts)
      .filter(([key]) => {
        const militaryKeys = Array.from({length: 19}, (_, i) => `A${i+1}`);
        const civilianKeys = ['SMV', 'LMV', 'AFV', 'CV', 'MCV'];
        return !militaryKeys.includes(key) && !civilianKeys.includes(key);
      })
      .reduce((sum, [_, count]) => sum + count, 0);
    return { military, civilian, airplanes, total: military + civilian + airplanes };
  };

  // Use real detection results or fallback to mock data
  const modelResults = analysisResults ? (() => {
    const counts = calculateVehicleCounts(analysisResults.detectionResults.vehicle_counts);
    return {
      totalScans: scanHistory.length,
      totalVehiclesDetected: counts.total,
      lastScanLocation: analysisResults.location,
      lastScanTime: new Date(analysisResults.timestamp).toLocaleString(),
      llmSummary: `Based on the latest satellite scan analysis, our AI model has identified vehicle activity patterns in the specified region. The system detected a total of ${counts.total} vehicles with detailed classification across military and civilian categories.

Key findings indicate ${counts.total > 10 ? 'elevated' : 'normal'} activity patterns with ${Object.entries(analysisResults.detectionResults.vehicle_counts).filter(([_, count]) => count > 0).length} different vehicle types detected.`,
      
      vehicleBreakdown: {
        military: counts.military,
        civilian: counts.civilian,
        SMV: analysisResults.detectionResults.vehicle_counts.SMV || 0,
        LMV: analysisResults.detectionResults.vehicle_counts.LMV || 0,
        AFV: analysisResults.detectionResults.vehicle_counts.AFV || 0,
        CV: analysisResults.detectionResults.vehicle_counts.CV || 0,
        MCV: analysisResults.detectionResults.vehicle_counts.MCV || 0
      },
      
      scanHistory: scanHistory.map(scan => ({
        id: scan.id,
        location: scan.location,
        timestamp: new Date(scan.timestamp).toLocaleString(),
        vehicles: Object.values(scan.detectionResults.vehicle_counts).reduce((sum, count) => sum + count, 0),
        status: "completed",
        confidence: "High"
      }))
    };
  })() : {
    totalScans: 0,
    totalVehiclesDetected: 0,
    lastScanLocation: "No scans yet",
    lastScanTime: "N/A",
    llmSummary: "No analysis data available. Upload an image to begin vehicle detection analysis.",
    
    vehicleBreakdown: {
      military: 0,
      civilian: 0,
      SMV: 0,
      LMV: 0,
      AFV: 0,
      CV: 0,
      MCV: 0
    },
    
    scanHistory: []
  };

  // Show "first scan" message if only one scan, otherwise show alerts
  const showFirstScanMessage = modelResults.totalScans === 1;
  
  const recentAlerts = showFirstScanMessage ? [] : [
    { 
      id: 1, 
      type: "warning", 
      location: "Mumbai Port", 
      message: "+15 vehicles detected since last scan", 
      time: "2 hours ago",
      severity: "medium"
    },
    { 
      id: 2, 
      type: "success", 
      location: "Delhi Airport", 
      message: "Vehicle pattern normalized", 
      time: "4 hours ago",
      severity: "low"
    },
    { 
      id: 3, 
      type: "alert", 
      location: "Bangalore Tech", 
      message: "Unusual military vehicle concentration", 
      time: "6 hours ago",
      severity: "high"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case 'alert':
      case 'warning':
        return AlertTriangle;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        searchValue={searchValue} 
        onSearchChange={setSearchValue} 
        onSearch={() => {}} 
      />
      
      <main className="pt-20 px-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Vehicle Monitoring Dashboard</h1>
                <p className="text-muted-foreground">Global vehicle detection and activity analysis</p>
              </div>
            </div>
            {analysisResults && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearResults}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Results
              </Button>
            )}
          </div>

          {/* Analysis Results Section */}
          {analysisResults && (
            <div className="mb-8">
              <Card className="bg-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-primary" />
                    Latest Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image */}
                    <div className="space-y-4">
                      <div className="relative bg-muted rounded-lg overflow-hidden">
                        <img 
                          ref={imageRef}
                          src={analysisResults.imageUrl} 
                          alt="Analyzed image"
                          className="w-full h-auto max-h-96 object-contain"
                          onLoad={handleImageLoad}
                        />
                        {/* Real bounding boxes from detection results */}
                        {analysisResults.detectionResults.detections.map((detection, index) => {
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
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">
                            {analysisResults.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detection Results */}
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary mb-2">
                          {analysisResults.detectionResults.detections.filter((detection) => {
                            const [xmin, ymin, xmax, ymax] = detection.bbox;
                            const width = xmax - xmin;
                            const height = ymax - ymin;
                            return width > 5 && height > 5 && xmin >= 0 && ymin >= 0 && xmax > xmin && ymax > ymin;
                          }).length}
                        </div>
                        <div className="text-sm text-muted-foreground">Objects Detected (Visual)</div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Detection Summary */}
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">Detection Summary</div>
                          <div className="text-lg font-semibold text-foreground">
                            {analysisResults.detectionResults.detections.filter((detection) => {
                              const [xmin, ymin, xmax, ymax] = detection.bbox;
                              const width = xmax - xmin;
                              const height = ymax - ymin;
                              return width > 5 && height > 5 && xmin >= 0 && ymin >= 0 && xmax > xmin && ymax > ymin;
                            }).length} objects detected visually
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            with bounding boxes on image
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Text analysis: {analysisResults.detectionResults.total_vehicles} total objects
                          </div>
                        </div>
                        
                      </div>

                      <Alert className="bg-success/10 border-success/20">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <AlertDescription className="text-success">
                          Analysis completed successfully with {analysisResults.detectionResults.detections.filter((detection) => {
                            const [xmin, ymin, xmax, ymax] = detection.bbox;
                            const width = xmax - xmin;
                            const height = ymax - ymin;
                            return width > 5 && height > 5 && xmin >= 0 && ymin >= 0 && xmax > xmin && ymax > ymin;
                          }).length} objects detected
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left column - Model Results */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Model Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Model Analysis Summary
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
                    <div className="prose prose-invert max-w-none">
                      <p className="text-sm text-foreground leading-relaxed bg-muted p-4 rounded-lg">
                        {modelResults.llmSummary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Detection Results */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Vehicle Detection Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Shield className="w-8 h-8 text-warning mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{modelResults.vehicleBreakdown.military}</div>
                      <div className="text-xs text-muted-foreground">Military (A1-A19)</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Car className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{modelResults.vehicleBreakdown.civilian}</div>
                      <div className="text-xs text-muted-foreground">Civilian</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Car className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{modelResults.vehicleBreakdown.SMV}</div>
                      <div className="text-xs text-muted-foreground">SMV</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <Truck className="w-8 h-8 text-info mx-auto mb-2" />
                      <div className="text-2xl font-bold text-foreground">{modelResults.vehicleBreakdown.LMV}</div>
                      <div className="text-xs text-muted-foreground">LMV</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Plane className="w-6 h-6 text-accent mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">{modelResults.vehicleBreakdown.AFV}</div>
                      <div className="text-xs text-muted-foreground">AFV</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Car className="w-6 h-6 text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">{modelResults.vehicleBreakdown.CV}</div>
                      <div className="text-xs text-muted-foreground">CV</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Shield className="w-6 h-6 text-warning mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">{modelResults.vehicleBreakdown.MCV}</div>
                      <div className="text-xs text-muted-foreground">MCV</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Scan History */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Recent Scans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modelResults.scanHistory.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-primary" />
                          <div>
                            <div className="font-medium text-foreground">{scan.location}</div>
                            <div className="text-xs text-muted-foreground">{scan.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-foreground">{scan.vehicles} vehicles</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Alerts and Stats */}
            <div className="space-y-6">
              
              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{modelResults.totalVehiclesDetected}</div>
                    <div className="text-xs text-muted-foreground">Total Vehicles</div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{modelResults.totalScans}</div>
                    <div className="text-xs text-muted-foreground">Scans Completed</div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts feed or First Scan Message */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    {showFirstScanMessage ? "System Status" : "Recent Alerts"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {showFirstScanMessage ? (
                    <div className="p-4">
                      <Alert className="bg-info/10 border-info/20">
                        <Info className="h-4 w-4 text-info" />
                        <AlertDescription className="text-info">
                          <strong>First Scan Detected</strong><br />
                          This is your first scan. Alerts will appear here after subsequent scans when the system can compare patterns and detect changes.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentAlerts.map((alert) => {
                        const IconComponent = getSeverityIcon(alert.type);
                        return (
                          <div key={alert.id} className="p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-0">
                            <div className="flex items-start gap-3">
                              <IconComponent className={`w-4 h-4 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium text-foreground">{alert.location}</span>
                                  <Badge 
                                    variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {alert.severity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{alert.message}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {alert.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Location Tracking Insights */}
              {analysisResults?.detectionResults?.location_tracking && (
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
                            {analysisResults.detectionResults.location_tracking.location_id}
                          </code>
                        </div>
                        <Badge variant={analysisResults.detectionResults.location_tracking.is_first_scan ? "default" : "secondary"}>
                          {analysisResults.detectionResults.location_tracking.is_first_scan ? "First Scan" : "Repeat Scan"}
                        </Badge>
                      </div>

                      {/* Changes Summary */}
                      {analysisResults.detectionResults.location_tracking.changes && (
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {analysisResults.detectionResults.location_tracking.changes.aircraft_diff > 0 ? '+' : ''}
                              {analysisResults.detectionResults.location_tracking.changes.aircraft_diff}
                            </div>
                            <div className="text-xs text-muted-foreground">Aircraft</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {analysisResults.detectionResults.location_tracking.changes.vehicles_diff > 0 ? '+' : ''}
                              {analysisResults.detectionResults.location_tracking.changes.vehicles_diff}
                            </div>
                            <div className="text-xs text-muted-foreground">Vehicles</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-foreground">
                              {analysisResults.detectionResults.location_tracking.changes.total_diff > 0 ? '+' : ''}
                              {analysisResults.detectionResults.location_tracking.changes.total_diff}
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
                          {analysisResults.detectionResults.location_tracking.insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-muted">
                              <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-foreground">{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;