import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHabitForge } from '../context/HabitForgeContext';
import { Sparkles, Eye, EyeOff, User, Mail, ShieldAlert } from 'lucide-react';

const RegisterView = () => {
  const { register } = useHabitForge();
  const navigate = useNavigate();
  
  const [heroName, setHeroName] = useState('');
  const [email, setEmail] = useState('');
  const [phrase, setPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(heroName, email, phrase);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try a different name or credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Cavern background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,24,39,0.2)_0%,rgba(11,14,20,1)_80%)] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[700px] h-[700px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Brand Logo Header */}
      <div className="z-10 text-center mb-6 flex flex-col items-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="text-accent-blue font-extrabold">Habit</span>Forge
        </h1>
      </div>

      <div className="z-10 w-full max-w-[440px]">
        
        {/* Main Register Box */}
        <div className="bg-card-slate border border-[#1F2937]/80 rounded-lg p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(139,171,255,0.02)] relative overflow-hidden flex flex-col justify-between">
          
          {/* Subtle tech border decor */}
          <div className="absolute top-0 left-0 w-24 h-[1px] bg-gradient-to-r from-accent-blue/20 to-transparent" />
          <div className="absolute top-0 left-0 h-24 w-[1px] bg-gradient-to-b from-accent-blue/20 to-transparent" />

          <div>
            <div className="text-center mb-6 flex flex-col gap-1.5">
              <h2 className="text-2xl font-extrabold tracking-wide text-slate-100">
                Begin Your Saga
              </h2>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                Forge your digital identity and claim your destiny.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded text-accent-red text-xs font-mono">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-mono text-[10px]">
              
              {/* Hero Name Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <User size={11} className="text-accent-blue" />
                  Hero Name
                </label>
                <input
                  type="text"
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="e.g. Paladin_Arin"
                  className="w-full bg-[#0B0E14] border border-[#1F2937] hover:border-slate-800 focus:border-accent-blue p-3.5 pl-4 rounded text-sm text-slate-100 placeholder-slate-700 transition-all font-sans focus:outline-none"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Address Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <Mail size={11} className="text-accent-blue" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="messenger@realm.com"
                  className="w-full bg-[#0B0E14] border border-[#1F2937] hover:border-slate-800 focus:border-accent-blue p-3.5 pl-4 rounded text-sm text-slate-100 placeholder-slate-700 transition-all font-sans focus:outline-none"
                  required
                  disabled={loading}
                />
              </div>

              {/* Confirm Secret Phrase Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert size={11} className="text-accent-blue" />
                  Confirm Secret Phrase
                </label>
                <div className="relative">
                  <input
                    type={showPhrase ? "text" : "password"}
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="•••••••••••••"
                    className="w-full bg-[#0B0E14] border border-[#1F2937] hover:border-slate-800 focus:border-accent-blue p-3.5 pl-4 pr-12 rounded text-sm text-slate-100 placeholder-slate-700 transition-all font-sans focus:outline-none tracking-widest"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhrase(!showPhrase)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    disabled={loading}
                  >
                    {showPhrase ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Interactive informational stats box */}
              <div className="bg-[#0B0E14]/70 border border-[#1F2937] rounded p-4 flex gap-3 text-slate-400 font-sans mt-2 select-none">
                <div className="w-6 h-6 shrink-0 bg-accent-gold/10 rounded flex items-center justify-center text-accent-gold shadow-gold-glow mt-0.5">
                  <Sparkles size={13} className="fill-accent-gold" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-bold text-slate-300 leading-relaxed font-mono">
                    Your journey begins here: Character creation is automatic upon registration. Your base stats will be calculated from your initial focus areas.
                  </p>
                </div>
              </div>

              {/* Create Character Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-dark-slate disabled:text-dark-slate/60 font-extrabold text-sm uppercase py-4 rounded shadow-blue-glow hover:shadow-blue-glow-hover transition-all flex items-center justify-center gap-2.5 tracking-wider mt-4"
              >
                {loading ? 'Creating Character... ⚔️' : 'Create Character ⚔️'}
              </button>
            </form>
          </div>

          {/* Navigation back to Sign In */}
          <div className="mt-6 text-center text-xs">
            <span className="text-slate-500">Already a hero? </span>
            <Link 
              to="/login" 
              className="text-accent-blue hover:text-accent-blue/80 hover:underline font-bold transition-all font-sans"
            >
              Sign In
            </Link>
          </div>
        </div>

      </div>

      {/* Decorative footer label */}
      <div className="z-10 mt-10 text-[9px] font-mono text-slate-700 tracking-[0.25em] flex gap-4 uppercase select-none">
        <span>⚔️ HONORS</span>
        <span>SHRINE LEGACY</span>
        <span>⚡ POWER</span>
      </div>

      <div className="z-10 mt-6 text-[8px] font-mono text-slate-800 tracking-wider">
        © STREAKQUEST ENGINE V4.2 // SECTOR 0-1
      </div>
    </div>
  );
};

export default RegisterView;

