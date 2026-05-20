import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHabitForge } from '../context/HabitForgeContext';
import { 
  BookOpen, 
  Trophy, 
  Sparkles, 
  Settings, 
  LogOut, 
  Plus,
  ShieldAlert
} from 'lucide-react';

const Sidebar = ({ onOpenForgeModal }) => {
  const { hero, isInitialized, logout } = useHabitForge();
  const navigate = useNavigate();
  const location = useLocation();

  const xpPercent = isInitialized ? Math.min(100, Math.max(0, (hero.xp / hero.xpNext) * 100)) : 0;

  const navItems = [
    {
      id: 'shrine',
      path: '/',
      label: 'SHRINE',
      sublabel: 'QUEST HUB',
      icon: (active) => (
        <span className={`text-xl font-bold tracking-widest ${active ? 'text-accent-blue text-glow-blue' : 'text-slate-400'}`}>
          ⚔️
        </span>
      )
    },
    {
      id: 'grimoire',
      path: '/grimoire',
      label: 'THE GRIMOIRE',
      sublabel: 'Chronicle of Power',
      icon: (active) => <BookOpen size={18} className={active ? 'text-accent-blue' : 'text-slate-400'} />
    },
    {
      id: 'leaderboard',
      path: '/leaderboard',
      label: 'HALL OF FAME',
      sublabel: 'Champion Scrolls',
      icon: (active) => <Trophy size={18} className={active ? 'text-accent-blue' : 'text-slate-400'} />
    },
    {
      id: 'sage',
      path: '/sage',
      label: 'SAGE\'S SANCTUM',
      sublabel: 'AI Coach guidance',
      icon: (active) => <Sparkles size={18} className={active ? 'text-accent-blue' : 'text-slate-400'} />
    }
  ];

  return (
    <aside className="w-64 h-screen bg-dark-slate border-r border-[#131822] flex flex-col justify-between py-6 px-4 shrink-0 font-sans select-none">
      <div className="flex flex-col gap-6">
        {/* BRAND LOGO */}
        <div className="px-2">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="text-accent-blue">Habit</span>Forge
          </h1>
        </div>

        {/* CHARACTER SNAPSHOT CARD */}
        <div className="bg-[#131822] border border-[#1F2937] p-3 rounded-lg flex flex-col gap-2 shadow-inner">
          <div className="text-xs uppercase text-slate-500 font-semibold tracking-wider">
            Active Hero
          </div>
          {isInitialized ? (
            <div className="flex items-center gap-3">
              {/* Avatar Frame */}
              <div className="relative">
                <div className="w-12 h-12 rounded bg-[#0B0E14] border-2 border-accent-blue/60 overflow-hidden flex items-center justify-center shadow-blue-glow">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-gold text-[#0B0E14] text-[9px] font-bold rounded-full flex items-center justify-center border border-[#131822]">
                  {hero.level}
                </div>
              </div>
              {/* Class & Details */}
              <div className="flex flex-col">
                <h2 className="text-sm font-bold text-slate-100 tracking-wide font-mono">
                  {hero.name.replace('You ', '')}
                </h2>
                <p className="text-[11px] text-accent-blue font-semibold tracking-wider uppercase font-mono">
                  LVL {hero.level} {hero.class}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Uninitialized Avatar Frame */}
              <div className="w-12 h-12 rounded bg-[#0B0E14] border border-gray-800 flex items-center justify-center shadow-inner">
                <span className="text-lg font-bold text-slate-500 font-mono">?</span>
              </div>
              {/* Uninitialized Label */}
              <div className="flex flex-col">
                <h2 className="text-[10px] font-bold text-accent-red tracking-wider uppercase font-mono">
                  UNINITIALIZED
                </h2>
                <p className="text-xs text-slate-400 font-bold tracking-wide">
                  New Hero
                </p>
              </div>
            </div>
          )}
          
          {/* XP Bar */}
          <div className="mt-1">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
              <span>XP PROGRESS</span>
              <span>{isInitialized ? `${hero.xp.toLocaleString()} / ${hero.xpNext.toLocaleString()}` : '0 / 100'}</span>
            </div>
            <div className="w-full bg-[#0B0E14] h-2 rounded-full overflow-hidden border border-gray-800">
              <div 
                className="bg-accent-blue h-full rounded-full transition-all duration-500 ease-out shadow-blue-glow" 
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* MENU NAVIGATION */}
        <nav className="flex flex-col gap-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            if (item.id === 'shrine') {
              // Special visual treatment for SHRINE as shown in the mockup
              return (
                <div 
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`cursor-pointer group flex items-center gap-3 p-3 rounded border transition-all ${
                    isActive 
                      ? 'bg-[#131822] border-accent-blue/30 shadow-blue-glow' 
                      : 'border-transparent hover:bg-[#131822]/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded bg-[#0B0E14] flex items-center justify-center border border-slate-800">
                    {item.icon(isActive)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-base font-extrabold tracking-widest ${
                        isActive ? 'text-white text-glow-blue' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        SHRINE
                      </span>
                      <span className="text-[9px] px-1 bg-accent-blue/10 text-accent-blue border border-accent-blue/20 rounded font-mono font-bold">
                        HUB
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
                      QUEST SYSTEM
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`cursor-pointer group flex items-center gap-3 py-2.5 px-3.5 rounded-md transition-all font-mono ${
                  isActive 
                    ? 'bg-[#131822] border-l-4 border-accent-blue text-accent-blue' 
                    : 'text-slate-400 hover:bg-[#131822]/40 hover:text-slate-200'
                }`}
              >
                <div>{item.icon(isActive)}</div>
                <div className="flex flex-col">
                  <span className={`text-xs font-bold tracking-wider ${isActive ? 'text-accent-blue' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM ELEMENTS */}
      <div className="flex flex-col gap-4">
        {/* NEW QUEST ACTION BUTTON */}
        <button 
          onClick={onOpenForgeModal}
          className="w-full bg-accent-blue hover:bg-accent-blue/90 text-dark-slate font-bold text-xs uppercase py-3 rounded-lg shadow-blue-glow hover:shadow-blue-glow-hover transition-all flex items-center justify-center gap-2 tracking-wider"
        >
          <Plus size={14} className="stroke-[3]" />
          Forge New Quest
        </button>

        {/* SETTINGS AND LOG OUT */}
        <div className="flex flex-col gap-1 border-t border-[#131822] pt-4 font-mono text-[11px]">
          <button className="flex items-center gap-2.5 py-2 px-2 text-slate-400 hover:text-slate-200 transition-all rounded hover:bg-[#131822]/40 w-full text-left">
            <Settings size={14} />
            <span>SETTINGS</span>
          </button>
          
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2.5 py-2 px-2 text-accent-red hover:text-accent-red/80 transition-all rounded hover:bg-[#131822]/40 w-full text-left"
          >
            <LogOut size={14} />
            <span>LOG OUT</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
