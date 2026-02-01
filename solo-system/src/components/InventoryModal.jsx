import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function InventoryModal({ onClose }) {
  const { inventory, useItem, isAwakened } = useHunterStore();
  const accentColor = isAwakened ? "text-purple-400" : "text-hunter-blue";
  const borderColor = isAwakened ? "border-purple-500" : "border-hunter-blue";

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[400] bg-black/95 flex items-center justify-center p-4 font-system"
    >
      <div className={`relative w-full max-w-sm border-2 ${borderColor} bg-slate-900 p-6 shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`${accentColor} text-sm font-black uppercase tracking-[0.4em]`}>Player Inventory</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl">✕</button>
        </div>

        {/* 4-Column Grid for Items */}
        <div className="grid grid-cols-4 gap-3 mb-8 min-h-[200px] content-start">
          {inventory.length > 0 ? inventory.map((item) => (
            <button
              key={item.id}
              onClick={() => { useItem(item.id); }}
              className="aspect-square border border-gray-700 bg-black/40 flex items-center justify-center relative group hover:border-white transition-all"
            >
              <span className="text-2xl">{item.category === 'consumable' ? '🧪' : '⚔️'}</span>
              <div className="absolute -top-1 -right-1 bg-hunter-blue text-black text-[6px] px-1 font-bold italic uppercase">
                {item.category === 'consumable' ? 'Use' : 'Equip'}
              </div>
            </button>
          )) : (
            <div className="col-span-4 flex flex-col items-center justify-center opacity-20 py-10">
              <span className="text-4xl mb-2">🎒</span>
              <p className="text-[8px] uppercase tracking-widest">Inventory is Empty</p>
            </div>
          )}
        </div>

        <button 
          onClick={onClose}
          className={`w-full py-3 bg-white/5 border ${borderColor} ${accentColor} font-black uppercase tracking-widest hover:bg-white/10 transition-all`}
        >
          Close Inventory
        </button>
      </div>
    </motion.div>
  );
}