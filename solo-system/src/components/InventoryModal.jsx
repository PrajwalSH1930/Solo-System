import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState } from 'react';
import { systemSounds } from '../utils/sounds';

export default function InventoryModal({ onClose }) {
  const { inventory, useItem, isAwakened, equippedItems } = useHunterStore();
  const [selectedItem, setSelectedItem] = useState(null);

  const accentColor = isAwakened ? "text-purple-400" : "text-hunter-blue";
  const glowColor = isAwakened ? "shadow-[0_0_15px_rgba(168,85,247,0.4)]" : "shadow-[0_0_15px_rgba(0,238,255,0.4)]";
  const borderColor = isAwakened ? "border-purple-500/50" : "border-hunter-blue/50";

  // Helper to determine item icon based on name/category
  const getItemIcon = (item) => {
    if (item.category === 'weapon') return '⚔️';
    if (item.category === 'armor') return '🛡️';
    if (item.name.includes('Potion') || item.name.includes('Elixir')) return '🧪';
    if (item.name.includes('Key')) return '🔑';
    return '📦';
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 font-system"
    >
      <div className={`relative w-full max-w-sm border ${borderColor} bg-[#050505] p-6 ${glowColor} flex flex-col`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 className={`${accentColor} text-xs font-black uppercase tracking-[0.4em] italic`}>Storage</h2>
            <p className="text-[8px] text-gray-500 uppercase mt-1">Dimensional Pocket v1.0</p>
          </div>
          <button onClick={() => { systemSounds.click(); onClose(); }} className="text-gray-500 hover:text-white transition-colors">✕</button>
        </div>

        {/* Item Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6 min-h-[220px] content-start overflow-y-auto no-scrollbar pr-1">
          {Array.from({ length: Math.max(16, inventory.length) }).map((_, index) => {
            const item = inventory[index];
            const isEquipped = item && (equippedItems.weapon?.id === item.id || equippedItems.armor?.id === item.id);

            return (
              <button
                key={item?.id || `empty-${index}`}
                onClick={() => {
                  if (item) {
                    systemSounds.click();
                    setSelectedItem(item);
                  }
                }}
                className={`aspect-square border transition-all relative flex items-center justify-center
                  ${item 
                    ? `bg-white/[0.03] ${selectedItem?.id === item.id ? 'border-white' : 'border-white/10 hover:border-white/40'}` 
                    : 'bg-black/20 border-white/5 cursor-default'
                  }
                  ${isEquipped ? 'ring-1 ring-inset ring-orange-500' : ''}
                `}
              >
                {item && (
                  <>
                    <span className="text-xl">{getItemIcon(item)}</span>
                    {isEquipped && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-[6px] px-1 font-black uppercase">EQUIPPED</div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Item Detail Pane */}
        <div className="min-h-[120px] border-t border-white/10 pt-4 mb-6">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-[11px] font-black uppercase tracking-widest ${accentColor}`}>
                    {selectedItem.name}
                  </h3>
                  <span className="text-[8px] text-gray-500 font-mono uppercase italic">{selectedItem.category}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic mb-4 leading-tight">{selectedItem.desc}</p>
                
                <button
                  onClick={() => {
                    systemSounds.questComplete();
                    useItem(selectedItem.id);
                    if (selectedItem.category === 'consumable') setSelectedItem(null);
                  }}
                  className={`mt-auto py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${selectedItem.category === 'consumable' 
                      ? 'bg-orange-600/20 text-orange-400 border border-orange-500/50 hover:bg-orange-600 hover:text-white' 
                      : 'bg-hunter-blue/20 text-hunter-blue border border-hunter-blue/50 hover:bg-hunter-blue hover:text-black'
                    }`}
                >
                  {selectedItem.category === 'consumable' ? 'Consume Item' : 'Equip / Unequip'}
                </button>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full opacity-20">
                <p className="text-[9px] uppercase tracking-[0.3em]">Select an item to view data</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => { systemSounds.click(); onClose(); }}
          className="w-full py-2 text-[9px] text-gray-500 uppercase tracking-widest hover:text-white transition-all border border-transparent hover:border-white/10"
        >
          Return to Hub
        </button>
      </div>
    </motion.div>
  );
}