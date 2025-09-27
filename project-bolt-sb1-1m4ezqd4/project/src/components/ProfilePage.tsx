import { motion } from 'framer-motion';
import { User, Settings, History, Bell, Shield, Download } from 'lucide-react';
import Header from './Header';

function ProfilePage() {
  const scanHistory = [
    { id: 1, location: 'New York Harbor', date: '2025-01-27', objects: 45, image: '🌊' },
    { id: 2, location: 'San Francisco Bay', date: '2025-01-26', objects: 32, image: '🏙️' },
    { id: 3, location: 'Miami Port', date: '2025-01-25', objects: 67, image: '🏖️' },
    { id: 4, location: 'Seattle Waterfront', date: '2025-01-24', objects: 28, image: '🌲' },
    { id: 5, location: 'Boston Harbor', date: '2025-01-23', objects: 41, image: '🏛️' },
    { id: 6, location: 'Los Angeles Port', date: '2025-01-22', objects: 89, image: '🌴' }
  ];

  const alertHistory = [
    { id: 1, type: 'critical', message: 'Unusual aircraft activity', date: '2025-01-27', resolved: false },
    { id: 2, type: 'warning', message: 'High vehicle concentration', date: '2025-01-26', resolved: true },
    { id: 3, type: 'info', message: 'Scan completed successfully', date: '2025-01-25', resolved: true },
    { id: 4, type: 'warning', message: 'Anomalous pattern detected', date: '2025-01-24', resolved: true }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
              Your Intelligence Profile
            </h1>
            <p className="text-gray-400">
              Manage your scans, alerts, and system preferences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info & Settings */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Profile Card */}
              <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
                <div className="text-center mb-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <User size={32} className="text-white" />
                  </motion.div>
                  <h2 className="text-xl font-bold text-white mb-1">Intelligence Analyst</h2>
                  <p className="text-gray-400 text-sm">Level 3 Clearance</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Scans:</span>
                    <span className="text-white font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Objects Detected:</span>
                    <span className="text-white font-semibold">34,562</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accuracy Rate:</span>
                    <span className="text-green-400 font-semibold">94.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since:</span>
                    <span className="text-white font-semibold">Jan 2024</span>
                  </div>
                </div>
              </div>

              {/* Settings Card */}
              <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Settings className="mr-2 text-blue-400" />
                  System Preferences
                </h3>

                <div className="space-y-4">
                  {/* Alert threshold slider */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Alert Threshold
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="50"
                        defaultValue="15"
                        className="w-full h-2 bg-black/30 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>

                  {/* Notification settings */}
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Email Notifications</span>
                      <motion.div
                        className="relative w-11 h-6 bg-blue-600 rounded-full cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                          animate={{ x: 20 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Push Notifications</span>
                      <motion.div
                        className="relative w-11 h-6 bg-gray-600 rounded-full cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full" />
                      </motion.div>
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">SMS Alerts</span>
                      <motion.div
                        className="relative w-11 h-6 bg-blue-600 rounded-full cursor-pointer"
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                          animate={{ x: 20 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.div>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Scans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <History className="mr-2 text-cyan-400" />
                Recent Scans
              </h3>

              <div className="space-y-4">
                {scanHistory.map((scan, index) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-black/30 rounded-xl hover:bg-black/40 transition-all duration-300 cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="text-2xl">{scan.image}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{scan.location}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{scan.date}</span>
                        <span className="text-xs">
                          <span className="text-blue-400 font-semibold">{scan.objects}</span>
                          <span className="text-gray-400"> objects</span>
                        </span>
                      </div>
                    </div>
                    <motion.button
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-400 transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download size={16} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Alerts History */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Bell className="mr-2 text-orange-400" />
                Alert History
              </h3>

              <div className="space-y-4">
                {alertHistory.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      alert.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                      alert.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`w-3 h-3 rounded-full mt-1 ${
                        alert.type === 'critical' ? 'bg-red-500' :
                        alert.type === 'warning' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.resolved 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {alert.resolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-white mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-400">{alert.date}</p>
                  </motion.div>
                ))}
              </div>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl"
              >
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <Shield className="text-blue-400" size={16} />
                  <span className="text-gray-400">Security Clearance:</span>
                  <span className="text-blue-400 font-semibold">Level 3 Verified</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #06b6d4);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #06b6d4);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;