import { allShadows } from '../../data/shadows';
import { systemSounds } from '../../utils/sounds';

export const createShadowSlice = (set, get) => ({
  shadows: [],
  extractionAvailable: false,

  extractShadow: () => set((state) => {
    const shadowLimit = state.isAwakened ? 10 : 4;
    
    // Check if army is full
    if (state.shadows.length >= shadowLimit) return { extractionAvailable: false };
    
    // Find next available shadow from the master list
    // It filters out shadows you already have
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