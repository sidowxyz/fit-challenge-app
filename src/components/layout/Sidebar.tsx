import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { TabType } from './Navbar';
import { useFitness } from '../../context/FitnessContext';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { currentDayNumber, selectedWorkoutDay, isDayCompleted } = useFitness();

  const isTodayDone = isDayCompleted(selectedWorkoutDay.id);

  const navItems: { id: TabType; label: string; icon: React.FC<any>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard',     icon: Icons.Dashboard },
    { id: 'calendar',  label: '100-Day Path',  icon: Icons.Calendar },
    {
      id: 'workout',
      label: "Today's Workout",
      icon: Icons.Dumbbell,
      badge: isTodayDone ? '✓' : undefined
    },
    { id: 'more',      label: 'Stats & More',  icon: Icons.TrendingUp },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r-2 border-surface-850 bg-surface-950 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Duolingo-style Progress Widget */}
      <div className="mb-6 p-4 rounded-2xl bg-surface-900 border-2 border-surface-800 border-b-4 border-b-surface-950 shadow-sm">
        <div className="text-[11px] uppercase tracking-wider text-surface-400 font-mono font-bold mb-1">
          Challenge Milestone
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-black text-surface-100 font-mono">Day {currentDayNumber}</span>
          <span className="text-xs font-mono text-brand-400 font-extrabold">{currentDayNumber}%</span>
        </div>
        <div className="w-full h-3 bg-surface-950 rounded-full overflow-hidden border border-surface-800 p-0.5">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ width: `${currentDayNumber}%` }}
          />
        </div>
      </div>

      {/* Navigation Menus as 3D Chunky Buttons */}
      <nav className="space-y-2.5 flex-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-extrabold font-mono uppercase tracking-wider transition-all duration-100 ${
                isActive
                  ? 'bg-brand-500/10 text-brand-300 border-2 border-brand-500 border-b-4 border-b-brand-600 translate-y-0 shadow-sm'
                  : 'bg-surface-900 hover:bg-surface-850 text-surface-400 hover:text-surface-100 border-2 border-surface-800 border-b-4 border-b-surface-950 active:translate-y-0.5 active:border-b-2'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent size={20} className={isActive ? 'text-brand-400' : 'text-surface-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-mono font-black text-emerald-950 bg-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Workout Routine Box */}
      <div className="mt-auto pt-4 border-t-2 border-surface-850">
        <div className="p-3.5 rounded-2xl bg-surface-900/60 border-2 border-surface-800 text-xs text-surface-400">
          <div className="text-[10px] uppercase font-mono tracking-wider text-brand-400 font-bold mb-1">
            Current Split
          </div>
          <div className="font-extrabold text-surface-200">{selectedWorkoutDay.workout_name}</div>
          <div className="text-[11px] text-surface-500 mt-0.5 font-mono">{selectedWorkoutDay.day_of_week}</div>
        </div>
      </div>
    </aside>
  );
};
