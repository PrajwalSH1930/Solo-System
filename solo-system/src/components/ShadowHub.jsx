import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { allShadows } from '../data/shadows';
import { systemSounds } from '../utils/sounds';

export default function ShadowHub() {
  const { shadows, isAwakened } = useHunterStore();
  const [selectedShadow, setSelectedShadow] = useState(shadows[0] || null);

  const accentColor = isAwakened ? "text-purple-500" : "text-blue-400";
  const glowColor = isAwakened ? "shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "shadow-[0_0_20px_rgba(0,238,255,0.4)]";

  // Filter to show which shadows are currently extracted vs locked
  const extractedNames = shadows.map(s => s.name);

  return (
    <div className="w-full max-w-4xl bg-black/60 border border-white/10 rounded-lg p-6 backdrop-blur-xl font-system mb-10 relative overflow-hidden">
      {/* Background Monarch Seal */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <span className="text-[300px] font-black italic">ARISE</span>
      </div>

      <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4 relative z-10">
        <div>
          <h2 className={`${accentColor} text-sm font-black tracking-[0.5em] uppercase italic drop-shadow-sm`}>
            Shadow Army Hub
          </h2>
          <p className="text-[9px] text-gray-500 uppercase mt-1 font-bold">Total Soldiers: {shadows.length}</p>
        </div>
        <div className="text-right">
          <span className="text-[8px] text-gray-600 uppercase tracking-widest block">Monarch Authority</span>
          <span className="text-xs font-mono text-white italic">{isAwakened ? 'Level 2: Shadow Sovereign' : 'Level 1: Necromancer'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: SELECTED SHADOW PREVIEW */}
        <div className="relative flex flex-col items-center">
          <AnimatePresence mode="wait">
            {selectedShadow ? (
              <motion.div 
                key={selectedShadow.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <div className={`relative w-full aspect-square border-2 border-white/5 overflow-hidden rounded-sm bg-gradient-to-b from-transparent to-purple-900/20 ${glowColor}`}>
                  <img 
                    src={selectedShadow.image} 
                    alt={selectedShadow.name} 
                    className="w-full h-full object-cover opacity-80 mix-blend-lighten"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedShadow.name}</h3>
                    <p className={`${selectedShadow.color} text-[10px] font-bold tracking-[0.2em] uppercase`}>{selectedShadow.rank}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <p className="text-[10px] text-gray-400 italic leading-relaxed border-l-2 border-purple-500 pl-3">
                    "{selectedShadow.lore}"
                  </p>
                  
                  {/* STAT BARS */}
                  <div className="space-y-3">
                    {Object.entries(selectedShadow.stats).map(([stat, value]) => (
                      <div key={stat} className="space-y-1">
                        <div className="flex justify-between text-[8px] uppercase font-bold tracking-widest text-gray-500">
                          <span>{stat}</span>
                          <span className="text-white">{value}%</span>
                        </div>
                        <div className="w-full h-[3px] bg-gray-900 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${value}%` }}
                            className={`h-full ${selectedShadow.color.replace('text', 'bg')}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="w-full aspect-square border-2 border-dashed border-white/5 flex flex-col items-center justify-center opacity-20">
                <span className="text-4xl mb-2">💀</span>
                <p className="text-[10px] uppercase tracking-widest">No Shadows Extracted</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: THE LEGION LIST */}
        <div className="flex flex-col">
          <h4 className="text-[10px] text-white font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">The Legion</h4>
          <div className="grid grid-cols-3 gap-3 overflow-y-auto no-scrollbar max-h-[450px] pr-2">
            {allShadows.map((shadow) => {
              const isExtracted = extractedNames.includes(shadow.name);
              const isSelected = selectedShadow?.name === shadow.name;

              return (
                <button
                  key={shadow.name}
                  onClick={() => {
                    if (isExtracted) {
                      systemSounds.click();
                      setSelectedShadow(shadow);
                    }
                  }}
                  className={`relative aspect-square border transition-all duration-300 flex items-center justify-center overflow-hidden
                    ${isExtracted 
                      ? `${isSelected ? 'border-white scale-105 z-10' : 'border-white/10 hover:border-white/40'}` 
                      : 'border-white/5 opacity-20 grayscale cursor-not-allowed'
                    }
                  `}
                >
                  {isExtracted ? (
                    <>
                      <img src={shadow.image} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-black/40" />
                      <span className="absolute text-xl z-10 drop-shadow-md">{shadow.icon}</span>
                      {isSelected && <div className="absolute inset-0 border-2 border-purple-500/50 animate-pulse" />}
                    </>
                  ) : (
                    <span className="text-lg">🔒</span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-[8px] text-gray-600 leading-relaxed uppercase tracking-tighter">
            * Shadows can only be extracted from successful dungeon raids. High rank shadows require higher Monarch Authority.
          </p>
        </div>
      </div>
    </div>
  );
}