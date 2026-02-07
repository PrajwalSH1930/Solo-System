import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../../store/useHunterStore';
import { systemSounds } from '../../utils/sounds';

export default function AriseOverlay() {
  const { extractionAvailable, extractShadow, isAwakened } = useHunterStore();

  const handleArise = () => {
    systemSounds.levelUp(); // Trigger cinematic sound
    extractShadow();
  };

  return (
    <AnimatePresence>
      {extractionAvailable && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl"
        >
          {/* Pulsing Aura Background */}
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] ${isAwakened ? 'bg-purple-600/30' : 'bg-emerald-600/30'}`}
          />

          <div className="relative text-center p-10 border border-white/5 bg-black/60 rounded-sm shadow-2xl">
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2 className={`text-[11px] uppercase tracking-[0.6em] mb-3 font-bold ${isAwakened ? 'text-purple-500' : 'text-emerald-500'}`}>Extraction Potential Detected</h2>
              <h1 className="text-6xl font-black italic text-white tracking-tighter mb-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                SHADOW REMAINS
              </h1>

              <motion.button
                whileHover={{ scale: 1.05, letterSpacing: "0.6em" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleArise}
                className={`group relative px-16 py-5 bg-transparent border-2 border-white overflow-hidden transition-all duration-700`}
              >
                <span className="relative z-10 text-white text-2xl font-black tracking-[0.5em] group-hover:text-black transition-colors italic">
                  ARISE
                </span>
                <motion.div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>

              <p className="mt-10 text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed italic opacity-60">
                Command the soul of the defeated <br /> to serve the Eternal Monarch.
              </p>
            </motion.div>
          </div>

          {/* Vertical Scanner Effect */}
          <motion.div 
            animate={{ y: ['-100vh', '100vh'] }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className={`absolute left-0 right-0 h-[2px] z-[1001] bg-gradient-to-r from-transparent ${isAwakened ? 'via-purple-500/40' : 'via-white/40'} to-transparent`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}