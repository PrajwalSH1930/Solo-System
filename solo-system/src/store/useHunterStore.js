/* eslint-disable no-unused-vars */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware' // Added createJSONStorage
import { systemSounds } from '../utils/sounds'
import { systemNotifications } from '../utils/notifications';
import { Preferences } from '@capacitor/preferences'; // Added for Mobile Persistence

// --- MOBILE STORAGE ADAPTER ---
// This replaces localStorage to prevent the phone OS from wiping your save data.
const capacitorStorage = {
  getItem: async (name) => {
    const { value } = await Preferences.get({ key: name });
    return value ? JSON.parse(value) : null;
  },
  setItem: async (name, value) => {
    await Preferences.set({ key: name, value: JSON.stringify(value) });
  },
  removeItem: async (name) => {
    await Preferences.remove({ key: name });
  },
};

export const useHunterStore = create(
  persist(
    (set, get) => ({
      // --- CORE STATE ---
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
      lastCompletionDate: null,
      lastRewardClaimedDate: null,
      isAwakened: false,

      // --- MORNING & REST SYSTEM ---
      wakeUpTime: "06:00",
      hasReportedMorning: false,
      isResting: false,
      restStartTime: null,
      mana: 100,
      maxMana: 100,
      
      // --- REAL LIFE UTILS & VITALITY ---
      waterGlassCount: 0,
      systemWarning: null,
      fatigue: 0,
      maxFatigue: 100,
      totalStepsToday: 0,
      lastSyncTimestamp: null,

      // --- STATS & INVENTORY ---
      stats: { strength: 10, agility: 10, intelligence: 10, perception: 10 },
      inventory: [],
      equippedItems: { weapon: null, armor: null },
      skills: [], 
      shadows: [], 
      logs: [],
      achievements: [
        { id: 'a1', title: 'First Blood', desc: 'Clear 1 Dungeon', target: 1, completed: false, reward: { gold: 500 } },
        { id: 'a2', title: 'Iron Will', desc: 'Reach 20 Strength', target: 20, stat: 'strength', completed: false, reward: { points: 2 } },
      ],

      // --- SYSTEM STATES ---
      bossActive: false,
      bossHealth: 100,
      bossMaxHealth: 100,
      quests: [
        { id: 1, title: "Pushups [0/50]", completed: false, reward: 25, goldReward: 100 },
        { id: 2, title: "Sit-ups [0/50]", completed: false, reward: 25, goldReward: 100 },
        { id: 3, title: "Squats [0/50]", completed: false, reward: 25, goldReward: 100 },
        { id: 4, title: "Walking [6K]", completed: false, reward: 50, goldReward: 250 },
      ],
      inDungeon: false,
      dungeonTimer: 0,
      activeDungeon: null,
      extractionAvailable: false,
      penaltyActive: false,
      timeLeft: 24 * 60 * 60,

      // --- CORE ACTIONS ---
      setPlayerName: (name) => {
        set({ playerName: name });
        get().addLog(`Identity Verified: Player [${name}] registered.`);
      },

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
          systemSounds.levelUp();
          if (newLevel % 10 === 0) triggerBoss = true; 
        }
        return { level: newLevel, exp: newExp, nextLevelExp: newNextLevelExp, abilityPoints: newPoints, bossActive: triggerBoss, bossHealth: 100 + (newLevel * 10), bossMaxHealth: 100 + (newLevel * 10) };
      }),

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
          state.gainExp(quest.reward);
          const updatedQuests = state.quests.map(q => q.id === id ? { ...q, completed: true } : q);
          set({ gold: state.gold + quest.goldReward, quests: updatedQuests, fatigue: Math.min(state.fatigue + 10, 100) });
        }
      },

      syncHealthData: async () => {
        const state = get();
        systemSounds.click();
        const newSteps = 12000; 
        const diff = newSteps - state.totalStepsToday;
        if (diff > 0) {
          state.gainExp(Math.floor(diff / 100));
          set({ totalStepsToday: newSteps, mana: Math.min(state.mana + Math.floor(diff / 500), state.maxMana), lastSyncTimestamp: Date.now() });
          if (newSteps >= 12000) state.completeQuest(4);
        }
      },

      triggerAwakening: (chosenJob) => {
        const state = get();
        set({ isAwakened: true, job: chosenJob, rank: "S", currentTitle: "Shadow Monarch", maxMana: state.maxMana + 500, mana: state.maxMana + 500 });
        state.addLog("SYSTEM EVOLUTION COMPLETE. PROTOCOL 'MONARCH' ACTIVE.");
        systemSounds.levelUp();
      },

      extractShadow: () => set((state) => {
        const shadowLimit = state.isAwakened ? 10 : 4;
        if (state.shadows.length >= shadowLimit) return { extractionAvailable: false };
        const shadowData = [
          { name: "Igris", icon: "⚔️", rank: "Knight Grade", color: "text-red-500", image: "https://i.pinimg.com/736x/75/75/4e/75754e943c3e5f731731bafe1886d29f.jpg", lore: "Blood-Red Commander.", stats: { power: 85, speed: 90 } },
          { name: "Tank", icon: "🐻", rank: "Elite Grade", color: "text-gray-400", image: "https://wallpaper.forfun.com/fetch/18/181033249133ab07f9c56ff5a00050fd.jpeg", lore: "Leader of Ice Bears.", stats: { power: 95, speed: 40 } },
          { name: "Iron", icon: "🛡️", rank: "Knight Grade", color: "text-blue-400", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIs-EBSTj9z-8Lv2RLUGogueA5XfEpEXC5Ig&s", lore: "Indestructible guardian.", stats: { power: 80, speed: 50 } },
          { name: "Kaisel", icon: "🐉", rank: "Knight Grade", color: "text-purple-500", image: "https://wallpapercave.com/wp/wp11243687.jpg", lore: "The Wyvern Lord.", stats: { power: 75, speed: 100 } }
        ];
        const available = shadowData.filter(s => !state.shadows.find(existing => existing.name === s.name));
        if (available.length === 0) return { extractionAvailable: false };
        systemSounds.levelUp(); 
        return { shadows: [...state.shadows, available[0]], extractionAvailable: false, stats: { ...state.stats, strength: state.stats.strength + 3 } };
      }),

      attackBoss: () => set((state) => {
        systemSounds.click();
        const damage = state.stats.strength + (state.shadows.length * 2);
        const newHealth = Math.max(0, state.bossHealth - damage);
        if (newHealth === 0) {
          const ranks = ["E", "D", "C", "B", "A", "S"];
          set({ bossActive: false, rank: ranks[ranks.indexOf(state.rank) + 1] || "S", gold: state.gold + 5000 });
        }
        return { bossHealth: newHealth };
      }),

      claimDailyReward: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        if (state.lastRewardClaimedDate === today) return { success: false };
        systemSounds.levelUp();
        state.resetQuests();
        set({ gold: state.gold + 500, lastRewardClaimedDate: today, inventory: [...state.inventory, { id: Date.now(), name: 'Strength Elixir', category: 'consumable' }] });
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

      drinkWater: () => set((s) => ({ waterGlassCount: s.waterGlassCount + 1, mana: Math.min(s.mana + 20, s.maxMana) })),
      enterRestMode: () => set({ isResting: true, restStartTime: Date.now() }),
      wakeUp: () => set({ isResting: false, fatigue: 0, mana: get().maxMana }),
      reportMorning: () => { systemSounds.levelUp(); set({ hasReportedMorning: true }); },
      setWakeUpTime: (time) => set({ wakeUpTime: time }),
      increaseStat: (name) => set((s) => ({ stats: { ...s.stats, [name]: s.stats[name] + 1 }, abilityPoints: s.abilityPoints - 1 })),
      addLog: (text) => set((s) => ({ logs: [{ id: Date.now(), text, date: new Date().toLocaleTimeString() }, ...s.logs].slice(0, 10) })),
      tick: () => set((state) => {
        let update = {};
        if (state.timeLeft > 0) update.timeLeft = state.timeLeft - 1;
        if (state.inDungeon && state.dungeonTimer > 0) {
          update.dungeonTimer = state.dungeonTimer - 1;
          if (update.dungeonTimer === 0) setTimeout(() => get().completeDungeon(), 100);
        }
        return update;
      })
    }),
    { 
      name: 'hunter-storage',
      storage: createJSONStorage(() => capacitorStorage) // Critical: Mobile Storage Hook
    }
  )
)