import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function ManaCore() {
  const { isFocusActive, manaChargeProgress, startFocusMode, isAwakened } = useHunterStore();

  const themeColor = isAwakened ? "border-purple-500" : "border-emerald-500";
  const shadowColor = isAwakened ? "shadow-[0_0_20px_#a855f7]" : "shadow-[0_0_20px_#10b981]";

  return (
    <div className="w-full max-w-md flex flex-col items-center p-8 bg-black/40 backdrop-blur-md border border-white/5 rounded-sm">
      <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.4em] mb-8 italic">Mana Sensing Mode</h3>
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Pulsing Ring */}
        <motion.div
          animate={isFocusActive ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`absolute inset-0 rounded-full border-2 ${themeColor} ${shadowColor} opacity-20`}
        />
        
        {/* Progress Circle (SVG) */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="96" cy="96" r="80"
            stroke="currentColor" strokeWidth="2" fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            cx="96" cy="96" r="80"
            stroke="currentColor" strokeWidth="4" fill="transparent"
            strokeDasharray="502"
            animate={{ strokeDashoffset: 502 - (502 * manaChargeProgress) / 100 }}
            className={isAwakened ? "text-purple-500" : "text-emerald-500"}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-black italic text-white tracking-tighter">
            {isFocusActive ? `${manaChargeProgress.toFixed(0)}%` : "IDLE"}
          </span>
          <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest">
            {isFocusActive ? "Sensing Mana" : "Ready to Focus"}
          </span>
        </div>
      </div>

      <button
        onClick={startFocusMode}
        disabled={isFocusActive}
        className={`mt-10 w-full py-3 border ${isFocusActive ? 'border-gray-800 text-gray-700' : 'border-white/20 text-white'} text-[9px] font-black uppercase tracking-[0.4em] transition-all`}
      >
        {isFocusActive ? "Focusing... Do Not Move" : "Initiate Focus"}
      </button>

      {isFocusActive && (
        <p className="mt-4 text-[6px] text-red-500/50 uppercase tracking-widest animate-pulse">
          Warning: Any movement will break the connection.
        </p>
      )}
    </div>
  );
}