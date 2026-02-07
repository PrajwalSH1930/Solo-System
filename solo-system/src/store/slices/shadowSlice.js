import { allShadows } from '../../data/shadows';
import { systemSounds } from '../../utils/sounds';

export const createShadowSlice = (set, get) => ({
  shadows: [],
  extractionAvailable: false,
  shadowLimitReached: false, 

  closeLimitPopup: () => set({ shadowLimitReached: false }),

  extractShadow: () => {
    const state = get();
    // Adjust limit based on awakening status
    const shadowLimit = state.isAwakened ? 20 : 4;
    
    // 1. CHECK LIMIT
    if (state.shadows.length >= shadowLimit) {
      systemSounds.click(); 
      set({ shadowLimitReached: true, extractionAvailable: false });
      return;
    }
    
    // 2. FIND AVAILABLE SHADOW
    const available = allShadows.filter(s => !state.shadows.find(existing => existing.name === s.name));
    
    if (available.length === 0) {
      set({ extractionAvailable: false });
      return;
    }
    
    // 3. SUCCESSFUL EXTRACTION
    systemSounds.levelUp(); 
    const newShadow = available[0];
    
    set((state) => ({ 
      shadows: [...state.shadows, newShadow], 
      extractionAvailable: false, 
      stats: { ...state.stats, strength: state.stats.strength + 3 } 
    }));
  },
});