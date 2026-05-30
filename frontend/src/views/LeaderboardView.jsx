import React, { useState } from 'react';
import { useHabitForge } from '../context/HabitForgeContext';
import { Trophy, Users, ShieldAlert, Sparkles } from 'lucide-react';

const LeaderboardView = () => {
  const { globalLeaderboard, friendsLeaderboard } = useHabitForge();
  const [activeTab, setActiveTab] = useState('GLOBAL'); // GLOBAL or FRIENDS

  const currentLeaderboard = activeTab === 'GLOBAL' ? globalLeaderboard : friendsLeaderboard;

  // Extract top 3 podium entries
  // Podium mapping: 2nd on Left, 1st in Center, 3rd on Right
  const rank1 = currentLeaderboard.find(p => p.rank === 1);
  const rank2 = currentLeaderboard.find(p => p.rank === 2);
  const rank3 = currentLeaderboard.find(p => p.rank === 3);

  // Get top 10 entries for the table
  const top10 = currentLeaderboard.slice(0, 10);
  const isCurrentUserInTop10 = top10.some(p => p.isCurrentUser);
  const currentUserEntry = currentLeaderboard.find(p => p.isCurrentUser);

  let tableEntries = [...top10];
  if (!isCurrentUserInTop10 && currentUserEntry) {
    tableEntries.push({ isSeparator: true });
    tableEntries.push(currentUserEntry);
  }

  return (
    <div className="flex flex-col gap-6 font-sans max-w-4xl mx-auto select-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-gray-900 pb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
            <Trophy size={20} className="text-accent-gold" />
            Hall of Fame
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase max-w-xl">
            Behold the legendary champions of discipline. Only the most consistent seekers earn a place in these hallowed scrolls.
          </p>
        </div>

        {/* TOGGLE TAB PILLS */}
        <div className="bg-[#131822] border border-gray-800 p-1 rounded-lg flex mt-4 md:mt-0 self-start">
          {['GLOBAL', 'FRIENDS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-widest uppercase transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-accent-blue text-dark-slate shadow-blue-glow font-extrabold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM LAYOUT */}
      <div className="grid grid-cols-3 gap-2 items-end justify-center py-6 max-w-2xl mx-auto w-full">
        {/* SECOND PLACE (LEFT) */}
        {rank2 ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              {/* Avatar frame */}
              <div className="w-20 h-20 bg-[#131822] border-2 border-slate-500 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden group-hover:border-slate-400 transition-all">
                <span className="text-4xl">{rank2.avatar}</span>
              </div>
              {/* Rank Overlay Badge */}
              <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-slate-500 border border-slate-700 text-[#0B0E14] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                2
              </div>
            </div>
            
            {/* Details */}
            <div className="text-center mt-2 flex flex-col">
              <span className="text-xs font-extrabold text-slate-200">{rank2.name}</span>
              <span className="text-[10px] text-accent-blue font-mono font-bold uppercase mt-0.5">LVL {rank2.level}</span>
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* FIRST PLACE (CENTER - TALLER) */}
        {rank1 ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              {/* Golden frame glow */}
              <div className="absolute -inset-1 bg-accent-gold/20 rounded-lg blur-sm group-hover:bg-accent-gold/30 transition-all"></div>
              {/* Avatar frame */}
              <div className="w-24 h-24 bg-[#131822] border-2 border-accent-gold rounded-lg flex items-center justify-center relative overflow-hidden shadow-gold-glow group-hover:border-accent-gold/90 transition-all">
                <span className="text-5xl">{rank1.avatar}</span>
              </div>
              {/* Rank Overlay Badge */}
              <div className="absolute -bottom-2.5 right-1/2 translate-x-1/2 bg-accent-gold border border-amber-600 text-[#0B0E14] text-[11px] font-black rounded-full w-6 h-6 flex items-center justify-center shadow-gold-glow">
                1
              </div>
            </div>
            
            {/* Details */}
            <div className="text-center mt-2.5 flex flex-col">
              <span className="text-sm font-extrabold text-accent-gold tracking-wide text-glow-gold flex items-center gap-1 justify-center">
                {rank1.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase mt-0.5">LVL {rank1.level}</span>
            </div>
          </div>
        ) : (
          <div />
        )}

        {/* THIRD PLACE (RIGHT) */}
        {rank3 ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              {/* Avatar frame */}
              <div className="w-20 h-20 bg-[#131822] border-2 border-amber-800 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden group-hover:border-amber-700 transition-all">
                <span className="text-4xl">{rank3.avatar}</span>
              </div>
              {/* Rank Overlay Badge */}
              <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-800 border border-amber-950 text-[#0B0E14] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                3
              </div>
            </div>
            
            {/* Details */}
            <div className="text-center mt-2 flex flex-col">
              <span className="text-xs font-extrabold text-slate-200">{rank3.name}</span>
              <span className="text-[10px] text-accent-blue font-mono font-bold uppercase mt-0.5">LVL {rank3.level}</span>
            </div>
          </div>
        ) : (
          <div />
        )}
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="rpg-card border border-gray-800 overflow-hidden shadow-inner mt-4">
        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-900 font-mono text-[10px] text-slate-500 uppercase tracking-widest font-extrabold">
          <div className="col-span-2">Rank</div>
          <div className="col-span-5">Warrior</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-3 text-right">Total XP</div>
        </div>

        {/* Table Entries */}
        <div className="flex flex-col max-h-[380px] overflow-y-auto">
          {tableEntries.map((player, index) => {
            if (player.isSeparator) {
              return (
                <div
                  key={`separator-${index}`}
                  className="grid grid-cols-12 items-center px-6 py-2 border-b border-gray-900 bg-[#0B0E14]/20"
                >
                  <div className="col-span-12 text-center text-xs font-mono font-bold text-slate-600 tracking-widest py-1">
                    •••
                  </div>
                </div>
              );
            }
            const isMe = player.isCurrentUser;
            return (
              <div
                key={player.rank}
                className={`grid grid-cols-12 items-center px-6 py-3.5 border-b border-gray-900 transition-all font-mono ${
                  isMe 
                    ? 'bg-accent-blue/5 border-l-4 border-accent-blue text-accent-blue shadow-inner' 
                    : 'text-slate-300 hover:bg-[#131822]/40'
                }`}
              >
                {/* Rank */}
                <div className={`col-span-2 text-sm font-extrabold ${isMe ? 'text-accent-blue' : 'text-slate-400'}`}>
                  {player.rank}
                </div>

                {/* Avatar + Username */}
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded bg-[#0B0E14] border flex items-center justify-center text-lg shadow-sm ${
                    isMe ? 'border-accent-blue/30 shadow-blue-glow' : 'border-gray-800'
                  }`}>
                    {player.avatar}
                  </div>
                  <span className={`text-xs font-sans font-bold tracking-wide ${isMe ? 'text-accent-blue font-extrabold' : 'text-slate-200'}`}>
                    {player.name}
                  </span>
                </div>

                {/* Level */}
                <div className={`col-span-2 text-center text-xs font-bold ${isMe ? 'text-accent-blue' : 'text-slate-400'}`}>
                  {player.level}
                </div>

                {/* Total XP */}
                <div className={`col-span-3 text-right text-xs font-bold ${isMe ? 'text-accent-blue font-black' : 'text-slate-200'}`}>
                  {player.xp.toLocaleString()} XP
                </div>
              </div>
            );
          })}
        </div>

        {/* Table Footer: LOAD MORE */}
        <div className="bg-[#131822]/80 border-t border-gray-900 py-3 text-center">
          <button className="text-[10px] font-mono font-black text-slate-500 hover:text-accent-blue uppercase tracking-widest transition-all">
            LOAD MORE LEGENDS
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;
