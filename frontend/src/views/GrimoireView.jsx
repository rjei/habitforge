import React from 'react';
import { useHabitForge } from '../context/HabitForgeContext';
import { useOutletContext } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  TrendingUp, 
  History, 
  Plus, 
  Calendar,
  Sword,
  BookOpen
} from 'lucide-react';

const GrimoireView = () => {
  const { habits, selectedHabit, setSelectedHabitId } = useHabitForge();
  const { onOpenForgeModal } = useOutletContext();

  // Calculate global completion rate across all habits
  const totalSquares = habits.reduce((acc, h) => acc + h.resonance.length, 0);
  const completedSquares = habits.reduce((acc, h) => acc + h.resonance.filter(Boolean).length, 0);
  const totalCompletionRate = totalSquares > 0 
    ? Math.round((completedSquares / totalSquares) * 100) 
    : 0;

  // Rarity styling helper
  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'legendary': return 'text-accent-gold text-glow-gold';
      case 'epic': return 'text-[#C084FC] text-shadow-[0_0_8px_rgba(192,132,252,0.5)]'; // lavender/purple
      case 'rare': return 'text-accent-blue text-glow-blue';
      default: return 'text-slate-300';
    }
  };

  // 30-day resonance square coloring
  const getSquareColor = (habitId, category, isCompleted) => {
    if (!isCompleted) return 'bg-[#1C2330] hover:bg-gray-800 border border-gray-900';
    switch (category) {
      case 'FOCUS': return 'bg-accent-blue/80 text-accent-blue shadow-blue-glow';
      case 'VITALITY': return 'bg-accent-gold/80 text-accent-gold shadow-gold-glow';
      case 'WISDOM': return 'bg-accent-red/80 text-accent-red shadow-red-glow';
      default: return 'bg-slate-500 text-slate-400';
    }
  };

  // Category border highlights for selected states
  const getSelectedBorder = (category) => {
    switch (category) {
      case 'FOCUS': return 'border-accent-blue shadow-blue-glow';
      case 'VITALITY': return 'border-accent-gold shadow-gold-glow';
      case 'WISDOM': return 'border-accent-red shadow-red-glow';
      default: return 'border-slate-500';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 font-sans max-w-6xl mx-auto select-none">
      
      {/* LEFT AREA: HABIT GRID */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Header Block */}
        <div className="flex justify-between items-start border-b border-gray-900 pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
              <BookOpen size={20} className="text-accent-blue" />
              The Grimoire
            </h2>
            <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase">
              Chronicle of your discipline and evolving strength
            </p>
          </div>
          
          {/* Status Box */}
          <div className="bg-[#131822] border border-gray-800 rounded-lg p-3 flex flex-col items-center shrink-0 min-w-[120px]">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">TOTAL COMPLETION</span>
            <span className="text-xl font-black text-slate-100 font-mono mt-0.5">{totalCompletionRate}%</span>
          </div>
        </div>

        {/* 2x2 Grid of active habits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {habits.map((habit) => {
            const isSelected = selectedHabit && habit.id === selectedHabit.id;
            return (
              <div
                key={habit.id}
                onClick={() => setSelectedHabitId(habit.id)}
                className={`rpg-card border p-5 cursor-pointer flex flex-col gap-4 justify-between transition-all duration-300 ${
                  isSelected 
                    ? `${getSelectedBorder(habit.category)} bg-[#131822]` 
                    : 'border-gray-800 hover:border-gray-700 bg-[#131822]/80 hover:bg-[#131822]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <h3 className={`text-sm font-extrabold tracking-wide ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {habit.grimoireName}
                    </h3>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
                      {habit.description}
                    </span>
                  </div>
                  {/* XP badge */}
                  <span className="bg-[#0B0E14] text-accent-blue border border-accent-blue/20 font-mono text-[9px] font-bold py-0.5 px-2 rounded">
                    +{habit.rewardXp} XP
                  </span>
                </div>

                {/* 30-day resonance track grid */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[8px] text-slate-500 font-mono uppercase">
                    <span>30-Day Resonance</span>
                    <span>{habit.resonance.filter(Boolean).length} / 30 COMPLETE</span>
                  </div>
                  {/* Grid squares */}
                  <div className="grid grid-cols-10 gap-1 mt-1">
                    {habit.resonance.map((completed, index) => (
                      <div 
                        key={index} 
                        className={`w-3.5 h-3.5 rounded-sm resonance-square transition-all duration-150 ${
                          getSquareColor(habit.id, habit.category, completed)
                        }`}
                        title={`Day ${index + 1}: ${completed ? 'Completed' : 'Missed'}`}
                        style={{ color: completed ? 'inherit' : 'rgba(255,255,255,0.05)' }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* DOTTED FORGE NEW HABIT BUTTON */}
          <div
            onClick={onOpenForgeModal}
            className="rpg-card border-2 border-dashed border-gray-800 hover:border-accent-blue/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer min-h-[170px] group transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-gray-800 group-hover:border-accent-blue flex items-center justify-center text-slate-400 group-hover:text-accent-blue transition-all mb-3 shadow-inner">
              <Plus size={18} />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black text-slate-700 tracking-wider font-mono">28</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-extrabold group-hover:text-accent-blue transition-all">
                FORGE NEW HABIT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: SELECTED ARTIFACT DETAILS */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
        
        {/* DETAILS CONTAINER */}
        {!selectedHabit ? (
          <div className="rpg-card border border-gray-800 p-6 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
            <div className="w-12 h-12 rounded-full bg-[#0B0E14] border border-gray-800 flex items-center justify-center text-slate-500">
              <Sparkles size={20} className="text-slate-500 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">No Active Quests</h3>
              <p className="text-[10px] text-slate-500 font-mono mt-1.5 uppercase max-w-[200px] leading-relaxed">
                Your Grimoire is empty. Forge a new quest to begin your chronicle.
              </p>
            </div>
          </div>
        ) : (
          <div className="rpg-card border border-gray-800 p-5 flex flex-col gap-6">
            {/* Header info */}
            <div className="border-b border-gray-850 pb-3 flex flex-col">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">SELECTED ARTIFACT</span>
              <h3 className="text-base font-extrabold text-white mt-1">
                {selectedHabit.grimoireName}
              </h3>
            </div>

          {/* Success rate & Tier card grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* SUCCESS RATE */}
            <div className="bg-[#0B0E14] border border-gray-800 p-3 rounded-lg flex flex-col gap-0.5 shadow-inner">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">SUCCESS RATE</span>
              <span className="text-lg font-black text-slate-200 font-mono flex items-baseline gap-1 mt-0.5">
                {selectedHabit.successRate}%
                <TrendingUp size={10} className="text-emerald-500" />
              </span>
            </div>

            {/* CURRENT TIER */}
            <div className="bg-[#0B0E14] border border-gray-800 p-3 rounded-lg flex flex-col gap-0.5 shadow-inner">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">CURRENT TIER</span>
              <span className={`text-base font-extrabold font-mono uppercase mt-1 ${getTierColor(selectedHabit.tier)}`}>
                {selectedHabit.tier}
              </span>
            </div>
          </div>

          {/* XP BREAKDOWN */}
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase border-b border-gray-850 pb-1 mb-1 font-bold">
              XP BREAKDOWN
            </span>

            <div className="flex flex-col gap-1.5 font-mono text-[11px] text-slate-400">
              <div className="flex justify-between">
                <span>Daily Base Reward</span>
                <span className="text-slate-200">+{selectedHabit.rewardXp - 50} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Streak Multiplier ({selectedHabit.streak}x)</span>
                <span className="text-slate-200">+{selectedHabit.streakMultiplier || 0} XP</span>
              </div>
              <div className="flex justify-between">
                <span>Paladin Class Bonus</span>
                <span className="text-slate-200">+{selectedHabit.classBonus || 0} XP</span>
              </div>
              
              <div className="border-t border-gray-800 my-1 pt-1.5 flex justify-between font-bold text-xs">
                <span className="text-slate-300">Total Potential</span>
                <span className="text-accent-blue">+{selectedHabit.rewardXp} XP</span>
              </div>
            </div>
          </div>

          {/* QUEST HISTORY */}
          <div className="flex flex-col gap-3">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase border-b border-gray-850 pb-1 mb-1 font-bold flex items-center gap-1.5">
              <History size={11} />
              Quest History
            </span>

            <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
              {selectedHabit.history && selectedHabit.history.length > 0 ? (
                selectedHabit.history.map((log, index) => (
                  <div 
                    key={index}
                    className="flex justify-between items-start text-[11px] p-2 bg-[#0B0E14] border border-gray-800/40 rounded shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="text-slate-200 font-bold flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Completed' ? 'bg-accent-blue shadow-blue-glow' : 'bg-accent-red shadow-red-glow'
                        }`} />
                        Quest {log.status}
                      </span>
                      <span className="text-[9px] text-slate-500 mt-0.5">{log.date}</span>
                    </div>

                    <span className={`font-mono font-bold ${
                      log.status === 'Completed' ? 'text-accent-blue' : 'text-accent-red'
                    }`}>
                      {log.xpGained > 0 ? `+${log.xpGained}` : log.xpGained} {log.xpGained > 0 ? 'XP' : 'HP'}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-[10px] text-slate-600 font-mono py-4 text-center">
                  NO CHRONICLE HISTORY FOUND
                </span>
              )}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default GrimoireView;
