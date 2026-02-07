import { useEffect, useState } from 'react'
import { useHunterStore } from './store/useHunterStore'
import { motion, AnimatePresence } from 'framer-motion'
import { systemSounds } from './utils/sounds'
import { setupAlarmSystem, checkAlarmPermissions, scheduleWakeUpAlarm } from './utils/notifications'
import { Motion } from '@capacitor/motion'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'; // Import the App plugin

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

function App() {
  const [showShop, setShowShop] = useState(false);
  const [showLicense, setShowLicense] = useState(false);
  const [showShadowHub, setShowShadowHub] = useState(false);
  const [isBooting, setIsBooting] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  
  const { 
    timeLeft, tick, gold, secretQuest, 
    completeSecretQuest, extractionAvailable, extractShadow,
    playerName, isAwakened, level,
    wakeUpTime, shadowLimitReached, closeLimitPopup,
    shadows, initializeSystem 
  } = useHunterStore();

  const [sessionLevel, setSessionLevel] = useState(null);


// ... inside your App() function ...
useEffect(() => {
  if (!Capacitor.isNativePlatform()) return;

  const backButtonListener = CapApp.addListener('backButton', () => {
    // Priority 1: High-level Overlays
    if (showShop) {
      setShowShop(false);
      systemSounds.click();
    } else if (showLicense) {
      setShowLicense(false);
      systemSounds.click();
    } else if (showShadowHub) {
      setShowShadowHub(false);
      systemSounds.click();
    } else if (showLevelUp) {
      setShowLevelUp(false);
    } 
    // Priority 2: System Exit
    else {
      // If no overlays are active, initiate extraction (Exit App)
      CapApp.exitApp();
    }
  });

  return () => {
    backButtonListener.remove();
  };
}, [showShop, showLicense, showShadowHub, showLevelUp]);// Add your modal states as dependencies
  // 1. SYSTEM INITIALIZATION & PLATFORM GUARDS
  useEffect(() => {
    const bootSystem = async () => {
      // Only attempt native features on Android/iOS
      if (Capacitor.isNativePlatform()) {
        try {
          await setupAlarmSystem().catch(() => console.warn("Alarms unsupported"));
          await checkAlarmPermissions().catch(() => console.warn("Permissions unsupported"));
          if (wakeUpTime) {
            await scheduleWakeUpAlarm(wakeUpTime).catch(() => console.warn("Schedule failed"));
          }
        } catch (e) {
          console.error("Native Plugin Error:", e);
        }
      }

      // Initialize store data (Fatigue, Quests, etc.)
      if (initializeSystem) initializeSystem();
    };

    bootSystem();

    // Accelerometer Guard
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
        } catch (e) {
          console.log("Motion sensors disabled.");
        }
      }
    };
    startMotion();

    const timer = setInterval(() => tick(), 1000);
    return () => {
      clearInterval(timer);
      if (accelListener) accelListener.remove();
    };
  }, [tick, wakeUpTime, initializeSystem]);

  // 2. PROTECTED LEVEL UP LOGIC (Prevents trigger during splash)
  useEffect(() => {
    if (isBooting || level === 0) return;

    if (sessionLevel === null) {
      setSessionLevel(level);
      return;
    }

    if (level > sessionLevel) {
      setShowLevelUp(true);
      systemSounds.levelUp(); // Sound context will be valid because user had to click "Enter"
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
      
      {/* --- PARALLAX BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ x: tilt.x * -8, y: tilt.y * -8, rotate: 360 }}
          transition={{ rotate: { repeat: Infinity, duration: 100, ease: "linear" }, type: "spring", stiffness: 30 }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] border border-cyan-500/5 rounded-full opacity-40"
        />
        <motion.div
          animate={{ x: tilt.x * 5, y: tilt.y * 5, rotate: -360 }}
          transition={{ rotate: { repeat: Infinity, duration: 150, ease: "linear" }, type: "spring", stiffness: 30 }}
          className="absolute bottom-0 -left-20 w-80 h-80 border-2 border-purple-500/5 rounded-full opacity-30"
        />
      </div>

      {/* --- OVERLAYS & MODALS --- */}
      <AnimatePresence>
        {isBooting && (
          <SystemSplash key="splash" onComplete={() => setIsBooting(false)} />
        )}
      </AnimatePresence>

      {/* Only show LevelUp if not booting */}
      {!isBooting && (
        <LevelUpOverlay 
          level={level} 
          visible={showLevelUp} 
          onComplete={() => setShowLevelUp(false)} 
        />
      )}

      {/* --- SHADOW CAPACITY WARNING --- */}
      <AnimatePresence>
        {shadowLimitReached && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          >
            <div className="bg-[#0a0a0a] border-2 border-red-600 p-8 w-full max-w-xs text-center relative shadow-[0_0_50px_rgba(220,38,38,0.3)]">
              <h3 className="text-2xl font-black text-red-500 uppercase mb-4 tracking-tighter">Capacity Full</h3>
              <p className="text-xs text-gray-400 mb-8 leading-relaxed font-mono">
                Extraction Failed. Your Shadow Storage has reached its maximum limit ({isAwakened ? 10 : 4}).
              </p>
              <button 
                onClick={() => { systemSounds.click(); closeLimitPopup(); }} 
                className="w-full bg-red-600/10 border border-red-500 text-red-100 py-3 text-[10px] uppercase font-black"
              >
                Clear Warning
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN HUD: RENDERED AFTER BOOT --- */}
      {!isBooting && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          className="w-full flex flex-col items-center relative z-10"
        >
          {/* Global Functional Overlays */}
          {!playerName && <Registration />}
          {level >= 40 && !isAwakened && <JobTrialOverlay />}
          
          <RestMode /> 
          <MorningReport />
          <DailyRewardModal />
          <PenaltyOverlay />
          <BossBattle />
          
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

          {/* --- TOP NAVIGATION BAR --- */}
          <div className="w-full max-w-md flex justify-between items-center mb-8 px-1 relative z-10">
             <button onClick={() => { setShowLicense(true); systemSounds.click(); }} className="border border-white/10 px-4 py-1.5 text-[9px] text-gray-500 hover:text-white transition-all uppercase tracking-widest italic">License</button>
             
             {/* Monarch Center Icon */}
             <button onClick={() => { setShowShadowHub(true); systemSounds.click(); }} className="flex flex-col items-center group relative px-6">
                <motion.div 
                  animate={isAwakened ? { scale: [1, 1.15, 1], filter: ["drop-shadow(0 0 2px #a855f7)", "drop-shadow(0 0 10px #a855f7)"] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className={`text-2xl mb-1 ${isAwakened ? 'grayscale-0' : 'grayscale opacity-30'}`}
                >🔥</motion.div>
                <span className="text-[7px] text-gray-500 font-black uppercase tracking-[0.2em]">Shadows: {shadows.length}</span>
             </button>

             <button onClick={() => { setShowShop(true); systemSounds.click(); }} className={`border px-4 py-1.5 text-[9px] transition-all uppercase tracking-widest font-black italic ${isAwakened ? 'border-purple-600 text-purple-400 bg-purple-950/10' : 'border-cyan-600 text-cyan-400 bg-cyan-950/10'}`}>Store [{gold}G]</button>
          </div>

          {/* --- SYSTEM HUD TIMER --- */}
          <div className="mb-10 text-center relative">
              <p className="text-[8px] text-gray-600 tracking-[0.6em] uppercase mb-2 font-black">System Time Remaining</p>
              <p className={`text-4xl font-black tracking-tighter font-mono italic ${isAwakened ? 'text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]'}`}>
                 {formatTime(timeLeft)}
              </p>
          </div>

          {/* --- CORE INTERFACE PANELS --- */}
          <div className="w-full max-w-md space-y-8 relative z-10 pb-20">
            <VitalitySync />
            <StatusPanel />
            <DungeonPanel />
            <QuestPanel />
            <LogPanel />
          </div>

          {/* --- CINEMATIC EXTRACTION --- */}
          <AnimatePresence>
            {extractionAvailable && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/98 z-[1000] flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(88,28,135,0.4)_0%,transparent_75%)] animate-pulse" />
                <motion.h2 
                  animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1, 0.95] }} 
                  transition={{ repeat: Infinity, duration: 3 }} 
                  className="text-7xl font-black text-purple-600 mb-6 italic drop-shadow-[0_0_30px_#a855f7]"
                >
                  ARISE
                </motion.h2>
                <button 
                  onClick={() => { systemSounds.levelUp(); extractShadow(); }} 
                  className="relative z-10 px-16 py-5 bg-transparent border-2 border-purple-500 text-purple-400 font-black tracking-[0.5em] hover:bg-purple-600 hover:text-black transition-all uppercase shadow-[0_0_40px_rgba(168,85,247,0.2)]"
                >
                  Extract Shadow
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="fixed bottom-6 text-[8px] text-gray-700 tracking-[0.4em] uppercase opacity-40">The system only rewards the persistent.</p>
        </motion.div>
      )}
    </div>
  );
}

export default App;