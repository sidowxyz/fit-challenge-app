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
    <aside className="hidden lg:flex flex-col w-64 border-r border-surface-800 bg-surface-950 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      
      {/* Athletic Progress Widget */}
      <div className="mb-6 p-4 rounded-xl bg-surface-900 border border-surface-800 shadow-md">
        <div className="text-[10px] uppercase tracking-wider text-surface-400 font-athletic font-bold mb-1">
          CHALLENGE PROGRESSION
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-athletic font-black text-white uppercase tracking-tight">DAY {String(currentDayNumber).padStart(2, '0')}</span>
          <span className="text-sm font-athletic font-black text-volt-400">{currentDayNumber}%</span>
        </div>
        <div className="w-full h-2 bg-surface-950 rounded-full overflow-hidden border border-surface-800 p-0.5">
          <div 
            className="h-full bg-volt-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(204,255,0,0.6)]"
            style={{ width: `${currentDayNumber}%` }}
          />
        </div>
      </div>

      {/* Navigation Menus */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-athletic font-extrabold uppercase tracking-wider transition-all duration-150 ${
                isActive
                  ? 'bg-surface-900 text-volt-400 border border-volt-500/40 shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-900/60 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent size={18} className={isActive ? 'text-volt-400' : 'text-surface-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-mono font-black text-black bg-volt-500 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(204,255,0,0.8)]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active Workout Routine Box */}
      <div className="mt-auto pt-4 border-t border-surface-800">
        <div className="p-3.5 rounded-xl bg-surface-900/60 border border-surface-800 text-xs text-surface-400">
          <div className="text-[10px] uppercase font-athletic tracking-wider text-volt-400 font-bold mb-1">
            CURRENT SPLIT
          </div>
          <div className="font-athletic font-black text-base text-surface-100 uppercase tracking-wide">{selectedWorkoutDay.workout_name}</div>
          <div className="text-[11px] text-surface-400 mt-0.5 font-mono">{selectedWorkoutDay.day_of_week}</div>
        </div>
      </div>
    </aside>
  );
};
