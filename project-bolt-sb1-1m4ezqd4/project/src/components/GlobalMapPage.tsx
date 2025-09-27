import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Upload, Camera, Crosshair, MapPin } from 'lucide-react';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

interface GlobalMapPageProps {
  onProcessing: (show: boolean) => void;
}

function GlobalMapPage({ onProcessing }: GlobalMapPageProps) {
  const [isGlobeMode, setIsGlobeMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleCapture = () => {
    onProcessing(true);
    setTimeout(() => {
      navigate('/results');
    }, 4000);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onProcessing(true);
      setTimeout(() => {
        navigate('/results');
      }, 4000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onProcessing(true);
      setTimeout(() => {
        navigate('/results');
      }, 4000);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      
      {/* Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-24 left-4 z-40"
      >
        <div className="backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-2xl p-1 shadow-2xl">
          <div className="flex">
            <motion.button
              onClick={() => setIsGlobeMode(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isGlobeMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-blue-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe size={18} />
              <span>Globe Mode</span>
            </motion.button>
            <motion.button
              onClick={() => setIsGlobeMode(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                !isGlobeMode
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-blue-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Upload size={18} />
              <span>Upload Mode</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="pt-24 px-4 pb-24">
        <div className="relative w-full h-[calc(100vh-12rem)] rounded-3xl overflow-hidden">
          {isGlobeMode ? (
            // Globe Mode
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-blue-500/20"
              style={{
                boxShadow: "inset 0 0 100px rgba(59, 130, 246, 0.1)",
              }}
            >
              {/* Globe visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{
                    rotateY: 360,
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  {/* Main globe circle */}
                  <div className="w-80 h-80 border-2 border-blue-500/30 rounded-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30 relative overflow-hidden">
                    {/* Continent outlines */}
                    <div className="absolute inset-4 border border-blue-400/40 rounded-full"></div>
                    <div className="absolute inset-8 border border-cyan-400/30 rounded-full"></div>
                    
                    {/* City dots */}
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                          left: `${20 + Math.random() * 60}%`,
                          top: `${20 + Math.random() * 60}%`,
                        }}
                        animate={{
                          opacity: [0.4, 1, 0.4],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </div>

                  {/* Orbital rings */}
                  <motion.div
                    className="absolute inset-0 border border-blue-400/20 rounded-full"
                    style={{
                      width: '420px',
                      height: '420px',
                      left: '-20px',
                      top: '-20px',
                    }}
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 40,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Coordinates display */}
              <div className="absolute top-6 right-6 backdrop-blur-xl bg-black/20 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <MapPin size={16} className="text-blue-400" />
                  <span>Lat: 40.7128° N</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300 mt-1">
                  <Crosshair size={16} className="text-cyan-400" />
                  <span>Lng: 74.0060° W</span>
                </div>
              </div>
            </motion.div>
          ) : (
            // Upload Mode
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-full h-full"
            >
              {/* Blurred globe background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-blue-500/20 blur-sm opacity-30"></div>
              
              {/* Upload area */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <motion.div
                  className={`backdrop-blur-xl bg-black/20 border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-500/10 scale-105'
                      : 'border-blue-500/40 hover:border-blue-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  whileHover={{
                    boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)",
                  }}
                  style={{
                    width: '500px',
                    height: '400px',
                  }}
                >
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Upload size={48} className="text-blue-400 mx-auto mb-6" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Upload Satellite Image
                  </h3>
                  <p className="text-gray-400 mb-8">
                    Drag and drop your satellite image here, or click to browse files
                  </p>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block cursor-pointer"
                  >
                    <motion.div
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300"
                      whileHover={{
                        boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                        scale: 1.05,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Browse Files
                    </motion.div>
                  </label>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40"
      >
        <motion.button
          onClick={handleCapture}
          disabled={!isGlobeMode}
          className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            isGlobeMode
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-2xl'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={isGlobeMode ? {
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.5)",
            scale: 1.05,
          } : {}}
          whileTap={isGlobeMode ? { scale: 0.95 } : {}}
        >
          <Camera size={24} />
          <span>Capture & Analyze</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default GlobalMapPage;