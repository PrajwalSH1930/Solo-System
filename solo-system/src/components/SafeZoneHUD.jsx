import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function SafeZoneHUD() {
  const { isInsideSafeZone, homeLocation, setHomeBase, checkLocationTask } = useHunterStore();

  // Auto-check location every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      checkLocationTask();
    }, 300000); 
    return () => clearInterval(interval);
  }, [checkLocationTask]);

  return (
    <div className="w-full max-w-md mx-auto mb-4 relative overflow-hidden bg-black/60 border border-white/10 p-4 backdrop-blur-md rounded-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={isInsideSafeZone ? { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-2 h-2 rounded-full ${isInsideSafeZone ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-orange-500 shadow-[0_0_10px_#f97316]'}`}
          />
          <div>
            <p className={`text-[10px] font-black uppercase tracking-widest ${isInsideSafeZone ? 'text-blue-400' : 'text-orange-400'}`}>
              {isInsideSafeZone ? "Safe Zone Detected" : "The Wild Area"}
            </p>
            <p className="text-[7px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">
              {isInsideSafeZone ? "Recovery Multiplier: 2.0x" : "Hazard Level: Moderate"}
            </p>
          </div>
        </div>

        {!homeLocation.lat ? (
          <button 
            onClick={setHomeBase}
            className="text-[8px] font-black bg-blue-600/10 border border-blue-500/50 text-blue-400 px-3 py-2 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
          >
            Register Home Base
          </button>
        ) : (
          <button onClick={checkLocationTask} className="text-xs opacity-50 hover:opacity-100 transition-opacity">
            🛰️
          </button>
        )}
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/5" />
    </div>
  );
}