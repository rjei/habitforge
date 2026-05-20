import React, { useState, useRef, useEffect } from 'react';
import { useHabitForge } from '../context/HabitForgeContext';
import { 
  Sparkles, 
  Send, 
  Brain, 
  TrendingUp, 
  Activity, 
  Plus, 
  Compass, 
  Zap, 
  FlaskConical,
  Award
} from 'lucide-react';

const SageView = () => {
  const { 
    chatThreads, 
    activeThreadId, 
    selectThread, 
    messages, 
    quickReplies, 
    sendMessage,
    isInitialized
  } = useHabitForge();

  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  const handleQuickReply = (text) => {
    sendMessage(text);
  };

  // SVG Circle calculations for Consistency ring
  const score = 85;
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col gap-6 font-sans max-w-6xl mx-auto h-[calc(100vh-120px)] select-none">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start border-b border-gray-900 pb-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
            <Sparkles size={20} className="text-accent-blue animate-pulse" />
            Sage's Sanctum
          </h2>
          <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase">
            Consult the AI Coach for guidance, streak preservation, and restorative rituals
          </p>
        </div>
      </div>

      {/* PANELS CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
      
      {/* 1. LEFT PANEL: RECENT CHRONICLES THREADS */}
      <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4 bg-[#131822]/40 border border-gray-800/40 p-4 rounded-lg overflow-y-auto">
        <button 
          onClick={() => alert("Seeking custom guidance... Enter a prompt in the chat box!")}
          className="w-full bg-[#131822] hover:bg-[#1C2330] border border-gray-800 hover:border-gray-700 py-2.5 rounded-lg flex items-center justify-center gap-2 text-[10px] font-mono font-bold tracking-widest text-slate-300 hover:text-white uppercase transition-all"
        >
          <Brain size={12} className="text-accent-blue" />
          Seek Guidance
        </button>

        <div className="flex flex-col gap-2 mt-2">
          <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase font-bold px-2">
            RECENT CHRONICLES
          </span>
          
          <div className="flex flex-col gap-1.5">
            {chatThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className={`cursor-pointer p-3 rounded-lg flex flex-col gap-1 border transition-all duration-200 ${
                  thread.active 
                    ? 'bg-[#131822] border-accent-blue/30 shadow-sm' 
                    : 'bg-transparent border-transparent hover:bg-[#131822]/40'
                }`}
              >
                <span className={`text-xs font-bold ${thread.active ? 'text-slate-100' : 'text-slate-300'}`}>
                  {thread.title}
                </span>
                <span className="text-[8px] text-slate-500 font-mono tracking-wider">
                  {thread.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. CENTER PANEL: ACTIVE CHAT CONTAINER */}
      <div className="flex-1 flex flex-col bg-[#131822]/80 border border-gray-800 rounded-lg overflow-hidden h-full shadow-inner">
        {/* Messages feed */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {messages.map((msg) => {
            const isSage = msg.sender === 'sage';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3.5 max-w-[85%] ${isSage ? 'self-start' : 'self-end flex-row-reverse'}`}
              >
                {/* Profile Icon */}
                <div className={`w-9 h-9 rounded bg-dark-slate border shrink-0 flex items-center justify-center text-lg ${
                  isSage ? 'border-accent-blue/40 shadow-blue-glow' : 'border-gray-800'
                }`}>
                  {isSage ? '🧙‍♂️' : (isInitialized ? '🛡️' : '?')}
                </div>

                {/* Text Bubble */}
                <div className="flex flex-col gap-1.5">
                  <div className={`rounded-xl p-4 text-xs leading-relaxed font-sans ${
                    isSage 
                      ? 'bg-[#1C2330] border border-gray-800/80 text-slate-100' 
                      : 'bg-accent-blue text-dark-slate font-semibold'
                  }`}>
                    {/* Preserve line breaks */}
                    {msg.text.split('\n\n').map((para, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* Sage Tag Badges */}
                  {isSage && msg.tags && (
                    <div className="flex gap-1.5 flex-wrap">
                      {msg.tags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className={`text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 rounded ${
                            tag.includes('XP') 
                              ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/20' 
                              : 'bg-accent-blue/10 text-accent-blue border border-accent-blue/20'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies & Custom Input */}
        <div className="border-t border-gray-900 p-4 flex flex-col gap-3.5 bg-dark-slate/40 shrink-0">
          {/* Quick-reply Pills */}
          <div className="flex gap-2 flex-wrap select-none">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => handleQuickReply(reply)}
                className="px-3.5 py-1.5 bg-[#131822] hover:bg-[#1C2330] border border-gray-800 hover:border-gray-700 rounded-full font-mono text-[9px] font-bold tracking-widest text-slate-400 hover:text-accent-blue transition-all uppercase shadow-sm"
              >
                "{reply}"
              </button>
            ))}
          </div>

          {/* Form input */}
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Consult with the Sage..."
              className="flex-1 bg-dark-slate border border-gray-800 hover:border-gray-705 p-3 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-accent-blue transition-all font-sans pr-12 shadow-inner"
            />
            <button 
              type="submit"
              className="absolute right-2.5 top-2.5 w-7 h-7 rounded bg-accent-blue hover:bg-accent-blue/90 text-dark-slate flex items-center justify-center shadow-blue-glow transition-all"
            >
              <Send size={12} className="stroke-[2.5]" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. RIGHT PANEL: SAGE'S INSIGHTS */}
      <div className="w-full lg:w-64 shrink-0 flex flex-col gap-5 overflow-y-auto">
        <h3 className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-bold border-b border-gray-850 pb-1 px-1">
          SAGE'S INSIGHTS
        </h3>

        {/* CONSISTENCY SCORE RING */}
        <div className="rpg-card border border-gray-800 p-4 flex items-center gap-3">
          {/* SVG Circular Meter */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-gray-850 fill-none"
                strokeWidth="4"
              />
              {/* Foreground glowing path */}
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-accent-blue fill-none transition-all duration-500 ease-out shadow-blue-glow"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-xs font-black font-mono text-slate-200">
              {score}%
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">CONSISTENCY SCORE</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
              You are outperforming 92% of Paladins in your bracket this week.
            </p>
          </div>
        </div>

        {/* ENERGY RESERVE BLOCK CHART */}
        <div className="rpg-card border border-gray-800 p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase flex items-center gap-1.5">
              <Activity size={10} className="text-accent-blue" />
              ENERGY RESERVE
            </span>
          </div>

          {/* Block bars */}
          <div className="flex gap-1.5 items-end justify-between h-14 px-1.5 bg-[#0B0E14] border border-gray-850 p-2.5 rounded shadow-inner">
            <div className="w-6 h-6 bg-slate-700 rounded-sm" title="Mon: 40%"></div>
            <div className="w-6 h-8 bg-slate-700 rounded-sm" title="Tue: 55%"></div>
            <div className="w-6 h-10 bg-slate-600 rounded-sm" title="Wed: 70%"></div>
            <div className="w-6 h-12 bg-accent-gold rounded-sm shadow-gold-glow animate-pulse" title="Thu: 85% (Fatigue Peak)"></div>
            <div className="w-6 h-4 bg-slate-300 rounded-sm" title="Fri: 20%"></div>
          </div>
          
          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wide leading-tight">
            Projected fatigue spike tomorrow. Recovery protocol advised.
          </p>
        </div>

        {/* FOCUS ELIXIR CONSUMABLE ARTIFACT */}
        <div className="rpg-card border border-gray-800 p-3.5 flex items-center gap-3.5 relative overflow-hidden">
          <div className="w-9 h-9 bg-accent-blue/10 border border-accent-blue/30 rounded-lg flex items-center justify-center text-accent-blue shrink-0 shadow-blue-glow">
            <FlaskConical size={16} />
          </div>
          
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold text-slate-100">Focus Elixir</span>
              <span className="text-[7px] bg-[#C084FC]/10 text-[#C084FC] border border-[#C084FC]/20 px-1 rounded font-mono font-bold">
                RARE
              </span>
            </div>
            <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">
              ACTIVE: +10% PRODUCTIVITY
            </span>
          </div>
        </div>

        {/* PREDICTED MILESTONES */}
        <div className="rpg-card border border-gray-800 p-4 flex flex-col gap-3">
          <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase border-b border-gray-850 pb-1 mb-1 font-bold">
            PREDICTED MILESTONES
          </span>

          <div className="flex flex-col gap-3 font-sans">
            {/* Milestone 1 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1 shrink-0 shadow-blue-glow"></span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-200">
                  Level 25: Master of Discipline
                </span>
                <span className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">
                  ESTIMATED: 3 DAYS
                </span>
              </div>
            </div>

            {/* Milestone 2 */}
            <div className="flex gap-2.5 items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1 shrink-0"></span>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">
                  10-Day Streak Emblem
                </span>
                <span className="text-[8px] text-slate-500 font-mono uppercase mt-0.5">
                  ESTIMATED: 5 DAYS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      </div> {/* End of PANELS CONTAINER */}
    </div>
  );
};

export default SageView;
