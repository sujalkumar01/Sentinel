import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Satellite } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';

function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 right-4 z-50 backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl px-6 py-4 shadow-2xl"
        style={{
          boxShadow: "0 0 30px rgba(59, 130, 246, 0.1)",
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg"
            >
              <Satellite className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SatWatch AI
            </span>
          </motion.div>

          {/* Search bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <motion.input
                type="text"
                placeholder="Search coordinates or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                whileFocus={{
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: searchQuery ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 bg-black/30 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all duration-300"
              whileHover={{
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell size={18} />
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.button>

            {/* Profile */}
            <motion.button
              className="p-2 bg-black/30 border border-blue-500/30 rounded-lg text-gray-400 hover:text-blue-400 hover:border-blue-400 transition-all duration-300"
              whileHover={{
                boxShadow: "0 0 15px rgba(59, 130, 246, 0.2)",
                scale: 1.05,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={18} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
}

export default Header;