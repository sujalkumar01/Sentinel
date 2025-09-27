import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Satellite, Search, Bell, User, Menu } from "lucide-react";
import NotificationsPanel from "./NotificationsPanel";

interface HeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

const Header = ({ searchValue, onSearchChange, onSearch }: HeaderProps) => {
  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const navigationItems = [
    { name: "Map", path: "/map" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => navigate("/map")}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <Satellite className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">SatelliteWatch</span>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Enter coordinates or place name..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 bg-input border-border text-foreground"
              />
            </div>
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Navigation Links */}
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="text-foreground hover:text-primary hover:bg-accent"
              >
                {item.name}
              </Button>
            ))}

            {/* Notifications */}
            <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-foreground" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                    3
                  </Badge>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Notifications</SheetTitle>
                </SheetHeader>
                <NotificationsPanel />
              </SheetContent>
            </Sheet>

            {/* Profile */}
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/profile")}
              className="text-foreground hover:text-primary hover:bg-accent"
            >
              <User className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5 text-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-card border-border">
                <SheetHeader>
                  <SheetTitle className="text-foreground">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search location..."
                      value={searchValue}
                      onChange={(e) => onSearchChange(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pl-10 bg-input border-border text-foreground"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  {navigationItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className="justify-start text-foreground hover:text-primary hover:bg-accent"
                    >
                      {item.name}
                    </Button>
                  ))}

                  <Button
                    variant="ghost"
                    onClick={() => setIsNotificationsOpen(true)}
                    className="justify-start text-foreground hover:text-primary hover:bg-accent"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                    <Badge className="ml-auto bg-destructive text-destructive-foreground">3</Badge>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;