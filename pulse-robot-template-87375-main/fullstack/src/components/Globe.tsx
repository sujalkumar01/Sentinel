import { useEffect, useRef } from "react";

const Globe = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would be where we initialize the 3D globe
    // For now, we'll create a mock CSS-based globe
    if (!containerRef.current) return;

    // Add rotating animation and stars
    const globe = containerRef.current.querySelector('.globe');
    if (globe) {
      // Add rotation animation
      globe.classList.add('animate-spin');
    }
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      
      {/* Background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Globe */}
      <div className="relative">
        <div 
          className="globe w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 via-accent/30 to-primary/40 shadow-2xl"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
              conic-gradient(from 0deg, 
                rgba(34, 197, 94, 0.1) 0deg, 
                rgba(59, 130, 246, 0.1) 90deg, 
                rgba(34, 197, 94, 0.1) 180deg, 
                rgba(59, 130, 246, 0.1) 270deg, 
                rgba(34, 197, 94, 0.1) 360deg
              )
            `,
            animation: 'spin 60s linear infinite',
          }}
        >
          {/* Globe surface details */}
          <div className="absolute inset-4 rounded-full opacity-30">
            {/* Continents mockup */}
            <div className="absolute top-8 left-12 w-16 h-12 bg-primary/40 rounded-lg transform rotate-12"></div>
            <div className="absolute top-20 right-16 w-12 h-8 bg-primary/40 rounded-lg transform -rotate-6"></div>
            <div className="absolute bottom-16 left-20 w-20 h-10 bg-primary/40 rounded-lg transform rotate-45"></div>
            <div className="absolute bottom-8 right-12 w-14 h-16 bg-primary/40 rounded-lg transform -rotate-12"></div>
          </div>

          {/* Scanning effect */}
          <div className="absolute inset-0 rounded-full border-2 border-accent/50 animate-ping"></div>
          <div className="absolute inset-2 rounded-full border border-primary/30 animate-pulse"></div>
        </div>

        {/* Orbit rings */}
        <div className="absolute inset-0 rounded-full border border-accent/20 transform rotate-12" style={{ width: '120%', height: '120%', left: '-10%', top: '-10%' }}></div>
        <div className="absolute inset-0 rounded-full border border-primary/20 transform -rotate-12" style={{ width: '140%', height: '140%', left: '-20%', top: '-20%' }}></div>
      </div>

      {/* Scanning grid overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full gap-1">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-accent/20"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Globe;