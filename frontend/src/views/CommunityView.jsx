import React, { useState } from 'react';
import { useHabitForge } from '../context/HabitForgeContext';
import { 
  Users, 
  Sun, 
  Wand2, 
  Globe, 
  Trophy, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Shield, 
  Check,
  Sword
} from 'lucide-react';

const CommunityView = () => {
  const { hero, isInitialized } = useHabitForge();
  const [newMessage, setNewMessage] = useState('');

  // 1. Guilds state
  const [guilds, setGuilds] = useState([
    {
      id: 'code-wizards',
      name: 'Code Wizards',
      members: 42,
      maxMembers: 50,
      description: 'Mastering the arcane arts of logic and syntax. Minimum 2hr daily focus required.',
      joined: false,
      icon: <Wand2 size={20} className="text-accent-blue" />,
      avatars: [
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=32&h=32&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=32&h=32&q=80',
      ],
      extraCount: 39
    },
    {
      id: 'early-birds',
      name: 'Early Bird Rangers',
      members: 18,
      maxMembers: 25,
      description: 'Defeating the Snooze Demon at the crack of dawn. 5 AM - 7 AM Active hours.',
      joined: false,
      icon: <Sun size={20} className="text-accent-gold" />,
      avatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=32&h=32&q=80',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=32&h=32&q=80',
      ],
      extraCount: 15
    }
  ]);

  // 2. Tavern Chat messages state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Warrior_Grog',
      role: 'BARBARIAN',
      time: '14:02',
      text: 'Just hit a 30-day streak in Meditation! Anyone got tips for Tier 4 Focus quests?',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 2,
      sender: 'LoreKeeper_Mia',
      role: 'CLERIC',
      time: '14:05',
      text: 'Check the Grimoire under "Mindful Mastery". The daily cooldown reduces after Lv. 15.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80'
    }
  ]);

  // Handle Join/Leave Guild
  const toggleJoinGuild = (guildId) => {
    setGuilds(prev => prev.map(guild => {
      if (guild.id === guildId) {
        const joined = !guild.joined;
        return {
          ...guild,
          joined,
          members: joined ? guild.members + 1 : guild.members - 1
        };
      }
      return guild;
    }));
  };

  // Handle Send Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: isInitialized ? hero.name : 'You (Guest)',
      role: isInitialized ? hero.class.toUpperCase() : 'GUEST',
      time: 'Just now',
      text: newMessage,
      avatar: isInitialized ? hero.avatar : null,
      isUser: true
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  // Mock World Feed Data
  const worldFeed = [
    {
      id: 1,
      user: 'PaladinX',
      action: 'completed the 10km Run quest!',
      meta: '+450 XP',
      time: '2m ago',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 2,
      user: 'ZenMaster',
      action: 'reached Level 15!',
      meta: 'Rank Up',
      time: '12m ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80'
    },
    {
      id: 3,
      user: 'ForgeBorn',
      action: 'forged the Indomitable Will artifact.',
      meta: 'Rare Drop',
      time: '1h ago',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80'
    }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans max-w-6xl mx-auto h-[calc(100vh-120px)] select-none">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col border-b border-gray-900 pb-4">
        <h2 className="text-xl font-black uppercase tracking-widest text-slate-100 flex items-center gap-2.5">
          <Users size={20} className="text-accent-blue" />
          Community Hub
        </h2>
        <p className="text-xs text-slate-500 font-mono tracking-wide mt-1 uppercase">
          Connect with fellow adventurers, join elite guilds, and celebrate collective growth in the Tavern.
        </p>
      </div>

      {/* PANELS CONTAINER */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* LEFT COLUMN: GUILDS & CHAT (Takes 8/12 grid approx) */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          
          {/* ACTIVE GUILDS PANEL */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                <Shield size={14} className="text-accent-blue" />
                Active Guilds
              </h3>
              <button 
                onClick={() => alert("Exploring guild list... More guilds available in future expansions!")}
                className="text-[9px] font-mono font-extrabold tracking-widest text-slate-400 hover:text-white border border-gray-800 hover:border-gray-700 px-3 py-1 bg-[#131822]/40 rounded uppercase transition-all"
              >
                VIEW ALL
              </button>
            </div>

            {/* Guilds list grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guilds.map((guild) => (
                <div 
                  key={guild.id} 
                  className={`bg-[#131822]/40 border rounded-lg p-5 flex flex-col justify-between gap-4 transition-all duration-300 ${
                    guild.joined ? 'border-accent-blue/40 shadow-blue-glow bg-[#131822]/60' : 'border-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="w-9 h-9 rounded bg-[#0B0E14] border border-gray-850 flex items-center justify-center">
                        {guild.icon}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-accent-blue tracking-wide">
                        {guild.members}/{guild.maxMembers} Members
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider mt-1">
                      {guild.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {guild.description}
                    </p>
                  </div>

                  {/* Footer of card */}
                  <div className="flex justify-between items-center mt-1">
                    {/* Avatars */}
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {guild.avatars.map((av, idx) => (
                          <img 
                            key={idx}
                            src={av} 
                            alt="Avatar member"
                            className="w-6 h-6 rounded-full border border-[#0B0E14] object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold ml-2">
                        +{guild.extraCount}
                      </span>
                    </div>

                    {/* Join button */}
                    <button 
                      onClick={() => toggleJoinGuild(guild.id)}
                      className={`text-[9px] font-mono font-bold tracking-widest uppercase px-4 py-2 rounded transition-all flex items-center gap-1.5 ${
                        guild.joined 
                          ? 'bg-[#0B0E14] border border-accent-blue text-accent-blue shadow-blue-glow' 
                          : 'bg-accent-blue hover:bg-accent-blue/90 text-dark-slate'
                      }`}
                    >
                      {guild.joined ? (
                        <>
                          <Check size={10} className="stroke-[3]" />
                          LEAVE GUILD
                        </>
                      ) : (
                        'JOIN GUILD'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TAVERN CHAT PANEL */}
          <div className="flex-1 min-h-0 bg-[#131822]/40 border border-gray-800/40 rounded-lg p-5 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-gray-850 pb-2 mb-3">
              <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-1.5">
                <MessageSquare size={14} className="text-accent-blue" />
                Tavern Chat
              </h3>
              <span className="text-[8px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 border border-slate-700 rounded uppercase">
                214 adventurers online
              </span>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-3.5 pr-2 mb-4">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded bg-[#0B0E14] border border-gray-800 overflow-hidden flex items-center justify-center shrink-0">
                    {msg.avatar ? (
                      <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-slate-400">🛡️</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold text-slate-200">{msg.sender}</span>
                      <span className="text-[8px] font-mono font-bold bg-[#131822] border border-slate-850 px-1 py-0.2 text-slate-500 rounded tracking-wider">
                        {msg.role}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 font-medium ml-1">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Send Input Box */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send a message to the Tavern..."
                className="flex-1 bg-[#0B0E14] border border-gray-850 rounded-lg py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent-blue font-sans"
              />
              <button 
                type="submit"
                className="w-10 h-8 bg-accent-blue hover:bg-accent-blue/90 text-dark-slate rounded-lg flex items-center justify-center shadow-blue-glow transition-all"
              >
                <Send size={12} className="stroke-[2.5]" />
              </button>
            </form>
          </div>

        </div>

        {/* RIGHT COLUMN: WORLD FEED & GLOBAL EVENTS */}
        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
          
          {/* DAILY MOTIVATION QUOTE */}
          <div className="bg-[#131822]/40 border border-gray-800/40 rounded-lg p-5 flex flex-col gap-2 relative">
            <p className="text-[11.5px] italic text-slate-200 leading-relaxed font-sans font-semibold">
              "Lebih baik berkembang 0.1% dan menjadi lebih baik dari semalam"
            </p>
            <span className="text-[9px] font-mono text-slate-500 font-bold text-right">
              - dikutip dari Atomic Habit
            </span>
          </div>

          {/* WORLD FEED PANEL */}
          <div className="bg-[#131822]/40 border border-gray-800/40 rounded-lg p-5 flex flex-col">
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 mb-4 border-b border-gray-850 pb-2">
              <Globe size={14} className="text-accent-blue" />
              World Feed
            </h3>

            <div className="flex flex-col gap-3">
              {worldFeed.map((feed) => (
                <div key={feed.id} className="flex gap-3 bg-[#0B0E14]/30 border border-[#1F2937]/30 hover:border-gray-850/60 p-2.5 rounded transition-all">
                  <img 
                    src={feed.avatar} 
                    alt={feed.user} 
                    className="w-8 h-8 rounded border border-gray-800 object-cover shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <p className="text-[11px] text-slate-300 leading-snug">
                      <span className="font-bold text-slate-100">{feed.user}</span> {feed.action}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 font-mono text-[9px] font-bold">
                      <span className="text-accent-blue">{feed.meta}</span>
                      <span className="text-slate-500">{feed.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GLOBAL EVENT PANEL */}
          <div className="bg-[#131822]/40 border border-gray-800/40 rounded-lg p-5 relative overflow-hidden flex flex-col gap-4">
            
            <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2 border-b border-gray-850 pb-2">
              <Trophy size={14} className="text-accent-gold" />
              Global Event
            </h3>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
                ACTIVE GLOBAL QUEST
              </span>
              <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider">
                The Vernal Equinox Hunt
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans mt-0.5">
                Complete 10 fitness quests this month to earn the limited edition 'Spring Shield'.
              </p>
            </div>

            {/* Event progress bar */}
            <div className="flex flex-col gap-1.5 mt-1 relative z-10">
              <div className="w-full bg-[#0B0E14] h-2 border border-gray-900 rounded-full overflow-hidden">
                <div 
                  className="bg-accent-blue h-full rounded-full shadow-blue-glow"
                  style={{ width: '65%' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                <span>65% Completed</span>
                <span>3.5 Days Left</span>
              </div>
            </div>

            {/* Background Icon Watermark */}
            <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none text-slate-300">
              <Shield size={80} />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CommunityView;
