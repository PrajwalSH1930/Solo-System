import { motion } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function StoreOverlay({ isOpen, onClose }) {
  const { gold, buyItem } = useHunterStore();
  
  // ... inside shopItems array
  const shopItems = [
    { name: 'Kasaka Dagger', price: 1500, bonus: 15, category: 'weapon', desc: 'Poisonous +15 Damage' },
    { name: 'Steel Armor', price: 2000, bonus: 10, category: 'armor', desc: 'Defense +10' },
    { name: 'Strength Elixir', price: 500, category: 'consumable', desc: '+1 STR' },
  ];

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }} 
      className="fixed inset-0 bg-black z-50 p-6 border-l border-hunter-blue font-system text-white"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-hunter-blue font-bold tracking-widest text-xl italic">SYSTEM STORE</h2>
        <button onClick={onClose} className="text-xs text-gray-500 hover:text-white">[CLOSE]</button>
      </div>
      
      <p className="text-orange-400 mb-6 text-sm font-bold tracking-widest uppercase">
        Mana Crystals: {gold}G
      </p>

      <div className="space-y-4">
        {shopItems.map(item => (
          <div key={item.name} className="border border-hunter-blue/30 p-4 bg-blue-900/10 flex justify-between items-center transition-all hover:border-hunter-blue">
            <div>
              <p className="text-sm font-bold text-white uppercase">{item.name}</p>
              <p className="text-[10px] text-gray-500 italic uppercase">{item.desc}</p>
            </div>
            <button 
              onClick={() => buyItem(item)} 
              className="bg-hunter-blue text-black font-black text-[10px] px-3 py-1 hover:bg-white transition-colors"
            >
              BUY {item.price}G
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}