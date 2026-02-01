import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function StatusPanel() {
  const { 
    level, exp, nextLevelExp, rank, job, currentTitle, 
    stats, abilityPoints, increaseStat, inventory, 
    skills, useItem, shadows, equippedItems 
  } = useHunterStore();
  
  const progressPercentage = (exp / nextLevelExp) * 100;

  return (
    <div className="w-full max-w-md border-2 border-hunter-blue p-6 rounded-lg bg-black/80 shadow-[0_0_30px_rgba(0,212,255,0.2)] mb-6 relative overflow-hidden font-system text-white">
      
      {/* Background Rank Watermark */}
      <div className="absolute -right-0 -top-1 text-8xl font-black text-hunter-blue/10 italic select-none z-0">
        {rank}
      </div>

      {/* NEW: Job Banner (Now correctly placed inside a relative div to sit above watermark) */}
      <div className="relative z-10">
        <div className={`text-[8px] font-bold px-2 py-0.5 rounded-sm mb-4 inline-block tracking-[0.2em] ${
          job === 'Necromancer' ? 'bg-purple-900 text-purple-200 shadow-[0_0_10px_rgba(147,51,234,0.3)]' : 
          job === 'Assassin' ? 'bg-red-900 text-red-200 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 
          job === 'Fighter' ? 'bg-orange-900 text-orange-200 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 
          'bg-gray-800 text-gray-400'
        }`}>
          {job === 'None' ? 'UNRANKED' : `${job.toUpperCase()} CLASS`}
        </div>

        {/* Header Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-4xl font-bold italic block leading-none">LV. {level}</span>
            <span className="text-[10px] text-orange-400 uppercase tracking-[0.2em] font-bold block mt-2 shadow-orange-500/20">Title: {currentTitle}</span>
          </div>
          <span className="text-[10px] text-hunter-blue border border-hunter-blue px-2 py-1 uppercase font-bold tracking-tighter">{rank}-RANK</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mb-6 relative z-10">
        <motion.div animate={{ width: `${progressPercentage}%` }} className="h-full bg-hunter-blue shadow-[0_0_10px_#00d4ff]" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-6 relative z-10">
        {Object.entries(stats).map(([name, value]) => (
          <div key={name} className="bg-white/5 p-2 border border-white/5 flex justify-between items-center hover:border-hunter-blue/30 transition-colors">
            <span className="uppercase text-[9px] text-gray-400 tracking-tighter font-bold">{name}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-hunter-blue text-xs">{value}</span>
              {abilityPoints > 0 && (
                <button onClick={() => increaseStat(name)} className="text-hunter-blue border border-hunter-blue w-4 h-4 text-[10px] font-bold hover:bg-hunter-blue hover:text-black transition-all">+</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Section */}
      <h3 className="text-[9px] text-hunter-blue/60 uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10">Equipment</h3>
      <div className="flex gap-2 mb-6 relative z-10">
        <div className="flex-1 p-2 border border-gray-700 bg-black/40 text-center">
          <p className="text-[7px] text-gray-500 uppercase font-bold">Weapon</p>
          <p className="text-[10px] text-hunter-blue font-bold uppercase truncate">{equippedItems.weapon?.name || 'Empty'}</p>
        </div>
        <div className="flex-1 p-2 border border-gray-700 bg-black/40 text-center">
          <p className="text-[7px] text-gray-500 uppercase font-bold">Armor</p>
          <p className="text-[10px] text-hunter-blue font-bold uppercase truncate">{equippedItems.armor?.name || 'Empty'}</p>
        </div>
      </div>

      {/* Skills Section */}
      <h3 className="text-[9px] text-hunter-blue/60 uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10">Skills</h3>
      <div className="space-y-2 mb-6 relative z-10">
        {skills.length > 0 ? skills.map(skill => (
          <div key={skill.name} className="border border-hunter-blue/30 p-2 bg-blue-900/10">
            <p className="text-xs font-bold text-hunter-blue uppercase tracking-tighter">{skill.name}</p>
            <p className="text-[8px] text-gray-400 italic uppercase">{skill.desc}</p>
          </div>
        )) : <p className="text-[8px] text-gray-600 uppercase italic tracking-widest opacity-50">No Skills Unlocked</p>}
      </div>

      {/* Inventory Section */}
      <h3 className="text-[9px] text-hunter-blue/60 uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10">Inventory</h3>
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {inventory.length > 0 ? inventory.map(item => {
          const isEquipped = equippedItems.weapon?.id === item.id || equippedItems.armor?.id === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => useItem(item.id)} 
              className={`p-2 border text-[9px] uppercase transition-all ${
                isEquipped 
                ? 'border-hunter-blue bg-hunter-blue/20 text-white shadow-[0_0_10px_rgba(0,212,255,0.3)]' 
                : 'border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500'
              }`}
            >
              {item.name} {isEquipped && '[E]'}
            </button>
          );
        }) : <p className="text-[8px] text-gray-600 italic uppercase tracking-tighter opacity-50">Empty</p>}
      </div>

      {/* Shadow Army Section */}
      <h3 className="text-[9px] text-purple-400 uppercase tracking-[0.3em] mb-2 font-bold italic relative z-10">Shadow Army</h3>
      <div className="flex flex-wrap gap-2 relative z-10">
        {shadows && shadows.length > 0 ? shadows.map(shadow => (
          <div key={shadow.name} className="p-2 border border-purple-600 bg-purple-900/20 text-[9px] uppercase shadow-[0_0_10px_rgba(147,51,234,0.3)]">
            {shadow.name} <span className="text-gray-500">[{shadow.rank}]</span>
          </div>
        )) : <p className="text-[8px] text-gray-600 italic uppercase tracking-tighter opacity-50">Shadows await your call...</p>}
      </div>
    </div>
  );
}