import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function HunterLicense({ isOpen, onClose }) {
  const state = useHunterStore();
  const { 
    rank, level, job, currentTitle, joinDate, 
    shadows, stats, currentStreak, playerName, isAwakened 
  } = state;

  if (!isOpen) return null;

  const multiplier = typeof state.getPowerMultiplier === 'function' ? state.getPowerMultiplier() : 1.0;
  const combatPower = Math.floor((stats.strength * 10 + level * 5 + (currentStreak * 2)) * multiplier);

  // --- REFINED COLOR PALETTE ---
  const colors = {
    purple: {
      primary: "text-[#A855F7]",
      border: "border-[#A855F7]",
      bg: "bg-[#A855F7]",
      glow: "shadow-[0_0_30px_rgba(168,85,247,0.4)]",
      gradient: "from-[#A855F7]/20 to-transparent"
    },
    cyan: {
      primary: "text-[#00D4FF]",
      border: "border-[#00D4FF]",
      bg: "bg-[#00D4FF]",
      glow: "shadow-[0_0_30px_rgba(0,212,255,0.4)]",
      gradient: "from-[#00D4FF]/20 to-transparent"
    }
  };

  const active = isAwakened ? colors.purple : colors.cyan;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/98 backdrop-blur-2xl font-system"
    >
      <motion.div 
        initial={{ scale: 0.9, rotateY: 20 }} 
        animate={{ scale: 1, rotateY: 0 }}
        className={`relative w-full max-w-sm border-t-2 border-x ${active.border} bg-[#050505] overflow-hidden rounded-2xl ${active.glow}`}
      >
        {/* Holographic Header */}
        <div className={`relative h-16 ${active.bg} flex items-center px-6 justify-between overflow-hidden`}>
          {/* Animated Background Pattern for Header */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)', backgroundSize: '8px 8px' }} />
          
          <div className="relative z-10">
            <span className="text-[10px] font-black tracking-[0.4em] text-black italic uppercase block leading-none">Hunter Association</span>
            <span className="text-[7px] font-bold text-black/50 uppercase tracking-widest">Dimensional Identity Node</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-black font-black hover:bg-black/30 z-20 transition-all">✕</button>
        </div>

        <div className="p-8 relative">
          {/* Parallax Rank Hexagon */}
          <div className="flex gap-6 mb-8 items-center">
            <div className="relative group">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className={`w-28 h-28 border border-dashed ${active.border} opacity-40 rounded-full absolute -inset-2`}
              />
              <div className={`w-24 h-24 border-2 ${active.border} bg-black flex flex-col items-center justify-center relative shadow-inner`}>
                <span className={`text-5xl font-black italic ${active.primary} drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]`}>{rank}</span>
                <span className={`text-[8px] font-black uppercase mt-1 tracking-widest ${active.primary} opacity-60 italic`}>Rank</span>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter truncate drop-shadow-md">
                {playerName || "Syncing..." }
              </h2>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full animate-ping ${isAwakened ? 'bg-purple-500' : 'bg-cyan-500'}`} />
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${active.primary} italic`}>
                  {currentTitle}
                </p>
              </div>
              
              <div className="bg-white/[0.03] border border-white/5 p-2 rounded-sm">
                <p className="text-[7px] text-gray-500 uppercase font-black tracking-widest mb-1">Authenticated Since</p>
                <p className="text-[9px] font-mono text-gray-300">{joinDate}</p>
              </div>
            </div>
          </div>

          {/* Stats & Power Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-4 rounded-xl">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Hunter Level</p>
                <p className="text-2xl font-black text-white italic leading-none">
                  <span className={`${active.primary} text-xs mr-1 tracking-tighter`}>LV.</span>{level}
                </p>
              </div>
              <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-4 rounded-xl">
                <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest mb-1">Class Type</p>
                <p className={`text-lg font-black italic uppercase tracking-tighter truncate ${active.primary}`}>
                  {job}
                </p>
              </div>
            </div>

            {/* Combat Power Module */}
            <div className={`relative p-5 border ${active.border} bg-gradient-to-r ${active.gradient} rounded-xl overflow-hidden group`}>
               {/* Background Decorative Text */}
               <span className={`absolute -right-2 -bottom-2 text-6xl font-black italic opacity-5 pointer-events-none ${active.primary}`}>POW</span>
               
               <div className="flex justify-between items-start mb-2 relative z-10">
                 <div>
                   <p className="text-[8px] text-gray-500 uppercase font-black tracking-[0.4em] mb-1">Current Combat Power</p>
                   <p className={`text-4xl font-black italic tracking-tighter ${active.primary} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`}>
                     {combatPower.toLocaleString()}
                   </p>
                 </div>
                 <div className="text-right">
                   <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest">Legion</p>
                   <p className="text-xs font-black text-white italic">{shadows.length} Units</p>
                 </div>
               </div>
               
               <div className="w-full h-[2px] bg-black/40 rounded-full mt-3 overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} animate={{ width: `${(currentStreak / 30) * 100}%` }}
                   className={`h-full ${active.bg}`}
                 />
               </div>
               <p className="text-[7px] text-gray-600 uppercase mt-2 italic font-bold tracking-widest">Streak Bonus Applied: +{(currentStreak * 2)} Points</p>
            </div>
          </div>
        </div>

        {/* Association Footer */}
        <div className="bg-black py-4 px-8 border-t border-white/5 flex justify-between items-center relative">
          <div className="flex flex-col">
            <p className="text-[8px] text-white font-black uppercase italic tracking-widest">Hunter ID: {playerName?.substring(0,3)}-{level}-2026</p>
            <p className="text-[6px] text-gray-700 uppercase tracking-widest mt-0.5">Association Seal Encrypted</p>
          </div>
          <div className={`w-10 h-10 border ${active.border} rotate-45 flex items-center justify-center opacity-30`}>
             <div className={`w-6 h-6 border ${active.border}`} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}