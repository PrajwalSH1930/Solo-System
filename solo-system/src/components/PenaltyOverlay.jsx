import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function PenaltyOverlay() {
  const { penaltyActive, timeLeft } = useHunterStore();

  if (!penaltyActive) return null;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[300] bg-red-950/95 flex flex-col items-center justify-center p-8 font-system text-white text-center"
    >
      <motion.div 
        animate={{ scale: [1, 1.02, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-8"
      >
        <h2 className="text-red-500 text-xs font-black tracking-[0.5em] mb-2 uppercase">System Warning</h2>
        <h1 className="text-5xl font-black italic tracking-tighter uppercase mb-4">Penalty Quest</h1>
        <div className="h-1 w-64 bg-red-600 mx-auto" />
      </motion.div>

      <div className="max-w-xs mb-10">
        <p className="text-[10px] text-red-200 uppercase tracking-widest leading-relaxed mb-6">
          The player has failed to comply with the required rest protocol. 
          A penalty has been issued. Survival is the only objective.
        </p>
        
        <div className="bg-black/40 border border-red-600 p-4">
          <p className="text-[8px] text-gray-400 uppercase mb-1">Time Remaining</p>
          <p className="text-3xl font-mono font-bold text-red-500">{formatTime(timeLeft)}</p>
        </div>
      </div>

      <div className="space-y-2 text-[10px] text-red-400 uppercase font-bold italic">
        <p>! Penalty: Experience Gain Disabled</p>
        <p>! Penalty: Gold Collection Disabled</p>
        <p>! Penalty: Shadow Army Unresponsive</p>
      </div>

      <p className="mt-12 text-[7px] text-red-700 uppercase tracking-[0.4em] animate-pulse">
        Do not close the system during the penalty phase.
      </p>
    </motion.div>
  );
}