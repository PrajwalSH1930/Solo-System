import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function VitalitySync() {
  const { totalStepsToday, syncHealthData, lastSyncTimestamp } = useHunterStore();

  return (
    <div className="w-full max-w-md bg-black/60 border border-emerald-500/30 p-4 rounded-lg mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Vitality Sync</h3>
          <p className="text-[7px] text-gray-500 uppercase">Physical Movement Data</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-mono text-white font-bold">{totalStepsToday.toLocaleString()}</p>
          <p className="text-[7px] text-gray-500 uppercase font-bold">Steps Tracked</p>
        </div>
      </div>

      {/* Progress towards 10km (approx 12,500 steps) */}
      <div className="w-full h-1 bg-gray-900 rounded-full mb-4 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((totalStepsToday / 12500) * 100, 100)}%` }}
          className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
        />
      </div>

      <button 
        onClick={syncHealthData}
        className="w-full py-2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 text-[9px] font-black uppercase hover:bg-emerald-500 hover:text-black transition-all tracking-[0.2em]"
      >
        Synchronize Vitality
      </button>
      
      {lastSyncTimestamp && (
        <p className="text-[6px] text-gray-600 text-center mt-2 uppercase">
          Last Sync: {new Date(lastSyncTimestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}