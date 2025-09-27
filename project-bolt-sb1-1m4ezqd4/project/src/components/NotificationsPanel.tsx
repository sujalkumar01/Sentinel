import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle, Info, Clock } from 'lucide-react';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'Critical Alert',
      message: 'Unusual aircraft activity detected in restricted airspace',
      location: 'Dallas-Fort Worth International',
      time: '2 minutes ago',
      icon: AlertTriangle
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Activity Warning',
      message: 'Vehicle concentration exceeds normal parameters',
      location: 'Los Angeles Port Complex',
      time: '15 minutes ago',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'success',
      title: 'Scan Complete',
      message: 'Satellite analysis completed successfully',
      location: 'New York Harbor',
      time: '1 hour ago',
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'info',
      title: 'System Update',
      message: 'AI detection model updated to v2.1.3',
      location: 'Global',
      time: '2 hours ago',
      icon: Info
    },
    {
      id: 5,
      type: 'warning',
      title: 'Pattern Anomaly',
      message: 'Irregular movement patterns detected',
      location: 'Miami International Airport',
      time: '4 hours ago',
      icon: AlertTriangle
    }
  ];

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-500/10 border-red-500/20',
          glow: 'shadow-red-500/20',
          iconColor: 'text-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10 border-orange-500/20',
          glow: 'shadow-orange-500/20',
          iconColor: 'text-orange-400'
        };
      case 'success':
        return {
          bg: 'bg-green-500/10 border-green-500/20',
          glow: 'shadow-green-500/20',
          iconColor: 'text-green-400'
        };
      default:
        return {
          bg: 'bg-blue-500/10 border-blue-500/20',
          glow: 'shadow-blue-500/20',
          iconColor: 'text-blue-400'
        };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-black/80 backdrop-blur-xl border-l border-blue-500/20 z-[100] overflow-hidden"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-500/20">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Intelligence Alerts
                </h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 bg-black/30 border border-blue-500/30 rounded-lg text-gray-400 hover:text-white hover:border-blue-400 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {notifications.map((notification, index) => {
                  const styles = getNotificationStyles(notification.type);
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${styles.bg} cursor-pointer group hover:scale-[1.02] transition-all duration-300`}
                      style={{
                        boxShadow: `0 4px 15px ${styles.glow}`,
                      }}
                      whileHover={{
                        boxShadow: `0 8px 25px ${styles.glow}`,
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Icon */}
                        <motion.div
                          className={`p-2 rounded-lg bg-black/30 ${styles.iconColor}`}
                          animate={{
                            rotate: notification.type === 'critical' ? [0, 5, -5, 0] : 0,
                          }}
                          transition={{
                            duration: 2,
                            repeat: notification.type === 'critical' ? Infinity : 0,
                          }}
                        >
                          <notification.icon size={18} />
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="text-white font-semibold text-sm truncate">
                              {notification.title}
                            </h3>
                            <div className="flex items-center text-gray-400 text-xs ml-2">
                              <Clock size={12} className="mr-1" />
                              {notification.time}
                            </div>
                          </div>
                          
                          <p className="text-gray-300 text-sm leading-relaxed mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center text-xs text-gray-400">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2" />
                            {notification.location}
                          </div>
                        </div>
                      </div>

                      {/* Animated border glow */}
                      <motion.div
                        className="absolute inset-0 rounded-xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          borderColor: notification.type === 'critical' ? '#ef4444' :
                                      notification.type === 'warning' ? '#f97316' :
                                      notification.type === 'success' ? '#22c55e' : '#3b82f6'
                        }}
                        animate={{
                          boxShadow: [
                            `0 0 0px ${notification.type === 'critical' ? '#ef4444' :
                                      notification.type === 'warning' ? '#f97316' :
                                      notification.type === 'success' ? '#22c55e' : '#3b82f6'}`,
                            `0 0 15px ${notification.type === 'critical' ? '#ef444440' :
                                       notification.type === 'warning' ? '#f9731640' :
                                       notification.type === 'success' ? '#22c55e40' : '#3b82f640'}`,
                            `0 0 0px ${notification.type === 'critical' ? '#ef4444' :
                                      notification.type === 'warning' ? '#f97316' :
                                      notification.type === 'success' ? '#22c55e' : '#3b82f6'}`
                          ]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-blue-500/20">
                <motion.button
                  className="w-full py-2 text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Mark All as Read
                </motion.button>
              </div>
            </div>

            {/* Animated side glow */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-500"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default NotificationsPanel;