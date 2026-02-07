import { systemSounds } from '../../utils/sounds';

export const createSystemSlice = (set, get) => ({
  logs: [],
  inventory: [],
  equippedItems: { weapon: null, armor: null },
  timeLeft: 24 * 60 * 60,
  wakeUpTime: "06:00",
  hasReportedMorning: false,
  isResting: false,
  restStartTime: null,
  waterGlassCount: 0,
  systemWarning: null,
  totalStepsToday: 0,
  lastSyncTimestamp: null,
  lastCompletionDate: null,
  lastRewardClaimedDate: null,

  addLog: (text) => set((s) => ({ 
    logs: [{ id: Date.now(), text, date: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 10) 
  })),

  setWakeUpTime: (time) => set({ wakeUpTime: time }),
  
  drinkWater: () => set((s) => ({ 
    waterGlassCount: s.waterGlassCount + 1, 
    mana: Math.min(s.mana + 20, s.maxMana) 
  })),

  enterRestMode: () => set({ isResting: true, restStartTime: Date.now() }),
  
  wakeUp: () => set((state) => ({ isResting: false, fatigue: 0, mana: state.maxMana })),
  
  reportMorning: () => { 
    systemSounds.levelUp(); 
    set({ hasReportedMorning: true }); 
  },

  claimDailyReward: () => {
    const state = get();
    const today = new Date().toISOString().split('T')[0];
    if (state.lastRewardClaimedDate === today) return { success: false };
    
    systemSounds.levelUp();
    state.resetQuests(); // Calls questSlice action
    
    set({ 
      gold: state.gold + 500, 
      lastRewardClaimedDate: today, 
      inventory: [...state.inventory, { id: Date.now(), name: 'Strength Elixir', category: 'consumable' }] 
    });
    return { success: true };
  },

  buyItem: (item) => {
    const state = get();
    if (state.gold >= item.price) {
      systemSounds.questComplete();
      set({ 
        gold: state.gold - item.price, 
        inventory: [...state.inventory, { ...item, id: Date.now() }] 
      });
      state.addLog(`Purchased: [${item.name}]`);
    }
  },

  useItem: (id) => {
    const state = get();
    const item = state.inventory.find(i => i.id === id);
    if (!item) return;

    if (item.category === 'consumable') {
      systemSounds.levelUp();
      set({ 
        stats: { ...state.stats, strength: state.stats.strength + 1 },
        inventory: state.inventory.filter(i => i.id !== id) 
      });
      state.addLog(`Used: [${item.name}]. STR +1.`);
    } else {
      systemSounds.click();
      const category = item.category;
      const currentEquipped = state.equippedItems[category];
      set({
        equippedItems: {
          ...state.equippedItems,
          [category]: currentEquipped?.id === item.id ? null : item
        }
      });
    }
  },

  syncHealthData: async () => {
    const state = get();
    systemSounds.click();
    const newSteps = 12000; // Mock data for now
    const diff = newSteps - state.totalStepsToday;
    
    if (diff > 0) {
      state.gainExp(Math.floor(diff / 100)); // Calls playerSlice
      set({ 
        totalStepsToday: newSteps, 
        mana: Math.min(state.mana + Math.floor(diff / 500), state.maxMana), 
        lastSyncTimestamp: Date.now() 
      });
      if (newSteps >= 12000) state.completeQuest(4); // Calls questSlice
    }
  },

  tick: () => set((state) => {
    let update = {};
    if (state.timeLeft > 0) update.timeLeft = state.timeLeft - 1;
    
    if (state.inDungeon && state.dungeonTimer > 0) {
      update.dungeonTimer = state.dungeonTimer - 1;
      if (update.dungeonTimer === 0) setTimeout(() => get().completeDungeon(), 100);
    }
    return update;
  })
});