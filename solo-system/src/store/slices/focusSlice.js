import { Motion } from '@capacitor/motion';

export const createFocusSlice = (set, get) => ({
  isFocusActive: false,
  manaChargeProgress: 0, // 0 to 100
  focusTimeMinutes: 0,
  movementDetected: false,
  _accelListener: null,

  startFocusMode: async () => {
    // Reset state and activate
    set({ 
      isFocusActive: true, 
      manaChargeProgress: 0, 
      focusTimeMinutes: 0,
      movementDetected: false 
    });
    
    // Start Monitoring Accelerometer for movement
    const listener = await Motion.addListener('accel', (event) => {
      const { x, y, z } = event.accelerationIncludingGravity;
      const totalMovement = Math.abs(x) + Math.abs(y) + Math.abs(z);

      // Sensitivity threshold: If movement > 13 (Realme 12 Pro+ sensitivity), focus is broken
      if (totalMovement > 13 && get().isFocusActive) {
        set({ movementDetected: true });
        get().stopFocusMode(false); // Immediate failure
      }
    });

    set({ _accelListener: listener });
  },

  stopFocusMode: async (isSuccess) => {
    const { _accelListener, focusTimeMinutes } = get();
    
    // Clean up the native listener
    if (_accelListener) {
      _accelListener.remove();
    }

    if (isSuccess) {
      // Reward logic: 1 INT per 10 minutes, plus XP
      const intGain = Math.floor(focusTimeMinutes / 10);
      
      // Standard XP reward (5 XP per minute focused)
      if (get().addExperience) get().addExperience(focusTimeMinutes * 5);
      
      set((state) => ({
        stats: { 
          ...state.stats, 
          intelligence: state.stats.intelligence + intGain 
        }
      }));
    } else {
      // Logic for failed focus (e.g., small fatigue penalty)
      set((state) => ({ fatigue: Math.min(state.fatigue + 5, 100) }));
    }

    set({ isFocusActive: false, _accelListener: null, manaChargeProgress: 0 });
  },

  updateFocusProgress: () => {
    const { isFocusActive, manaChargeProgress } = get();
    if (!isFocusActive) return;

    // Increment progress: ~1.67% per second = 60 seconds per full cycle
    if (manaChargeProgress >= 100) {
      set((state) => ({
        manaChargeProgress: 0,
        focusTimeMinutes: state.focusTimeMinutes + 1
      }));
    } else {
      set((state) => ({
        manaChargeProgress: state.manaChargeProgress + 1.67
      }));
    }
  }
});