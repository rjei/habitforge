import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useHabitForge } from '../context/HabitForgeContext';
import { Eye, EyeOff, User, Lock } from 'lucide-react';

const LoginView = () => {
  const { login } = useHabitForge();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [phrase, setPhrase] = useState('');
  const [showPhrase, setShowPhrase] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, phrase);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to authenticate. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans select-none">
      
      {/* Premium cavern background radial glowing effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,41,55,0.15)_0%,rgba(11,14,20,1)_80%)] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Brand Header */}
      <div className="z-10 text-center mb-8 flex flex-col items-center gap-1.5">
        <h1 className="text-4xl font-extrabold tracking-widest text-slate-100">
          <span className="text-accent-blue font-black drop-shadow-[0_0_10px_rgba(139,171,255,0.4)]">Habit</span>Forge
        </h1>
        <p className="text-xs font-mono font-bold tracking-[0.3em] text-slate-500 uppercase">
          Your Journey Awaits
        </p>
      </div>

      <div className="z-10 w-full max-w-[440px]">
        
        {/* Main Login Card */}
        <div className="bg-card-slate border border-[#1F2937]/80 rounded-lg p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(139,171,255,0.03)] relative overflow-hidden flex flex-col justify-between">
          
          {/* Decorative corner indicator */}
          <div className="absolute top-0 right-0 w-24 h-[1px] bg-gradient-to-l from-accent-blue/30 to-transparent" />
          <div className="absolute top-0 right-0 h-24 w-[1px] bg-gradient-to-b from-accent-blue/30 to-transparent" />

          <div>
            {error && (
              <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded text-accent-red text-xs font-mono">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Email or Username Input */}
              <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                  <User size={11} className="text-accent-blue" />
                  Email or Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. demo"
                    className="w-full bg-[#0B0E14] border border-[#1F2937] hover:border-slate-800 focus:border-accent-blue p-3.5 pl-4 rounded text-sm text-slate-100 placeholder-slate-700 transition-all font-sans focus:outline-none"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Secret Phrase (Password) Input */}
              <div className="flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between items-center">
                  <label className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                    <Lock size={11} className="text-accent-blue" />
                    Secret Phrase
                  </label>
                  <button 
                    type="button"
                    className="text-slate-500 hover:text-slate-400 transition-colors uppercase font-bold tracking-wider hover:underline"
                  >
                    Lost Key?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPhrase ? "text" : "password"}
                    value={phrase}
                    onChange={(e) => setPhrase(e.target.value)}
                    placeholder="e.g. demo123"
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

              {/* Submit Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-blue hover:bg-accent-blue/90 disabled:bg-accent-blue/50 text-dark-slate disabled:text-dark-slate/60 font-extrabold text-sm uppercase py-4 rounded shadow-blue-glow hover:shadow-blue-glow-hover transition-all flex items-center justify-center gap-2.5 tracking-wider mt-4"
              >
                {loading ? 'Authenticating... ⚔️' : 'Begin Quest ⚔️'}
              </button>
            </form>
          </div>

          {/* Create Account Link */}
          <div className="mt-8 text-center text-xs">
            <span className="text-slate-500">New to the realm? </span>
            <Link 
              to="/register" 
              className="text-accent-blue hover:text-accent-blue/80 hover:underline font-bold transition-all font-sans"
            >
              Create an Account
            </Link>
          </div>
        </div>

      </div>

      {/* Tiny Footer info */}
      <div className="z-10 mt-12 text-[10px] font-mono text-slate-700 tracking-widest flex items-center gap-1.5">
        <span>⚔️ V1.0</span>
      </div>
    </div>
  );
};

export default LoginView;

