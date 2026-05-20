import React from 'react';
import { useHabitForge } from '../context/HabitForgeContext';
import { 
  Target, 
  Heart, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Calendar, 
  Sun, 
  FlaskConical, 
  Trophy, 
  Users, 
  MessageSquare,
  Sparkles,
  Shield
} from 'lucide-react';

const ProfileView = () => {
  const { hero, updateAvatar } = useHabitForge();

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Percentage calculations
  const xpPercent = Math.round((hero.xp / hero.xpNext) * 100);

  // Allies mock data as shown in Screenshot 2
  const allies = [
    {
      id: 1,
      name: 'Kaelen_Void',
      class: 'LVL 21 ROGUE',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80',
      online: true
    },
    {
      id: 2,
      name: 'Elara_Mist',
      class: 'LVL 30 SORCERESS',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
      online: true
    },
    {
      id: 3,
      name: 'Thorin_Oak',
      class: 'LVL 18 BERSERKER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
      online: false
    }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans max-w-6xl mx-auto select-none">
      
      {/* 1. HERO HEADER CARD (Screenshot 2 Top) */}
      <div className="rpg-card border border-gray-800 p-6 relative overflow-hidden bg-card-slate flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Cavern background gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,171,255,0.05)_0%,transparent_50%)] pointer-events-none" />

        {/* Hero Details left block */}
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto z-10">
          
          {/* Avatar Slot with Upload Option */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <div className="w-28 h-28 rounded-lg bg-[#0B0E14] border-2 border-accent-blue/50 overflow-hidden flex items-center justify-center shadow-blue-glow relative">
                <img 
                  src={hero.avatar} 
                  alt="Paladin Portrait" 
                  className="w-full h-full object-cover object-center opacity-85"
                />
                {/* Hover overlay upload option */}
                <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-accent-blue text-[10px] font-mono font-bold tracking-wider gap-1">
                  <span>UPLOAD</span>
                  <span>IMAGE</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
              {/* Level bubble tag overlay */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-blue text-dark-slate font-mono font-black text-xs rounded-lg flex items-center justify-center border-2 border-card-slate shadow-blue-glow">
                {hero.level}
              </div>
            </div>
            {/* Explicit upload button */}
            <label className="cursor-pointer px-3 py-1 bg-[#0B0E14]/60 border border-slate-800 hover:border-accent-blue/50 text-[10px] font-mono font-bold text-accent-blue hover:text-accent-blue/80 rounded transition-all uppercase tracking-wider">
              Change Portrait
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
              />
            </label>
          </div>

          {/* Rank & Stats */}
          <div className="flex flex-col text-center sm:text-left gap-1.5 flex-1 sm:flex-initial">
            <h3 className="text-[10px] font-mono font-bold tracking-[0.35em] text-accent-blue uppercase">
              CURRENT RANK: MASTER ASCENDANT
            </h3>
            <h2 className="text-2xl font-black text-slate-100 tracking-wide">
              {hero.name}
            </h2>
            
            {/* Experience Meter */}
            <div className="mt-2 w-full sm:w-80">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mb-1">
                <span className="font-bold tracking-wider">EXPERIENCE PROGRESS</span>
                <span className="text-accent-blue font-bold">{xpPercent}%</span>
              </div>
              <div className="w-full bg-[#0B0E14] h-2.5 rounded-full overflow-hidden border border-gray-900 shadow-inner">
                <div 
                  className="bg-accent-blue h-full rounded-full shadow-blue-glow transition-all duration-700" 
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1.5 tracking-wide">
                {hero.xp.toLocaleString()} / {hero.xpNext.toLocaleString()} XP until Level {hero.level + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Titled Hero right block */}
        <div className="z-10 bg-[#0B0E14]/40 border border-slate-800/80 px-5 py-4 rounded-lg flex flex-col items-center justify-center self-stretch md:self-auto min-w-[160px] text-center">
          <span className="text-[8px] font-mono font-bold tracking-[0.2em] px-2 py-0.5 border border-accent-gold/20 text-accent-gold bg-accent-gold/5 rounded uppercase mb-2">
            Titled Hero
          </span>
          <span className="text-sm font-extrabold text-accent-blue tracking-wide font-mono">
            Storm Runner
          </span>
        </div>
      </div>

      {/* 2. ATTRIBUTE CARDS ROW (Screenshot 2 Middle) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* FOCUS CARD */}
        <div className="rpg-card p-5 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:border-accent-blue/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-accent-blue/20 flex items-center justify-center text-accent-blue group-hover:scale-110 transition-all duration-300">
            <Target size={20} />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em]">FOCUS</span>
          <div className="font-mono flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-slate-100">{hero.stats.focus}</span>
            <span className="text-slate-500 text-xs font-semibold">/100</span>
          </div>
          <div className="w-12 h-1 bg-accent-blue rounded-full shadow-blue-glow opacity-80" />
        </div>

        {/* VITALITY CARD */}
        <div className="rpg-card p-5 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:border-accent-gold/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-accent-gold/20 flex items-center justify-center text-accent-gold group-hover:scale-110 transition-all duration-300">
            <Heart size={18} className="fill-accent-gold/10" />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em]">VITALITY</span>
          <div className="font-mono flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-slate-100">{hero.stats.vitality}</span>
            <span className="text-slate-500 text-xs font-semibold">/100</span>
          </div>
          <div className="w-12 h-1 bg-accent-gold rounded-full shadow-gold-glow opacity-80" />
        </div>

        {/* WISDOM CARD */}
        <div className="rpg-card p-5 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden group hover:border-accent-orange/30 transition-all duration-300">
          <div className="w-10 h-10 rounded-full bg-[#0B0E14] border border-accent-orange/20 flex items-center justify-center text-accent-orange group-hover:scale-110 transition-all duration-300">
            <BookOpen size={18} />
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500 tracking-[0.2em]">WISDOM</span>
          <div className="font-mono flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-slate-100">{hero.stats.wisdom}</span>
            <span className="text-slate-500 text-xs font-semibold">/100</span>
          </div>
          <div className="w-12 h-1 bg-accent-orange rounded-full shadow-red-glow opacity-80" />
        </div>
      </div>

      {/* 3. HEROIC RECORDS & STANDINGS LAYOUT (Screenshot 2 Bottom Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: HEROIC RECORDS & BADGES (Takes 2 span on desktop) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* HEROIC RECORDS PANEL */}
          <div className="rpg-card border border-gray-800 p-6">
            <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2.5 mb-6 border-b border-gray-800 pb-3">
              <TrendingUp size={16} className="text-accent-blue" />
              Heroic Records
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-center">
              {/* Stat 1 */}
              <div className="bg-[#0B0E14]/40 border border-gray-900 p-4 rounded flex flex-col justify-center gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">COMPLETED</span>
                <span className="text-xl font-black text-accent-blue">156</span>
              </div>
              {/* Stat 2 */}
              <div className="bg-[#0B0E14]/40 border border-gray-900 p-4 rounded flex flex-col justify-center gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">CURRENT STREAK</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-black text-accent-gold">12</span>
                  <span className="text-[9px] text-slate-400 font-bold">days</span>
                </div>
              </div>
              {/* Stat 3 */}
              <div className="bg-[#0B0E14]/40 border border-gray-900 p-4 rounded flex flex-col justify-center gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">LONGEST STREAK</span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-black text-slate-100">45</span>
                  <span className="text-[9px] text-slate-400 font-bold">days</span>
                </div>
              </div>
              {/* Stat 4 */}
              <div className="bg-[#0B0E14]/40 border border-gray-900 p-4 rounded flex flex-col justify-center gap-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">TOTAL XP</span>
                <span className="text-xl font-black text-accent-orange">384k</span>
              </div>
            </div>
          </div>

          {/* HALL OF BADGES PANEL */}
          <div className="rpg-card border border-gray-800 p-6">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3 mb-6">
              <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2.5">
                <Award size={16} className="text-accent-gold" />
                Hall of Badges
              </h3>
              <button className="text-[10px] font-mono font-bold tracking-wider text-accent-blue hover:text-accent-blue/80 transition-all uppercase hover:underline">
                VIEW ALL ARTIFACTS
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              
              {/* Badge 1 */}
              <div className="bg-[#0B0E14]/30 border border-[#1F2937]/50 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue shadow-blue-glow mb-1">
                  <Calendar size={20} />
                </div>
                <h4 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest leading-tight">
                  Streak Master
                </h4>
              </div>

              {/* Badge 2 */}
              <div className="bg-[#0B0E14]/30 border border-[#1F2937]/50 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded bg-accent-gold/5 border border-accent-gold/20 flex items-center justify-center text-accent-gold shadow-gold-glow mb-1">
                  <Sun size={20} className="fill-accent-gold/10" />
                </div>
                <h4 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest leading-tight">
                  Early Bird
                </h4>
              </div>

              {/* Badge 3 */}
              <div className="bg-[#0B0E14]/30 border border-[#1F2937]/50 rounded-lg p-5 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 rounded bg-accent-red/5 border border-accent-red/20 flex items-center justify-center text-accent-red shadow-red-glow mb-1">
                  <FlaskConical size={20} />
                </div>
                <h4 className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest leading-tight">
                  Deep Focus
                </h4>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STANDINGS & ALLIES */}
        <div className="flex flex-col gap-6">
          
          {/* GLOBAL STANDINGS PANEL */}
          <div className="rpg-card border border-gray-800 p-5 relative overflow-hidden flex-1 flex flex-col">
            {/* Background trophy decor */}
            <div className="absolute top-2 right-4 opacity-5 pointer-events-none">
              <Trophy size={90} className="text-slate-100" />
            </div>

            <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
              <Trophy size={14} className="text-accent-gold" />
              Global Standings
            </h3>

            {/* Current standing overview */}
            <div className="flex items-center gap-2 mb-4 font-mono">
              <span className="text-accent-gold font-black text-base">#42</span>
              <span className="text-[10px] font-extrabold bg-accent-gold/15 text-accent-gold border border-accent-gold/30 px-2 py-0.5 rounded tracking-widest">
                TOP 0.1%
              </span>
            </div>

            {/* Standings list */}
            <div className="flex flex-col gap-2 font-sans text-xs flex-1 justify-center">
              
              {/* Standings Rank 41 */}
              <div className="flex justify-between items-center p-2 rounded bg-[#0B0E14]/30 border border-transparent font-medium text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500 w-4">41</span>
                  <span>Astra_Nova</span>
                </div>
                <span className="font-mono font-bold text-[11px]">15,400</span>
              </div>

              {/* Standings Rank 42 (YOU) */}
              <div className="flex justify-between items-center p-2.5 rounded bg-accent-blue/10 border border-accent-blue/30 shadow-blue-glow font-bold text-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-accent-blue w-4">42</span>
                  <span className="flex items-center gap-1.5">
                    YOU
                    <span className="w-1.5 h-1.5 bg-accent-blue rounded-full shadow-blue-glow" />
                  </span>
                </div>
                <span className="font-mono text-accent-blue font-black text-[11px]">14,200</span>
              </div>

              {/* Standings Rank 43 */}
              <div className="flex justify-between items-center p-2 rounded bg-[#0B0E14]/30 border border-transparent font-medium text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500 w-4">43</span>
                  <span>Iron_Clad</span>
                </div>
                <span className="font-mono font-bold text-[11px]">14,150</span>
              </div>

            </div>
          </div>

          {/* FELLOW ALLIES PANEL */}
          <div className="rpg-card border border-gray-800 p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <h3 className="text-sm font-extrabold tracking-widest text-slate-100 uppercase flex items-center gap-2">
                <Users size={14} className="text-accent-blue" />
                Fellow Allies
              </h3>
              <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 border border-slate-700 rounded uppercase">
                12 Online
              </span>
            </div>

            {/* List of Allies */}
            <div className="flex flex-col gap-3 font-sans">
              {allies.map((ally) => (
                <div 
                  key={ally.id}
                  className="flex items-center justify-between p-2 rounded bg-[#0B0E14]/30 border border-[#131822] hover:border-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar with status indicator */}
                    <div className="relative">
                      <img 
                        src={ally.avatar} 
                        alt={ally.name} 
                        className="w-8 h-8 rounded-full border border-gray-800 object-cover"
                      />
                      {ally.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#131822] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                      )}
                    </div>

                    <div className="flex flex-col justify-center">
                      <span className="text-[12px] font-bold text-slate-200">{ally.name}</span>
                      <span className="text-[9px] text-slate-500 font-mono tracking-wide">{ally.class}</span>
                    </div>
                  </div>

                  {/* Messaging chat action icon */}
                  <button className="w-8 h-8 bg-transparent hover:bg-slate-800/40 border border-slate-800 rounded flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all">
                    <MessageSquare size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summon allies CTA */}
            <button className="w-full py-2.5 bg-transparent border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 font-mono font-bold text-[10px] tracking-widest rounded transition-all uppercase mt-1">
              Summon More Allies
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfileView;
