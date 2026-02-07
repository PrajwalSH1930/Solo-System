import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { capacitorStorage } from '../utils/storage' // Import from utils

// Import Slices
import { createPlayerSlice } from './slices/playerSlice'
import { createShadowSlice } from './slices/shadowSlice'
import { createQuestSlice } from './slices/questSlice'
import { createSystemSlice } from './slices/systemSlice'

export const useHunterStore = create(
  persist(
    (...a) => ({
      ...createPlayerSlice(...a),
      ...createShadowSlice(...a),
      ...createQuestSlice(...a),
      ...createSystemSlice(...a),
    }),
    {
      name: 'hunter-storage',
      storage: createJSONStorage(() => capacitorStorage),
      // Optional: Only persist fields that matter to save storage space
      // partialize: (state) => ({ ... }) 
    }
  )
);