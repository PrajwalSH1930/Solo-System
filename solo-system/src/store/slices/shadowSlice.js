import { allShadows } from '../../data/shadows';
import { systemSounds } from '../../utils/sounds';

export const createShadowSlice = (set, get) => ({
  shadows: [],
  extractionAvailable: false,
  shadowLimitReached: false, // 1. New State for the Popup

  // Action to close the popup manually
  closeLimitPopup: () => set({ shadowLimitReached: false }),

  extractShadow: () => set((state) => {
    const shadowLimit = state.isAwakened ? 20 : 4;
    
    // 2. CHECK LIMIT: If full, trigger the popup and stop
    if (state.shadows.length >= shadowLimit) {
      systemSounds.click(); // Optional: Error sound
      return { shadowLimitReached: true, extractionAvailable: false };
    }
    
    // Find next available shadow
    const available = allShadows.filter(s => !state.shadows.find(existing => existing.name === s.name));
    
    if (available.length === 0) return { extractionAvailable: false };
    
    systemSounds.levelUp(); 
    
    return { 
      shadows: [...state.shadows, available[0]], 
      extractionAvailable: false, 
      stats: { ...state.stats, strength: state.stats.strength + 3 } 
    };
  }),
});