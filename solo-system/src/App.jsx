import { useEffect, useState, useRef } from 'react'
import { useHunterStore } from './store/useHunterStore'
import { motion, AnimatePresence } from 'framer-motion'
import { systemSounds } from './utils/sounds'
import { setupAlarmSystem, checkAlarmPermissions, scheduleWakeUpAlarm } from './utils/notifications'

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
import RestMode from './components/RestMode'
import MorningReport from './components/MorningReport'
import SystemSplash from './components/SystemSplash'
import VitalitySync from './components/VitalitySync' 
import Registration from './components/Registration'
import JobTrialOverlay from './components/JobTrialOverlay'
import LevelUpOverlay from './components/LevelUpOverlay'

function App() {
  const [showShop, setShowShop] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  
  const { 
    timeLeft, tick, gold, secretQuest, 
    completeSecretQuest, extractionAvailable, extractShadow,
    playerName, isAwakened, level,
    wakeUpTime 
  } = useHunterStore();

  // FIX: This state tracks the level only FOR THIS SESSION.
  // It starts as null every time you kill and reopen the app.
  const [sessionLevel, setSessionLevel] = useState(null);

  // 1. Unified System Initialization
  useEffect(() => {
    const initializeSystem = async () => {
      await setupAlarmSystem();
      await checkAlarmPermissions();
      if (wakeUpTime) {
        await scheduleWakeUpAlarm(wakeUpTime);
      }
    };

    initializeSystem();

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const timer = setInterval(() => tick(), 1000);
    return () => clearInterval(timer);
  }, [tick, wakeUpTime]);

  // 2. Level Up Trigger Logic (Session Lock Fix)
  useEffect(() => {
    // Wait until the store actually loads your level from storage (level > 0)
    if (level === 0) return;

    // INITIAL LOAD: If sessionLevel is null, this is the first time the app is opening.
    if (sessionLevel === null) {
      setSessionLevel(level); // Lock the current level into this session
      return; // EXIT: Do not show the level up overlay
    }

    // ACTIVE GAMEPLAY: If the level in the store is higher than our session lock
    if (level > sessionLevel) {
      setShowLevelUp(true);
      systemSounds.levelUp();
      setSessionLevel(level); // Update the session lock to the new level
    }
  }, [level, sessionLevel]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center py-10 font-system text-white px-4 overflow-x-hidden relative ${isAwakened ? 'bg-[#000000] shadow-[inset_0_0_100px_rgba(168,85,247,0.15)]' : 'bg-[#000000]'}`}>
      
      {/* Cinematic Level Up Cutscene */}
      <LevelUpOverlay 
        level={level} 
        visible={showLevelUp} 
        onComplete={() => setShowLevelUp(false)} 
      />

      <AnimatePresence>
        {isBooting && (
          <SystemSplash onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      {!isBooting && !playerName && <Registration />}
      {!isBooting && level >= 40 && !isAwakened && <JobTrialOverlay />}

      {!isBooting && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          className="w-full flex flex-col items-center"
        >
          <RestMode /> 
          <MorningReport />
          <DailyRewardModal />
          <PenaltyOverlay />
          <BossBattle />
          <HunterLicense isOpen={showLicense} onClose={() => setShowLicense(false)} />
          
          <AnimatePresence>
            {showShop && <StoreOverlay isOpen={showShop} onClose={() => setShowShop(false)} />}
          </AnimatePresence>

          <AnimatePresence>
            {secretQuest && !secretQuest.completed && (
              <motion.div 
                initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} 
                className="fixed bottom-10 z-50 w-full max-w-xs bg-orange-600 border-2 border-white p-4 shadow-[0_0_20px_rgba(234,88,12,0.5)]"
              >
                  <h4 className="text-[10px] font-bold tracking-widest text-white mb-1 uppercase underline italic">! Warning: Secret Quest !</h4>
                  <p className="text-xs mb-3 italic">{secretQuest.title}</p>
                  <button onClick={() => { completeSecretQuest(); systemSounds.levelUp(); }} className="w-full bg-white text-orange-600 font-black py-1 text-[10px] uppercase hover:bg-gray-200 transition-colors">Accept Reward</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full max-w-md flex justify-between items-center mb-6 px-1 relative z-10">
             <button onClick={() => { setShowLicense(true); systemSounds.click(); }} className="border border-white/20 px-3 py-1 text-[9px] text-gray-400 hover:text-white hover:border-white transition-all uppercase tracking-widest">License</button>
             <div className="text-center">
                <p className="text-[7px] text-gray-500 tracking-[0.4em] uppercase mb-0.5 font-bold">System Time</p>
                <p className={`text-sm font-bold tracking-widest font-mono ${isAwakened ? 'text-purple-500 drop-shadow-[0_0_5px_#a855f7]' : 'text-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]'}`}>
                   {formatTime(timeLeft)}
                </p>
             </div>
             <button onClick={() => { setShowShop(true); systemSounds.click(); }} className={`border px-3 py-1 text-[9px] transition-all uppercase tracking-widest font-bold ${isAwakened ? 'border-purple-500 text-purple-400 bg-purple-900/10' : 'border-hunter-blue text-hunter-blue bg-blue-500/10'}`}>Store [{gold}G]</button>
          </div>

          <div className="w-full max-w-md space-y-6 relative z-10">
            <VitalitySync />
            <StatusPanel />
            <DungeonPanel />
            <QuestPanel />
            <LogPanel />
          </div>

          <AnimatePresence>
            {extractionAvailable && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(88,28,135,0.4)_0%,transparent_70%)] animate-pulse" />
                <motion.h2 animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-5xl font-black text-purple-500 tracking-[0.3em] mb-4 italic drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">ARISE</motion.h2>
                <p className="text-[10px] text-purple-300 mb-8 max-w-xs uppercase tracking-[0.5em] font-bold">A soul lingers from the Gate... Extract?</p>
                <button onClick={extractShadow} className="relative z-10 px-12 py-4 bg-transparent border-2 border-purple-500 text-purple-500 font-black tracking-[0.4em] hover:bg-purple-500 hover:text-black transition-all uppercase shadow-[0_0_30px_rgba(168,85,247,0.3)]">Extract Shadow</button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-[8px] text-gray-700 tracking-[0.4em] uppercase text-center opacity-40">The system only rewards the persistent.</p>
        </motion.div>
      )}
    </div>
  );
}

export default App;