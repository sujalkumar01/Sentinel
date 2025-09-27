import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function AnalysisPage() {
  const navigate = useNavigate();

  const trendData = [
    { date: '2025-01-20', cars: 18, trucks: 5, aircraft: 2 },
    { date: '2025-01-21', cars: 22, trucks: 7, aircraft: 3 },
    { date: '2025-01-22', cars: 19, trucks: 6, aircraft: 2 },
    { date: '2025-01-23', cars: 26, trucks: 9, aircraft: 4 },
    { date: '2025-01-24', cars: 21, trucks: 8, aircraft: 3 },
    { date: '2025-01-25', cars: 28, trucks: 12, aircraft: 5 },
    { date: '2025-01-26', cars: 24, trucks: 8, aircraft: 3 },
  ];

  const maxValue = Math.max(...trendData.map(d => d.cars + d.trucks + d.aircraft));

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 px-4 pb-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/results')}
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Results</span>
        </motion.button>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
              AI Intelligence Analysis
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>40.7128°N, 74.0060°W</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>2025-01-27 14:30 UTC</span>
              </div>
            </div>
          </motion.div>

          {/* Large satellite image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
          >
            <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-green-700/20 aspect-[16/10]">
              {/* Enhanced satellite image simulation */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDM0LDE5NywsOTQsMC4xKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-30"></div>
              
              {/* Enhanced bounding boxes */}
              {[
                { x: 15, y: 20, width: 6, height: 8, type: 'car', id: 'C001' },
                { x: 25, y: 15, width: 8, height: 6, type: 'truck', id: 'T001' },
                { x: 45, y: 35, width: 5, height: 7, type: 'car', id: 'C002' },
                { x: 65, y: 25, width: 12, height: 8, type: 'aircraft', id: 'A001' },
                { x: 35, y: 45, width: 6, height: 8, type: 'car', id: 'C003' },
                { x: 75, y: 60, width: 7, height: 5, type: 'truck', id: 'T002' }
              ].map((box, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="absolute border-2 rounded cursor-pointer group"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                    borderColor: box.type === 'car' ? '#3B82F6' : 
                                box.type === 'truck' ? '#06B6D4' : '#F97316'
                  }}
                >
                  {/* Enhanced tooltip */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap border border-blue-500/30"
                  >
                    <div className="font-semibold">{box.id}</div>
                    <div className="text-gray-300">{box.type}</div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Analysis Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI Intelligence Summary
              </span>
            </h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Our advanced AI detection system has identified <strong className="text-blue-400">35 total objects</strong> in this satellite image, representing a <strong className="text-cyan-400">17% increase</strong> compared to the previous scan. The analysis reveals concentrated vehicle activity in the northern sector, with several clusters of civilian and commercial vehicles.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-4">
                <strong className="text-orange-400">Notable observations:</strong> The aircraft detected in the eastern area appears to be a commercial airliner based on its size profile and positioning near what appears to be a runway or taxiway. Vehicle density patterns suggest normal operational activity, with truck concentrations indicating potential cargo or logistics operations.
              </p>
              
              <p className="text-gray-300 leading-relaxed">
                <strong className="text-green-400">Assessment:</strong> No anomalous patterns detected. The object distribution and types align with expected civilian infrastructure usage. Confidence levels across all detections exceed 89%, indicating high reliability of the analysis results.
              </p>
            </div>
          </motion.div>

          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp className="mr-3 text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                7-Day Object Detection Trend
              </span>
            </h2>

            <div className="relative h-80">
              <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                {trendData.map((day, index) => {
                  const total = day.cars + day.trucks + day.aircraft;
                  const height = (total / maxValue) * 100;
                  
                  return (
                    <motion.div
                      key={day.date}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      {/* Bar stack */}
                      <div className="relative w-12 bg-gradient-to-t from-blue-600 via-cyan-500 to-orange-500 rounded-t-lg mb-2 flex flex-col justify-end overflow-hidden">
                        {/* Truck section */}
                        <div 
                          className="w-full bg-orange-500" 
                          style={{ height: `${(day.aircraft / total) * 100}%` }}
                        />
                        {/* Truck section */}
                        <div 
                          className="w-full bg-cyan-500" 
                          style={{ height: `${(day.trucks / total) * 100}%` }}
                        />
                        {/* Car section */}
                        <div 
                          className="w-full bg-blue-500" 
                          style={{ height: `${(day.cars / total) * 100}%` }}
                        />
                      </div>
                      
                      {/* Date label */}
                      <span className="text-xs text-gray-400 text-center">
                        {new Date(day.date).getDate()}/{new Date(day.date).getMonth() + 1}
                      </span>
                      
                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-blue-500/30"
                      >
                        <div>Cars: {day.cars}</div>
                        <div>Trucks: {day.trucks}</div>
                        <div>Aircraft: {day.aircraft}</div>
                        <div className="font-semibold border-t border-gray-600 pt-1 mt-1">
                          Total: {total}
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Y-axis */}
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                {[maxValue, Math.round(maxValue * 0.75), Math.round(maxValue * 0.5), Math.round(maxValue * 0.25), 0].map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-0 right-0 flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-400">Cars</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-cyan-500 rounded"></div>
                  <span className="text-gray-400">Trucks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span className="text-gray-400">Aircraft</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AnalysisPage;