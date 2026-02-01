export default function PenaltyScreen({ timeLeft, onExit }) {
  const hours = Math.floor(timeLeft / 3600);
  const mins = Math.floor((timeLeft % 3600) / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fixed inset-0 bg-red-950/90 z-50 flex flex-col items-center justify-center font-system text-white text-center p-10">
      <h1 className="text-5xl font-bold text-red-500 animate-pulse mb-4 tracking-tighter">PENALTY QUEST: SURVIVAL</h1>
      <p className="text-red-200 mb-8 max-w-sm">Goal: Survive until the timer reaches zero. Failure is not an option.</p>
      
      <div className="text-6xl font-mono border-y-2 border-red-500 py-4 w-full max-w-xs">
        {String(hours).padStart(2, '0')}:{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </div>

      <p className="mt-10 text-[10px] uppercase text-red-400 italic">Current Location: Penalty Zone (Desert)</p>
      
      {/* For testing purposes, we'll allow an exit button */}
      <button onClick={onExit} className="mt-12 text-[10px] border border-red-500/50 px-4 py-1 text-red-500/50">Admin: Force Exit</button>
    </div>
  );
}