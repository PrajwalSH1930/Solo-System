import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { systemSounds } from '../utils/sounds'

export const useHunterStore = create(
  persist(
    (set, get) => ({
      // --- CORE ---
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

      // NEW: MORNING SYSTEM
      wakeUpTime: "07:00", // Default 7 AM
      hasReportedMorning: false,

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
        { id: 1, title: "Pushups [0/100]", completed: false, reward: 25, goldReward: 100 },
        { id: 2, title: "Sit-ups [0/100]", completed: false, reward: 25, goldReward: 100 },
        { id: 3, title: "Squats [0/100]", completed: false, reward: 25, goldReward: 100 },
        { id: 4, title: "Running [10km]", completed: false, reward: 50, goldReward: 250 },
      ],
      secretQuest: null,
      inDungeon: false,
      dungeonTimer: 0,
      activeDungeon: null,
      extractionAvailable: false,
      penaltyActive: false,
      timeLeft: 24 * 60 * 60,

      // --- ACTIONS ---
      setWakeUpTime: (time) => set({ wakeUpTime: time }),
      
      reportMorning: () => {
        const state = get();
        systemSounds.levelUp();
        set({ hasReportedMorning: true });
        state.addLog("Morning check-in complete. System active.");
      },

      claimDailyReward: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        if (state.lastRewardClaimedDate === today) return { success: false, message: "REWARD ALREADY CLAIMED" };

        const rewardGold = 200 + (state.currentStreak * 50);
        const newItem = { id: Date.now(), name: 'Strength Elixir', price: 500, category: 'consumable', desc: '+1 STR' };
        
        systemSounds.levelUp();
        set({
          gold: state.gold + rewardGold,
          inventory: [...state.inventory, newItem],
          lastRewardClaimedDate: today,
          hasReportedMorning: false // Reset morning check-in for the new day
        });
        state.addLog(`Claimed Daily Reward: ${rewardGold}G + Elixir`);
        return { success: true, message: `RECEIVED: ${rewardGold}G & ELIXIR` };
      },

      getPowerMultiplier: () => {
        const job = get().job;
        if (job === 'Necromancer') return 1.5;
        if (job === 'Assassin') return 1.3;
        if (job === 'Fighter') return 1.4;
        return 1.0;
      },

      gainExp: (amount) => set((state) => {
        if (state.bossActive) return state;
        const multiplier = state.currentStreak >= 3 ? 2 : 1;
        let newExp = state.exp + (amount * multiplier);
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
        return { level: newLevel, exp: newExp, nextLevelExp: newNextLevelExp, abilityPoints: newPoints, bossActive: triggerBoss, bossHealth: 100 + (newLevel * 10) };
      }),

      completeQuest: (id) => {
        const state = get();
        const quest = state.quests.find(q => q.id === id);
        if (quest && !quest.completed) {
          systemSounds.questComplete();
          state.gainExp(quest.reward);
          const updatedQuests = state.quests.map(q => q.id === id ? { ...q, completed: true } : q);
          const allDone = updatedQuests.every(q => q.completed);

          if (allDone) {
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            let newStreak = state.currentStreak;
            if (state.lastCompletionDate === yesterdayStr) newStreak += 1;
            else if (state.lastCompletionDate !== today) newStreak = 1;
            set({ gold: state.gold + quest.goldReward, quests: updatedQuests, currentStreak: newStreak, lastCompletionDate: today });
            state.addLog(`Daily Quests Complete! Streak: ${newStreak}`);
          } else {
            set({ gold: state.gold + quest.goldReward, quests: updatedQuests });
          }
        }
      },

      extractShadow: () => set((state) => {
        const shadowNames = ["Igris", "Tank", "Iron", "Kaisel"];
        const randomShadow = shadowNames[Math.floor(Math.random() * shadowNames.length)];
        systemSounds.levelUp(); 
        if (state.shadows.find(s => s.name === randomShadow)) return { extractionAvailable: false };
        const newShadow = { name: randomShadow, bonus: { strength: 2, agility: 2 }, rank: "Knight" };
        return { shadows: [...state.shadows, newShadow], stats: { ...state.stats, strength: state.stats.strength + 2, agility: state.stats.agility + 2 }, extractionAvailable: false };
      }),

      increaseStat: (statName) => {
        systemSounds.click();
        set((state) => {
          if (state.abilityPoints > 0) {
            const newStats = { ...state.stats, [statName]: state.stats[statName] + 1 };
            return { abilityPoints: state.abilityPoints - 1, stats: newStats };
          }
          return state;
        });
        get().checkAchievements();
      },

      toggleEquip: (item) => {
        systemSounds.click();
        set((state) => {
          const type = item.category;
          if (state.equippedItems[type]?.id === item.id) return { equippedItems: { ...state.equippedItems, [type]: null } };
          return { equippedItems: { ...state.equippedItems, [type]: item } };
        });
      },

      attackBoss: () => {
        systemSounds.click();
        set((state) => {
          const weaponBonus = state.equippedItems.weapon ? state.equippedItems.weapon.bonus : 0;
          const damage = (state.stats.strength + weaponBonus) + (state.shadows.length * 2);
          const newHealth = Math.max(0, state.bossHealth - damage);
          if (newHealth === 0) {
            setTimeout(() => {
              systemSounds.levelUp();
              const ranks = ["E", "D", "C", "B", "A", "S"];
              const currentIdx = ranks.indexOf(state.rank);
              const nextRank = ranks[currentIdx + 1] || "S";
              set({ bossActive: false, rank: nextRank, gold: state.gold + 5000 });
            }, 500);
          }
          return { bossHealth: newHealth };
        });
      },

      addLog: (entry) => set((state) => ({ logs: [{ id: Date.now(), text: entry, date: new Date().toLocaleTimeString() }, ...state.logs].slice(0, 10) })),

      checkAchievements: () => set((state) => {
        const updatedAchievements = state.achievements.map(ach => {
          if (ach.completed) return ach;
          let isNowComplete = false;
          if (ach.id === 'a1' && state.logs.filter(l => l.text.includes('Cleared')).length >= ach.target) isNowComplete = true;
          if (ach.stat && state.stats[ach.stat] >= ach.target) isNowComplete = true;
          if (isNowComplete) {
            systemSounds.levelUp();
            if (ach.reward.gold) state.gold += ach.reward.gold;
            if (ach.reward.points) state.abilityPoints += ach.reward.points;
            return { ...ach, completed: true };
          }
          return ach;
        });
        return { achievements: updatedAchievements };
      }),

      enterDungeon: (type) => {
        systemSounds.click();
        const dungeons = { 'Instant': { time: 60, exp: 100, gold: 500, type: 'Instant' }, 'Red': { time: 1500, exp: 500, gold: 2000, type: 'Red' } };
        set({ inDungeon: true, dungeonTimer: dungeons[type].time, activeDungeon: dungeons[type] });
      },

      completeDungeon: () => {
        const state = get();
        if (state.activeDungeon) {
          systemSounds.questComplete();
          state.gainExp(state.activeDungeon.exp);
          state.addLog(`Cleared ${state.activeDungeon.type} Gate`);
          set({ gold: state.gold + state.activeDungeon.gold, inDungeon: false, activeDungeon: null, dungeonTimer: 0, extractionAvailable: state.activeDungeon.type === 'Red' });
          state.checkAchievements();
        }
      },

      buyItem: (item) => {
        if (get().gold >= item.price) systemSounds.questComplete();
        set((state) => {
          if (state.gold >= item.price) return { gold: state.gold - item.price, inventory: [...state.inventory, { ...item, id: Date.now() }] };
          return state;
        });
      },

      useItem: (itemId) => {
        systemSounds.click();
        set((state) => {
          const item = state.inventory.find(i => i.id === itemId);
          if (!item) return state;
          if (item.category === 'weapon' || item.category === 'armor') { get().toggleEquip(item); return state; }
          if (item.name === 'Strength Elixir') return { stats: { ...state.stats, strength: state.stats.strength + 1 }, inventory: state.inventory.filter(i => i.id !== itemId) };
          return { inventory: state.inventory.filter(i => i.id !== itemId) };
        });
      },

      changeJob: (newJob) => {
        systemSounds.levelUp();
        let jobSkills = [];
        if (newJob === 'Necromancer') jobSkills = [{ name: 'Arise', desc: 'Extract shadows' }];
        if (newJob === 'Assassin') jobSkills = [{ name: 'Stealth', desc: 'Become invisible' }];
        if (newJob === 'Fighter') jobSkills = [{ name: 'Bloodlust', desc: 'Buff strength' }];
        set({ job: newJob, skills: jobSkills });
      },

      resetQuests: () => set((state) => ({ quests: state.quests.map(q => ({ ...q, completed: false })) })),

      tick: () => set((state) => {
        let update = {};
        if (state.timeLeft > 0) update.timeLeft = state.timeLeft - 1;
        if (state.inDungeon && state.dungeonTimer > 0) {
          update.dungeonTimer = state.dungeonTimer - 1;
          if (update.dungeonTimer === 0) { setTimeout(() => get().completeDungeon(), 100); }
        }
        return update;
      }),

      exitPenalty: () => set({ penaltyActive: false, timeLeft: 24 * 60 * 60 })
    }),
    { name: 'hunter-storage' }
  )
)