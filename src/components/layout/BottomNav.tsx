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
  { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { id: 'calendar',  label: 'Timeline',  icon: Icons.Calendar },
  { id: 'workout',   label: 'Session',   icon: Icons.Dumbbell, isPrimary: true },
  { id: 'more',      label: 'Hub',       icon: Icons.Settings },
];

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { selectedWorkoutDay, isDayCompleted } = useFitness();
  const isTodayDone = isDayCompleted(selectedWorkoutDay.id);

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-950/95 backdrop-blur-xl border-t border-surface-800 px-3 sm:px-6 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
    >
      <div className="grid grid-cols-4 gap-1.5 max-w-lg mx-auto sm:max-w-xl">
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
                py-2 px-1 rounded-lg transition-all duration-150 min-h-[52px] select-none
                ${isActive
                  ? 'bg-surface-900/90 text-volt-400 border border-volt-500/40 shadow-[0_0_15px_rgba(204,255,0,0.12)]'
                  : isWorkout
                    ? 'text-surface-300 hover:text-white hover:bg-surface-900/50'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-900/40'
                }
              `}
            >
              {/* Top hairline active indicator */}
              {isActive && (
                <span className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-volt-500 rounded-full shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
              )}

              {/* Icon Container */}
              <div className="relative mt-0.5">
                <IconComponent
                  size={20}
                  className={`transition-transform duration-150 ${
                    isActive 
                      ? 'text-volt-400 scale-110 drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]' 
                      : isWorkout 
                        ? 'text-surface-200' 
                        : 'text-surface-400'
                  }`}
                />
                
                {/* Workout done badge */}
                {isWorkout && isTodayDone && (
                  <span className="absolute -top-1.5 -right-3 w-3.5 h-3.5 bg-volt-500 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(204,255,0,0.8)]">
                    ✓
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] mt-1 font-athletic font-bold uppercase tracking-wider ${
                isActive ? 'text-volt-400 font-extrabold' : isWorkout ? 'text-surface-200' : 'text-surface-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
