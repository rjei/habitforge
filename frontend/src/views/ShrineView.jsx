import React from 'react';
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
  Trophy
} from 'lucide-react';

const ShrineView = () => {
  const { hero, habits, completeQuest } = useHabitForge();

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

  return (
    <div className="flex flex-col lg:flex-row gap-8 font-sans max-w-6xl mx-auto">
      {/* LEFT COLUMN: DAILY QUESTS */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Block */}
        <div className="flex justify-between items-center border-b border-gray-900 pb-3">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
            <span className="text-accent-blue">◎</span> Daily Quests
          </h2>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 bg-[#131822] border border-gray-800 px-3 py-1 rounded-full">
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
                  ? 'border-accent-blue/10 bg-[#131822]/40 opacity-70' 
                  : `border ${getQuestColorClass(habit.category)} shadow-inner`
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
                    className="px-4 py-2 bg-dark-slate border border-[#8BABFF]/30 hover:border-[#8BABFF] text-[#8BABFF] font-bold text-xs uppercase rounded transition-all hover:bg-accent-blue hover:text-dark-slate hover:shadow-blue-glow tracking-wider"
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
            <span className="text-accent-gold">📈</span> Character Stats
          </h3>

          <div className="flex flex-col gap-4 font-mono text-xs">
            {/* FOCUS (Level 18) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">FOCUS</span>
                <span className="text-accent-blue font-bold">Level {hero.stats.focus}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-blue h-full rounded-full shadow-blue-glow" 
                  style={{ width: `${Math.min(100, (hero.stats.focus / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* VITALITY (Level 24) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">VITALITY</span>
                <span className="text-accent-gold font-bold">Level {hero.stats.vitality}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-gold h-full rounded-full shadow-gold-glow animate-pulse" 
                  style={{ width: `${Math.min(100, (hero.stats.vitality / 30) * 100)}%` }}
                />
              </div>
            </div>

            {/* WISDOM (Level 12) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold tracking-wide">WISDOM</span>
                <span className="text-accent-red font-bold">Level {hero.stats.wisdom}</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden border border-gray-800">
                <div 
                  className="bg-accent-red h-full rounded-full shadow-red-glow" 
                  style={{ width: `${Math.min(100, (hero.stats.wisdom / 30) * 100)}%` }}
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
