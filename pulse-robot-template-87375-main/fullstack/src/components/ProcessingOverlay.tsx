import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Satellite, Radar, Zap } from "lucide-react";

const ProcessingOverlay = () => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { icon: Satellite, text: "Fetching satellite image..." },
    { icon: Radar, text: "Running detection model..." },
    { icon: Zap, text: "Comparing with last scan..." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center">
      <Card className="bg-card/90 backdrop-blur-sm border-border w-full max-w-md mx-4">
        <CardContent className="p-8 text-center space-y-8">
          
          {/* Animated globe with scanning effect */}
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 animate-spin" style={{ animationDuration: '3s' }}>
              {/* Globe surface */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute top-4 left-6 w-8 h-6 bg-primary/40 rounded transform rotate-12"></div>
                <div className="absolute bottom-6 right-4 w-6 h-8 bg-primary/40 rounded transform -rotate-12"></div>
              </div>
            </div>
            
            {/* Radar scan effect */}
            <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping"></div>
            <div className="absolute inset-4 rounded-full border border-primary/50 animate-pulse"></div>
            
            {/* Pulsating dots */}
            <div className="absolute top-8 left-8 w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-12 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-12 left-16 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          {/* Processing steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary/20 border border-primary/30' 
                      : isCompleted 
                        ? 'bg-success/20 border border-success/30' 
                        : 'bg-muted border border-border'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    isActive 
                      ? 'bg-primary/30 text-primary animate-pulse' 
                      : isCompleted 
                        ? 'bg-success/30 text-success' 
                        : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive 
                      ? 'text-primary' 
                      : isCompleted 
                        ? 'text-success' 
                        : 'text-muted-foreground'
                  }`}>
                    {step.text}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress indication */}
          <div className="text-xs text-muted-foreground">
            Processing satellite data... This may take a few seconds.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingOverlay;