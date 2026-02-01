import { useHunterStore } from '../store/useHunterStore';
import { motion } from 'framer-motion';

export default function DungeonPanel() {
  const { inDungeon, dungeonTimer, enterDungeon, activeDungeon } = useHunterStore();

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}m ${rs}s`;
  };

  if (inDungeon) {
    return (
      <div className="w-full max-w-md border-2 border-purple-600 p-6 rounded-lg bg-black/90 shadow-[0_0_30px_rgba(147,51,234,0.3)] mb-6 text-center font-system">
        <h2 className="text-purple-500 text-xs font-black tracking-[0.3em] mb-4 animate-pulse uppercase">Inside the Gate</h2>
        <div className="text-4xl font-bold text-white mb-2">{formatTime(dungeonTimer)}</div>
        <p className="text-[10px] text-gray-500 uppercase italic">Objective: Focus until completion</p>
        <div className="w-full h-1 bg-gray-800 mt-4 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: `${(dungeonTimer / activeDungeon.time) * 100}%` }}
            className="h-full bg-purple-600"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md border-2 border-purple-900 p-6 rounded-lg bg-black/80 shadow-[0_0_20px_rgba(147,51,234,0.1)] mb-6 font-system">
      <h2 className="text-[10px] text-purple-500 tracking-[0.2em] font-bold uppercase italic mb-4">Available Gates</h2>
      <div className="space-y-3">
        <button 
          onClick={() => enterDungeon('Instant')}
          className="w-full flex justify-between items-center p-3 border border-purple-900/50 hover:border-purple-500 hover:bg-purple-500/10 transition-all group"
        >
          <span className="text-xs uppercase font-bold tracking-tighter">Instant Dungeon [E-Rank]</span>
          <span className="text-[9px] text-purple-400 group-hover:text-purple-200">1 Min</span>
        </button>
        <button 
          onClick={() => enterDungeon('Red')}
          className="w-full flex justify-between items-center p-3 border border-red-900/50 hover:border-red-500 hover:bg-red-500/10 transition-all group"
        >
          <span className="text-xs uppercase font-bold tracking-tighter text-red-400">Red Gate [B-Rank]</span>
          <span className="text-[9px] text-red-500">25 Min</span>
        </button>
      </div>
    </div>
  );
}