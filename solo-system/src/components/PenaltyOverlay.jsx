import { useHunterStore } from '../store/useHunterStore';

export default function PenaltyOverlay() {
  const { timeLeft, penaltyActive, exitPenalty } = useHunterStore();

  if (!penaltyActive) return null;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-red-950 flex flex-col items-center justify-center font-system text-white p-6 z-[100] text-center">
      <h1 className="text-4xl font-bold text-red-600 animate-pulse mb-4 tracking-tighter">
        [PENALTY QUEST: SURVIVAL]
      </h1>
      <p className="text-red-200 text-xs mb-8 uppercase tracking-widest max-w-[250px]">
        You failed to complete the daily quest. Survive until the timer reaches zero.
      </p>
      <div className="text-6xl font-bold border-y border-red-600 py-6 w-full max-w-sm mb-10">
        {formatTime(timeLeft)}
      </div>
      <button 
        onClick={exitPenalty} 
        className="text-[10px] text-red-900 border border-red-900 px-4 py-1 hover:bg-red-600 hover:text-white"
      >
        ADMIN: FORCE EXIT
      </button>
    </div>
  );
}