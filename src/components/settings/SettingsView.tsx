import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';
import { saveSupabaseConfig, clearSupabaseConfig, isSupabaseConfigured } from '../../lib/supabase';

interface SettingsViewProps {
  onOpenAuthModal: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onOpenAuthModal }) => {
  const { preferences, updatePreferences } = useFitness();
  const { profile, updateProfile, signOut, user } = useAuth();

  const [name, setName] = useState(profile?.name || '');
  const [units, setUnits] = useState<'kg' | 'lb'>(preferences.units);
  const [notifications, setNotifications] = useState(preferences.notifications_enabled);

  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem('supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem('supabase_anon_key') || '');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [showDbSaved, setShowDbSaved] = useState(false);

  const handleSaveProfileAndPrefs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      await updateProfile(name.trim());
    }
    await updatePreferences({
      units,
      notifications_enabled: notifications
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2000);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (supabaseUrl.trim() && supabaseKey.trim()) {
      saveSupabaseConfig(supabaseUrl, supabaseKey);
      setShowDbSaved(true);
      setTimeout(() => {
        setShowDbSaved(false);
        window.location.reload();
      }, 1000);
    }
  };

  const handleClearSupabase = () => {
    clearSupabaseConfig();
    setSupabaseUrl('');
    setSupabaseKey('');
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-duo p-5 sm:p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-black mb-1">
          Preferences & System
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-surface-100 font-mono">
          Settings
        </h1>
        <p className="text-xs font-mono text-surface-400 font-semibold mt-1">
          Manage your athlete profile, training units, and backend database sync.
        </p>
      </div>

      {/* 1. PROFILE & TRAINING PREFERENCES */}
      <form onSubmit={handleSaveProfileAndPrefs} className="card-duo p-5 sm:p-6 space-y-6">
        <div className="flex items-center space-x-2 text-surface-100 font-mono font-black text-sm uppercase">
          <Icons.User size={20} className="text-brand-400" />
          <span>Athlete Profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-surface-400 font-black mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-3 text-sm font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-surface-400 font-black mb-1.5">
              Weight Unit
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnits('kg')}
                className={`py-3 px-3 rounded-2xl text-xs font-mono font-black uppercase transition-all ${
                  units === 'kg'
                    ? 'btn-duo-primary'
                    : 'btn-duo-secondary'
                }`}
              >
                kg (Kilograms)
              </button>
              <button
                type="button"
                onClick={() => setUnits('lb')}
                className={`py-3 px-3 rounded-2xl text-xs font-mono font-black uppercase transition-all ${
                  units === 'lb'
                    ? 'btn-duo-primary'
                    : 'btn-duo-secondary'
                }`}
              >
                lb (Pounds)
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-surface-800">
          <div className="flex items-center space-x-2">
            <Icons.Bell size={18} className="text-surface-400" />
            <span className="text-xs font-mono font-bold text-surface-300">Workout & Football Reminders</span>
          </div>
          <button
            type="button"
            onClick={() => setNotifications(!notifications)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all ${
              notifications
                ? 'btn-duo-primary'
                : 'btn-duo-secondary'
            }`}
          >
            {notifications ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          {showSavedToast && (
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1 font-bold">
              <Icons.Check size={16} />
              <span>Preferences saved!</span>
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="btn-duo-primary px-6 py-3 text-xs font-mono font-black"
            >
              SAVE SETTINGS
            </button>
          </div>
        </div>
      </form>

      {/* 2. SUPABASE BACKEND CONFIGURATION */}
      <form onSubmit={handleSaveSupabaseConfig} className="card-duo p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-surface-100 font-mono font-black text-sm uppercase">
            <Icons.Database size={20} className="text-brand-400" />
            <span>Supabase PostgreSQL Backend</span>
          </div>
          <span className={`text-[10px] font-mono px-3 py-1 rounded-xl border-2 font-black uppercase ${
            isSupabaseConfigured 
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
              : 'bg-surface-950 text-surface-400 border-surface-800'
          }`}>
            {isSupabaseConfigured ? 'Sync Connected' : 'Local Mode'}
          </span>
        </div>

        <p className="text-xs font-mono text-surface-400 font-semibold leading-relaxed">
          Provide your Supabase URL & Public Anon Key below to sync live across devices. Complete SQL schema with RLS is in <code>supabase/schema.sql</code>.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-surface-400 font-bold mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-surface-400 font-bold mb-1">
              Supabase Anon / Publishable Key
            </label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full bg-surface-950 border-2 border-surface-700 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t-2 border-surface-800">
          <button
            type="button"
            onClick={handleClearSupabase}
            className="text-xs font-mono text-rose-400 hover:underline font-bold"
          >
            Clear Keys
          </button>

          <div className="flex items-center space-x-3">
            {showDbSaved && (
              <span className="text-xs font-mono text-emerald-400 font-bold">Connected! Reloading...</span>
            )}
            <button
              type="submit"
              className="btn-duo-secondary px-5 py-2.5 text-xs font-mono font-bold"
            >
              Save & Connect
            </button>
          </div>
        </div>
      </form>

      {/* 3. ACCOUNT & AUTHENTICATION */}
      <div className="card-duo p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-surface-100 font-mono font-black text-sm uppercase">
          <Icons.Lock size={20} className="text-brand-400" />
          <span>Account & Security</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <div className="text-surface-200 font-black">{user?.email || 'Demo Athlete Mode'}</div>
            <div className="text-surface-500 font-bold">Authenticated via Supabase Auth</div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuthModal}
              className="btn-duo-secondary px-4 py-2.5 text-xs font-mono font-bold"
            >
              Switch Account
            </button>
            <button
              onClick={signOut}
              className="btn-duo-danger px-4 py-2.5 text-xs font-mono font-black flex items-center space-x-1"
            >
              <Icons.LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
