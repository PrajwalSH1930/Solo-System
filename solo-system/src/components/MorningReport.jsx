import { useHunterStore } from '../store/useHunterStore';
import { motion } from 'framer-motion';

export default function MorningReport() {
  const { wakeUpTime, hasReportedMorning, reportMorning, setWakeUpTime } = useHunterStore();
  
  // Get current time in HH:mm format
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
  // LOGIC FIX: Only trigger if it's currently between WakeUpTime and 12:00 PM
  // This ensures the popup doesn't appear at 10 PM at night.
  const isMorning = now.getHours() < 12; 
  const isAfterWakeUp = currentTime >= wakeUpTime;

  if (hasReportedMorning || !(isMorning && isAfterWakeUp)) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-8 font-system text-white"
    >
      <div className="w-full max-w-xs border-l-2 border-hunter-blue pl-6">
        <div className="mb-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-hunter-blue animate-ping rounded-full" />
          <h2 className="text-hunter-blue text-xs font-black tracking-[0.4em] uppercase italic">Status: Online</h2>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tighter italic uppercase leading-none">
          Morning <br/> Check-In
        </h1>
        
        <p className="text-gray-500 text-[10px] mb-8 leading-relaxed uppercase tracking-tighter">
          The System has reset your daily parameters. 
          Confirm presence to initialize the day's quests and claim your daily supply box.
        </p>

        <div className="mb-10 bg-white/5 p-4 border border-white/5">
          <p className="text-[8px] text-gray-500 uppercase mb-2 tracking-[0.2em]">Target Wake Time</p>
          <input 
            type="time" 
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
            className="bg-transparent border-b border-hunter-blue text-hunter-blue font-bold text-2xl outline-none cursor-pointer"
          />
        </div>

        <button 
          onClick={reportMorning}
          className="w-full py-4 border border-hunter-blue text-hunter-blue font-black tracking-widest hover:bg-hunter-blue hover:text-black transition-all uppercase italic shadow-[0_0_15px_rgba(0,212,255,0.2)]"
        >
          Confirm Presence
        </button>
        
        <p className="text-[7px] text-gray-700 mt-6 text-center uppercase tracking-[0.3em]">
          Unconfirmed hunters will remain in stasis.
        </p>
      </div>
    </motion.div>
  );
}