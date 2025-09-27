import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Radar, Satellite, Brain, CheckCircle } from 'lucide-react';

interface ProcessingScreenProps {
  onComplete: () => void;
}

const steps = [
  { icon: Satellite, text: "Fetching satellite image...", duration: 1000 },
  { icon: Brain, text: "Running AI detection model...", duration: 1500 },
  { icon: Radar, text: "Analyzing object patterns...", duration: 1000 },
  { icon: CheckCircle, text: "Comparing with historical data...", duration: 500 }
];

function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        setProgress((index + 1) / steps.length * 100);
      }, totalTime);
      totalTime += step.duration;
    });

    setTimeout(() => {
      onComplete();
    }, totalTime);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
    >
      <div className="text-center">
        {/* Main globe with scanning effect */}
        <div className="relative mb-12">
          <motion.div
            className="w-64 h-64 border-2 border-blue-500/30 rounded-full bg-gradient-to-br from-blue-900/30 to-cyan-900/30 relative overflow-hidden mx-auto"
            animate={{
              rotateY: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Radar sweep effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
              style={{
                clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)",
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Scanning dots */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-cyan-400 rounded-full"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>

          {/* Orbital rings */}
          <motion.div
            className="absolute inset-0 border border-blue-400/20 rounded-full"
            style={{
              width: '300px',
              height: '300px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </motion.div>
        </div>

        {/* Status text */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <motion.div
              animate={{
                rotate: currentStep < steps.length - 1 ? 360 : 0,
              }}
              transition={{
                duration: 1,
                repeat: currentStep < steps.length - 1 ? Infinity : 0,
                ease: "linear",
              }}
            >
              {steps[currentStep] && (() => {
                const IconComponent = steps[currentStep].icon;
                return (
                  <IconComponent 
                    size={24} 
                    className={currentStep === steps.length - 1 ? "text-green-400" : "text-blue-400"} 
                  />
                );
              })()}
            </motion.div>
            <span className="text-xl text-white font-medium">
              {steps[currentStep]?.text}
            </span>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            {steps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index <= currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
                animate={{
                  scale: index === currentStep ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 0.5,
                  repeat: index === currentStep ? Infinity : 0,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="text-center mt-2 text-gray-400 text-sm">
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Scanning lines effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
              animate={{
                top: ['0%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ProcessingScreen;