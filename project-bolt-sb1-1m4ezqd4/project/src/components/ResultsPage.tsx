import { motion } from 'framer-motion';
import { ArrowLeft, ZoomIn, Save, AlertTriangle, CheckCircle, Car, Truck, Plane } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

function ResultsPage() {
  const navigate = useNavigate();

  const detections = [
    { type: 'cars', count: 24, icon: Car, color: 'text-blue-400', confidence: 0.95 },
    { type: 'trucks', count: 8, icon: Truck, color: 'text-cyan-400', confidence: 0.89 },
    { type: 'aircraft', count: 3, icon: Plane, color: 'text-orange-400', confidence: 0.92 }
  ];

  const alerts = [
    { type: 'warning', icon: AlertTriangle, text: 'Unusual vehicle concentration detected', severity: 'medium' },
    { type: 'info', icon: CheckCircle, text: 'Aircraft count within normal range', severity: 'low' }
  ];

  const boundingBoxes = [
    { x: 20, y: 30, width: 8, height: 12, type: 'car', confidence: 0.97 },
    { x: 35, y: 25, width: 12, height: 8, type: 'truck', confidence: 0.94 },
    { x: 60, y: 40, width: 6, height: 10, type: 'car', confidence: 0.91 },
    { x: 75, y: 20, width: 15, height: 10, type: 'aircraft', confidence: 0.96 }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 px-4 pb-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Globe</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main image display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Satellite Analysis Results</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>40.7128°N, 74.0060°W</span>
                  <span>•</span>
                  <span>2025-01-27 14:30 UTC</span>
                </div>
              </div>
              
              {/* Satellite image with bounding boxes */}
              <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-green-900/20 to-green-700/20 aspect-video">
                {/* Simulated satellite image background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICA8cGF0aCBkPSJNIDEwIDAgTCAwIDAgMCAxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDM0LDE5NywsOTQsMC4xKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPg==')] opacity-30"></div>
                
                {/* Bounding boxes */}
                {boundingBoxes.map((box, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
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
                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                    >
                      {box.type} ({Math.round(box.confidence * 100)}%)
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Analysis panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Detection counts */}
            <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Object Detection</h3>
              <div className="space-y-4">
                {detections.map((detection, index) => (
                  <motion.div
                    key={detection.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-black/30 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <detection.icon size={20} className={detection.color} />
                      <span className="text-white capitalize">{detection.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{detection.count}</div>
                      <div className="text-xs text-gray-400">{Math.round(detection.confidence * 100)}% conf.</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4">Alerts</h3>
              <div className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`flex items-start space-x-3 p-3 rounded-xl ${
                      alert.severity === 'medium' ? 'bg-orange-500/10 border border-orange-500/20' :
                      'bg-green-500/10 border border-green-500/20'
                    }`}
                  >
                    <alert.icon 
                      size={20} 
                      className={alert.severity === 'medium' ? 'text-orange-400 mt-0.5' : 'text-green-400 mt-0.5'} 
                    />
                    <span className="text-sm text-gray-300">{alert.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => navigate('/analysis')}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300"
                whileHover={{
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <ZoomIn size={18} />
                <span>Detailed Analysis</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="w-full flex items-center justify-center space-x-2 py-3 bg-black/30 border border-blue-500/30 hover:border-blue-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
                whileHover={{
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Save size={18} />
                <span>Save Scan</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;