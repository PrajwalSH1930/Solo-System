import { useHunterStore } from '../store/useHunterStore';

export default function LogPanel() {
  const { logs, achievements } = useHunterStore();

  return (
    <div className="w-full max-w-md mt-6 space-y-4 font-system text-white">
      {/* Achievements */}
      <div className="border border-hunter-blue/20 bg-black/40 p-4 rounded">
        <h3 className="text-[10px] text-hunter-blue uppercase tracking-widest mb-3 font-bold">Achievements</h3>
        <div className="space-y-2">
          {achievements.map(ach => (
            <div key={ach.id} className={`flex justify-between items-center p-2 border ${ach.completed ? 'border-green-900 bg-green-900/10' : 'border-white/5'}`}>
              <div>
                <p className={`text-xs ${ach.completed ? 'text-green-400' : 'text-gray-300'}`}>{ach.title}</p>
                <p className="text-[8px] text-gray-500 italic">{ach.desc}</p>
              </div>
              {ach.completed && <span className="text-[8px] text-green-500 font-bold tracking-tighter">COMPLETE</span>}
            </div>
          ))}
        </div>
      </div>

      {/* System Logs */}
      <div className="p-4 border-t border-white/5 opacity-50">
        <h3 className="text-[8px] text-gray-500 uppercase tracking-widest mb-2">System History</h3>
        <div className="space-y-1">
          {logs.map(log => (
            <div key={log.id} className="flex justify-between text-[9px]">
              <span className="text-gray-400 tracking-tighter">{log.text}</span>
              <span className="text-gray-600 font-mono text-[7px]">{log.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}