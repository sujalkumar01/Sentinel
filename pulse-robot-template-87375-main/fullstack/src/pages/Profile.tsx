import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { User, History, Settings, Bell, Calendar, MapPin, Car, AlertTriangle } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [vehicleThreshold, setVehicleThreshold] = useState([10]);
  const [alertSensitivity, setAlertSensitivity] = useState([5]);

  // Mock data for recent scans
  const recentScans = [
    {
      id: 1,
      location: "Delhi Airport",
      date: "2024-01-30",
      time: "14:32",
      vehicles: 47,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 2,
      location: "Mumbai Port",
      date: "2024-01-29",
      time: "09:15",
      vehicles: 89,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 3,
      location: "Chennai Base",
      date: "2024-01-28",
      time: "16:45",
      vehicles: 23,
      thumbnail: "/placeholder.svg"
    },
    {
      id: 4,
      location: "Bangalore Tech",
      date: "2024-01-27",
      time: "11:20",
      vehicles: 156,
      thumbnail: "/placeholder.svg"
    },
  ];

  const alertHistory = [
    {
      id: 1,
      type: "warning",
      severity: "medium",
      location: "Mumbai Port",
      message: "+15 vehicles detected above threshold",
      timestamp: "2024-01-30 10:32"
    },
    {
      id: 2,
      type: "success",
      severity: "low",
      location: "Delhi Airport",
      message: "Activity returned to normal levels",
      timestamp: "2024-01-29 16:45"
    },
    {
      id: 3,
      type: "alert",
      severity: "high",
      location: "Bangalore Tech",
      message: "Unusual military vehicle concentration",
      timestamp: "2024-01-28 08:20"
    },
  ];

  const handleScanClick = (scanId: number) => {
    // Navigate to results page for specific scan
    navigate("/results");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
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
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <User className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Scans & Alerts</h1>
              <p className="text-muted-foreground">Manage your scanning history and alert preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left column - Recent scans */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Recent Scans */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Scans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentScans.map((scan) => (
                      <div 
                        key={scan.id}
                        onClick={() => handleScanClick(scan.id)}
                        className="group cursor-pointer bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors"
                      >
                        <div className="aspect-video bg-secondary rounded-md mb-3 overflow-hidden">
                          <img 
                            src={scan.thumbnail}
                            alt={`Scan of ${scan.location}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">{scan.location}</h4>
                            <Badge variant="outline" className="text-xs">
                              <Car className="w-3 h-3 mr-1" />
                              {scan.vehicles}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {scan.date}
                            </div>
                            <span>{scan.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert History */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Bell className="w-5 h-5 text-warning" />
                    Alert History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alertHistory.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                        <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground">{alert.location}</span>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Settings */}
            <div className="space-y-6">
              
              {/* Profile summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Profile Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground">Intelligence Analyst</h3>
                    <p className="text-sm text-muted-foreground">analyst@defense.gov</p>
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Scans</span>
                      <span className="text-sm font-medium text-foreground">47</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Alerts Generated</span>
                      <span className="text-sm font-medium text-foreground">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Member Since</span>
                      <span className="text-sm font-medium text-foreground">Jan 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Alert Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="space-y-3">
                    <Label className="text-foreground">
                      Vehicle Count Alert Threshold
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={vehicleThreshold}
                        onValueChange={setVehicleThreshold}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 vehicle</span>
                        <span className="font-medium text-foreground">
                          Alert if &gt;{vehicleThreshold[0]} new vehicles
                        </span>
                        <span>50 vehicles</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground">
                      Alert Sensitivity
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={alertSensitivity}
                        onValueChange={setAlertSensitivity}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Low</span>
                        <span className="font-medium text-foreground">
                          Level {alertSensitivity[0]}
                        </span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Save Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => navigate("/map")}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                  <Button 
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className="w-full border-border text-foreground hover:bg-muted"
                  >
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;