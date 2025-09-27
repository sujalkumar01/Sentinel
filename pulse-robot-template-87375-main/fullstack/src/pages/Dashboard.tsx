import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import { Activity, MapPin, AlertTriangle, CheckCircle2, Clock, Brain, Car, Truck, Shield, Plane, Info, Image as ImageIcon } from "lucide-react";
import { DetectionResults } from "@/services/api";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();
  const [analysisResults, setAnalysisResults] = useState<{
    imageUrl: string;
    detectionResults: DetectionResults;
    location: string;
    fromAnalysis: boolean;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Get analysis results from navigation state
  useEffect(() => {
    if (location.state?.fromAnalysis) {
      setAnalysisResults({
        imageUrl: location.state.imageUrl,
        detectionResults: location.state.detectionResults,
        location: location.state.location,
        fromAnalysis: location.state.fromAnalysis
      });
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

  // Model analysis results
  const modelResults = {
    totalScans: 3,
    totalVehiclesDetected: 156,
    lastScanLocation: "Delhi Airport",
    lastScanTime: "2 hours ago",
    llmSummary: `Based on the analysis of 3 satellite scans across different regions, our AI model has identified significant patterns in vehicle activity. The system detected a total of 156 vehicles with notable concentration around Delhi Airport and Mumbai Port areas. The model's confidence level is 94.2% for vehicle classification accuracy.

Key findings indicate normal civilian activity patterns with some areas showing elevated military vehicle presence. The AI has flagged 2 regions for further monitoring due to unusual vehicle clustering patterns that deviate from baseline expectations.`,
    
    vehicleBreakdown: {
      military: 45,
      civilian: 111,
      SMV: 67,
      LMV: 28,
      AFV: 8,
      CV: 6,
      MCV: 2
    },
    
    scanHistory: [
      {
        id: 1,
        location: "Delhi Airport",
        timestamp: "2 hours ago",
        vehicles: 47,
        status: "completed",
        confidence: 96.8
      },
      {
        id: 2,
        location: "Mumbai Port", 
        timestamp: "5 hours ago",
        vehicles: 89,
        status: "completed",
        confidence: 94.2
      },
      {
        id: 3,
        location: "Chennai Base",
        timestamp: "1 day ago", 
        vehicles: 20,
        status: "completed",
        confidence: 91.5
      }
    ]
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
          <div className="flex items-center gap-4">
            <Activity className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Vehicle Monitoring Dashboard</h1>
              <p className="text-muted-foreground">Global vehicle detection and activity analysis</p>
            </div>
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
                          {analysisResults.detectionResults.total_vehicles}
                        </div>
                        <div className="text-sm text-muted-foreground">Total Vehicles Detected</div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Military Vehicles (A1-A19) */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Military Vehicles (A1-A19)</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {Array.from({length: 19}, (_, i) => `A${i+1}`).map(vehicleClass => (
                              <div key={vehicleClass} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                                <span className="text-muted-foreground">{vehicleClass}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {analysisResults.detectionResults.vehicle_counts[vehicleClass as keyof typeof analysisResults.detectionResults.vehicle_counts] || 0}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Civilian Vehicles */}
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Civilian Vehicles</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {['SMV', 'LMV', 'AFV', 'CV', 'MCV'].map(vehicleClass => (
                              <div key={vehicleClass} className="flex items-center justify-between p-2 bg-muted rounded text-xs">
                                <span className="text-muted-foreground">{vehicleClass}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {analysisResults.detectionResults.vehicle_counts[vehicleClass as keyof typeof analysisResults.detectionResults.vehicle_counts] || 0}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Alert className="bg-success/10 border-success/20">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <AlertDescription className="text-success">
                          Analysis completed successfully with {analysisResults.detectionResults.total_vehicles} vehicles detected
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
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm text-foreground leading-relaxed bg-muted p-4 rounded-lg">
                      {modelResults.llmSummary}
                    </p>
                  </div>
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
                          <div className="text-xs text-muted-foreground">{scan.confidence}% confidence</div>
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

              {/* Model Performance */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Model Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Detection Accuracy</span>
                    <Badge className="bg-success text-success-foreground">94.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Processing Speed</span>
                    <Badge className="bg-success text-success-foreground">2.3s avg</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Model Status</span>
                    <Badge className="bg-success text-success-foreground">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">Last Analysis</span>
                    <span className="text-xs text-muted-foreground">{modelResults.lastScanTime}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;