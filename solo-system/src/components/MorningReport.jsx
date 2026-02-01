import { useHunterStore } from '../store/useHunterStore';
import { motion } from 'framer-motion';

export default function MorningReport() {
  const { wakeUpTime, hasReportedMorning, reportMorning, setWakeUpTime } = useHunterStore();
  
  const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const isAfterWakeUp = currentTime >= wakeUpTime;

  if (hasReportedMorning || !isAfterWakeUp) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[150] bg-black flex flex-col items-center justify-center p-8 font-system text-white"
    >
      <div className="w-full max-w-xs border-l-2 border-hunter-blue pl-6">
        <h2 className="text-hunter-blue text-xs font-black tracking-[0.4em] mb-2 uppercase italic">Status: Awake</h2>
        <h1 className="text-4xl font-bold mb-4 tracking-tighter italic uppercase">Time to Rise</h1>
        <p className="text-gray-500 text-[10px] mb-8 leading-relaxed uppercase">
          The System is online. Your daily training parameters have been reset. 
          Confirm presence to initialize quests.
        </p>

        <div className="mb-10">
          <p className="text-[8px] text-gray-600 uppercase mb-2">Target Wake Time</p>
          <input 
            type="time" 
            value={wakeUpTime}
            onChange={(e) => setWakeUpTime(e.target.value)}
            className="bg-transparent border-b border-hunter-blue text-hunter-blue font-bold text-xl outline-none"
          />
        </div>

        <button 
          onClick={reportMorning}
          className="w-full py-4 border border-hunter-blue text-hunter-blue font-black tracking-widest hover:bg-hunter-blue hover:text-black transition-all uppercase italic"
        >
          Confirm Presence
        </button>
      </div>
    </motion.div>
  );
}