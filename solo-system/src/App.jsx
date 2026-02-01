import { useEffect, useState } from 'react'
import { useHunterStore } from './store/useHunterStore'
import { motion, AnimatePresence } from 'framer-motion'
import { systemSounds } from './utils/sounds' // Added this import

// Component Imports
import StatusPanel from './components/StatusPanel'
import QuestPanel from './components/QuestPanel'
import StoreOverlay from './components/StoreOverlay'
import PenaltyOverlay from './components/PenaltyOverlay'
import DungeonPanel from './components/DungeonPanel'
import BossBattle from './components/BossBattle'
import LogPanel from './components/LogPanel'
import HunterLicense from './components/HunterLicense'
import DailyRewardModal from './components/DailyRewardModal'

function App() {
  const [showShop, setShowShop] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  
  const { 
    timeLeft, tick, gold, secretQuest, 
    completeSecretQuest, extractionAvailable, extractShadow 
  } = useHunterStore();

  useEffect(() => {
    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  }, [tick]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-hunter-dark flex flex-col items-center py-10 font-system text-white px-4 overflow-x-hidden relative">
      
      {/* 1. Global Overlays (Highest Z-Index) */}
      <DailyRewardModal />
      <PenaltyOverlay />
      <BossBattle />
      <HunterLicense isOpen={showLicense} onClose={() => setShowLicense(false)} />
      
      <AnimatePresence>
        {showShop && <StoreOverlay isOpen={showShop} onClose={() => setShowShop(false)} />}
      </AnimatePresence>

      {/* 2. Secret Notification Popups */}
      <AnimatePresence>
        {secretQuest && !secretQuest.completed && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} 
            className="fixed bottom-10 z-50 w-full max-w-xs bg-orange-600 border-2 border-white p-4 shadow-2xl"
          >
             <h4 className="text-[10px] font-bold tracking-widest text-white mb-1 uppercase underline italic">! Warning: Secret Quest !</h4>
             <p className="text-xs mb-3 italic">{secretQuest.title}</p>
             <button 
                onClick={() => { completeSecretQuest(); systemSounds.levelUp(); }} 
                className="w-full bg-white text-orange-600 font-black py-1 text-[10px] uppercase hover:bg-gray-200 transition-colors"
              >
                Accept Reward
              </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Consolidated Main Header */}
      <div className="w-full max-w-md flex justify-between items-center mb-6 px-1">
         <button 
           onClick={() => { setShowLicense(true); systemSounds.click(); }} 
           className="border border-white/20 px-3 py-1 text-[9px] text-gray-400 hover:text-white hover:border-white transition-all uppercase tracking-widest"
         >
            License
         </button>

         <div className="text-center">
            <p className="text-[7px] text-gray-500 tracking-[0.4em] uppercase mb-0.5 font-bold">Mana Recharge</p>
            <p className="text-orange-500 text-sm font-bold tracking-widest font-mono drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]">
               {formatTime(timeLeft)}
            </p>
         </div>

         <button 
           onClick={() => { setShowShop(true); systemSounds.click(); }} 
           className="border border-hunter-blue px-3 py-1 text-[9px] text-hunter-blue bg-blue-500/10 hover:bg-hunter-blue hover:text-black transition-all uppercase tracking-widest font-bold"
         >
            Store [{gold}G]
         </button>
      </div>

      {/* 4. Core Content Panels */}
      <StatusPanel />
      <DungeonPanel />
      <QuestPanel />
      <LogPanel />

      {/* 5. Shadow Extraction Overlay (Arise) */}
      <AnimatePresence>
        {extractionAvailable && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="fixed inset-0 bg-purple-950/90 z-[60] flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.h2 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl font-black text-white tracking-[0.2em] mb-4"
            >
              VOICE RECORDED: "ARISE"
            </motion.h2>
            <p className="text-xs text-purple-200 mb-8 max-w-xs uppercase tracking-widest">
              A soul lingers from the Red Gate. Extract its shadow?
            </p>
            <button 
              onClick={extractShadow}
              className="px-10 py-4 bg-white text-purple-950 font-black tracking-widest hover:scale-105 transition-transform uppercase shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              Extract Shadow
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-8 text-[8px] text-gray-700 tracking-[0.4em] uppercase text-center opacity-40">
        Only the one who challenges themselves can level up.
      </p>
    </div>
  );
}

export default App;