import { useHunterStore } from '../store/useHunterStore';
import { DUNGEON_LIST } from '../store/slices/questSlice'; 
import { motion } from 'framer-motion';

export default function DungeonPanel() {
  const { inDungeon, dungeonTimer, enterDungeon, activeDungeon, rank: playerRank } = useHunterStore();
  const ranks = ["E", "D", "C", "B", "A", "S"];

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rs = s % 60;
    return h > 0 ? `${h}h ${m}m ${rs}s` : `${m}m ${rs}s`;
  };

  const isLocked = (gateRank) => ranks.indexOf(playerRank) < ranks.indexOf(gateRank);

  if (inDungeon) {
    return (
      <div className="w-full max-w-md border-t-2 border-b-2 border-purple-500/50 py-8 px-6 bg-gradient-to-b from-purple-900/20 to-black mb-6 text-center backdrop-blur-xl relative overflow-hidden">
        <motion.div 
          animate={{ top: ['0%', '100%', '0%'] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 w-full h-[2px] bg-purple-400/30 blur-sm z-0"
        />
        
        <h2 className="text-purple-400 text-[10px] font-black tracking-[0.5em] mb-6 uppercase italic drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
          Extraction Phase: {activeDungeon?.type}
        </h2>
        
        <div className="text-6xl font-black text-white mb-4 font-mono tracking-tighter italic">
          {formatTime(dungeonTimer)}
        </div>
        
        <div className="flex justify-center gap-4 mb-6">
            <span className="text-[8px] text-purple-300/50 uppercase tracking-widest animate-pulse">Analyzing Mana...</span>
            <span className="text-[8px] text-purple-300/50 uppercase tracking-widest animate-pulse delay-75">Stabilizing Gate...</span>
        </div>

        <div className="w-full h-2 bg-gray-900/50 rounded-full p-[2px] border border-white/10 shadow-inner">
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: activeDungeon ? `${(dungeonTimer / activeDungeon.time) * 100}%` : "0%" }}
            transition={{ ease: "linear" }}
            className={`h-full rounded-full ${activeDungeon?.color === 'red' ? 'bg-gradient-to-r from-red-600 to-orange-500 shadow-[0_0_15px_#ef4444]' : 'bg-gradient-to-r from-purple-600 to-cyan-400 shadow-[0_0_15px_#9333ea]'}`}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mb-6 font-system">
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <h2 className="text-[12px] text-white font-black tracking-[0.2em] uppercase italic">Gate Radar</h2>
          <div className="h-1 w-12 bg-purple-600 mt-1" />
        </div>
        <div className="text-right">
          <p className="text-[8px] text-gray-500 uppercase tracking-widest">Auth Level</p>
          <p className="text-sm font-bold text-purple-500">RANK-{playerRank}</p>
        </div>
      </div>

      <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar py-2 px-1">
        {Object.entries(DUNGEON_LIST).map(([key, gate]) => {
          const locked = isLocked(gate.rank);
          const glowColor = gate.color === 'red' ? 'rgba(239, 68, 68, 0.2)' : 
                            gate.color === 'orange' ? 'rgba(249, 115, 22, 0.2)' : 
                            gate.color === 'blue' ? 'rgba(59, 130, 246, 0.2)' :
                            'rgba(168, 85, 247, 0.2)';

          return (
            <motion.button 
              whileTap={!locked ? { scale: 0.98 } : {}}
              key={key}
              disabled={locked}
              onClick={() => enterDungeon(key)}
              className={`w-full group relative flex flex-col p-4 rounded-sm border-l-4 transition-all duration-300 
                ${locked 
                  ? 'border-gray-800 bg-gray-900/20 grayscale opacity-40' 
                  : `bg-white/[0.03] hover:bg-white/[0.07] ${
                      gate.color === 'red' ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : 
                      gate.color === 'orange' ? 'border-orange-500' : 'border-purple-600' 
                    }`
                }`}
            >
              <div className="w-full flex justify-between items-start z-10">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${locked ? 'text-gray-500' : 'text-white'}`}>
                      {key.replace('-', ' ')}
                    </span>
                    {locked && <span className="text-[10px]">🔒</span>}
                  </div>
                  <p className="text-[8px] text-gray-500 uppercase font-bold tracking-[0.2em]">{gate.type} Protocol</p>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className={`text-[12px] font-black italic ${locked ? 'text-gray-600' : 'text-white'}`}>
                    {gate.rank}
                  </div>
                  <div className="text-[9px] text-gray-500 font-mono">{gate.time >= 3600 ? `${gate.time/3600}h` : `${gate.time/60}m`}</div>
                </div>
              </div>

              {/* LORE SECTION - Separated from the flex row */}
              {!locked && gate.lore && (
                <div className="mt-2 text-left border-t border-white/5 pt-2">
                  <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest italic opacity-80 leading-tight">
                    &gt; {gate.lore}
                  </p>
                </div>
              )}

              {/* LOCKED WARNING SECTION */}
              {locked && (
                <div className="mt-3 w-full h-[1px] bg-gray-800">
                   <div className="w-full text-center text-[7px] text-red-600 font-black uppercase pt-1 tracking-widest">
                      Access Denied: Rank Insufficient
                   </div>
                </div>
              )}

              {/* Hover Glow Effect */}
              {!locked && (
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)` }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}