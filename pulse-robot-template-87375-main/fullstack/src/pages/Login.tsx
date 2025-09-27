import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Satellite, Globe, Upload, Target, Camera } from "lucide-react";
import { detectVehicles } from "@/services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogin = () => {
    // For demo purposes, just navigate to map
    navigate("/map");
  };

  const handleDemoLogin = () => {
    navigate("/map");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    
    try {
      const imageUrl = URL.createObjectURL(uploadedFile);
      
      // Detect vehicles in uploaded image using your model
      const detectionResults = await detectVehicles(uploadedFile);
      
      setTimeout(() => {
        setIsProcessing(false);
        navigate("/results", { 
          state: { 
            imageUrl,
            detectionResults,
            location: 'Uploaded Image'
          } 
        });
      }, 3000);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-accent rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary rounded-full opacity-30 animate-pulse"></div>
      </div>

      {/* Faint globe outline */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Globe className="w-96 h-96 text-primary" />
      </div>

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Satellite className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl font-bold text-foreground">SatelliteWatch</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Vehicle Detection & Intelligence Analysis Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              Login
            </Button>
            
            <Button 
              onClick={handleDemoLogin}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground"
              size="lg"
            >
              Demo Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;