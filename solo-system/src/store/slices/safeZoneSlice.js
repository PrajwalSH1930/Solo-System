import { Geolocation } from '@capacitor/geolocation';

export const createSafeZoneSlice = (set, get) => ({
  homeLocation: { lat: null, lng: null },
  isInsideSafeZone: false,
  lastWildTimestamp: null,

  setHomeBase: async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      set({ 
        homeLocation: { 
          lat: coordinates.coords.latitude, 
          lng: coordinates.coords.longitude 
        },
        isInsideSafeZone: true 
      });
      if (get().addLog) get().addLog("HOME BASE REGISTERED: Safe Zone established.", "success");
    } catch (e) {
      if (get().addLog) get().addLog("Failed to establish Home Base. Check GPS permissions.", "critical");
    }
  },

  checkLocationTask: async () => {
    const { homeLocation, fatigue, addLog, lastWildTimestamp } = get();
    if (!homeLocation.lat) return;

    try {
      const current = await Geolocation.getCurrentPosition();
      
      // Calculate distance (approx 50m radius)
      const dist = Math.sqrt(
        Math.pow(current.coords.latitude - homeLocation.lat, 2) + 
        Math.pow(current.coords.longitude - homeLocation.lng, 2)
      );

      const isHome = dist < 0.0005; 
      set({ isInsideSafeZone: isHome });

      if (isHome) {
        // 2x Recovery Mechanic (Restoring Fatigue twice as fast)
        if (fatigue > 0) {
          set({ fatigue: Math.max(0, fatigue - 2) }); 
        }
        set({ lastWildTimestamp: null });
      } else {
        // Wild Timer Logic
        if (!lastWildTimestamp) {
          set({ lastWildTimestamp: Date.now() });
        } else {
          const hoursInWild = (Date.now() - lastWildTimestamp) / (1000 * 60 * 60);
          if (hoursInWild >= 4) {
            if (addLog) addLog("Warning: Environmental Hazard. Return to Safe Zone.", "critical");
          }
        }
      }
    } catch (e) {
      console.error("GPS Check Failed", e);
    }
  }
});