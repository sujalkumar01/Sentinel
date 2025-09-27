import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoginPage from './components/LoginPage';
import GlobalMapPage from './components/GlobalMapPage';
import ProcessingScreen from './components/ProcessingScreen';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';
import DashboardPage from './components/DashboardPage';
import ProfilePage from './components/ProfilePage';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>
        
        {/* Floating stars */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<GlobalMapPage onProcessing={setShowProcessing} />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </AnimatePresence>

        {/* Processing Overlay */}
        <AnimatePresence>
          {showProcessing && (
            <ProcessingScreen onComplete={() => setShowProcessing(false)} />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;