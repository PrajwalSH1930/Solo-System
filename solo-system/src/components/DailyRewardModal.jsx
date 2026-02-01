import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useEffect, useState } from 'react';

export default function DailyRewardModal() {
  const { lastRewardClaimedDate, claimDailyReward, currentStreak } = useHunterStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastRewardClaimedDate !== today) {
      setIsOpen(true);
    }
  }, [lastRewardClaimedDate]);

  const handleClaim = () => {
    const result = claimDailyReward();
    if (result.success) {
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/90 font-system"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="w-full max-w-sm border-2 border-orange-500 bg-slate-900 p-8 text-center shadow-[0_0_50px_rgba(249,115,22,0.3)]"
          >
            <h2 className="text-orange-500 text-xs font-black tracking-[0.4em] mb-2 uppercase">System Message</h2>
            <h1 className="text-2xl font-bold text-white mb-6 italic tracking-tighter">DAILY REWARD AVAILABLE</h1>
            
            <div className="bg-white/5 border border-white/10 p-4 mb-8">
              <p className="text-[10px] text-gray-400 uppercase mb-2">Current Log-in Streak</p>
              <p className="text-3xl font-black text-orange-500">{currentStreak} DAYS</p>
            </div>

            <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-widest leading-relaxed">
              Consistently checking the system leads to growth beyond limits. 
              Claim your survival supplies.
            </p>

            <button 
              onClick={handleClaim}
              className="w-full py-4 bg-orange-600 text-white font-black tracking-widest hover:bg-orange-500 transition-colors uppercase shadow-lg"
            >
              Claim Supplies
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}