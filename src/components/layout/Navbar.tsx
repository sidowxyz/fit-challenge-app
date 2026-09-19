import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';

export type TabType = 'dashboard' | 'workout' | 'calendar' | 'more';

interface NavbarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  onOpenSupabaseModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenSupabaseModal }) => {
  const { currentDayNumber, stats } = useFitness();
  const { profile, isConfigured } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-surface-950/90 backdrop-blur-md border-b-2 border-surface-850">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title with 3D Button */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group active:translate-y-0.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-2xl bg-brand-500 border-2 border-brand-400 border-b-4 border-b-brand-700 flex items-center justify-center text-surface-950 font-black shadow-md">
            <Icons.Fire size={20} className="text-surface-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm sm:text-base tracking-wider text-surface-100 uppercase font-mono">
                100 DAYS
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-extrabold bg-brand-500/20 text-brand-300 border border-brand-500/40">
                CHALLENGE
              </span>
            </div>
            <p className="text-[10px] text-surface-400 font-mono hidden sm:block">
              Sep 19 → Dec 27
            </p>
          </div>
        </div>

        {/* Duolingo Gamified Resource Header Pills */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Day Progress Pill */}
          <div 
            onClick={() => setCurrentTab('calendar')}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-900 border-2 border-surface-800 border-b-4 border-b-surface-950 cursor-pointer hover:border-brand-500/40 active:translate-y-0.5 active:border-b-2 transition-all font-mono text-xs font-bold"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-surface-300">Day</span>
            <span className="text-brand-400 font-black">{currentDayNumber}</span>
            <span className="text-surface-500 hidden sm:inline">/100</span>
          </div>

          {/* Streak Flame Pill */}
          <div 
            onClick={() => setCurrentTab('more')}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-surface-900 border-2 border-surface-800 border-b-4 border-b-surface-950 cursor-pointer hover:border-amber-500/40 active:translate-y-0.5 active:border-b-2 transition-all font-mono text-xs font-bold"
          >
            <Icons.Fire size={16} className="text-amber-500" />
            <span className="text-amber-400 font-black">{stats.currentStreak}</span>
            <span className="text-surface-500 hidden sm:inline">streak</span>
          </div>

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border-2 border-b-4 transition-all active:translate-y-0.5 active:border-b-2 ${
              isConfigured 
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/80 border-b-emerald-950 hover:bg-emerald-900/40' 
                : 'bg-surface-900 text-surface-400 border-surface-800 border-b-surface-950 hover:border-surface-700'
            }`}
            title="Database Connection Status"
          >
            <Icons.Database size={14} />
            <span>{isConfigured ? 'Sync On' : 'Setup'}</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => setCurrentTab('more')}
            className="flex items-center space-x-2 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-surface-900 border-2 border-surface-800 border-b-4 border-b-surface-950 hover:border-surface-700 active:translate-y-0.5 active:border-b-2 transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-xs font-black text-brand-300">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <span className="text-xs font-bold font-mono text-surface-200 hidden md:block">
              {profile?.name || 'Athlete'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
