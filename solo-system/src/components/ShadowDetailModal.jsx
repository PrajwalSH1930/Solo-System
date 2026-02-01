import { motion } from 'framer-motion';

export default function ShadowDetailModal({ shadow, onClose }) {
  if (!shadow) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center p-4 font-system"
    >
      <div className="relative w-full max-w-sm overflow-hidden border border-purple-500/50 bg-black shadow-[0_0_50px_rgba(168,85,247,0.3)] min-h-[500px] flex flex-col justify-end">
        
        {/* BACKGROUND IMAGE - Now fills the entire card */}
        <div className="absolute inset-0 z-0">
          {shadow.image ? (
            <img 
              src={shadow.image} 
              alt={shadow.name} 
              className="w-full h-full object-cover opacity-40 transition-opacity duration-500" 
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-9xl opacity-10">
              {shadow.icon || "👥"}
            </div>
          )}
          
          {/* VIGNETTE GRADIENT - Darkens bottom and top for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        {/* CLOSE BUTTON - Moved outside the top div since that div was removed */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl z-30"
        >
          ✕
        </button>

        {/* CONTENT SECTION - Pushed to the bottom over the image background */}
        <div className="p-6 relative z-10">
          <h2 className={`text-6xl font-black italic uppercase tracking-tighter leading-none mb-1 ${shadow.color || 'text-purple-500'} drop-shadow-lg`}>
            {shadow.name}
          </h2>
          <p className="text-purple-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-6">
            {shadow.rank || 'Knight Grade'}
          </p>
          
          <div className="mb-6">
             <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mb-2">Lore & Archives</p>
             <p className="text-gray-300 text-xs italic leading-relaxed border-l-2 border-purple-500 pl-4 bg-black/40 py-2 backdrop-blur-sm">
               {shadow.lore || "A loyal shadow soldier bound to the Monarch. Its power is limited only by the Master's will."}
             </p>
          </div>

          {/* Detailed Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-8 bg-black/40 backdrop-blur-sm p-4 rounded-sm border border-white/5">
            {shadow.stats ? (
              Object.entries(shadow.stats).map(([key, val]) => (
                <div key={key} className="text-center">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">{key}</p>
                  <p className="text-xl font-black text-white">{val}</p>
                </div>
              ))
            ) : (
              <>
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Power</p>
                  <p className="text-xl font-black text-white">85</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Speed</p>
                  <p className="text-xl font-black text-white">90</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] text-gray-500 uppercase font-bold">Loyalty</p>
                  <p className="text-xl font-black text-white">MAX</p>
                </div>
              </>
            )}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-purple-900/40 border border-purple-500 text-purple-400 font-black uppercase tracking-widest hover:bg-purple-500 hover:text-black transition-all backdrop-blur-md"
          >
            Return to Shadow Fold
          </button>
        </div>
      </div>
    </motion.div>
  );
}