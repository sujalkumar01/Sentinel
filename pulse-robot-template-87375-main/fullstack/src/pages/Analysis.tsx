import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { FileText, TrendingUp, MapPin, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Analysis = () => {
  const [searchValue, setSearchValue] = useState("");

  // Mock data for the chart - updated to reflect actual model output
  const chartData = [
    { date: "Jan 15", total: 32, military: 8, civilian: 24, SMV: 12, LMV: 8, AFV: 2, CV: 2, MCV: 0 },
    { date: "Jan 20", total: 38, military: 12, civilian: 26, SMV: 15, LMV: 7, AFV: 3, CV: 1, MCV: 0 },
    { date: "Jan 25", total: 45, military: 15, civilian: 30, SMV: 18, LMV: 8, AFV: 2, CV: 2, MCV: 0 },
    { date: "Jan 30", total: 47, military: 12, civilian: 35, SMV: 20, LMV: 10, AFV: 3, CV: 2, MCV: 0 },
  ];

  const aiSummary = `SITUATION REPORT - Delhi Airport Region
Generated: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY:
In this region, vehicle count has increased by 7 cars while tank presence dropped. This suggests potential civilian activity increase and reduced heavy vehicle presence.

DETAILED ANALYSIS:
• Civilian vehicle presence: 23 cars (+7 from last scan)
• Heavy vehicle count: 12 trucks (stable)
• Military presence: 3 tanks (-2 from last scan)
• Aircraft activity: 2 fighter jets, 7 commercial planes

CHANGE DETECTION:
+7 vehicles added (primarily civilian cars)
-2 tanks removed (military vehicle reduction)
+2 commercial planes (increased air traffic)

ASSESSMENT:
The pattern indicates normal civilian activity growth with reduced military presence. No immediate security concerns identified.

RECOMMENDATIONS:
• Monitor for continued civilian vehicle increase
• Verify tank relocation to other facilities
• Schedule follow-up scan in 48 hours`;

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <Header 
        searchValue={searchValue} 
        onSearchChange={setSearchValue} 
        onSearch={() => {}} 
      />
      
      <main className="pt-20 px-6 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-4">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Intelligence Analysis</h1>
              <p className="text-muted-foreground">AI-generated situation report and trends</p>
            </div>
          </div>

          {/* Detection Image */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Detection Overview
                </CardTitle>
                <Badge variant="secondary" className="text-success">
                  <Calendar className="w-4 h-4 mr-1" />
                  Latest Scan
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/placeholder.svg" 
                  alt="Satellite image with detections"
                  className="w-full h-full object-cover"
                />
                {/* Enhanced bounding boxes with labels */}
                <div className="absolute top-12 left-16">
                  <div className="w-8 h-6 border-2 border-primary bg-primary/20 relative">
                    <span className="absolute -top-6 left-0 text-xs bg-primary text-primary-foreground px-1 rounded">CAR</span>
                  </div>
                </div>
                <div className="absolute top-20 left-32">
                  <div className="w-12 h-8 border-2 border-accent bg-accent/20 relative">
                    <span className="absolute -top-6 left-0 text-xs bg-accent text-accent-foreground px-1 rounded">TRUCK</span>
                  </div>
                </div>
                <div className="absolute bottom-16 right-20">
                  <div className="w-6 h-4 border-2 border-warning bg-warning/20 relative">
                    <span className="absolute -top-6 left-0 text-xs bg-warning text-warning-foreground px-1 rounded">TANK</span>
                  </div>
                </div>
                <div className="absolute bottom-24 left-24">
                  <div className="w-10 h-6 border-2 border-info bg-info/20 relative">
                    <span className="absolute -top-6 left-0 text-xs bg-info text-info-foreground px-1 rounded">AIRCRAFT</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Report */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                AI Intelligence Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed bg-muted p-4 rounded-lg">
                  {aiSummary}
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* Trends Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "6px",
                        color: "hsl(var(--popover-foreground))"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="total" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      name="Total Vehicles"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="military" 
                      stroke="hsl(var(--warning))" 
                      strokeWidth={2}
                      name="Military (A1-A19)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="civilian" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Civilian"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="SMV" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="SMV"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="LMV" 
                      stroke="hsl(var(--info))" 
                      strokeWidth={2}
                      name="LMV"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="AFV" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="AFV"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analysis;