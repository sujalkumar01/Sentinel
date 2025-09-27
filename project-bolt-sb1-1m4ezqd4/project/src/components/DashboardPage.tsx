import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Globe, BarChart3 } from 'lucide-react';
import Header from './Header';

function DashboardPage() {
  const recentScans = [
    { id: 1, location: 'New York Harbor', time: '2 hours ago', objects: 45, status: 'completed' },
    { id: 2, location: 'San Francisco Bay', time: '6 hours ago', objects: 32, status: 'completed' },
    { id: 3, location: 'Miami Port', time: '1 day ago', objects: 67, status: 'completed' }
  ];

  const alerts = [
    { id: 1, type: 'critical', message: 'Unusual aircraft activity detected', location: 'Dallas-Fort Worth', time: '30 min ago' },
    { id: 2, type: 'warning', message: 'High vehicle concentration', location: 'Los Angeles', time: '2 hours ago' },
    { id: 3, type: 'info', message: 'Scan completed successfully', location: 'Chicago', time: '4 hours ago' }
  ];

  const weeklyData = [
    { day: 'Mon', scans: 12, detections: 340 },
    { day: 'Tue', scans: 15, detections: 420 },
    { day: 'Wed', scans: 18, detections: 510 },
    { day: 'Thu', scans: 14, detections: 380 },
    { day: 'Fri', scans: 22, detections: 650 },
    { day: 'Sat', scans: 19, detections: 540 },
    { day: 'Sun', scans: 16, detections: 460 }
  ];

  const maxDetections = Math.max(...weeklyData.map(d => d.detections));

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4">
              Mission Control Dashboard
            </h1>
            <p className="text-gray-400">
              Real-time satellite intelligence monitoring and analysis
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: 'Total Scans', value: '1,247', change: '+12%', icon: Globe, color: 'text-blue-400' },
              { title: 'Objects Detected', value: '34,562', change: '+8%', icon: BarChart3, color: 'text-cyan-400' },
              { title: 'Active Alerts', value: '23', change: '-5%', icon: AlertTriangle, color: 'text-orange-400' },
              { title: 'Accuracy Rate', value: '94.7%', change: '+2%', icon: CheckCircle, color: 'text-green-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <stat.icon size={24} className={stat.color} />
                  <span className={`text-sm font-semibold ${
                    stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Weekly Activity Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-3 text-blue-400" />
                  Weekly Detection Activity
                </h2>
                <div className="text-sm text-gray-400">Last 7 days</div>
              </div>

              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end justify-between px-4 pb-8">
                  {weeklyData.map((day, index) => {
                    const height = (day.detections / maxDetections) * 100;
                    
                    return (
                      <motion.div
                        key={day.day}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        {/* Bar */}
                        <div className="relative w-12 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg mb-2 hover:from-blue-500 hover:to-cyan-300 transition-all duration-300">
                          {/* Glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-blue-400 to-cyan-300 rounded-t-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                            animate={{
                              boxShadow: [
                                "0 0 0px rgba(59, 130, 246, 0)",
                                "0 0 20px rgba(59, 130, 246, 0.3)",
                                "0 0 0px rgba(59, 130, 246, 0)"
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        </div>
                        
                        {/* Day label */}
                        <span className="text-xs text-gray-400 text-center font-medium">
                          {day.day}
                        </span>
                        
                        {/* Tooltip */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap border border-blue-500/30"
                        >
                          <div>Scans: {day.scans}</div>
                          <div>Detections: {day.detections}</div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Y-axis */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
                  {[maxDetections, Math.round(maxDetections * 0.75), Math.round(maxDetections * 0.5), Math.round(maxDetections * 0.25), 0].map((value) => (
                    <span key={value}>{value}</span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="mr-2 text-orange-400" />
                Recent Alerts
              </h2>

              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                      <span className="text-xs text-gray-400">{alert.time}</span>
                    </div>
                    <p className="text-sm text-white mb-1">{alert.message}</p>
                    <p className="text-xs text-gray-400">{alert.location}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Scans */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Clock className="mr-3 text-cyan-400" />
              Recent Scan Activity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentScans.map((scan, index) => (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="bg-black/30 border border-blue-500/20 rounded-xl p-6 hover:border-blue-400 transition-all duration-300 cursor-pointer group"
                  whileHover={{
                    boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
                    scale: 1.02,
                  }}
                >
                  {/* Mini globe visualization */}
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <motion.div
                      className="w-full h-full border-2 border-blue-500/30 rounded-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      {/* Location dot */}
                      <div className="absolute top-2 right-3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    </motion.div>
                  </div>

                  <h3 className="text-lg font-semibold text-white text-center mb-2">
                    {scan.location}
                  </h3>
                  <div className="text-center space-y-1">
                    <p className="text-sm text-gray-400">{scan.time}</p>
                    <p className="text-sm">
                      <span className="text-blue-400 font-semibold">{scan.objects}</span>
                      <span className="text-gray-400"> objects detected</span>
                    </p>
                    <div className="flex items-center justify-center mt-3">
                      <CheckCircle size={16} className="text-green-400 mr-1" />
                      <span className="text-xs text-green-400 capitalize">{scan.status}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;