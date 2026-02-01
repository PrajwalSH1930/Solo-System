import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';

export default function SystemSplash({ onComplete }) {
  const [loadingText, setLoadingText] = useState("Initializing System...");
  const [progress, setProgress] = useState(0);
  const state = useHunterStore(); 
  const { playerName } = state;

  const sequences = [
    { p: 10, t: "Connecting to the Great Architect..." },
    { p: 30, t: "Authenticating Player Identity..." },
    { p: 50, t: "Scanning Physiological Parameters..." },
    { p: 70, t: "Syncing Daily Quest Data..." },
    { p: 90, t: "Finalizing Mana Channels..." },
    { p: 100, t: `Welcome, ${playerName}.` }
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < sequences.length) {
        setLoadingText(sequences[index].t);
        setProgress(sequences[index].p);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-10 font-system"
    >
      <div className="w-full max-w-xs">
        {/* Animated Logo / Icon */}
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-12 flex justify-center"
        >
          <div className="w-16 h-16 border-2 border-hunter-blue rotate-45 flex items-center justify-center">
            <div className="w-10 h-10 border border-hunter-blue flex items-center justify-center">
               <div className="w-4 h-4 bg-hunter-blue" />
            </div>
          </div>
        </motion.div>

        {/* Loading Bar */}
        <div className="w-full h-[2px] bg-gray-900 mb-4 overflow-hidden">
          <motion.div 
            animate={{ width: `${progress}%` }}
            className="h-full bg-hunter-blue shadow-[0_0_15px_#00d4ff]"
          />
        </div>

        {/* Status Text */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] text-hunter-blue font-black uppercase tracking-[0.3em] italic">
            {loadingText}
          </p>
          <div className="flex justify-between items-center">
            <p className="text-[7px] text-gray-600 uppercase tracking-widest font-bold">
              System Boot Sequence v2.6.1
            </p>
            <p className="text-[7px] text-gray-600 font-mono">{progress}%</p>
          </div>
        </div>
      </div>

      {/* Background Matrix-like Subtle Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,212,255,0.05)_0%,transparent_70%)] pointer-events-none" />
    </motion.div>
  );
}