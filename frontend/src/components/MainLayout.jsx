import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useHabitForge } from '../context/HabitForgeContext';
import { Bell, Flame, Sparkles, X } from 'lucide-react';

const MainLayout = () => {
  const { hero, forgeNewHabit } = useHabitForge();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState('FOCUS');
  const [newHabitXp, setNewHabitXp] = useState('250');
  const [grimoireName, setGrimoireName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    // Forge the new habit
    forgeNewHabit(
      newHabitName, 
      newHabitCategory, 
      newHabitXp, 
      grimoireName || newHabitName
    );

    // Reset form & close modal
    setNewHabitName('');
    setGrimoireName('');
    setNewHabitCategory('FOCUS');
    setNewHabitXp('250');
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-dark-slate overflow-hidden relative">
      {/* Permanent Left Navigation Sidebar */}
      <Sidebar onOpenForgeModal={() => setIsModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-[#131822] bg-dark-slate/90 backdrop-blur px-8 flex items-center justify-between shrink-0 select-none">
          <div>
            {/* Can show dynamic greetings or active view notifications */}
            <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
              STATUS: CONNECTED TO SPRING BOOT JWT BACKEND
            </span>
          </div>

          {/* Quick Stats / Action Badges */}
          <div className="flex items-center gap-4">
            {/* 7 DAY STREAK BADGE */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-accent-gold/10 border border-accent-gold/30 text-accent-gold rounded-full font-mono text-[11px] font-bold shadow-gold-glow animate-pulse">
              <Flame size={14} className="fill-accent-gold" />
              <span>{hero.streak} DAY STREAK</span>
            </div>

            {/* Notification Bell */}
            <button className="relative w-8 h-8 rounded bg-[#131822] border border-gray-800 flex items-center justify-center text-slate-300 hover:text-white transition-all">
              <Bell size={15} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-blue rounded-full shadow-blue-glow"></span>
            </button>

            {/* Profile Quick-Action */}
            <div className="w-8 h-8 rounded bg-[#131822] border border-accent-blue/30 overflow-hidden cursor-pointer hover:border-accent-blue transition-all flex items-center justify-center">
              <span className="text-base">🧙‍♂️</span>
            </div>
          </div>
        </header>

        {/* Dynamic Route Container */}
        <main className="flex-1 overflow-y-auto bg-dark-slate p-8">
          <Outlet context={{ onOpenForgeModal: () => setIsModalOpen(true) }} />
        </main>
      </div>

      {/* FORGE NEW HABIT / QUEST MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm select-none p-4">
          <div className="bg-card-slate border-2 border-accent-blue/40 w-full max-w-md rounded-xl p-6 shadow-blue-glow animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-4">
              <h3 className="text-base font-extrabold tracking-widest text-white flex items-center gap-2">
                <Sparkles size={16} className="text-accent-blue" />
                FORGE NEW ARTIFACT
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-xs">
              {/* Habit Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Quest Hub Name</label>
                <input 
                  type="text" 
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g. Morning Meditation"
                  className="bg-dark-slate border border-gray-800 p-2.5 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent-blue transition-all font-sans text-sm"
                  required
                />
              </div>

              {/* Grimoire Specific Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Grimoire Chronicle Name (Optional)</label>
                <input 
                  type="text" 
                  value={grimoireName}
                  onChange={(e) => setGrimoireName(e.target.value)}
                  placeholder="e.g. Meditation Ritual"
                  className="bg-dark-slate border border-gray-800 p-2.5 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-accent-blue transition-all font-sans text-sm"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Attribute Alignment</label>
                <div className="grid grid-cols-3 gap-2">
                  {['FOCUS', 'VITALITY', 'WISDOM'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewHabitCategory(cat)}
                      className={`py-2 rounded-lg border font-bold text-[10px] tracking-widest transition-all ${
                        newHabitCategory === cat 
                          ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-blue-glow' 
                          : 'bg-dark-slate border-gray-800 text-slate-400 hover:border-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* XP Value Option */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider">Potential Energy Reward</label>
                <select
                  value={newHabitXp}
                  onChange={(e) => setNewHabitXp(e.target.value)}
                  className="bg-dark-slate border border-gray-800 p-2.5 rounded-lg text-slate-100 focus:outline-none focus:border-accent-blue transition-all cursor-pointer font-sans text-sm"
                >
                  <option value="150">150 XP (Common Artifact)</option>
                  <option value="250">250 XP (Rare Artifact)</option>
                  <option value="400">400 XP (Epic Artifact)</option>
                  <option value="600">600 XP (Legendary Artifact)</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-800 hover:bg-gray-800 text-slate-300 font-bold py-2.5 rounded-lg transition-all"
                >
                  ABANDON
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-dark-slate font-bold py-2.5 rounded-lg shadow-blue-glow transition-all"
                >
                  FORGE QUEST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
