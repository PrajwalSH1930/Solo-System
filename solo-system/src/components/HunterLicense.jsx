import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function HunterLicense({ isOpen, onClose }) {
  // Added getPowerMultiplier to the destructuring list
  const { rank, level, job, currentTitle, joinDate, shadows, stats, currentStreak, getPowerMultiplier } = useHunterStore();

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 font-system text-white"
    >
      <div className="relative w-full max-w-sm border-2 border-hunter-blue bg-slate-900 overflow-hidden rounded-xl shadow-[0_0_50px_rgba(0,212,255,0.3)]">
        
        <div className="bg-hunter-blue h-12 flex items-center px-4 justify-between">
          <span className="text-[10px] font-black tracking-[0.3em] text-black italic uppercase">Hunter Association</span>
          <button onClick={onClose} className="text-black font-bold hover:scale-110 transition-transform">✕</button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-24 h-24 border border-hunter-blue/50 bg-black flex items-center justify-center relative">
               <div className="text-4xl font-black text-hunter-blue italic">{rank}</div>
               <div className="absolute bottom-0 w-full bg-hunter-blue/20 text-[8px] text-center py-1 font-bold uppercase tracking-tighter">Rank {rank}</div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
               <h2 className="text-xl font-bold tracking-tighter italic leading-none mb-1 text-white uppercase">Prajwal Hiremath</h2>
               <p className="text-[10px] text-hunter-blue uppercase tracking-widest mb-2 font-bold">{currentTitle !== "None" ? currentTitle : 'Newbie Hunter'}</p>
               <div className="h-[1px] bg-white/10 w-full mb-2" />
               <p className="text-[9px] text-gray-500 uppercase tracking-tighter mb-1">Registration: {joinDate}</p>
               <div className="flex items-center gap-2">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Streak:</p>
                  <p className="text-xs font-bold text-orange-500">{currentStreak} Days</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4 mb-6">
            <div>
              <p className="text-[8px] text-gray-500 uppercase font-bold">Level</p>
              <p className="text-lg font-bold">{level}</p>
            </div>
            <div>
              <p className="text-[8px] text-gray-500 uppercase font-bold">Class</p>
              <p className="text-lg font-bold text-hunter-blue truncate uppercase tracking-tighter">{job}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-400">
               <span>Shadow Soldiers</span>
               <span className="font-bold text-white">{shadows.length} Units</span>
            </div>
            <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-400">
               <span>Combat Power</span>
               <span className="text-hunter-blue font-black text-sm">
                 {Math.floor((stats.strength * 10 + level * 5 + (currentStreak * 2)) * getPowerMultiplier())}
               </span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-black/40 text-center border-t border-white/5">
           <p className="text-[7px] text-gray-600 uppercase tracking-[0.5em] animate-pulse italic">Authenticity Verified by System</p>
        </div>
      </div>
    </motion.div>
  );
}