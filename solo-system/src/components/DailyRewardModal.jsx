import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useEffect, useState } from 'react';
import { systemSounds } from '../utils/sounds';

export default function DailyRewardModal() {
  const { lastRewardClaimedDate, claimDailyReward, currentStreak, isAwakened } = useHunterStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastRewardClaimedDate !== today) {
      // Delay opening slightly to let the Splash Screen finish completely
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastRewardClaimedDate]);

  const handleClaim = () => {
    systemSounds.click();
    const result = claimDailyReward();
    if (result.success) {
      systemSounds.levelUp(); // Play victory sound for reward
      setIsOpen(false);
    }
  };

  const accentColor = isAwakened ? "text-purple-500" : "text-orange-500";
  const borderColor = isAwakened ? "border-purple-600" : "border-orange-600";
  const glowColor = isAwakened ? "shadow-[0_0_50px_rgba(168,85,247,0.3)]" : "shadow-[0_0_50_rgba(249,115,22,0.3)]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl font-system"
        >
          {/* Background Radiant Light */}
          <div className={`absolute w-72 h-72 rounded-full blur-[100px] opacity-10 ${isAwakened ? 'bg-purple-600' : 'bg-orange-600'}`} />

          <motion.div 
            initial={{ scale: 0.8, y: 30, rotateX: 20 }} 
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            className={`w-full max-w-sm border-t-4 ${borderColor} bg-[#0a0a0a] p-8 text-center relative overflow-hidden ${glowColor}`}
          >
            {/* Header Identity */}
            <div className="mb-6">
              <h2 className={`${accentColor} text-[10px] font-black tracking-[0.5em] mb-2 uppercase italic animate-pulse`}>
                System Notification
              </h2>
              <h1 className="text-3xl font-black text-white italic tracking-tighter leading-none">
                DAILY <span className={accentColor}>SUPPLY</span> DROP
              </h1>
            </div>
            
            {/* Streak Counter: Holographic Style */}
            <div className="relative bg-white/[0.03] border border-white/5 p-6 mb-8 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em] mb-2">Current Login Streak</p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl font-black text-white italic">{currentStreak}</span>
                <span className={`text-xl font-black italic ${accentColor}`}>DAYS</span>
              </div>
            </div>

            {/* Reward Preview */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-black/50 border border-white/5 p-3 flex flex-col items-center">
                <span className="text-xl mb-1">💰</span>
                <span className="text-[8px] text-gray-600 uppercase font-black">Gold</span>
                <span className="text-xs font-bold text-white">+500G</span>
              </div>
              <div className="bg-black/50 border border-white/5 p-3 flex flex-col items-center">
                <span className="text-xl mb-1">⚡</span>
                <span className="text-[8px] text-gray-600 uppercase font-black">Stat Point</span>
                <span className="text-xs font-bold text-white">+1 AP</span>
              </div>
            </div>

            <p className="text-[9px] text-gray-500 mb-10 uppercase tracking-widest leading-relaxed italic opacity-60">
              "The gap between the weak and the strong is narrowed by consistency."
            </p>

            {/* The Arise/Claim Button */}
            <button 
              onClick={handleClaim}
              className={`relative w-full py-5 overflow-hidden transition-all active:scale-95 group`}
            >
              <div className={`absolute inset-0 ${isAwakened ? 'bg-purple-600' : 'bg-orange-600'} transition-colors`} />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <span className="relative z-10 text-white font-black tracking-[0.4em] uppercase text-xs">
                Claim Reward
              </span>
              
              {/* Button Glow Effect */}
              <div className={`absolute inset-0 ${isAwakened ? 'shadow-[inset_0_0_20px_#a855f7]' : 'shadow-[inset_0_0_20px_#f97316]'} opacity-50`} />
            </button>

            {/* Modal Corner Accents */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${borderColor} opacity-30`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${borderColor} opacity-30`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}