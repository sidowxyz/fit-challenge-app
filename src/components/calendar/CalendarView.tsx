import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { formatShortDate, formatDisplayDate } from '../../utils/schedule';
import { WorkoutDay } from '../../types';

type AnyTab = 'dashboard' | 'workout' | 'calendar' | 'more' | 'history' | 'progress' | 'challenge' | 'settings';

interface CalendarViewProps {
  onNavigate: (tab: AnyTab) => void;
}

type ViewMode = 'path' | 'grid';
type FilterOption = 'all' | 'gym' | 'football' | 'rest' | 'completed';

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigate }) => {
  const {
    allDays,
    currentDayNumber,
    setSelectedDayNumber,
    isDayCompleted
  } = useFitness();

  const [viewMode, setViewMode] = useState<ViewMode>('path');
  const [filter, setFilter] = useState<FilterOption>('all');

  const filteredDays = allDays.filter((day) => {
    const isDone = isDayCompleted(day.id);
    if (filter === 'gym') return day.day_type === 'gym';
    if (filter === 'football') return day.day_type === 'football';
    if (filter === 'rest') return day.day_type === 'rest';
    if (filter === 'completed') return isDone;
    return true;
  });

  const handleSelectDay = (day: WorkoutDay) => {
    setSelectedDayNumber(day.day_number);
    onNavigate('workout');
  };

  // Calculate winding offset for Duolingo path (-32px, 0, 32px, 0)
  const getPathOffset = (index: number) => {
    const pattern = [0, 36, 60, 36, 0, -36, -60, -36];
    return pattern[index % pattern.length];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header & Controls */}
      <div className="card-duo p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-black mb-1">
            Training Journey
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-surface-100 font-mono">
            100-Day Milestone Path
          </h1>
          <p className="text-xs font-mono text-surface-400 font-semibold mt-1">
            September 19 → December 27, 2026 (100 Days)
          </p>
        </div>

        {/* View Mode Toggle (Path vs Grid) */}
        <div className="flex items-center space-x-2">
          <div className="flex p-1 bg-surface-950 rounded-2xl border-2 border-surface-800">
            <button
              onClick={() => setViewMode('path')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                viewMode === 'path'
                  ? 'bg-brand-500 text-surface-950 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              🛤️ Path View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-brand-500 text-surface-950 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200'
              }`}
            >
              ▦ Grid Matrix
            </button>
          </div>
        </div>
      </div>

      {/* FILTER BUTTONS (IF IN GRID MODE) */}
      {viewMode === 'grid' && (
        <div className="flex flex-wrap gap-2 p-1.5 bg-surface-900 rounded-2xl border-2 border-surface-800 border-b-4 border-b-surface-950">
          {(['all', 'gym', 'football', 'rest', 'completed'] as FilterOption[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-extrabold capitalize transition-all ${
                filter === f
                  ? 'bg-brand-500 text-surface-950 shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 bg-surface-950/60'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {/* 1. DUOLINGO WINDING MILESTONE PATH VIEW */}
      {viewMode === 'path' && (
        <div className="card-duo p-6 sm:p-10 flex flex-col items-center relative overflow-hidden bg-gradient-to-b from-surface-900 via-surface-950 to-surface-900">
          
          <div className="w-full max-w-sm mx-auto space-y-6 flex flex-col items-center">
            {allDays.map((day, idx) => {
              const isDone = isDayCompleted(day.id);
              const isToday = day.day_number === currentDayNumber;
              const isMilestone = [10, 25, 50, 75, 100].includes(day.day_number);
              const offsetX = getPathOffset(idx);

              // 3D Node Styling
              let nodeClass = 'bg-surface-850 border-2 border-surface-700 border-b-6 border-b-surface-950 text-surface-400';
              let badgeColor = 'text-surface-500';

              if (isDone) {
                nodeClass = 'bg-emerald-500 hover:bg-emerald-400 border-2 border-emerald-400 border-b-6 border-b-emerald-700 text-surface-950 active:translate-y-1 active:border-b-2 shadow-lg';
                badgeColor = 'text-emerald-400 font-bold';
              } else if (isToday) {
                nodeClass = 'bg-brand-500 hover:bg-brand-400 border-2 border-brand-300 border-b-6 border-b-brand-700 text-surface-950 ring-4 ring-brand-500/40 animate-pulse active:translate-y-1 active:border-b-2 shadow-xl';
                badgeColor = 'text-brand-300 font-black';
              } else if (day.day_type === 'football') {
                nodeClass = 'bg-surface-900 hover:bg-surface-850 border-2 border-emerald-800/80 border-b-6 border-b-surface-950 text-emerald-400';
              }

              return (
                <div 
                  key={day.id} 
                  className="flex flex-col items-center relative my-2"
                  style={{ transform: `translateX(${offsetX}px)` }}
                >
                  {/* Milestone Banner */}
                  {isMilestone && (
                    <div className="mb-2 px-3 py-1 rounded-xl bg-amber-500/20 border-2 border-amber-500/50 border-b-4 border-b-amber-700 text-amber-300 font-mono text-[10px] font-black uppercase tracking-wider flex items-center space-x-1.5 shadow-md">
                      <span>🏆</span>
                      <span>Milestone: Day {day.day_number}</span>
                    </div>
                  )}

                  {/* Active Tooltip for Today */}
                  {isToday && (
                    <div className="mb-1 px-3 py-1 rounded-xl bg-brand-500 border-b-3 border-brand-700 text-surface-950 font-mono text-[10px] font-black uppercase tracking-wider shadow-md">
                      START DAY {day.day_number}
                    </div>
                  )}

                  {/* Circular 3D Node */}
                  <button
                    onClick={() => handleSelectDay(day)}
                    className={`node-duo relative group ${nodeClass}`}
                    title={`Day ${day.day_number}: ${day.workout_name}`}
                  >
                    {isDone ? (
                      <Icons.Check size={28} className="text-surface-950 stroke-[3]" />
                    ) : isToday ? (
                      day.day_type === 'gym' ? <Icons.Dumbbell size={26} className="text-surface-950" /> :
                      day.day_type === 'football' ? <span className="text-xl">⚽</span> :
                      <span className="text-xl">💤</span>
                    ) : (
                      <span className="font-mono text-sm font-black">
                        {day.day_number}
                      </span>
                    )}

                    {/* Mini Day Type Icon Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface-950 border-2 border-surface-800 flex items-center justify-center text-[10px]">
                      {day.day_type === 'gym' ? '🏋️' : day.day_type === 'football' ? '⚽' : '💤'}
                    </div>
                  </button>

                  {/* Label under node */}
                  <div className="mt-1 text-center">
                    <div className="text-[11px] font-mono font-bold text-surface-200">
                      {day.workout_name}
                    </div>
                    <div className="text-[9px] font-mono text-surface-500">
                      {formatShortDate(day.date)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TACTILE GRID MATRIX VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
          {filteredDays.map((day) => {
            const isDone = isDayCompleted(day.id);
            const isToday = day.day_number === currentDayNumber;

            let borderClass = 'bg-surface-900 border-2 border-surface-800 border-b-4 border-b-surface-950 hover:border-surface-700';
            let statusLabel = 'Upcoming';
            let statusBadgeClass = 'text-surface-500 bg-surface-950';

            if (isDone) {
              borderClass = 'bg-emerald-950/20 border-2 border-emerald-500/50 border-b-4 border-b-emerald-700 hover:border-emerald-500';
              statusLabel = '✓ Done';
              statusBadgeClass = 'text-emerald-400 bg-emerald-500/20 font-black';
            } else if (isToday) {
              borderClass = 'bg-brand-500/10 border-2 border-brand-500 border-b-4 border-b-brand-600 ring-2 ring-brand-500/30';
              statusLabel = 'Today';
              statusBadgeClass = 'text-brand-300 bg-brand-500/30 font-black';
            } else if (day.day_type === 'football') {
              borderClass = 'bg-surface-900 border-2 border-emerald-900/60 border-b-4 border-b-surface-950';
              statusLabel = 'Football';
              statusBadgeClass = 'text-emerald-400 bg-emerald-950/40 font-bold';
            } else if (day.day_type === 'rest') {
              borderClass = 'bg-surface-950/60 border-2 border-surface-850 border-b-4 border-b-surface-950';
              statusLabel = 'Rest';
              statusBadgeClass = 'text-surface-500 bg-surface-900';
            }

            return (
              <div
                key={day.id}
                onClick={() => handleSelectDay(day)}
                className={`p-3.5 rounded-2xl flex flex-col justify-between transition-all cursor-pointer group active:translate-y-0.5 active:border-b-2 ${borderClass}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-black text-surface-100 group-hover:text-brand-300">
                    Day {day.day_number}
                  </span>
                  <span className="text-[10px] font-mono text-surface-500 font-bold">
                    {formatShortDate(day.date)}
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-xs font-extrabold text-surface-200 uppercase tracking-tight line-clamp-1">
                    {day.workout_name}
                  </div>
                  <div className="text-[10px] font-mono text-surface-400 font-semibold">
                    {day.day_of_week}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-surface-800/80 flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-lg ${statusBadgeClass}`}>
                    {statusLabel}
                  </span>
                  {day.day_type === 'gym' && (
                    <span className="text-[10px] font-mono text-surface-500 font-bold">
                      {day.exercises.length} ex
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
