import { useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';

export default function QuestPanel() {
  const [mainGoal, setMainGoal] = useState("");
  const { quests, completeQuest, resetQuests, gainExp, addLog } = useHunterStore();

  const completeMainGoal = () => {
    if (!mainGoal) return;
    gainExp(200); // 4x standard quest reward
    addLog(`MAIN QUEST CLEAR: ${mainGoal}`);
    useHunterStore.setState((state) => ({ gold: state.gold + 1000 })); 
    setMainGoal("");
    alert("MAIN QUEST COMPLETED: +200XP +1000G");
  };

  return (
    <div className="w-full max-w-md border-2 border-orange-500 p-6 rounded-lg bg-black/80 shadow-[0_0_30px_rgba(249,115,22,0.1)] font-system text-white">
      
      {/* NEW: MAIN QUEST SECTION */}
      <div className="mb-8 p-4 border border-hunter-blue/30 bg-blue-950/10">
        <h3 className="text-[9px] text-hunter-blue font-bold uppercase tracking-widest mb-3 italic">Main Quest: Goal of the Day</h3>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your main task..."
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            className="flex-1 bg-black/50 border border-white/10 p-2 text-xs outline-none focus:border-hunter-blue text-white"
          />
          <button 
            onClick={completeMainGoal}
            className="px-4 bg-hunter-blue text-black font-black text-[10px] uppercase hover:bg-white transition-colors"
          >
            Clear
          </button>
        </div>
        <p className="text-[7px] text-gray-500 mt-2 uppercase tracking-tighter italic">Warning: Clearing this grants massive XP and Gold.</p>
      </div>

      <div className="flex justify-between items-center mb-4 border-t border-white/10 pt-4">
        <h2 className="text-[10px] text-orange-500 tracking-[0.2em] font-bold uppercase italic underline">Daily Routine</h2>
        <button onClick={resetQuests} className="text-[8px] text-gray-600 hover:text-white uppercase">[Reset]</button>
      </div>

      <div className="space-y-2">
        {quests.map((quest) => (
          <button 
            key={quest.id} 
            disabled={quest.completed} 
            onClick={() => completeQuest(quest.id)} 
            className={`w-full flex justify-between items-center p-3 border transition-all ${
              quest.completed 
              ? 'border-gray-800 text-gray-600 bg-black/40' 
              : 'border-orange-500/20 hover:border-orange-500 bg-white/5'
            }`}
          >
            <span className={`text-[11px] uppercase italic ${quest.completed ? 'line-through opacity-40' : ''}`}>{quest.title}</span>
            <div className="text-right">
              <p className={`text-[9px] font-bold ${quest.completed ? 'text-green-500' : 'text-orange-500'}`}>{quest.completed ? 'DONE' : `+${quest.reward}XP`}</p>
              {!quest.completed && <p className="text-[7px] text-orange-300">+{quest.goldReward}G</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}