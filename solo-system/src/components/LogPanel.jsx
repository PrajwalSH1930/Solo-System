import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';

export default function LogPanel() {
  const { logs, achievements, isAwakened } = useHunterStore();

  const accentColor = isAwakened ? "text-purple-400" : "text-hunter-blue";
  const borderColor = isAwakened ? "border-purple-500/30" : "border-hunter-blue/30";
  const glowColor = isAwakened ? "shadow-[0_0_15px_rgba(168,85,247,0.2)]" : "shadow-[0_0_15px_rgba(0,212,255,0.2)]";

  return (
    <div className="w-full max-w-md mt-10 space-y-8 font-system text-white pb-10">
      
      {/* 1. ACHIEVEMENTS: THE HALL OF RECORDS */}
      <div className={`relative border-l-2 ${borderColor} bg-white/[0.02] p-6 backdrop-blur-sm ${glowColor}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-[10px] ${accentColor} uppercase tracking-[0.4em] font-black italic`}>
            Feats of the Monarch
          </h3>
          <div className="flex gap-1">
             <div className={`w-1 h-1 rounded-full ${accentColor.replace('text', 'bg')} animate-pulse`} />
             <div className="w-1 h-1 rounded-full bg-gray-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {achievements.map((ach, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              key={ach.id} 
              className={`group relative flex justify-between items-center p-3 border transition-all duration-500
                ${ach.completed 
                  ? 'border-green-500/40 bg-green-500/5 shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]' 
                  : 'border-white/5 bg-transparent'
                }`}
            >
              {/* Completed Highlight */}
              {ach.completed && (
                <div className="absolute left-0 top-0 h-full w-[2px] bg-green-500 shadow-[0_0_8px_#22c55e]" />
              )}
              
              <div className="pr-4">
                <p className={`text-[10px] font-black uppercase tracking-widest ${ach.completed ? 'text-green-400' : 'text-gray-500'}`}>
                  {ach.title}
                </p>
                <p className="text-[8px] text-gray-600 italic mt-0.5 group-hover:text-gray-400 transition-colors">
                  {ach.desc}
                </p>
              </div>

              {ach.completed ? (
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[7px] text-green-500 font-black tracking-tighter animate-pulse">RECORDED</span>
                  <span className="text-[10px]">🏆</span>
                </div>
              ) : (
                <span className="text-[14px] opacity-20 grayscale">🔒</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. SYSTEM LOGS: THE ARCHITECT'S TERMINAL */}
      <div className="relative group">
        <div className="flex items-center gap-3 mb-4 opacity-50">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-gray-800" />
          <h3 className="text-[8px] text-gray-500 uppercase tracking-[0.5em] font-black">System History</h3>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-gray-800" />
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar mask-fade-edge">
          <AnimatePresence mode="popLayout">
            {logs.slice(0).reverse().map((log) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                key={log.id} 
                className="flex justify-between items-start text-[9px] group/item hover:bg-white/[0.02] p-1 transition-colors"
              >
                <div className="flex gap-2">
                  <span className={`${accentColor} opacity-50 font-mono`}>&gt;</span>
                  <span className="text-gray-400 tracking-tight leading-relaxed group-hover/item:text-gray-200">
                    {log.text}
                  </span>
                </div>
                <span className="text-gray-700 font-mono text-[7px] pt-0.5 whitespace-nowrap pl-4 italic">
                  [{log.date.split(',')[1] || log.date}]
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Terminal Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none border border-white/[0.02] rounded-lg" />
      </div>

      {/* 3. FINAL SYSTEM FOOTER */}
      <div className="flex flex-col items-center py-6 border-t border-white/5 opacity-20">
         <div className={`w-1 h-1 rounded-full mb-2 ${isAwakened ? 'bg-purple-500 shadow-[0_0_10px_#a855f7]' : 'bg-hunter-blue shadow-[0_0_10px_#00d4ff]'}`} />
         <p className="text-[6px] text-white uppercase tracking-[1.5em] font-black">End of Line</p>
      </div>
    </div>
  );
}