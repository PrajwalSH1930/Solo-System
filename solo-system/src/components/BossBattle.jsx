import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function BossBattle() {
  const { bossHealth, bossMaxHealth, attackBoss, bossActive } = useHunterStore();

  if (!bossActive) return null;

  const healthPercentage = (bossHealth / bossMaxHealth) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black/95 z-[70] flex flex-col items-center justify-center p-6 text-center font-system"
    >
      <h2 className="text-red-600 text-xs font-black tracking-[0.5em] mb-2 animate-pulse uppercase">Rank Advancement Test</h2>
      <h1 className="text-4xl font-bold text-white mb-8 tracking-tighter">BOSS: BLOOD-RED IGRIS</h1>
      
      {/* Boss Health Bar */}
      <div className="w-full max-w-sm h-4 bg-gray-900 border border-red-900 rounded-full overflow-hidden mb-12">
        <motion.div 
          animate={{ width: `${healthPercentage}%` }}
          className="h-full bg-gradient-to-r from-red-600 to-red-400 shadow-[0_0_15px_#ef4444]"
        />
      </div>

      <button 
        onClick={attackBoss}
        className="group relative px-12 py-6 border-2 border-red-600 text-red-600 font-black text-xl hover:bg-red-600 hover:text-white transition-all overflow-hidden"
      >
        <span className="relative z-10 uppercase">Strike Boss</span>
        <motion.div 
          whileTap={{ scale: 2, opacity: 0 }}
          className="absolute inset-0 bg-red-500 opacity-20"
        />
      </button>

      <p className="mt-8 text-[10px] text-gray-500 uppercase italic">Damage scales with your Strength stat</p>
    </motion.div>
  );
}