import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';
import InventoryModal from './InventoryModal';
import { systemSounds } from '../utils/sounds';

// --- SHADOW DETAIL MODAL (Restored Full Animations & Styling) ---
function ShadowDetailModal({ shadow, onClose }) {
  if (!shadow) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[600] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 font-system"
    >
      <div className="relative w-full max-w-sm aspect-[2/3] overflow-hidden border border-purple-500/50 bg-[#050505] shadow-[0_0_60px_rgba(168,85,247,0.3)] rounded-sm flex flex-col">
        <div className="absolute inset-0 z-0">
          {shadow.image ? (
            <motion.img 
              initial={{ scale: 1.2, opacity: 0 }} 
              animate={{ scale: 1, opacity: 0.7 }}
              src={shadow.image} 
              alt={shadow.name} 
              className="w-full h-full object-cover mix-blend-lighten" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl opacity-5">{shadow.icon}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-white text-2xl z-50">✕</button>
        
        <div className="p-8 relative z-10 mt-auto w-full">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className={`text-6xl font-black italic uppercase tracking-tighter leading-none mb-1 drop-shadow-[0_4px_10px_rgba(0,0,0,1)] ${shadow.color || 'text-purple-500'}`}
          >
            {shadow.name}
          </motion.h2>
          <p className="text-purple-400 text-[10px] font-black tracking-[0.5em] uppercase mb-8 opacity-80">{shadow.rank}</p>
          
          <div className="grid grid-cols-3 gap-1 mb-8 bg-white/[0.03] border border-white/10 p-4 backdrop-blur-md">
            <div className="text-center border-r border-white/10"><p className="text-[7px] text-gray-500 uppercase font-black">Power</p><p className="text-xl font-black text-white">{shadow.stats?.power || '90'}</p></div>
            <div className="text-center border-r border-white/10"><p className="text-[7px] text-gray-500 uppercase font-black">Speed</p><p className="text-xl font-black text-white">{shadow.stats?.speed || '95'}</p></div>
            <div className="text-center"><p className="text-[7px] text-gray-500 uppercase font-black">Loyalty</p><p className="text-xl font-black text-purple-400">MAX</p></div>
          </div>

          <button 
            onClick={() => { systemSounds.click(); onClose(); }} 
            className="w-full py-4 bg-purple-600/10 border border-purple-500/50 text-purple-400 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-purple-600 hover:text-black transition-all"
          >
            Dismiss Shadow
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function StatusPanel() {
  const [selectedShadow, setSelectedShadow] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const state = useHunterStore();
  
  const { 
    level, exp, nextLevelExp, rank, job, currentTitle, stats, abilityPoints, increaseStat, 
    shadows, equippedItems, isResting, enterRestMode, mana, maxMana, 
    fatigue, wakeUpTime, setWakeUpTime, waterGlassCount, drinkWater, isAwakened 
  } = state;
  
  const expPercentage = (exp / nextLevelExp) * 100;
  const manaPercentage = (mana / maxMana) * 100;
  const accentColor = isAwakened ? "text-purple-400" : "text-cyan-400";
  const barColor = isAwakened ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" : "bg-cyan-500 shadow-[0_0_10px_#06b6d4]";

  return (
    <>
      <AnimatePresence>{selectedShadow && <ShadowDetailModal shadow={selectedShadow} onClose={() => setSelectedShadow(null)} />}</AnimatePresence>
      <AnimatePresence>{isInventoryOpen && <InventoryModal onClose={() => setIsInventoryOpen(false)} />}</AnimatePresence>

      <div className={`w-full max-w-md border-l-4 p-6 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-md mb-8 relative overflow-hidden font-system text-white transition-all duration-1000 ${isAwakened ? 'border-purple-600 shadow-[0_0_40px_rgba(168,85,247,0.15)]' : 'border-cyan-500 shadow-[0_0_30px_rgba(0,212,255,0.1)]'}`}>
        
        {/* Background Rank Watermark */}
        <div className={`absolute -right-4 -top-8 text-[12rem] font-black italic select-none z-0 uppercase opacity-5 pointer-events-none ${accentColor}`}>{rank}</div>

        <div className="relative z-10">
          {/* Top Actions */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className={`text-[9px] font-black px-3 py-1 rounded-full tracking-[0.2em] inline-block ${isAwakened ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' : 'bg-gray-800 text-gray-400'}`}>
                {isAwakened ? 'SHADOW MONARCH' : `${job.toUpperCase()} CLASS`}
              </div>
              <p className="text-[7px] text-gray-500 uppercase tracking-widest pl-1">System Authorization Verified</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { systemSounds.click(); setIsInventoryOpen(true); }} className="bg-white/5 hover:bg-white/10 p-2 border border-white/10 transition-all">🎒</button>
              {!isResting && <button onClick={() => { systemSounds.click(); enterRestMode(); }} className="bg-white/5 hover:bg-white/10 p-2 border border-white/10 transition-all">⏳</button>}
            </div>
          </div>

          {/* Level & Title */}
          <div className="flex justify-between items-end mb-8">
            <div className="space-y-1">
              <h1 className="text-5xl font-black italic tracking-tighter leading-none">LV.{level}</h1>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isAwakened ? 'text-purple-400 animate-pulse' : 'text-orange-400'}`}>
                &gt; {currentTitle}
              </p>
            </div>
            <div className="text-right">
                <div className="mb-2 flex flex-col items-end">
                    <span className="text-[7px] text-gray-500 uppercase font-black">Sync Time</span>
                    <input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className={`bg-transparent font-black text-xs outline-none cursor-pointer ${accentColor}`} />
                </div>
              <span className={`text-[11px] border-2 px-3 py-1 font-black italic tracking-widest ${isAwakened ? 'border-purple-500 text-purple-400' : 'border-cyan-500 text-cyan-400'}`}>
                {rank}-RANK
              </span>
            </div>
          </div>

          {/* Glowing Resource Bars */}
          <div className="space-y-4 mb-8">
            <div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1.5"><span>Experience</span><span>{Math.floor(expPercentage)}%</span></div>
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${expPercentage}%` }} className={`h-full ${barColor}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1.5"><span>Mana Pool</span><span>{mana} / {maxMana}</span></div>
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${manaPercentage}%` }} className={`h-full ${isAwakened ? 'bg-purple-400 shadow-[0_0_10px_#a855f7]' : 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]'}`} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1.5"><span>Fatigue</span><span className={fatigue > 80 ? 'text-red-500 animate-pulse' : 'text-gray-300'}>{fatigue}%</span></div>
              <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${fatigue}%` }} className={`h-full ${fatigue > 80 ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-white/20'}`} />
              </div>
            </div>
          </div>

          {/* Stats Grid - Mobile Optimized with Allocation */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {Object.entries(stats).map(([name, value]) => (
              <div 
                key={name} 
                className="bg-white/[0.03] p-3 border border-white/5 flex flex-col justify-center min-h-[50px] group hover:bg-white/[0.06] transition-all relative overflow-hidden"
              >
                <span className="uppercase text-[7px] text-gray-500 font-black tracking-widest mb-1">{name}</span>
                <div className="flex items-center justify-between">
                  <span className={`font-black text-sm ${accentColor} leading-none`}>{value}</span>
                  <AnimatePresence>
                    {abilityPoints > 0 && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => { systemSounds.click(); increaseStat(name); }} 
                        className={`w-6 h-6 flex items-center justify-center border font-black text-xs shrink-0
                          ${isAwakened ? 'border-purple-500 text-purple-400 bg-purple-500/10' : 'border-cyan-500 text-cyan-400 bg-cyan-500/10'} 
                          active:scale-90 transition-all rounded-sm ml-2`}
                      >
                        +
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>

          {/* Hydration & Equipment (Combined Row) */}
          <div className="grid grid-cols-1 gap-3 mb-8">
             <div className="p-3 border border-white/10 bg-white/[0.02] flex justify-between items-center group">
               <div className="flex items-center gap-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform">💧</span>
                  <div>
                    <p className="text-[7px] text-gray-600 uppercase font-black">Hydration</p>
                    <p className="text-[10px] font-black text-white">{waterGlassCount} / 8 Glasses</p>
                  </div>
               </div>
               <button onClick={() => { systemSounds.click(); drinkWater(); }} className={`text-xs font-black uppercase p-2 border ${accentColor} border-current hover:bg-white/5 transition-all`}>Consumable</button>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-3 border border-white/10 bg-white/[0.02] flex items-center gap-4 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{equippedItems.weapon ? "🗡️" : "⚔️"}</span>
              <div className="overflow-hidden">
                <p className="text-[7px] text-gray-600 uppercase font-black">Primary Armament</p>
                <p className={`text-[10px] font-black uppercase truncate ${accentColor}`}>{equippedItems.weapon?.name || 'Unarmed'}</p>
              </div>
            </div>
            <div className="p-3 border border-white/10 bg-white/[0.02] flex items-center gap-4 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">{equippedItems.armor ? "👕" : "🛡️"}</span>
              <div className="overflow-hidden">
                <p className="text-[7px] text-gray-600 uppercase font-black">Defense Core</p>
                <p className={`text-[10px] font-black uppercase truncate ${accentColor}`}>{equippedItems.armor?.name || 'Standard'}</p>
              </div>
            </div>
          </div>

          {/* Shadow Legion Grid */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-[10px] uppercase tracking-[0.4em] font-black italic ${isAwakened ? 'text-purple-400' : 'text-gray-500'}`}>
                    Shadow Legion {isAwakened && "[ Sovereign Active ]"}
                </h3>
                <span className="text-[8px] text-gray-600 font-mono">{shadows.length} / {isAwakened ? '10' : '4'}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {shadows.length > 0 ? shadows.map(shadow => (
                <motion.div 
                    whileHover={{ x: 4 }} 
                    onClick={() => { systemSounds.click(); setSelectedShadow(shadow); }} 
                    key={shadow.name} 
                    className="cursor-pointer p-3 border border-purple-900/40 bg-purple-950/10 flex items-center gap-3 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-2xl shrink-0 z-10 filter drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">{shadow.icon}</span>
                  <div className="overflow-hidden leading-tight z-10">
                    <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${shadow.color || 'text-purple-100'}`}>{shadow.name}</p>
                    <p className="text-[7px] text-purple-500 font-black uppercase italic truncate tracking-widest">{shadow.rank}</p>
                  </div>
                </motion.div>
              )) : (
                <p className="text-[8px] text-gray-600 italic uppercase tracking-[0.2em] py-2">No shadows extracted from the void...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}