import React, { createContext, useContext, useState, useEffect } from 'react';

const HabitForgeContext = createContext();

export const useHabitForge = () => {
  const context = useContext(HabitForgeContext);
  if (!context) {
    throw new Error('useHabitForge must be used within a HabitForgeProvider');
  }
  return context;
};

export const HabitForgeProvider = ({ children }) => {
  // 1. HERO STATE
  const [hero, setHero] = useState({
    name: 'You (PaladinX)',
    class: 'Paladin',
    level: 24,
    xp: 14200,
    xpNext: 15000,
    streak: 7,
    stats: {
      focus: 18,
      vitality: 24,
      wisdom: 12
    },
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    title: 'Level 24 Paladin'
  });

  // Level Up check helper
  const addXp = (amount, statToIncrease, statAmount) => {
    setHero(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpNext = prev.xpNext;
      let leveledUp = false;

      if (newXp >= newXpNext) {
        newXp = newXp - newXpNext;
        newLevel += 1;
        newXpNext = Math.floor(newXpNext * 1.1);
        leveledUp = true;
      }

      const updatedStats = { ...prev.stats };
      if (statToIncrease) {
        const key = statToIncrease.toLowerCase();
        if (updatedStats[key] !== undefined) {
          updatedStats[key] += statAmount;
        }
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        xpNext: newXpNext,
        stats: updatedStats,
        title: `Level ${newLevel} ${prev.class}`,
        leveledUp // Flag to trigger high-tech UI notifications
      };
    });
  };

  // 2. HABITS / QUESTS STATE
  const [habits, setHabits] = useState([
    {
      id: 'meditation-ritual',
      name: 'Morning Meditation',
      grimoireName: 'Meditation Ritual',
      description: 'Daily Quest • Dawn',
      category: 'FOCUS',
      rewardXp: 150,
      rewardStat: 'FOCUS',
      rewardStatVal: 5,
      completedToday: true,
      successRate: 92,
      tier: 'Epic',
      streak: 28,
      streakMultiplier: 12,
      classBonus: 10,
      resonance: [
        true, true, true, false, true, true, true, true, true, false,
        true, true, true, true, true, true, false, true, true, true,
        true, true, true, true, true, true, true, false, true, true
      ],
      history: [
        { date: 'Today, 06:42 AM', status: 'Completed', xpGained: 150 },
        { date: 'Yesterday, 07:15 AM', status: 'Completed', xpGained: 148 },
        { date: '3 days ago', status: 'Failed', xpGained: -25 }
      ]
    },
    {
      id: 'strength-training',
      name: '10km Run',
      grimoireName: 'Strength Training',
      description: 'Weekly (3x) • Afternoon',
      category: 'VITALITY',
      rewardXp: 400,
      rewardStat: 'VITALITY',
      rewardStatVal: 10,
      completedToday: false,
      successRate: 78,
      tier: 'Legendary',
      streak: 15,
      streakMultiplier: 8,
      classBonus: 15,
      resonance: [
        true, false, true, true, false, true, true, true, false, true,
        true, true, false, true, true, false, true, true, true, true,
        false, true, true, true, false, true, true, true, false, false
      ],
      history: [
        { date: 'Yesterday, 08:30 AM', status: 'Completed', xpGained: 400 },
        { date: '3 days ago', status: 'Completed', xpGained: 400 },
        { date: '5 days ago', status: 'Failed', xpGained: -40 }
      ]
    },
    {
      id: 'deep-focus-code',
      name: 'Write Code',
      grimoireName: 'Deep Focus Code',
      description: 'Daily Quest • Morning',
      category: 'WISDOM',
      rewardXp: 250,
      rewardStat: 'WISDOM',
      rewardStatVal: 8,
      completedToday: false,
      successRate: 85,
      tier: 'Epic',
      streak: 22,
      streakMultiplier: 10,
      classBonus: 8,
      resonance: [
        true, true, true, true, true, false, true, true, true, true,
        true, false, true, true, true, true, true, false, true, true,
        true, true, true, true, true, false, true, true, true, false
      ],
      history: [
        { date: 'Yesterday, 10:15 AM', status: 'Completed', xpGained: 250 },
        { date: '2 days ago', status: 'Completed', xpGained: 250 },
        { date: '4 days ago', status: 'Completed', xpGained: 250 }
      ]
    }
  ]);

  const [selectedHabitId, setSelectedHabitId] = useState('meditation-ritual');
  const selectedHabit = habits.find(h => h.id === selectedHabitId) || habits[0];

  // Complete a Daily Quest
  const completeQuest = (id) => {
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === id && !habit.completedToday) {
          // Trigger rewards
          addXp(habit.rewardXp, habit.rewardStat, habit.rewardStatVal);

          // Update 30-day resonance: replace the last element (today) with true
          const updatedResonance = [...habit.resonance];
          updatedResonance[updatedResonance.length - 1] = true;

          const newHistory = [
            { date: 'Just Now', status: 'Completed', xpGained: habit.rewardXp },
            ...habit.history
          ];

          const newStreak = habit.streak + 1;
          const successCount = updatedResonance.filter(Boolean).length;
          const newSuccessRate = Math.round((successCount / updatedResonance.length) * 100);

          return {
            ...habit,
            completedToday: true,
            streak: newStreak,
            successRate: newSuccessRate,
            resonance: updatedResonance,
            history: newHistory
          };
        }
        return habit;
      })
    );

    // Reactive increase streak badge if all done
    setHero(prev => {
      const allDone = habits.every(h => h.id === id ? true : h.completedToday);
      if (allDone) {
        return { ...prev, streak: prev.streak + 1 };
      }
      return prev;
    });
  };

  // Forge a New Habit
  const forgeNewHabit = (name, category, rewardXp, grimoireName, tier = 'Rare') => {
    const statMap = {
      FOCUS: 'FOCUS',
      VITALITY: 'VITALITY',
      WISDOM: 'WISDOM'
    };

    const newHabit = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      grimoireName: grimoireName || name,
      description: `Daily Quest • Custom`,
      category: category,
      rewardXp: parseInt(rewardXp) || 200,
      rewardStat: statMap[category] || 'FOCUS',
      rewardStatVal: Math.ceil((parseInt(rewardXp) || 200) / 30),
      completedToday: false,
      successRate: 100,
      tier: tier,
      streak: 0,
      streakMultiplier: 0,
      classBonus: 5,
      resonance: Array(30).fill(false),
      history: []
    };

    setHabits(prev => [...prev, newHabit]);
    setSelectedHabitId(newHabit.id);
  };

  // 3. LEADERBOARD STATE
  const globalLeaderboard = [
    { rank: 1, name: 'Archmage_Neo', level: 50, xp: 48000, avatar: '🧙‍♂️', isCurrentUser: false },
    { rank: 2, name: 'NIGHTSHADE', level: 42, xp: 38200, avatar: '🥷', isCurrentUser: false },
    { rank: 3, name: 'IRONFIST', level: 39, xp: 35400, avatar: '🧔', isCurrentUser: false },
    { rank: 4, name: 'VoidWalker', level: 38, xp: 32850, avatar: '👤', isCurrentUser: false },
    { rank: 5, name: 'Elder_Groot', level: 35, xp: 31200, avatar: '🧝', isCurrentUser: false },
    { rank: 6, name: 'Volt_Runner', level: 31, xp: 29940, avatar: '🤖', isCurrentUser: false },
    { rank: 12, name: 'You (PaladinX)', level: 24, xp: 14200, avatar: '🛡️', isCurrentUser: true }
  ];

  const friendsLeaderboard = [
    { rank: 1, name: 'IRONFIST', level: 39, xp: 35400, avatar: '🧔', isCurrentUser: false },
    { rank: 2, name: 'VoidWalker', level: 38, xp: 32850, avatar: '👤', isCurrentUser: false },
    { rank: 3, name: 'You (PaladinX)', level: 24, xp: 14200, avatar: '🛡️', isCurrentUser: true },
    { rank: 4, name: 'Volt_Runner', level: 31, xp: 29940, avatar: '🤖', isCurrentUser: false }
  ];

  // 4. SAGE COACH CHAT STATE
  const [chatThreads, setChatThreads] = useState([
    { id: 'burnout', title: 'Burnout Prevention', time: '2 HOURS AGO', active: true },
    { id: 'weekly', title: 'Weekly Mastery Review', time: 'YESTERDAY', active: false },
    { id: 'calibration', title: 'Habit Calibration', time: '3 DAYS AGO', active: false },
    { id: 'challenge', title: 'The Sage\'s Challenge', time: 'DEC 12', active: false }
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'sage',
      text: "Greetings, Hero. I see you've maintained your running streak for 5 days. Your discipline is commendable, yet the stars suggest a peak in physical fatigue. \n\nTo avoid burnout and preserve your long quest, I recommend a lower intensity activity tomorrow. Perhaps a session in 'The Grimoire' or a restorative stretch?",
      isHighlight: true,
      tags: ['SUGGESTION', '+50 XP INSIGHT']
    },
    {
      id: 2,
      sender: 'user',
      text: "That makes sense. I have been feeling a bit of strain in my legs. What kind of restorative activities yield the most XP?"
    }
  ]);

  const [activeThreadId, setActiveThreadId] = useState('burnout');

  const selectThread = (threadId) => {
    setActiveThreadId(threadId);
    setChatThreads(prev => prev.map(t => ({ ...t, active: t.id === threadId })));

    // Load custom responses for each thread
    if (threadId === 'burnout') {
      setMessages([
        {
          id: 1,
          sender: 'sage',
          text: "Greetings, Hero. I see you've maintained your running streak for 5 days. Your discipline is commendable, yet the stars suggest a peak in physical fatigue. \n\nTo avoid burnout and preserve your long quest, I recommend a lower intensity activity tomorrow. Perhaps a session in 'The Grimoire' or a restorative stretch?",
          isHighlight: true,
          tags: ['SUGGESTION', '+50 XP INSIGHT']
        },
        {
          id: 2,
          sender: 'user',
          text: "That makes sense. I have been feeling a bit of strain in my legs. What kind of restorative activities yield the most XP?"
        }
      ]);
    } else if (threadId === 'weekly') {
      setMessages([
        {
          id: 1,
          sender: 'sage',
          text: "Your weekly quest completion is at 84%! Truly exemplary discipline, Paladin. Your strongest resonance resides in the 'Morning Meditation' ritual. \n\nHowever, 'Write Code' has slipped on Wednesdays. Let us devise a plan to fortify your Wednesday focus blocks.",
          isHighlight: true,
          tags: ['REPORT', 'MASTERY CHECK']
        }
      ]);
    } else {
      setMessages([
        {
          id: 1,
          sender: 'sage',
          text: "The paths of growth are winding, Hero. Choose a quick command below or ask a custom question to calibrate your quest variables.",
          isHighlight: false,
          tags: ['GUIDANCE']
        }
      ]);
    }
  };

  // Quick reply list
  const quickReplies = ['Plan my week', 'Analyze fatigue', 'Optimize routine'];

  // Send message simulation
  const sendMessage = (text) => {
    if (!text.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // Simple reply logic
    setTimeout(() => {
      let sageReply = '';
      if (text.toLowerCase().includes('fatigue') || text.toLowerCase().includes('strain')) {
        sageReply = "I have analyzed your biological logs. Your VITALITY level is high (Level 24), but continuous high-impact training will trigger a fatigue spike. I recommend replacing your next '10km Run' with 'Restorative Yoga' (+120 XP, +3 Wisdom). This maintains your streak momentum while letting muscle micro-tears recover.";
      } else if (text.toLowerCase().includes('plan')) {
        sageReply = "A perfect tactical request. For the upcoming 7 solar cycles, I suggest completing 'Morning Meditation' at Dawn (+150 XP base) and spacing your '10km Run' to Monday/Wednesday/Friday. Tuesdays and Thursdays will be dedicated to heavy 'Deep Focus Code' sessions. Under this load, we project you will hit Level 25 in precisely 3 days!";
      } else {
        sageReply = "Indeed, Hero. Consistency is the ultimate weapon against chaos. The energy reserve projects fatigue under control. Continue with your Grimoire exercises, and do not forget to claim your daily rewards in the Shrine Hub!";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'sage',
          text: sageReply,
          isHighlight: true,
          tags: ['SAGE RESPONSE', '+50 XP INSIGHT']
        }
      ]);

      // Award XP for consulting AI coach!
      addXp(50, 'WISDOM', 1);
    }, 1200);
  };

  return (
    <HabitForgeContext.Provider
      value={{
        hero,
        habits,
        selectedHabit,
        setSelectedHabitId,
        completeQuest,
        forgeNewHabit,
        globalLeaderboard,
        friendsLeaderboard,
        chatThreads,
        activeThreadId,
        selectThread,
        messages,
        quickReplies,
        sendMessage,
        addXp
      }}
    >
      {children}
    </HabitForgeContext.Provider>
  );
};
