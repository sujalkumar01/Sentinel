import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2, Info, Clock, MapPin } from "lucide-react";

const NotificationsPanel = () => {
  const notifications = [
    {
      id: 1,
      type: "alert",
      severity: "high",
      location: "Mumbai Port",
      message: "Unusual vehicle concentration detected",
      details: "+25 vehicles appeared in restricted zone",
      timestamp: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      type: "warning",
      severity: "medium",
      location: "Delhi Airport",
      message: "Vehicle count above threshold",
      details: "47 vehicles detected, threshold is 40",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: 3,
      type: "success",
      severity: "low",
      location: "Chennai Base",
      message: "Scan completed successfully",
      details: "23 vehicles detected, normal activity",
      timestamp: "4 hours ago",
      read: true
    },
    {
      id: 4,
      type: "info",
      severity: "low",
      location: "Bangalore Tech",
      message: "Scheduled scan reminder",
      details: "Next scan scheduled for 18:00",
      timestamp: "6 hours ago",
      read: true
    },
    {
      id: 5,
      type: "alert",
      severity: "high",
      location: "Kolkata Docks",
      message: "Military vehicle presence",
      details: "3 armored vehicles detected",
      timestamp: "8 hours ago",
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return AlertTriangle;
      case "warning":
        return AlertTriangle;
      case "success":
        return CheckCircle2;
      default:
        return Info;
    }
  };

  const getColorClass = (type: string, severity: string) => {
    if (type === "alert" && severity === "high") return "text-destructive";
    if (type === "warning") return "text-warning";
    if (type === "success") return "text-success";
    return "text-info";
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-1 mt-6 max-h-96 overflow-y-auto">
      {notifications.map((notification, index) => {
        const IconComponent = getIcon(notification.type);
        const iconColor = getColorClass(notification.type, notification.severity);
        
        return (
          <div key={notification.id}>
            <Card className={`bg-card border-border transition-colors hover:bg-muted/50 ${
              !notification.read ? 'border-l-4 border-l-primary' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <IconComponent className={`w-5 h-5 mt-0.5 ${iconColor}`} />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">
                          {notification.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                        <Badge variant={getBadgeVariant(notification.severity)}>
                          {notification.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.details}</p>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {notification.timestamp}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {index < notifications.length - 1 && (
              <Separator className="bg-border my-1" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NotificationsPanel;