import { systemSounds } from '../../utils/sounds';

export const createQuestSlice = (set, get) => ({
  bossActive: false,
  bossHealth: 100,
  bossMaxHealth: 100,
  inDungeon: false,
  dungeonTimer: 0,
  activeDungeon: null,
  penaltyActive: false,

  quests: [
    { id: 1, title: "Pushups [0/50]", completed: false, reward: 25, goldReward: 100 },
    { id: 2, title: "Sit-ups [0/50]", completed: false, reward: 25, goldReward: 100 },
    { id: 3, title: "Squats [0/50]", completed: false, reward: 25, goldReward: 100 },
    { id: 4, title: "Walking [6K]", completed: false, reward: 50, goldReward: 250 },
  ],

  achievements: [
    { id: 'a1', title: 'First Blood', desc: 'Clear 1 Dungeon', target: 1, completed: false, reward: { gold: 500 } },
    { id: 'a2', title: 'Iron Will', desc: 'Reach 20 Strength', target: 20, stat: 'strength', completed: false, reward: { points: 2 } },
  ],

  resetQuests: () => set((state) => ({
    quests: state.quests.map(q => ({ ...q, completed: false })),
    hasReportedMorning: false,
    waterGlassCount: 0
  })),

  completeQuest: (id) => {
    const state = get();
    const quest = state.quests.find(q => q.id === id);
    if (quest && !quest.completed) {
      systemSounds.questComplete();
      state.gainExp(quest.reward); // Calls playerSlice action
      
      const updatedQuests = state.quests.map(q => q.id === id ? { ...q, completed: true } : q);
      set({ 
        gold: state.gold + quest.goldReward, 
        quests: updatedQuests, 
        fatigue: Math.min(state.fatigue + 10, 100) 
      });
    }
  },

  enterDungeon: (type) => {
    const dungeonData = { 
      'Instant': { time: 60, exp: 100, gold: 500, type: 'Instant' }, 
      'Red': { time: 1500, exp: 500, gold: 2000, type: 'Red' } 
    };
    set({ inDungeon: true, dungeonTimer: dungeonData[type].time, activeDungeon: dungeonData[type] });
  },

  completeDungeon: () => {
    const state = get();
    systemSounds.questComplete();
    state.gainExp(state.activeDungeon?.exp || 100);
    set({ inDungeon: false, activeDungeon: null, extractionAvailable: true });
  },

  attackBoss: () => set((state) => {
    systemSounds.click();
    const damage = state.stats.strength + (state.shadows.length * 2);
    const newHealth = Math.max(0, state.bossHealth - damage);
    
    if (newHealth === 0) {
      const ranks = ["E", "D", "C", "B", "A", "S"];
      set({ 
        bossActive: false, 
        rank: ranks[ranks.indexOf(state.rank) + 1] || "S", 
        gold: state.gold + 5000 
      });
    }
    return { bossHealth: newHealth };
  }),
});