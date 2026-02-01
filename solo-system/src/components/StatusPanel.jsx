import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useHunterStore } from '../store/useHunterStore';
import InventoryModal from './InventoryModal';

// --- SHADOW DETAIL MODAL ---
function ShadowDetailModal({ shadow, onClose }) {
  if (!shadow) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 font-system"
    >
      <div className="relative w-full max-w-sm aspect-[2/3] overflow-hidden border border-purple-500 bg-black shadow-[0_0_50px_rgba(168,85,247,0.4)] rounded-sm flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          {shadow.image ? (
            <img src={shadow.image} alt={shadow.name} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">{shadow.icon || "👥"}</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl z-30">✕</button>
        <div className="p-6 relative z-10 w-full">
          <h2 className={`text-6xl font-black italic uppercase tracking-tighter leading-none mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] ${shadow.color || 'text-purple-500'}`}>{shadow.name}</h2>
          <p className="text-purple-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6">{shadow.rank || 'Knight Grade'}</p>
          <div className="grid grid-cols-3 gap-4 mb-8 bg-black/60 backdrop-blur-md p-4 rounded-sm border border-white/10">
            <div className="text-center"><p className="text-[8px] text-gray-500 uppercase font-bold">Power</p><p className="text-xl font-black text-white">{shadow.stats?.power || '85'}</p></div>
            <div className="text-center"><p className="text-[8px] text-gray-500 uppercase font-bold">Speed</p><p className="text-xl font-black text-white">{shadow.stats?.speed || '90'}</p></div>
            <div className="text-center"><p className="text-[8px] text-gray-500 uppercase font-bold">Loyalty</p><p className="text-xl font-black text-white">MAX</p></div>
          </div>
          <button onClick={onClose} className="w-full py-4 bg-purple-600/20 border border-purple-500 text-purple-400 font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all backdrop-blur-sm">Return to Shadow Fold</button>
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
  const borderColor = isAwakened ? "border-purple-600 shadow-[0_0_30px_rgba(168,85,247,0.4)]" : "border-hunter-blue shadow-[0_0_30px_rgba(0,212,255,0.2)]";
  const accentColor = isAwakened ? "text-purple-400" : "text-hunter-blue";

  return (
    <>
      <AnimatePresence>{selectedShadow && <ShadowDetailModal shadow={selectedShadow} onClose={() => setSelectedShadow(null)} />}</AnimatePresence>
      <AnimatePresence>{isInventoryOpen && <InventoryModal onClose={() => setIsInventoryOpen(false)} />}</AnimatePresence>

      <div className={`w-full max-w-md border-2 p-6 rounded-lg bg-black/80 mb-6 relative overflow-hidden font-system text-white transition-all duration-1000 ${borderColor}`}>
        <div className={`absolute -right-0 -top-1 text-8xl font-black italic select-none z-0 uppercase opacity-10 ${accentColor}`}>{rank}</div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-2">
            <div className={`text-[8px] font-bold px-2 py-0.5 rounded-sm tracking-[0.2em] ${isAwakened ? 'bg-purple-900 text-purple-200' : 'bg-gray-800 text-gray-400'}`}>{isAwakened ? 'MONARCH CLASS' : `${job.toUpperCase()} CLASS`}</div>
            <div className="flex gap-2">
              <button onClick={() => setIsInventoryOpen(true)} className={`text-[7px] border px-2 py-0.5 transition-all uppercase font-bold ${isAwakened ? 'border-purple-500 text-purple-400 hover:bg-purple-500' : 'border-hunter-blue text-hunter-blue hover:bg-hunter-blue'} hover:text-black`}>Bag</button>
              {!isResting && <button onClick={enterRestMode} className={`text-[7px] border px-2 py-0.5 transition-all uppercase font-bold ${isAwakened ? 'border-purple-500 text-purple-400 hover:bg-purple-500' : 'border-blue-500/30 text-blue-400 hover:bg-blue-500'} hover:text-black`}>Rest</button>}
            </div>
          </div>

          <div className="flex justify-between items-end mb-4">
            <div><span className="text-4xl font-bold italic block leading-none">LV. {level}</span><span className={`text-[10px] uppercase tracking-[0.2em] font-bold block mt-2 ${isAwakened ? 'text-purple-500 animate-pulse' : 'text-orange-400'}`}>Title: {currentTitle}</span></div>
            <div className="text-right">
               <div className="mb-2 flex flex-col items-end"><span className="text-[7px] text-gray-500 uppercase tracking-widest">Alarm Config</span><input type="time" value={wakeUpTime} onChange={(e) => setWakeUpTime(e.target.value)} className={`bg-transparent font-bold text-[10px] outline-none ${accentColor}`} /></div>
              <span className={`text-[10px] border px-2 py-1 uppercase font-bold tracking-tighter italic ${isAwakened ? 'border-purple-500 text-purple-400' : 'border-hunter-blue text-hunter-blue'}`}>{rank}-RANK</span>
            </div>
          </div>
        </div>
        
        {/* Resource Bars */}
        <div className="space-y-3 mb-6 relative z-10">
          <div><div className="flex justify-between text-[7px] uppercase tracking-widest text-gray-500 mb-1"><span>EXP</span><span>{Math.floor(expPercentage)}%</span></div><div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${expPercentage}%` }} className={`h-full ${isAwakened ? 'bg-purple-500' : 'bg-hunter-blue'}`} /></div></div>
          <div><div className="flex justify-between text-[7px] uppercase tracking-widest text-gray-500 mb-1"><span>Mana</span><span>{mana}/{maxMana}</span></div><div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${manaPercentage}%` }} className={`h-full ${isAwakened ? 'bg-purple-400' : 'bg-blue-500'}`} /></div></div>
          <div><div className="flex justify-between text-[7px] uppercase tracking-widest text-gray-500 mb-1"><span>Fatigue</span><span className={fatigue > 80 ? 'text-red-500 animate-pulse' : ''}>{fatigue}/100</span></div><div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden"><motion.div animate={{ width: `${fatigue}%` }} className={`h-full ${fatigue > 80 ? 'bg-red-600' : 'bg-gray-600'}`} /></div></div>
        </div>

        {/* Hydration */}
        <div className="mb-6 relative z-10 bg-white/5 p-3 border border-white/5">
            <div className="flex justify-between items-center mb-2"><h3 className={`text-[9px] uppercase tracking-[0.3em] font-bold italic ${accentColor}`}>Hydration</h3><span className="text-[9px] text-white font-bold">{waterGlassCount}/12</span></div>
            <div className="flex flex-wrap gap-1.5">{[...Array(12)].map((_, i) => (<button key={i} onClick={drinkWater} disabled={i < waterGlassCount} className={`w-3 h-3 rounded-full border ${i < waterGlassCount ? (isAwakened ? 'bg-purple-500 border-purple-300' : 'bg-blue-500 border-blue-300') : 'border-gray-700'}`} />))}</div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
          {Object.entries(stats).map(([name, value]) => (
            <div key={name} className="bg-white/5 p-2 border border-white/5 flex justify-between items-center">
              <span className="uppercase text-[9px] text-gray-400 font-bold">{name}</span>
              <div className="flex items-center gap-2"><span className={`font-bold text-xs ${accentColor}`}>{value}</span>{abilityPoints > 0 && <button onClick={() => increaseStat(name)} className={`border w-4 h-4 text-[10px] font-bold ${isAwakened ? 'border-purple-500 text-purple-400' : 'border-hunter-blue text-hunter-blue'}`}>+</button>}</div>
            </div>
          ))}
        </div>

        {/* Equipment */}
        <h3 className={`text-[9px] uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10 ${accentColor} opacity-60`}>Equipment</h3>
        <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
          <div className="p-2 border border-gray-700 bg-black/40 flex items-center gap-3">
            <span className="text-lg opacity-50">{equippedItems.weapon ? "🗡️" : "⚔️"}</span>
            <div className="overflow-hidden"><p className="text-[7px] text-gray-500 uppercase font-bold">Weapon</p><p className={`text-[9px] font-bold uppercase truncate ${accentColor}`}>{equippedItems.weapon?.name || 'Bare Hands'}</p></div>
          </div>
          <div className="p-2 border border-gray-700 bg-black/40 flex items-center gap-3">
            <span className="text-lg opacity-50">{equippedItems.armor ? "👕" : "🛡️"}</span>
            <div className="overflow-hidden"><p className="text-[7px] text-gray-500 uppercase font-bold">Armor</p><p className={`text-[9px] font-bold uppercase truncate ${accentColor}`}>{equippedItems.armor?.name || 'Basic Clothes'}</p></div>
          </div>
        </div>

        {/* Shadow Army */}
        <h3 className="text-[9px] text-purple-400 uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10">Shadow Army {isAwakened && "(10 Slots)"}</h3>
        <div className="grid grid-cols-2 gap-2 relative z-10">
          {shadows.length > 0 ? shadows.map(shadow => (
            <motion.div whileHover={{ scale: 1.05 }} onClick={() => setSelectedShadow(shadow)} key={shadow.name} className="cursor-pointer p-2 border border-purple-600/50 bg-purple-900/10 flex items-center gap-3 group transition-all">
              <span className="text-xl shrink-0 filter drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">{shadow.icon}</span>
              <div className="overflow-hidden leading-tight">
                <p className={`text-[10px] font-black uppercase tracking-tighter truncate ${shadow.color || 'text-purple-200'}`}>{shadow.name}</p>
                <p className="text-[7px] text-purple-400/60 font-bold uppercase italic truncate">{shadow.rank}</p>
              </div>
            </motion.div>
          )) : <p className="text-[8px] text-gray-500 italic uppercase">No Shadows Available</p>}
        </div>
      </div>
    </>
  );
}