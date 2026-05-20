import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useHabitForge } from '../context/HabitForgeContext';
import { 
  Check, 
  ChevronRight, 
  Zap, 
  Shield, 
  Award, 
  Footprints, 
  Terminal, 
  Compass,
  Trophy,
  UserPlus,
  Lock,
  Plus,
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';

const ShrineView = () => {
  const { hero, habits, completeQuest, isInitialized, initializeHero } = useHabitForge();
  const outletContext = useOutletContext();
  
  // Naming & Class creation local state
  const [isCreating, setIsCreating] = useState(false);
  const [heroName, setHeroName] = useState('Seraphim Dawn');
  const [heroClass, setHeroClass] = useState('Paladin');

  // Trigger modal function passed down from MainLayout
  const handleForgeFirstHabit = () => {
    if (outletContext && outletContext.onOpenForgeModal) {
      outletContext.onOpenForgeModal();
    }
  };

  // Naming form submission
  const handleCreateHeroSubmit = (e) => {
    e.preventDefault();
    initializeHero(heroName, heroClass);
    setIsCreating(false);
  };

  // Remaining incomplete daily quests count
  const remainingCount = habits.filter(h => !h.completedToday).length;

  // Icon selector based on category or name
  const getQuestIcon = (id, category) => {
    switch (id) {
      case 'meditation-ritual':
      case 'morning-meditation':
        return <Compass size={18} className="text-accent-blue" />;
      case 'strength-training':
      case '10km-run':
        return <Footprints size={18} className="text-accent-gold" />;
      case 'deep-focus-code':
      case 'write-code':
        return <Terminal size={18} className="text-accent-blue" />;
      default:
        return category === 'FOCUS' 
          ? <Compass size={18} className="text-accent-blue" />
          : category === 'VITALITY'
            ? <Zap size={18} className="text-accent-gold" />
            : <Terminal size={18} className="text-accent-blue" />;
    }
  };

  // Border hover colors based on category
  const getQuestColorClass = (category) => {
    switch (category) {
      case 'FOCUS': return 'border-accent-blue/20 hover:border-accent-blue/50';
      case 'VITALITY': return 'border-accent-gold/20 hover:border-accent-gold/50';
      case 'WISDOM': return 'border-accent-blue/20 hover:border-accent-blue/50';
      default: return 'border-gray-800 hover:border-gray-700';
    }
  };

  // RENDER UNINITIALIZED ONBOARDING LAYOUT (Screenshot 1)
  if (!isInitialized) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 font-sans max-w-6xl mx-auto select-none">
        
        {/* LEFT COLUMN: ONBOARDING CARD & EMPTY QUESTS */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* A. FORGE YOUR LEGEND / CHARACTER CREATION CARD */}
          <div className="rpg-card border border-gray-800/80 p-6 relative overflow-hidden bg-card-slate flex flex-col md:flex-row items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            
            {/* Cavern background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,171,255,0.03)_0%,transparent_70%)] pointer-events-none" />

            {!isCreating ? (
              <>
                {/* Silhouette & Avatar overlay */}
                <div className="relative shrink-0">
                  <div className="w-40 h-40 rounded-lg bg-[#0B0E14] border border-gray-800 overflow-hidden flex items-center justify-center relative group">
                    {/* Abstract silhouette character background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-10" />
                    <img 
                      src="https://images.unsplash.com/photo-1519074069444-1ba4e66640c2?auto=format&fit=crop&w=200&h=200&q=80" 
                      alt="Hero Silhouette" 
                      className="w-full h-full object-cover object-center opacity-30 grayscale filter group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute z-20 flex flex-col items-center justify-center text-slate-500 gap-1.5">
                      <UserPlus size={36} className="text-slate-600 stroke-[1.5]" />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-1.5">
                    <h2 className="text-2xl font-black text-slate-100 tracking-wide uppercase">
                      Forge Your Legend
                    </h2>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed font-sans max-w-md">
                      The path to greatness begins with a single habit. Name your hero and choose your class to begin your odyssey.
                    </p>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => setIsCreating(true)}
                      className="px-6 py-3.5 bg-accent-blue hover:bg-accent-blue/90 text-dark-slate font-black text-xs uppercase rounded-lg shadow-blue-glow hover:shadow-blue-glow-hover transition-all flex items-center gap-2.5 tracking-widest font-mono"
                    >
                      <Sparkles size={14} className="fill-dark-slate" />
                      CREATE HERO
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleCreateHeroSubmit} className="w-full flex flex-col gap-4 z-10 font-mono text-xs">
                <div className="border-b border-gray-800 pb-2 mb-2 flex items-center gap-2">
                  <Sparkles size={16} className="text-accent-blue" />
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-100">Hero Character Builder</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hero Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider">HERO NAME</label>
                    <input 
                      type="text" 
                      value={heroName}
                      onChange={(e) => setHeroName(e.target.value)}
                      placeholder="e.g. Paladin_Arin"
                      className="bg-[#0B0E14] border border-gray-800 focus:border-accent-blue p-3 rounded-lg text-slate-100 transition-all font-sans text-sm focus:outline-none"
                      required
                    />
                  </div>

                  {/* Hero Class Selection */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-400 font-bold uppercase tracking-wider">CLASS PATHWAY</label>
                    <div className="grid grid-cols-2 gap-2 font-sans">
                      {['Paladin', 'Sorceress', 'Rogue', 'Berserker'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setHeroClass(cls)}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                            heroClass === cls 
                              ? 'bg-accent-blue/15 border-accent-blue text-accent-blue font-extrabold shadow-blue-glow' 
                              : 'bg-[#0B0E14] border-gray-800 text-slate-400 hover:border-gray-700'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-4 py-2 border border-gray-800 hover:bg-gray-800 rounded-lg text-slate-400 transition-all text-xs font-bold uppercase"
                  >
                    ABANDON
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-accent-blue hover:bg-accent-blue/90 text-dark-slate font-extrabold rounded-lg shadow-blue-glow transition-all text-xs uppercase flex items-center gap-1.5"
                  >
                    Forge Hero <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* B. ACTIVE QUEST BOARD - EMPTY STATE */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-900 pb-3">
              <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-100 flex items-center gap-2">
                <span className="text-slate-500">◎</span> Active Quests
              </h2>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-600 bg-[#131822] border border-gray-900 px-3 py-1 rounded-full">
                0 / 3 QUESTS ACTIVE
              </span>
            </div>

            <div className="rpg-card border border-dashed border-gray-800/80 p-12 flex flex-col items-center justify-center text-center gap-5 bg-card-slate/30 rounded-xl relative overflow-hidden">
              <div className="w-14 h-14 rounded-lg bg-[#0B0E14] border border-gray-800 flex items-center justify-center text-slate-600 shadow-inner">
                <Lock size={22} className="stroke-[1.5]" />
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-slate-200">The Quest Board is Empty</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans max-w-sm">
                  You haven't forged any habits yet. Start with something small to build your initial momentum.
                </p>
              </div>

              <div>
                <button
                  onClick={handleForgeFirstHabit}
                  className="px-5 py-2.5 bg-transparent border border-accent-blue/30 hover:border-accent-blue hover:bg-accent-blue/5 text-[#8BABFF] font-bold text-xs uppercase rounded transition-all tracking-widest font-mono flex items-center gap-1.5"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  FORGE FIRST HABIT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOCKED CHARACTER METRICS */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 select-none z-10">
          
          {/* LEVEL CAP BLOCK */}
          <div className="rpg-card border border-gray-800 p-5 flex flex-col gap-4 bg-card-slate relative overflow-hidden">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-slate-500 uppercase">
                Character Level
              </span>
              <span className="text-base font-mono font-black text-accent-gold tracking-wide">
                LVL 1
              </span>
            </div>
            
            {/* Empty Progress bar */}
            <div className="w-full bg-[#0B0E14] h-2.5 rounded-full overflow-hidden border border-gray-900">
              <div className="bg-slate-800 h-full w-[2%] rounded-full shadow-inner" />
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>XP: 0</span>
              <span>NEXT: 100</span>
            </div>
          </div>

          {/* energy and streak row (Screenshot 1 Right widgets) */}
          <div className="grid grid-cols-2 gap-4 font-sans text-center">
            
            {/* Energy widget */}
            <div className="rpg-card border border-gray-900 p-4 flex flex-col justify-center items-center gap-1.5 opacity-60">
              <Zap size={18} className="text-slate-600" />
              <span className="text-[18px] font-black text-slate-400 font-mono">0</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">ENERGY</span>
            </div>

            {/* Streak widget */}
            <div className="rpg-card border border-gray-900 p-4 flex flex-col justify-center items-center gap-1.5 opacity-60">
              <Award size={18} className="text-slate-600" />
              <span className="text-[18px] font-black text-slate-400 font-mono">0</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">STREAK</span>
            </div>
          </div>

          {/* RELICS SLOTS (LOCKED) */}
          <div className="rpg-card border border-gray-900 p-5 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2 border-b border-gray-900 pb-2.5">
              Relics
            </h3>

            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((slot) => (
                <div 
                  key={slot} 
                  className="flex items-center gap-4 p-3 rounded bg-[#0B0E14]/40 border border-gray-900/60 opacity-50 relative overflow-hidden"
                >
                  {/* locked pad square */}
                  <div className="w-10 h-10 rounded bg-[#0B0E14] border border-gray-900 flex items-center justify-center text-slate-600 shrink-0">
                    <Lock size={14} className="stroke-[2.5]" />
                  </div>

                  {/* placeholder lines loaders */}
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-1.5 bg-slate-800 rounded w-2/3 animate-pulse" />
                    <div className="h-1.5 bg-slate-800 rounded w-5/12 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // RENDER NORMAL INITIALIZED SHRINE VIEW (Screenshot 2 Daily Quest Log)
  return (
    <div className="flex flex-col lg:flex-row gap-8 font-sans max-w-6xl mx-auto select-none">
      {/* LEFT COLUMN: DAILY QUESTS */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-gray-900 pb-3">
          <h2 className="text-base font-extrabold uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
            <span className="text-accent-blue">◎</span> Daily Quests
          </h2>
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 bg-[#131822] border border-gray-800 px-3 py-1 rounded-full">
            {remainingCount > 0 ? `${remainingCount} REMAINING` : 'ALL COMPLETED'}
          </span>
        </div>

        {/* Quest List */}
        <div className="flex flex-col gap-4">
          {habits.map((habit) => (
            <div 
              key={habit.id}
              className={`rpg-card flex items-center justify-between p-4 transition-all duration-300 ${
                habit.completedToday 
                  ? 'border-accent-blue/15 bg-[#131822]/40 opacity-70 shadow-inner' 
                  : `border ${getQuestColorClass(habit.category)} shadow-[0_4px_12px_rgba(0,0,0,0.2)]`
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon Circle */}
                <div className={`w-10 h-10 rounded bg-[#0B0E14] border flex items-center justify-center ${
                  habit.completedToday ? 'border-gray-800' : 'border-gray-700 shadow-sm'
                }`}>
                  {getQuestIcon(habit.id, habit.category)}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <h3 className={`text-sm font-extrabold tracking-wide ${
                    habit.completedToday ? 'text-slate-400 line-through' : 'text-slate-100'
                  }`}>
                    {habit.name}
                  </h3>
                  
                  {/* Reward tags */}
                  <div className="flex gap-2 mt-1 font-mono text-[9px] uppercase">
                    <span className="bg-[#0B0E14] text-slate-400 border border-gray-800 px-2 py-0.5 rounded font-bold">
                      {habit.rewardStat} +{habit.rewardStatVal}
                    </span>
                    <span className="bg-accent-gold/10 text-accent-gold border border-accent-gold/20 px-2 py-0.5 rounded font-extrabold shadow-sm">
                      XP +{habit.rewardXp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complete Action Button */}
              <div>
                {habit.completedToday ? (
                  <div className="w-10 h-10 rounded bg-accent-blue/10 border border-accent-blue/40 flex items-center justify-center text-accent-blue shadow-blue-glow">
                    <Check size={18} className="stroke-[3]" />
                  </div>
                ) : (
                  <button
                    onClick={() => completeQuest(habit.id)}
                    className="px-4 py-2 bg-transparent border border-[#8BABFF]/30 hover:border-[#8BABFF] text-[#8BABFF] font-bold text-xs uppercase rounded transition-all hover:bg-accent-blue hover:text-dark-slate hover:shadow-blue-glow tracking-wider"
                  >
                    COMPLETE
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: CHARACTER STATS & RECENT ACHIEVEMENTS */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 select-none">
        
        {/* CHARACTER STATS CARD */}
        <div className="rpg-card border border-gray-800 p-5 relative overflow-hidden">
          <div className="absolute top-3 right-4 opacity-5 pointer-events-none">
            <Shield size={100} className="text-slate-100" />
          </div>

          <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2 mb-5 font-sans border-b border-gray-800 pb-2">
            📊 Character Stats
          </h3>

          <div className="flex flex-col gap-4 font-mono text-xs">
            {/* FOCUS */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">FOCUS</span>
                <span className="text-accent-blue font-bold">Level {hero.stats.focus}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-blue h-full rounded-full shadow-blue-glow" 
                  style={{ width: `${Math.min(100, (hero.stats.focus / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* VITALITY */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">VITALITY</span>
                <span className="text-accent-gold font-bold">Level {hero.stats.vitality}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-gold h-full rounded-full shadow-gold-glow animate-pulse" 
                  style={{ width: `${Math.min(100, (hero.stats.vitality / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* WISDOM */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">WISDOM</span>
                <span className="text-accent-orange font-bold">Level {hero.stats.wisdom}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-orange h-full rounded-full shadow-red-glow" 
                  style={{ width: `${Math.min(100, (hero.stats.wisdom / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACHIEVEMENTS CARD */}
        <div className="rpg-card border border-gray-800 p-5">
          <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
            <Trophy size={14} className="text-accent-gold" />
            Recent Achievements
          </h3>

          <div className="flex flex-col gap-4 font-sans">
            {/* Achievement 1 */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold shrink-0">
                <Zap size={16} />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[12px] font-extrabold text-slate-200">
                  Unlocked <span className="text-accent-gold">Storm Runner</span> title
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Earned by completing 10km under 50 mins
                </p>
              </div>
            </div>

            {/* Achievement 2 */}
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center text-accent-blue shrink-0">
                <Award size={16} />
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="text-[12px] font-extrabold text-slate-200">
                  Master of The Grimoire
                </h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  Logged 50 productivity hours this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShrineView;
