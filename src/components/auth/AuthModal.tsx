import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name.');
          setIsLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name.trim());
        if (error) {
          setError(error.message);
        } else {
          setSuccessMsg('Account created successfully!');
          setTimeout(() => {
            onClose();
          }, 1000);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccessMsg('Logged in successfully!');
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 rounded-3xl p-6 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-surface-800 pb-3">
          <div>
            <div className="text-[10px] font-mono uppercase text-brand-400 font-black tracking-wider">
              Supabase Auth Quest
            </div>
            <h2 className="text-lg font-black font-mono text-surface-100 uppercase tracking-tight">
              {isSignUp ? 'Create Athlete Account' : 'Log In to Challenge'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-surface-400 hover:text-surface-100 bg-surface-950 rounded-xl border border-surface-800 transition-colors"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-mono font-bold">
            <Icons.Alert size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2 font-mono font-bold">
            <Icons.CheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-xs font-mono uppercase text-surface-400 font-black mb-1">
                Athlete Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  required={isSignUp}
                  className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                  <Icons.User size={18} />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase text-surface-400 font-black mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="athlete@example.com"
                required
                className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                <Icons.Mail size={18} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-surface-400 font-black mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                <Icons.Lock size={18} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-duo-primary w-full py-3.5 text-xs font-mono font-black uppercase tracking-wider mt-2"
          >
            {isLoading ? 'Processing...' : isSignUp ? 'CREATE ACCOUNT' : 'LOG IN'}
          </button>
        </form>

        <div className="text-center pt-2 border-t-2 border-surface-800">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs font-mono font-bold text-surface-400 hover:text-brand-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};
