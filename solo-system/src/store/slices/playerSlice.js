import { systemSounds } from '../../utils/sounds';

export const createPlayerSlice = (set, get) => ({
  playerName: "",
  level: 1,
  exp: 0,
  nextLevelExp: 100,
  abilityPoints: 0,
  rank: "E",
  job: "None",
  gold: 0,
  currentTitle: "None",
  joinDate: new Date().toLocaleDateString(),
  currentStreak: 0,
  isAwakened: false,
  mana: 100,
  maxMana: 100,
  fatigue: 0,
  maxFatigue: 100,
  // Added 'vitality' to stats to link with your health sync later
  stats: { strength: 10, agility: 10, intelligence: 10, perception: 10, vitality: 10 },
  skills: [],
  isSystemLoaded: false,

  setPlayerName: (name) => {
    set({ playerName: name });
    if (get().addLog) get().addLog(`Identity Verified: Player [${name}] registered.`);
  },

  initializeSystem: () => set({ isSystemLoaded: true }),

  getPowerMultiplier: () => {
    const state = get();
    if (state.isAwakened) return 1.5;
    const multipliers = { 'Necromancer': 1.5, 'Assassin': 1.3, 'Fighter': 1.4, 'None': 1.0 };
    return multipliers[state.job] || 1.0;
  },

  gainExp: (amount) => set((state) => {
    if (state.bossActive) return state;
    
    let fatigueMultiplier = state.fatigue >= 100 ? 0 : state.fatigue > 70 ? 0.5 : 1.0;
    const intBonus = state.stats.intelligence * 0.01; 
    const streakMultiplier = state.currentStreak >= 3 ? 2 : 1;
    const totalMultiplier = (streakMultiplier * fatigueMultiplier) + intBonus;

    let newExp = state.exp + (amount * totalMultiplier);
    let newLevel = state.level;
    let newNextLevelExp = state.nextLevelExp;
    let newPoints = state.abilityPoints;
    let triggerBoss = false;

    if (newExp >= state.nextLevelExp) {
      newLevel += 1;
      newExp -= state.nextLevelExp;
      newNextLevelExp = Math.floor(state.nextLevelExp * 1.5);
      newPoints += 5;
      
      if (state.isSystemLoaded) systemSounds.levelUp();
      if (get().addLog) get().addLog(`SYSTEM: LEVEL UP! Current Level: ${newLevel}`);
      
      if (newLevel % 10 === 0) triggerBoss = true; 
    }
    
    return { 
      level: newLevel, 
      exp: newExp, 
      nextLevelExp: newNextLevelExp, 
      abilityPoints: newPoints, 
      bossActive: triggerBoss, 
      bossHealth: 100 + (newLevel * 10), 
      bossMaxHealth: 100 + (newLevel * 10) 
    };
  }),

  // 🧬 IMPROVED STAT ALLOCATION
  increaseStat: (statName) => {
    const state = get();
    if (state.abilityPoints > 0) {
      systemSounds.click(); // Using your sound utility
      set((s) => ({ 
        stats: { ...s.stats, [statName]: s.stats[statName] + 1 }, 
        abilityPoints: s.abilityPoints - 1 
      }));
      
      if (get().addLog) {
        get().addLog(`Stat Increased: ${statName.toUpperCase()} is now ${get().stats[statName]}`);
      }
    }
  },

  triggerAwakening: (chosenJob) => {
    const state = get();
    set({ 
      isAwakened: true, 
      job: chosenJob, 
      rank: "S", 
      currentTitle: "Shadow Monarch", 
      maxMana: state.maxMana + 500, 
      mana: state.maxMana + 500 
    });
    if (get().addLog) get().addLog("SYSTEM EVOLUTION COMPLETE. PROTOCOL 'MONARCH' ACTIVE.");
    systemSounds.levelUp();
  },
});