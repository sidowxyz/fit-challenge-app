import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { TabType } from './Navbar';
import { useFitness } from '../../context/FitnessContext';

interface BottomNavProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

const NAV_ITEMS: {
  id: TabType;
  label: string;
  icon: React.FC<any>;
  isPrimary?: boolean;
}[] = [
  { id: 'dashboard', label: 'Home',    icon: Icons.Dashboard },
  { id: 'calendar',  label: 'Path',    icon: Icons.Calendar },
  { id: 'workout',   label: 'Workout', icon: Icons.Dumbbell, isPrimary: true },
  { id: 'more',      label: 'More',    icon: Icons.Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { selectedWorkoutDay, isDayCompleted } = useFitness();
  const isTodayDone = isDayCompleted(selectedWorkoutDay.id);

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-950/95 backdrop-blur-md border-t-2 border-surface-850 px-3 sm:px-6 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl"
    >
      <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto sm:max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentTab === item.id;
          const isWorkout = item.id === 'workout';

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`
                relative flex flex-col items-center justify-center
                py-2 px-1 rounded-2xl transition-all duration-100 min-h-[54px] select-none
                border-2 border-b-4 font-mono
                ${isActive
                  ? 'bg-brand-500/15 text-brand-300 border-brand-500 border-b-brand-600 shadow-sm'
                  : isWorkout
                    ? 'bg-surface-900 text-surface-300 border-surface-700 border-b-surface-950 hover:border-brand-500/40 active:translate-y-0.5 active:border-b-2'
                    : 'bg-surface-900 text-surface-400 border-surface-800 border-b-surface-950 hover:text-surface-200 hover:border-surface-700 active:translate-y-0.5 active:border-b-2'
                }
              `}
            >
              {/* Icon */}
              <div className="relative">
                <IconComponent
                  size={22}
                  className={isActive ? 'text-brand-400' : isWorkout ? 'text-surface-300' : 'text-surface-400'}
                />
                {/* Workout done badge */}
                {isWorkout && isTodayDone && (
                  <span className="absolute -top-1.5 -right-3 w-4 h-4 bg-emerald-400 text-surface-950 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-surface-950 shadow-sm">
                    ✓
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[10px] mt-1 font-black uppercase tracking-tight ${
                isActive ? 'text-brand-300' : isWorkout ? 'text-surface-300' : 'text-surface-400'
              }`}>
                {item.label}
              </span>

              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-brand-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
