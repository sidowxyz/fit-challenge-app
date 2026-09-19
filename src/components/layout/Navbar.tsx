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
    <header className="sticky top-0 z-40 bg-surface-950/95 backdrop-blur-md border-b border-surface-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-volt-500 flex items-center justify-center text-black font-athletic font-black shadow-[0_0_20px_rgba(204,255,0,0.3)] group-hover:scale-105 transition-transform">
            <Icons.Fire size={22} className="text-black" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-athletic font-black text-lg sm:text-xl tracking-wider text-white uppercase">
                100 DAYS
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-athletic font-black bg-volt-500/15 text-volt-400 border border-volt-500/40 tracking-wider">
                PRO TRAINING
              </span>
            </div>
            <p className="text-[10px] text-surface-400 font-mono tracking-tight hidden sm:block">
              SEP 19 → DEC 27 // HIGH-INTENSITY
            </p>
          </div>
        </div>

        {/* Athletic Telemetry Header Modules */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Day Progress Pill */}
          <div 
            onClick={() => setCurrentTab('calendar')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-750 cursor-pointer hover:border-volt-500/60 active:scale-95 transition-all font-mono text-xs font-bold"
          >
            <span className="w-2 h-2 rounded-full bg-volt-500 animate-pulse shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
            <span className="text-surface-400 uppercase text-[10px]">DAY</span>
            <span className="text-volt-400 font-athletic font-black text-base leading-none">{String(currentDayNumber).padStart(2, '0')}</span>
            <span className="text-surface-500 text-[10px] hidden sm:inline">/100</span>
          </div>

          {/* Streak Flame Pill */}
          <div 
            onClick={() => setCurrentTab('more')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-900 border border-surface-750 cursor-pointer hover:border-amber-500/60 active:scale-95 transition-all font-mono text-xs font-bold"
          >
            <Icons.Fire size={16} className="text-amber-400 animate-bounce duration-1000" />
            <span className="text-white font-athletic font-black text-base leading-none">{stats.currentStreak}</span>
            <span className="text-amber-400 uppercase text-[10px] hidden sm:inline">STREAK</span>
          </div>

          {/* Supabase Status Pill */}
          <button
            onClick={onOpenSupabaseModal}
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all active:scale-95 ${
              isConfigured 
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/40' 
                : 'bg-surface-900 text-surface-400 border-surface-750 hover:border-surface-600'
            }`}
            title="Database Connection Status"
          >
            <Icons.Database size={14} />
            <span className="text-[10px] tracking-wider uppercase">{isConfigured ? 'SYNC ON' : 'CONNECT'}</span>
          </button>

          {/* User Profile Pill */}
          <button
            onClick={() => setCurrentTab('more')}
            className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-surface-900 border border-surface-750 hover:border-surface-600 active:scale-95 transition-all"
          >
            <div className="w-7 h-7 rounded-md bg-volt-500/15 border border-volt-500/30 flex items-center justify-center text-xs font-athletic font-black text-volt-400">
              {profile?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <span className="text-xs font-athletic font-bold tracking-wider text-surface-200 uppercase hidden md:block">
              {profile?.name || 'ATHLETE'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
