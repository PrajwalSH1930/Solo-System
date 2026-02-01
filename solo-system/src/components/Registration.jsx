import { motion } from 'framer-motion';
import { useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';
import { systemSounds } from '../utils/sounds';

export default function Registration() {
  const [input, setInput] = useState("");
  const playerName = useHunterStore((state) => state.playerName);
  const setPlayerName = useHunterStore((state) => state.setPlayerName);

  // If name exists, hide the component immediately
  if (playerName && playerName !== "") return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim().length >= 3) {
      systemSounds.levelUp();
      setPlayerName(input.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] bg-black flex items-center justify-center p-6 font-system"
    >
      <div className="w-full max-w-xs text-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-hunter-blue text-[10px] font-black uppercase tracking-[0.4em] mb-8"
        >
          [ Player Identification Required ]
        </motion.div>

        <p className="text-white text-xs italic mb-10 leading-relaxed uppercase tracking-tighter">
          "The System has detected a new player. Provide your designation to synchronize with the Architect."
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            autoFocus
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ENTER NAME..."
            className="w-full bg-transparent border-b-2 border-hunter-blue text-center text-xl font-black text-white outline-none focus:border-white transition-colors uppercase tracking-widest"
          />
          
          <button 
            type="submit"
            disabled={input.trim().length < 3}
            className="w-full py-3 bg-hunter-blue/10 border border-hunter-blue text-hunter-blue font-black uppercase tracking-[0.3em] hover:bg-hunter-blue hover:text-black transition-all disabled:opacity-20 shadow-[0_0_15px_rgba(0,212,255,0.2)]"
          >
            Confirm Identity
          </button>
        </form>
      </div>
    </motion.div>
  );
}