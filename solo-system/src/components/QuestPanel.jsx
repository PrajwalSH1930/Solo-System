import { useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';
import { motion, AnimatePresence } from 'framer-motion';
import { systemSounds } from '../utils/sounds';

export default function QuestPanel() {
  const [mainGoal, setMainGoal] = useState("");
  const [showMainClear, setShowMainClear] = useState(false);
  const { quests, completeQuest, resetQuests, gainExp, addLog, isAwakened } = useHunterStore();

  const accentColor = isAwakened ? "text-purple-400" : "text-orange-500";
  const borderColor = isAwakened ? "border-purple-500/30" : "border-orange-500/30";
  const barColor = isAwakened ? "bg-purple-600 shadow-[0_0_10px_#a855f7]" : "bg-orange-600 shadow-[0_0_10px_#ea580c]";

  const completedCount = quests.filter(q => q.completed).length;
  const progressWidth = (completedCount / quests.length) * 100;

  const completeMainGoal = () => {
    if (!mainGoal) return;
    systemSounds.levelUp();
    gainExp(200);
    addLog(`MAIN QUEST CLEAR: ${mainGoal}`);
    useHunterStore.setState((state) => ({ gold: state.gold + 1000 })); 
    
    // Trigger Cinematic Message instead of alert
    setShowMainClear(true);
    setTimeout(() => {
      setShowMainClear(false);
      setMainGoal("");
    }, 3000);
  };

  return (
    <div className={`w-full max-w-md border-t border-b ${borderColor} py-6 px-4 bg-black/40 backdrop-blur-md font-system text-white relative overflow-hidden`}>
      
      {/* 1. MAIN QUEST SECTION: Cinematic Input */}
      <div className="mb-10 relative">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[10px] text-cyan-400 font-black uppercase tracking-[0.3em] italic flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
            Main Quest: Objective
          </h3>
          <span className="text-[8px] text-gray-500 font-mono">ID: MON-001</span>
        </div>
        
        <div className="flex group">
          <input 
            type="text" 
            placeholder="Input Daily Directive..."
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            className="flex-1 bg-white/[0.03] border-l-2 border-cyan-500/50 p-3 text-xs outline-none focus:bg-cyan-500/5 transition-all text-white placeholder:text-gray-700"
          />
          <button 
            onClick={completeMainGoal}
            className="px-6 bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 font-black text-[9px] uppercase hover:bg-cyan-500 hover:text-black transition-all active:scale-90"
          >
            Clear
          </button>
        </div>
      </div>

      {/* 2. DAILY ROUTINE HEADER & PROGRESS */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className={`text-[11px] ${accentColor} tracking-[0.2em] font-black uppercase italic`}>Daily Routine</h2>
          <p className="text-[8px] text-gray-600 uppercase font-bold">Standard Training Requirements</p>
        </div>
        <button onClick={() => { systemSounds.click(); resetQuests(); }} className="text-[8px] text-gray-600 hover:text-red-500 transition-colors uppercase font-bold tracking-tighter underline">[Reset System]</button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[2px] bg-white/5 mb-6 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressWidth}%` }}
          className={`h-full ${barColor}`}
        />
      </div>

      {/* 3. QUEST LIST */}
      <div className="space-y-3">
        {quests.map((quest) => (
          <motion.button 
            whileTap={{ scale: 0.98 }}
            key={quest.id} 
            disabled={quest.completed} 
            onClick={() => completeQuest(quest.id)} 
            className={`w-full flex justify-between items-center p-4 border-l-4 transition-all relative overflow-hidden group
              ${quest.completed 
                ? 'border-gray-800 bg-gray-950/50 opacity-40' 
                : `${isAwakened ? 'border-purple-600' : 'border-orange-500'} bg-white/[0.02] hover:bg-white/[0.05]`
              }`}
          >
            <div className="flex flex-col items-start">
              <span className={`text-[10px] font-black uppercase tracking-widest ${quest.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                {quest.title}
              </span>
              <span className="text-[7px] text-gray-600 font-bold uppercase tracking-tighter mt-1">Status: {quest.completed ? 'Verified' : 'Pending'}</span>
            </div>

            <div className="text-right">
              <p className={`text-[10px] font-black italic ${quest.completed ? 'text-green-500' : accentColor}`}>
                {quest.completed ? 'COMPLETE' : `+${quest.reward} XP`}
              </p>
              {!quest.completed && (
                <p className="text-[8px] font-mono text-gray-400 opacity-70">+{quest.goldReward}G</p>
              )}
            </div>

            {/* Subtle scanning effect for incomplete quests */}
            {!quest.completed && (
              <motion.div 
                animate={{ left: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* 4. CINEMATIC SUCCESS OVERLAY */}
      <AnimatePresence>
        {showMainClear && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 p-10 pointer-events-none"
          >
            <div className="text-center">
              <motion.h2 
                animate={{ letterSpacing: ['0.2em', '0.6em', '0.2em'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-cyan-400 text-3xl font-black uppercase italic mb-4 drop-shadow-[0_0_20px_#22d3ee]"
              >
                QUEST CLEARED
              </motion.h2>
              <div className="h-[2px] w-full bg-cyan-400/50 mb-4" />
              <p className="text-white text-xs font-mono uppercase tracking-[0.5em] mb-2">{mainGoal}</p>
              <p className="text-cyan-400/70 text-[10px] font-black uppercase">Reward Obtained: +200XP | +1000G</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}