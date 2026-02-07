import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState } from 'react';

export default function VitalitySync() {
  // Pulling from the unified store (Health + Player slices)
  const { 
    totalStepsToday, 
    syncHealthData, 
    lastSyncTimestamp, 
    isAwakened, 
    showXPPop 
  } = useHunterStore();

  const [isSyncing, setIsSyncing] = useState(false);
  
  const GOAL = 10000;
  const progress = Math.min((totalStepsToday / GOAL) * 100, 100);
  
  // Dynamic Theme Variables
  const themeColor = isAwakened ? "rgba(168, 85, 247, 0.6)" : "rgba(16, 185, 129, 0.6)";
  const textColor = isAwakened ? "text-purple-400" : "text-emerald-400";
  const barColor = isAwakened ? "bg-purple-500" : "bg-emerald-500";
  const glowShadow = isAwakened ? "shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "shadow-[0_0_15px_rgba(16,185,129,0.4)]";

  const handleSync = async () => {
    setIsSyncing(true);
    await syncHealthData();
    // 1.5s delay to allow the "Updating Vessel" animation to feel weighty
    setTimeout(() => setIsSyncing(false), 1500);
  };

  return (
    <div className={`w-full max-w-md relative overflow-hidden bg-black/40 border border-white/10 p-6 backdrop-blur-xl rounded-sm mb-8 group shadow-2xl`}>
      
      {/* ⚔️ XP FLOATING POPUP: Triggered on Milestone */}
      <AnimatePresence>
        {showXPPop && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -120, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none text-center"
          >
            <span className={`text-2xl font-black italic ${textColor} drop-shadow-[0_0_15px_currentColor] block`}>
              +500 EXP
            </span>
            <span className="text-[8px] text-white font-black uppercase tracking-[0.3em] bg-black/80 px-2 py-0.5 rounded border border-white/10">
              Daily Vessel Strengthened
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP SECTION: DATA & STATUS */}
      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <motion.h3 
            animate={isSyncing ? { opacity: [1, 0.5, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className={`text-[11px] ${textColor} font-black uppercase tracking-[0.4em] mb-1 italic`}
          >
            Vitality Link
          </motion.h3>
          <div className="flex items-center gap-2">
            <div className={`w-1 h-1 rounded-full ${isSyncing ? 'animate-ping' : ''} ${barColor}`} />
            <p className="text-[7px] text-gray-500 uppercase tracking-widest font-bold">Biometric Stream: ACTIVE</p>
          </div>
        </div>

        <div className="text-right">
          <motion.div 
            key={totalStepsToday}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl font-black italic text-white tracking-tighter tabular-nums"
          >
            {totalStepsToday.toLocaleString()}
          </motion.div>
          <p className="text-[8px] text-gray-600 uppercase font-black tracking-[0.2em]">Physical Steps</p>
        </div>
      </div>

      {/* 2. CENTER SECTION: THE LIQUID PROGRESS BAR */}
      <div className="relative mb-6">
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ 
                width: `${progress}%`,
                backgroundColor: showXPPop ? "#fff" : undefined // Flash white on goal reach
            }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
            className={`h-full ${barColor} ${glowShadow} relative`}
          >
            {/* Liquid Mana Streak */}
            <motion.div 
              animate={{ x: ['-100%', '300%'] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-32"
            />
          </motion.div>
        </div>

        <div className="flex justify-between mt-2 items-center">
          <span className="text-[7px] text-gray-700 font-bold uppercase tracking-widest italic">Sync Efficiency</span>
          <span className={`text-[9px] font-black italic ${textColor} flex items-center gap-1`}>
            {Math.round(progress)}% <span className="text-[6px] text-gray-600 font-normal">COMPLETED</span>
          </span>
        </div>
      </div>

      {/* 3. INTERACTION: THE SYNC TRIGGER */}
      <div className="relative group/btn">
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className={`relative w-full py-4 overflow-hidden bg-white/[0.02] border border-white/10 group-hover/btn:border-${isAwakened ? 'purple' : 'emerald'}-500/50 transition-all duration-500 active:scale-[0.98]`}
        >
          <span className={`relative z-10 ${textColor} text-[10px] font-black uppercase tracking-[0.5em] flex justify-center items-center gap-3`}>
            {isSyncing ? (
              <>
                <div className={`w-3 h-3 border-2 ${isAwakened ? 'border-purple-500' : 'border-emerald-500'} border-t-transparent rounded-full animate-spin`} />
                Updating Vessel...
              </>
            ) : "Synchronize Vitality"}
          </span>

          {/* Liquid Fill Effect on Hover */}
          <div className={`absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-${isAwakened ? 'purple' : 'emerald'}-500/10 to-transparent`} />
        </button>
      </div>

      {/* 4. FOOTER: SYSTEM METADATA */}
      <AnimatePresence>
        {lastSyncTimestamp && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-5 border-t border-white/5 pt-4 space-y-1"
          >
            <div className="flex items-center gap-4 text-[7px] text-gray-600 font-bold tracking-[0.2em] uppercase">
              <span>Node: REALME-12P+</span>
              <div className="w-[1px] h-2 bg-gray-800" />
              <span>Freq: 2.4GHz</span>
              <div className="w-[1px] h-2 bg-gray-800" />
              <span>Last: {new Date(lastSyncTimestamp).toLocaleTimeString()}</span>
            </div>
            <p className={`text-[6px] ${textColor} opacity-20 uppercase font-black tracking-widest`}>Authorized by the Architect</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cyberpunk Decorative Corner Accents */}
      <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l ${isAwakened ? 'border-purple-500/40' : 'border-emerald-500/40'}`} />
      <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r ${isAwakened ? 'border-purple-500/10' : 'border-emerald-500/10'}`} />
    </div>
  );
}