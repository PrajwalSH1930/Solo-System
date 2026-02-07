import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState } from 'react';
import { systemSounds } from '../utils/sounds';

export default function StoreOverlay({ isOpen, onClose }) {
  const { gold, buyItem } = useHunterStore();
  const [activeTab, setActiveTab] = useState('weapon');

  const shopItems = [
    // --- WEAPONS ---
    { name: 'Kasaka\'s Venom Fang', price: 1500, bonus: 15, category: 'weapon', desc: 'Made from the Great Serpent. Inflicts [Paralyze] and [Bleed].' },
    { name: 'Knight Killer', price: 3000, bonus: 25, category: 'weapon', desc: 'Designed to penetrate heavy armor. (+25 DMG vs Knights)' },
    { name: 'Baruka\'s Dagger', price: 8000, bonus: 40, category: 'weapon', desc: 'Wielded by the Snow Folk Lord. High agility boost.' },
    { name: 'Devil King\'s Daggers', price: 25000, bonus: 80, category: 'weapon', desc: 'Dropped by Baran. Master of lightning effects.' },
    { name: 'Kamish\'s Wrath', price: 100000, bonus: 250, category: 'weapon', desc: 'The ultimate weapon carved from a Dragon\'s tooth.' },

    // --- ARMOR & ACCESSORIES ---
    { name: 'Warden\'s Necklace', price: 2000, bonus: 10, category: 'armor', desc: 'Agility +10 and Sense +10. A relic from the underground.' },
    { name: 'High Knight\'s Chestplate', price: 5000, bonus: 20, category: 'armor', desc: 'Heavy physical protection. Reduces damage by 20%.' },
    { name: 'Black Knight\'s Helmet', price: 7500, bonus: 15, category: 'armor', desc: 'Reduces magic damage taken. (+15 DEF)' },
    { name: 'Red Knight\'s Gauntlets', price: 12000, bonus: 30, category: 'armor', desc: 'Increases grip and attack speed. (+30 STR/AGI)' },
    { name: 'Demon Monarch\'s Ring', price: 45000, bonus: 50, category: 'armor', desc: 'Set item from the Demon Castle. Massive Mana boost.' },

    // --- CONSUMABLES & QUEST ITEMS ---
    { name: 'Strength Elixir', price: 500, category: 'consumable', desc: 'A foul-smelling liquid that hardens the muscles. (+1 STR)' },
    { name: 'Mana Potion', price: 300, category: 'consumable', desc: 'Restores 50% of total Mana instantly.' },
    { name: 'Full Recovery Potion', price: 2000, category: 'consumable', desc: 'Heals all wounds and fatigue instantly.' },
    { name: 'Dungeon Key', price: 1500, category: 'consumable', desc: 'Used to unlock Instant Dungeons for leveling.' },
    { name: 'Elixir of Life', price: 1000000, category: 'consumable', desc: 'The Holy Water of Life. Can cure any disease.' }
  ];

  const filteredItems = shopItems.filter(item => item.category === activeTab);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-[100] p-6 font-system text-white backdrop-blur-md overflow-hidden flex flex-col"
    >
      {/* HEADER Section */}
      <div className="flex justify-between items-start mb-6 border-b border-hunter-blue/30 pb-4">
        <div>
          <h2 className="text-hunter-blue font-black tracking-[0.3em] text-2xl italic drop-shadow-[0_0_10px_#00eeff]">STORE</h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Trading with the Great Spellcaster Kandiaru</p>
        </div>
        <button 
          onClick={() => { systemSounds.click(); onClose(); }} 
          className="bg-white/5 border border-white/10 px-3 py-1 text-[10px] hover:bg-red-500/20 hover:border-red-500/50 transition-all uppercase font-bold"
        >
          Exit [×]
        </button>
      </div>
      
      {/* CURRENCY Display */}
      <div className="bg-gradient-to-r from-orange-600/20 to-transparent border-l-4 border-orange-500 p-4 mb-6">
        <p className="text-[10px] text-orange-400 uppercase font-bold tracking-widest">Available Balance</p>
        <p className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">{gold.toLocaleString()} G</p>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-2 mb-6">
        {['weapon', 'armor', 'consumable'].map((tab) => (
          <button
            key={tab}
            onClick={() => { systemSounds.click(); setActiveTab(tab); }}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-tighter border-b-2 transition-all ${
              activeTab === tab 
              ? 'border-hunter-blue text-hunter-blue bg-hunter-blue/10 shadow-[inset_0_-10px_20px_rgba(0,238,255,0.05)]' 
              : 'border-white/10 text-gray-500 hover:text-white'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* ITEMS Grid */}
      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="space-y-4"
          >
            {filteredItems.map(item => (
              <div 
                key={item.name} 
                className="group relative border border-white/10 p-4 bg-white/[0.02] flex flex-col gap-3 transition-all hover:bg-white/[0.05] hover:border-hunter-blue/50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase italic tracking-tight group-hover:text-hunter-blue transition-colors">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  {item.bonus && (
                    <span className="text-[9px] font-black text-hunter-blue border border-hunter-blue/30 px-2 py-0.5 bg-hunter-blue/5">
                      +{item.bonus} STAT
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <span className={`text-xs font-mono font-bold ${gold >= item.price ? 'text-orange-400' : 'text-red-500'}`}>
                    {item.price.toLocaleString()} G
                  </span>
                  <button 
                    disabled={gold < item.price}
                    onClick={() => { systemSounds.questComplete(); buyItem(item); }} 
                    className={`text-[10px] font-black px-6 py-2 transition-all uppercase tracking-[0.2em] ${
                      gold >= item.price 
                      ? 'bg-hunter-blue text-black hover:bg-white hover:shadow-[0_0_15px_#00eeff]' 
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {gold >= item.price ? 'Purchase' : 'Insufficient Gold'}
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-4 text-[8px] text-gray-700 tracking-[0.5em] uppercase text-center font-bold italic">
        "One who looks for strength should not fear the price."
      </p>
    </motion.div>
  );
}