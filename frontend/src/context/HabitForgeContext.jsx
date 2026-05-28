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
  // AUTHENTICATION STATE
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // HERO INITIALIZATION STATE (Onboarding vs Dashboard)
  const [isInitialized, setIsInitialized] = useState(false);

  // 1. HERO STATE
  const [hero, setHero] = useState({
    name: 'Seraphim Dawn',
    class: 'Paladin',
    level: 1,
    xp: 0,
    xpNext: 100,
    streak: 0,
    stats: {
      focus: 0,
      vitality: 0,
      wisdom: 0
    },
    avatar: localStorage.getItem('avatar') || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=200&h=200&q=80',
    title: 'Level 1 Paladin'
  });

  const fetchCharacterData = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/character', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        
        // Calculate relative level progress to avoid UI overflow
        const xpNeededForThisLevel = data.level * 100;
        const currentLevelProgress = Math.max(0, xpNeededForThisLevel - data.xpToNextLevel);

        setHero(prev => ({
          ...prev,
          name: localStorage.getItem('username') || prev.name,
          level: data.level,
          xp: currentLevelProgress,
          xpNext: xpNeededForThisLevel,
          stats: {
            focus: data.disciplineScore || 0,
            vitality: data.healthScore || 0,
            wisdom: prev.stats.wisdom || 0
          },
          title: `Level ${data.level} ${prev.class}`
        }));
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching character:', err);
    }
  };

  const fetchHabits = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/habits', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const mappedHabits = data.map(h => ({
          id: h.id,
          name: h.name,
          grimoireName: h.name,
          description: `${h.type} Quest • Custom`,
          category: h.category,
          rewardXp: h.xpReward,
          rewardStat: h.category === 'VITALITY' ? 'VITALITY' : h.category === 'WISDOM' ? 'WISDOM' : 'FOCUS',
          rewardStatVal: Math.ceil(h.xpReward / 30),
          completedToday: h.completedToday,
          successRate: 100,
          tier: 'Epic',
          streak: h.currentStreak,
          streakMultiplier: 10,
          classBonus: 10,
          resonance: Array(30).fill(h.completedToday),
          history: []
        }));
        setHabits(mappedHabits);
        if (mappedHabits.length > 0) {
          setSelectedHabitId(prev => mappedHabits.some(h => h.id === prev) ? prev : mappedHabits[0].id);
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Error fetching habits:', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setIsAuthenticated(true);
      setIsInitialized(true);
      fetchCharacterData(token);
      fetchHabits(token);
      const storedAvatar = localStorage.getItem('avatar');
      if (storedAvatar) {
        setHero(prev => ({ ...prev, avatar: storedAvatar }));
      }
    } else {
      // Guest mode: allowed to view Shrine (Quest Hub No account)
      setIsAuthenticated(true);
      setIsInitialized(false);
    }
  }, []);

  // Auth functions
  const login = async (username, password) => {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Invalid username or secret phrase');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setIsAuthenticated(true);
    setIsInitialized(true);
    await fetchCharacterData(data.token);
    await fetchHabits(data.token);
  };

  const register = async (heroName, email, phrase) => {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: heroName, email, password: phrase })
    });
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Registration failed. Name or email might already be claimed.');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setIsAuthenticated(true);
    setIsInitialized(true);
    await fetchCharacterData(data.token);
    await fetchHabits(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    setIsAuthenticated(true); // Enable guest mode at root path
    setIsInitialized(false);
    setHero({
      name: 'Seraphim Dawn',
      class: 'Paladin',
      level: 1,
      xp: 0,
      xpNext: 100,
      streak: 0,
      stats: { focus: 0, vitality: 0, wisdom: 0 },
      avatar: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=200&h=200&q=80',
      title: 'Level 1 Paladin'
    });
  };

  const updateAvatar = (avatarUrl) => {
    setHero(prev => ({
      ...prev,
      avatar: avatarUrl
    }));
    localStorage.setItem('avatar', avatarUrl);
  };


  const resetHero = () => {
    setIsInitialized(false);
    setHero(prev => ({
      ...prev,
      level: 1,
      xp: 0,
      xpNext: 100,
      stats: { focus: 0, vitality: 0, wisdom: 0 }
    }));
  };

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
  const completeQuest = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8080/api/habits/${id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        await fetchCharacterData(token);
        await fetchHabits(token);
      }
    } catch (err) {
      console.error('Error completing quest:', err);
    }
  };

  // Forge a New Habit
  const forgeNewHabit = async (name, category, rewardXp, grimoireName, tier = 'Rare') => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8080/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name,
          category: category,
          type: 'DAILY',
          xpReward: parseInt(rewardXp) || 200,
          targetDaysPerWeek: null,
          deadline: null
        })
      });
      if (response.ok) {
        const newHabitData = await response.json();
        await fetchHabits(token);
        setSelectedHabitId(newHabitData.id);
      }
    } catch (err) {
      console.error('Error forging new habit:', err);
    }
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
        addXp,
        isAuthenticated,
        isInitialized,
        login,
        register,
        logout,
        resetHero,
        updateAvatar
      }}
    >
      {children}
    </HabitForgeContext.Provider>
  );
};
