import { motion, AnimatePresence } from 'framer-motion';
import { useHunterStore } from '../store/useHunterStore';
import { useState, useEffect } from 'react';

export default function VitalitySync() {
  const {
    totalStepsToday,
    syncHealthData,
    lastSyncTimestamp,
    isAwakened,
    showXPPop,
    heartRateCurrent,
    heartRateAverageToday,
    heartRateZone,
    lastHeartSampleTime
  } = useHunterStore();

  const [isSyncing, setIsSyncing] = useState(false);

  const GOAL = 10000;
  const progress = Math.min((totalStepsToday / GOAL) * 100, 100);

  const accentColor = isAwakened ? "rgb(168, 85, 247)" : "rgb(16, 185, 129)";
  const textColor = isAwakened ? "text-purple-400" : "text-emerald-400";
  const barColor = isAwakened ? "bg-purple-500" : "bg-emerald-500";
  const glowShadow = isAwakened
    ? "shadow-[0_0_25px_rgba(168,85,247,0.6)]"
    : "shadow-[0_0_25px_rgba(16,185,129,0.6)]";

  // Auto-sync every 60 seconds
  useEffect(() => {
    syncHealthData();
    const interval = setInterval(syncHealthData, 60000);
    return () => clearInterval(interval);
  }, [syncHealthData]);

  const handleSync = async () => {
    setIsSyncing(true);
    await syncHealthData();
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const pulseSpeed = heartRateCurrent
    ? Math.max(0.4, 90 / heartRateCurrent)
    : 1;

  const zoneColor = {
    RESTING: "text-blue-400",
    NORMAL: "text-emerald-400",
    ACTIVE: "text-yellow-400",
    COMBAT: "text-red-500"
  }[heartRateZone] || "text-white/40";

  return (
    <div className="w-full max-w-md relative">

      <div className="relative bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl">

        {/* XP POP */}
        <AnimatePresence>
          {showXPPop && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: 1, y: -120, scale: 1.4 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 -translate-x-1/2 z-50"
            >
              <span className={`text-3xl font-black italic ${textColor}`}>
                +500 XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.5em] ${textColor}`}>
              Vessel Vitality
            </h3>
            <p className="text-[8px] text-white/40 uppercase tracking-widest">
              Status: {heartRateZone === 'UNSUPPORTED'
  ? "Sensor Offline"
  : heartRateZone}

            </p>
          </div>

          <div className="text-right">
            <div className="text-4xl font-black italic text-white tabular-nums">
              {totalStepsToday.toLocaleString()}
            </div>
            <p className="text-[9px] text-white/30 uppercase tracking-widest">
              Steps
            </p>
          </div>
        </div>

        {/* HEART RATE PANEL */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-white/40">
              Combat Pulse
            </p>
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: pulseSpeed }}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <span className={`text-xl font-black ${zoneColor}`}>
                {heartRateCurrent ?? "--"} BPM
              </span>
            </div>
            <p className="text-[8px] text-white/30">
              Avg Today: {heartRateAverageToday ?? "--"} BPM
            </p>
          </div>

          <div className="text-right">
            <p className={`text-[10px] font-black ${zoneColor}`}>
              {heartRateZone === 'UNSUPPORTED'
  ? "Sensor Offline"
  : heartRateZone}

            </p>
            <p className="text-[8px] text-white/30">
              {lastHeartSampleTime
                ? new Date(lastHeartSampleTime).toLocaleTimeString()
                : "NO DATA"}
            </p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex justify-between text-[8px] mb-2 uppercase text-white/30">
            <span>Mana Core</span>
            <span className={textColor}>{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-3 bg-white/[0.05] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
              className={`h-full ${barColor} ${glowShadow}`}
            />
          </div>
        </div>

        {/* ACTION */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full py-3 border border-white/10 text-[11px] font-black uppercase tracking-[0.4em]"
        >
          {isSyncing ? "Synchronizing..." : "Manual Sync"}
        </button>

        {/* FOOTER */}
        <div className="mt-6 text-[7px] text-white/30 flex justify-between">
          <span>Node: {isAwakened ? "MONARCH" : "VESSEL"}</span>
          <span>
            Last Sync: {lastSyncTimestamp
              ? new Date(lastSyncTimestamp).toLocaleTimeString()
              : "PENDING"}
          </span>
        </div>
      </div>
    </div>
  );
}
