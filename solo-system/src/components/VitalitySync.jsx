import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState, useEffect } from 'react';

export default function VitalitySync() {
  const { totalStepsToday, syncHealthData, lastSyncTimestamp, isAwakened, showXPPop } = useHunterStore();
  const [isSyncing, setIsSyncing] = useState(false);
  
  const GOAL = 10000;
  const progress = Math.min((totalStepsToday / GOAL) * 100, 100);
  
  const accentColor = isAwakened ? "rgb(168, 85, 247)" : "rgb(16, 185, 129)";
  const textColor = isAwakened ? "text-purple-400" : "text-emerald-400";
  const barColor = isAwakened ? "bg-purple-500" : "bg-emerald-500";
  const glowShadow = isAwakened ? "shadow-[0_0_20px_rgba(168,85,247,0.5)]" : "shadow-[0_0_20px_rgba(16,185,129,0.5)]";

  // Auto-sync every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => syncHealthData(), 60000);
    return () => clearInterval(interval);
  }, [syncHealthData]);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncHealthData();
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className="w-full max-w-md relative group">
      {/* 🔮 THE OUTER GLOW BOUNDARY */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${isAwakened ? 'from-purple-600 to-blue-600' : 'from-emerald-600 to-teal-600'} rounded-sm blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>

      <div className="relative bg-[#0a0a0a] border border-white/10 p-6 backdrop-blur-3xl overflow-hidden shadow-2xl">
        
        {/* 📟 SYSTEM OVERLAY: Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

        {/* ⚔️ XP FLOATING POPUP */}
        <AnimatePresence>
          {showXPPop && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -150, scale: 1.5 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            >
              <span className={`text-3xl font-black italic ${textColor} drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]`}>
                LEVEL UP +500
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. HEADER: TYPE & DATA */}
        <div className="flex justify-between items-end mb-8 relative z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`h-[1px] w-6 ${barColor}`} />
              <motion.h3 
                animate={isSyncing ? { opacity: [1, 0.4, 1] } : {}}
                className={`text-[10px] ${textColor} font-black uppercase tracking-[0.5em] italic`}
              >
                Vessel Vitality
              </motion.h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'animate-ping' : ''} ${barColor}`} />
              <p className="text-[7px] text-white/40 uppercase tracking-[0.3em] font-bold font-mono">Status: Re-Calibrating</p>
            </div>
          </div>

          <div className="text-right">
            <motion.div 
              key={totalStepsToday}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-4xl font-black italic text-white tracking-tighter tabular-nums leading-none"
            >
              {totalStepsToday.toLocaleString()}
            </motion.div>
            <p className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mt-1">Steps Collected</p>
          </div>
        </div>

        {/* 2. PROGRESS SECTION: The "Mana Core" */}
        <div className="relative mb-8 px-1">
          <div className="flex justify-between text-[8px] mb-2 font-black uppercase tracking-widest text-white/20">
            <span>Core Integration</span>
            <span className={textColor}>{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full h-3 bg-white/[0.03] rounded-sm border border-white/5 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className={`h-full ${barColor} ${glowShadow} relative`}
            >
              {/* Shimmer Effect */}
              <motion.div 
                animate={{ x: ['-100%', '250%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-40"
              />
            </motion.div>
            {/* Background Grid for the bar */}
            <div className="absolute inset-0 bg-[grid:4px_4px] bg-[size:8px_8px] opacity-10 pointer-events-none" />
          </div>
        </div>

        {/* 3. ACTION: The Sync Trigger */}
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="relative w-full py-4 group/btn transition-all active:scale-[0.97]"
        >
          {/* Beveled corners effect */}
          <div className={`absolute inset-0 border border-white/10 group-hover/btn:border-${isAwakened ? 'purple' : 'emerald'}-500/50 skew-x-[-12deg] bg-white/[0.02] transition-all`} />
          
          <span className={`relative z-10 ${textColor} text-[11px] font-black uppercase tracking-[0.6em] flex justify-center items-center gap-4`}>
            {isSyncing ? (
              <span className="animate-pulse">Accessing Records...</span>
            ) : "Manual Synchronize"}
          </span>
          
          {/* Hover Glow Liquid */}
          <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-10 transition-opacity skew-x-[-12deg] bg-${isAwakened ? 'purple' : 'emerald'}-500`} />
        </button>

        {/* 4. METADATA FOOTER */}
        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center relative z-20">
          <div className="text-[7px] text-white/20 font-bold uppercase tracking-widest leading-relaxed">
            <p>Arch: Solo-V4</p>
            <p>Node: {isAwakened ? "MONARCH_PRIME" : "HUMAN_VESSEL"}</p>
          </div>
          <div className="text-right">
             <p className="text-[7px] text-white/20 font-bold uppercase tracking-widest mb-1">Last Transmission</p>
             <p className={`text-[9px] font-mono font-bold ${textColor}`}>
               {lastSyncTimestamp ? new Date(lastSyncTimestamp).toLocaleTimeString() : "PENDING..."}
             </p>
          </div>
        </div>

        {/* Decorative HUD Flairs */}
        <div className={`absolute top-2 right-2 w-1 h-1 ${barColor} opacity-50`} />
        <div className={`absolute top-4 right-2 w-1 h-1 ${barColor} opacity-20`} />
      </div>

      {/* ANGULAR BRACKETS */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${isAwakened ? 'border-purple-500/40' : 'border-emerald-500/40'} pointer-events-none`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${isAwakened ? 'border-purple-500/40' : 'border-emerald-500/40'} pointer-events-none`} />
    </div>
  );
}