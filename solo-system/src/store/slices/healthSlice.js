import { Health } from '@capgo/capacitor-health';
import { Capacitor } from '@capacitor/core';

export const createHealthSlice = (set, get) => ({

  totalStepsToday: 0,

  heartRateCurrent: null,
  heartRateAverageToday: null,
  heartRateZone: 'UNSUPPORTED',
  lastHeartSampleTime: null,

  lastSyncTimestamp: null,
  healthAuthorized: false,

  syncHealthData: async () => {
    try {
      console.log("=== START HEALTH SYNC ===");

      const platform = Capacitor.getPlatform(); // 'android' | 'ios'
      console.log("Platform:", platform);

      const { available } = await Health.isAvailable();
      if (!available) return;

      // ✅ Only request what the platform supports
      const readTypes =
        platform === 'ios'
          ? ['steps', 'heart_rate']
          : ['steps'];

      await Health.requestAuthorization({
        read: readTypes,
        write: []
      });

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const now = new Date();

      // ======================
      // STEPS
      // ======================
      const stepsResult = await Health.readSamples({
        type: 'steps',
        dataType: 'steps',
        startDate: start.toISOString(),
        endDate: now.toISOString()
      });

      const totalSteps = (stepsResult.samples || []).reduce(
        (sum, s) => sum + (s.value || 0),
        0
      );

      // ======================
      // HEART RATE (iOS ONLY)
      // ======================
      let currentHR = null;
      let avgHR = null;
      let zone = 'UNSUPPORTED';
      let lastSampleTime = null;

      if (platform === 'ios') {
        const hrResult = await Health.readSamples({
          type: 'heart_rate',
          dataType: 'heart_rate',
          startDate: start.toISOString(),
          endDate: now.toISOString()
        });

        const samples = hrResult.samples || [];

        if (samples.length > 0) {
          const latest = samples[samples.length - 1];
          currentHR = Math.round(latest.value);
          lastSampleTime = new Date(latest.startDate).getTime();

          const total = samples.reduce((s, x) => s + x.value, 0);
          avgHR = Math.round(total / samples.length);

          if (currentHR < 60) zone = 'RESTING';
          else if (currentHR < 90) zone = 'NORMAL';
          else if (currentHR < 120) zone = 'ACTIVE';
          else zone = 'COMBAT';
        }
      }

      set({
        totalStepsToday: totalSteps,

        heartRateCurrent: currentHR,
        heartRateAverageToday: avgHR,
        heartRateZone: zone,
        lastHeartSampleTime: lastSampleTime,

        lastSyncTimestamp: Date.now(),
        healthAuthorized: true
      });

      console.log("=== HEALTH SYNC DONE ===");

    } catch (err) {
      console.error("HEALTH ERROR:", err);
    }
  },
});
