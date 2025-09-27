import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Globe, Satellite } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 2000);
  };

  const handleDemoLogin = () => {
    setEmail('demo@satellite.ai');
    setPassword('demo123');
    setTimeout(() => onLogin(), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden flex items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Constellation background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo and title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
            >
              <Satellite className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-2"
            animate={{
              textShadow: [
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(59, 130, 246, 0.8)",
                "0 0 10px rgba(59, 130, 246, 0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            SatWatch AI
          </motion.h1>
          <p className="text-gray-400 text-sm">
            Advanced Satellite Intelligence Platform
          </p>
        </motion.div>

        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-8 shadow-2xl"
          style={{
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.1)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300"
                placeholder="your.email@domain.com"
                whileFocus={{
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                }}
                required
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-blue-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                  whileFocus={{
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  className="flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Globe size={20} />
                </motion.div>
              ) : (
                "Access Satellite Network"
              )}
            </motion.button>

            {/* Demo login button */}
            <motion.button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 bg-transparent border border-orange-500/50 hover:border-orange-400 text-orange-300 hover:text-orange-200 font-semibold rounded-xl transition-all duration-300"
              whileHover={{
                boxShadow: "0 0 20px rgba(251, 146, 60, 0.2)",
                scale: 1.02,
              }}
              whileTap={{ scale: 0.98 }}
            >
              Demo Access
            </motion.button>
          </form>

          {/* Footer text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center text-xs text-gray-500 mt-6"
          >
            Powered by advanced AI satellite detection systems
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoginPage;