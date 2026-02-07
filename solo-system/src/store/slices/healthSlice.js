import { Health } from '@capgo/capacitor-health';

export const createHealthSlice = (set, get) => ({

  totalStepsToday: 0,
  lastSyncTimestamp: null,
  healthAuthorized: false,

  syncHealthData: async () => {
    try {

      console.log("=== START HEALTH SYNC ===");

      const { available } = await Health.isAvailable();
      console.log("Available:", available);

      if (!available) return;

      const auth = await Health.requestAuthorization({
        read: ['steps'],
        write: []
      });

      console.log("Auth:", auth);

      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const result = await Health.readSamples({
  type: 'steps',
  dataType: 'steps',
  startDate: start.toISOString(),
  endDate: new Date().toISOString()
});


      console.log("Raw Result:", JSON.stringify(result, null, 2));

      const totalSteps = (result.samples || []).reduce(
        (sum, s) => sum + (s.value || 0),
        0
      );

      console.log("TOTAL STEPS:", totalSteps);

      set({
        totalStepsToday: totalSteps,
        lastSyncTimestamp: Date.now(),
        healthAuthorized: true
      });

      console.log("=== HEALTH SYNC DONE ===");

    } catch (err) {
      console.error("HEALTH ERROR:", err);
    }
  },
});
