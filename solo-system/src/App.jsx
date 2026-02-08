/* eslint-disable no-empty */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import { useHunterStore } from './store/useHunterStore'
import { motion, AnimatePresence } from 'framer-motion'
import { systemSounds } from './utils/sounds'
import { setupAlarmSystem, checkAlarmPermissions, scheduleWakeUpAlarm } from './utils/notifications'
import { Motion } from '@capacitor/motion'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app';

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
import ShadowHub from './components/ShadowHub'
import AriseOverlay from './components/Shadows/AriseOverlay';
import ManaCore from './components/ManaCore';
import SafeZoneHUD from './components/SafeZoneHUD'

function App() {
  const [showShop, setShowShop] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [showShadowHub, setShowShadowHub] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const { 
    timeLeft, tick, gold, secretQuest, 
    completeSecretQuest, extractionAvailable,
    playerName, isAwakened, level,
    wakeUpTime, shadowLimitReached, closeLimitPopup,
    shadows, initializeSystem,
    isFocusActive, updateFocusProgress // Added Focus Props
  } = useHunterStore();

  const [sessionLevel, setSessionLevel] = useState(null);

  // --- BACK BUTTON LOGIC ---
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backButtonListener = CapApp.addListener('backButton', () => {
      if (showShop) setShowShop(false);
      else if (showLicense) setShowLicense(false);
      else if (showShadowHub) setShowShadowHub(false);
      else if (showLevelUp) setShowLevelUp(false);
      else CapApp.exitApp();
      systemSounds.click();
    });

    return () => backButtonListener.remove();
  }, [showShop, showLicense, showShadowHub, showLevelUp]);

  // --- SYSTEM INITIALIZATION & CORE TICK ---
  useEffect(() => {
    const bootSystem = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await setupAlarmSystem().catch(() => {});
          await checkAlarmPermissions().catch(() => {});
          if (wakeUpTime) await scheduleWakeUpAlarm(wakeUpTime).catch(() => {});
        } catch (e) { console.error(e); }
      }
      if (initializeSystem) initializeSystem();
    };

    bootSystem();

    let accelListener;
    const startMotion = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          accelListener = await Motion.addListener('accel', (event) => {
            setTilt({
              x: event.accelerationIncludingGravity.x * 1.5,
              y: event.accelerationIncludingGravity.y * 1.5
            });
          });
        } catch (e) {}
      }
    };
    startMotion();

    // SYSTEM HEARTBEAT
    const timer = setInterval(() => {
      tick();
      // Handle Mana Sensing Progress
      if (isFocusActive) {
        updateFocusProgress();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (accelListener) accelListener.remove();
    };
  }, [tick, wakeUpTime, initializeSystem, isFocusActive, updateFocusProgress]);

  // --- LEVEL UP LOGIC ---
  useEffect(() => {
    if (isBooting || level === 0) return;
    if (sessionLevel === null) { setSessionLevel(level); return; }

    if (level > sessionLevel) {
      setShowLevelUp(true);
      systemSounds.levelUp();
      setSessionLevel(level);
    }
  }, [level, sessionLevel, isBooting]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center py-10 font-system text-white px-4 overflow-x-hidden relative ${isAwakened ? 'bg-[#000000] shadow-[inset_0_0_150px_rgba(168,85,247,0.1)]' : 'bg-[#000000]'}`}>
      
      {/* Parallax Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ x: tilt.x * -8, y: tilt.y * -8, rotate: 360 }} transition={{ rotate: { repeat: Infinity, duration: 100, ease: "linear" }, type: "spring", stiffness: 30 }} className="absolute -top-20 -right-20 w-[600px] h-[600px] border border-cyan-500/5 rounded-full opacity-40" />
      </div>

      <AnimatePresence>
        {isBooting && <SystemSplash key="splash" onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>

      {!isBooting && <LevelUpOverlay level={level} visible={showLevelUp} onComplete={() => setShowLevelUp(false)} />}

      {/* Shadow Limit Popup */}
      <AnimatePresence>
        {shadowLimitReached && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
            <div className="bg-[#0a0a0a] border-2 border-red-600 p-8 w-full max-w-xs text-center relative shadow-[0_0_50px_rgba(220,38,38,0.3)]">
              <h3 className="text-2xl font-black text-red-500 uppercase mb-4 tracking-tighter">Capacity Full</h3>
              <p className="text-xs text-gray-400 mb-8 leading-relaxed font-mono">Extraction Failed. Shadow Storage limit reached ({isAwakened ? 20 : 4}).</p>
              <button onClick={() => { systemSounds.click(); closeLimitPopup(); }} className="w-full bg-red-600/10 border border-red-500 text-red-100 py-3 text-[10px] uppercase font-black">Clear Warning</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isBooting && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="w-full flex flex-col items-center relative z-10">
          {!playerName && <Registration />}
          {level >= 40 && !isAwakened && <JobTrialOverlay />}
          
          <RestMode /> <MorningReport /> <DailyRewardModal /> <PenaltyOverlay /> <BossBattle />
          
          <HunterLicense isOpen={showLicense} onClose={() => setShowLicense(false)} />
          <AnimatePresence>
            {showShop && <StoreOverlay isOpen={showShop} onClose={() => setShowShop(false)} />}
            {showShadowHub && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed inset-0 z-[500] bg-black">
                <div className="h-full overflow-y-auto no-scrollbar p-6">
                  <button onClick={() => setShowShadowHub(false)} className="mb-4 text-[9px] text-gray-500 tracking-widest font-black uppercase">[ Back to Sovereign Seat ]</button>
                  <ShadowHub />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HUD Top Bar */}
          <div className="w-full max-w-md flex justify-between items-center mb-8 px-1 relative z-10">
             <button onClick={() => { setShowLicense(true); systemSounds.click(); }} className="border border-white/10 px-4 py-1.5 text-[9px] text-gray-500 uppercase tracking-widest italic">License</button>
             <button onClick={() => { setShowShadowHub(true); systemSounds.click(); }} className="flex flex-col items-center group px-6">
                <motion.div animate={isAwakened ? { scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 2px #a855f7)", "drop-shadow(0 0 10px #a855f7)"] } : {}} transition={{ repeat: Infinity, duration: 2.5 }} className={`text-2xl mb-1 ${isAwakened ? 'grayscale-0' : 'grayscale opacity-30'}`}>🔥</motion.div>
                <span className="text-[7px] text-gray-500 font-black uppercase tracking-[0.2em]">Shadows: {shadows.length}</span>
             </button>
             <button onClick={() => { setShowShop(true); systemSounds.click(); }} className={`border px-4 py-1.5 text-[9px] uppercase tracking-widest font-black italic ${isAwakened ? 'border-purple-600 text-purple-400 bg-purple-950/10' : 'border-cyan-600 text-cyan-400 bg-cyan-950/10'}`}>Store [{gold}G]</button>
          </div>

          {/* System Timer */}
          <div className="mb-10 text-center">
              <p className="text-[8px] text-gray-600 tracking-[0.6em] uppercase mb-2 font-black">System Time Remaining</p>
              <p className={`text-4xl font-black tracking-tighter font-mono italic ${isAwakened ? 'text-purple-500' : 'text-orange-500'}`}>{formatTime(timeLeft)}</p>
          </div>

          <div className="w-full max-w-md space-y-8 pb-20">
            <SafeZoneHUD />
            <VitalitySync /> 
            <StatusPanel /> 
            <ManaCore /> 
            <DungeonPanel /> 
            <QuestPanel /> 
            <LogPanel />
            <AriseOverlay />
          </div>

          <p className="fixed bottom-6 text-[8px] text-gray-700 tracking-[0.4em] uppercase opacity-40 italic">The system only rewards the persistent.</p>
        </motion.div>
      )}
    </div>
  );
}

export default App;