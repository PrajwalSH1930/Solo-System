import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState, useEffect } from 'react';

export default function JobTrialOverlay() {
  const { triggerAwakening } = useHunterStore();
  const [repCount, setRepCount] = useState(0);
  const [codingSeconds, setCodingSeconds] = useState(0);
  const [isFocusing, setIsFocusing] = useState(false);

  useEffect(() => {
    let interval;
    if (isFocusing) { interval = setInterval(() => setCodingSeconds(prev => prev + 1), 1000); }
    return () => clearInterval(interval);
  }, [isFocusing]);

  const targetReps = 300;
  const targetSeconds = 4 * 60 * 60; // 4 Hours
  const isComplete = repCount >= targetReps && codingSeconds >= targetSeconds;

  return (
    <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6 font-system">
      <div className="w-full max-w-md border-2 border-purple-500 bg-slate-900 p-8 rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.4)] text-center">
        <h2 className="text-purple-500 text-xs font-black tracking-[0.5em] mb-4 animate-pulse">CLASS ADVANCEMENT TRIAL</h2>
        <h1 className="text-3xl font-black italic text-white mb-8">THE MONARCH'S ASCENSION</h1>
        <div className="space-y-6 mb-10 text-left">
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Physical Trial</span>
              <span className="text-xs font-black text-white">{repCount} / {targetReps} REPS</span>
            </div>
            <button onClick={() => setRepCount(prev => prev + 10)} className="w-full py-2 bg-purple-500/10 border border-purple-500/30 text-[9px] text-purple-400 uppercase font-bold">+10 Reps</button>
          </div>
          <div className="bg-white/5 p-4 border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Mental Fortitude</span>
              <span className="text-xs font-black text-white">{Math.floor(codingSeconds / 3600)}h {Math.floor((codingSeconds % 3600) / 60)}m</span>
            </div>
            <button onClick={() => setIsFocusing(!isFocusing)} className={`w-full py-2 border text-[9px] uppercase font-bold ${isFocusing ? 'border-red-500 text-red-500' : 'border-emerald-500 text-emerald-500'}`}>
              {isFocusing ? "Stop Focus Session" : "Start Focus Session"}
            </button>
          </div>
        </div>
        <button disabled={!isComplete} onClick={() => triggerAwakening("Shadow Monarch")} className={`w-full py-4 font-black tracking-[0.4em] uppercase transition-all ${isComplete ? 'bg-purple-600 text-white shadow-[0_0_30px_#a855f7]' : 'bg-gray-800 text-gray-600 opacity-50'}`}>
          {isComplete ? "Arise as Monarch" : "Trial in Progress"}
        </button>
      </div>
    </div>
  );
}