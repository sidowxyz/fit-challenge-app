import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { formatShortDate } from '../../utils/schedule';
import { WorkoutDay } from '../../types';

type AnyTab = 'dashboard' | 'workout' | 'calendar' | 'more' | 'history' | 'progress' | 'challenge' | 'settings';

interface CalendarViewProps {
  onNavigate: (tab: AnyTab) => void;
}

type ViewMode = 'timeline' | 'grid';
type FilterOption = 'all' | 'gym' | 'football' | 'rest' | 'completed';

interface PhaseInfo {
  phase: number;
  name: string;
  subtitle: string;
  range: [number, number];
  color: string;
}

const PHASES: PhaseInfo[] = [
  { phase: 1, name: 'FOUNDATION & CAPACITY', subtitle: 'Movement mechanics & aerobic base', range: [1, 25], color: 'from-blue-500/20 to-transparent' },
  { phase: 2, name: 'HYPERTROPHY & DENSITY', subtitle: 'Progressive overload & muscle building', range: [26, 50], color: 'from-amber-500/20 to-transparent' },
  { phase: 3, name: 'STRENGTH & POWER', subtitle: 'Maximal force production & explosiveness', range: [51, 75], color: 'from-rose-500/20 to-transparent' },
  { phase: 4, name: 'PEAK ATHLETIC PERFORMANCE', subtitle: 'Championship conditioning & taper', range: [76, 100], color: 'from-volt-500/20 to-transparent' },
];

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigate }) => {
  const {
    allDays,
    currentDayNumber,
    setSelectedDayNumber,
    isDayCompleted
  } = useFitness();

  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');

  const filteredDays = allDays.filter((day) => {
    const isDone = isDayCompleted(day.id);
    if (selectedPhase !== 'all') {
      const p = PHASES.find(ph => ph.phase === selectedPhase);
      if (p && (day.day_number < p.range[0] || day.day_number > p.range[1])) {
        return false;
      }
    }
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

  const completedCount = allDays.filter(d => isDayCompleted(d.id)).length;
  const progressPercent = Math.round((completedCount / 100) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Header & Athletic Telemetry */}
      <div className="card-athletic p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-surface-800 bg-surface-900/90 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-volt-500 shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
            <span className="text-xs font-athletic font-black uppercase tracking-widest text-volt-400">
              TRAINING CALENDAR // 100-DAY MISSION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-athletic">
            SEASON TIMELINE
          </h1>
          <p className="text-xs font-mono text-surface-400 mt-1">
            SEP 19 → DEC 27, 2026 // {completedCount} OF 100 SESSIONS LOGGED ({progressPercent}%)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <div className="flex p-1 bg-surface-950 rounded-lg border border-surface-800">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded text-xs font-athletic font-extrabold uppercase tracking-wider transition-all ${
                viewMode === 'timeline'
                  ? 'bg-volt-500 text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              ⚡ TIMELINE
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-xs font-athletic font-extrabold uppercase tracking-wider transition-all ${
                viewMode === 'grid'
                  ? 'bg-volt-500 text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              ▦ MATRIX
            </button>
          </div>
        </div>
      </div>

      {/* Phase Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PHASES.map((p) => {
          const isActive = selectedPhase === p.phase;
          const isCurrent = currentDayNumber >= p.range[0] && currentDayNumber <= p.range[1];
          return (
            <button
              key={p.phase}
              onClick={() => setSelectedPhase(isActive ? 'all' : p.phase)}
              className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-surface-850 border-volt-500 text-white shadow-[0_0_15px_rgba(204,255,0,0.15)]'
                  : isCurrent
                    ? 'bg-surface-900 border-surface-750 text-surface-200 hover:border-surface-600'
                    : 'bg-surface-950/70 border-surface-850 text-surface-400 hover:border-surface-750'
              }`}
            >
              {isCurrent && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-volt-500 shadow-[0_0_6px_rgba(204,255,0,0.8)]" />
              )}
              <div className="text-[10px] font-athletic font-bold uppercase tracking-wider text-surface-400">
                PHASE 0{p.phase} // DAYS {p.range[0]}–{p.range[1]}
              </div>
              <div className="font-athletic font-black text-sm uppercase tracking-wide text-surface-100 truncate mt-0.5">
                {p.name.split('&')[0]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter Chips for Grid Mode */}
      {viewMode === 'grid' && (
        <div className="flex flex-wrap gap-2 p-2 bg-surface-900 rounded-lg border border-surface-800">
          {(['all', 'gym', 'football', 'rest', 'completed'] as FilterOption[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded text-xs font-athletic font-extrabold uppercase tracking-wider transition-all ${
                filter === f
                  ? 'bg-volt-500 text-black shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 bg-surface-950/80'
              }`}
            >
              {f === 'completed' ? '✓ Completed' : f}
            </button>
          ))}
        </div>
      )}

      {/* 1. ATHLETIC PRO TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="relative space-y-4">
          
          {/* Vertical Performance Track Line */}
          <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-[2px] bg-surface-800 z-0" />

          {filteredDays.map((day) => {
            const isDone = isDayCompleted(day.id);
            const isToday = day.day_number === currentDayNumber;
            const isMilestone = [10, 25, 50, 75, 100].includes(day.day_number);

            return (
              <div key={day.id} className="relative z-10 flex items-start space-x-3 sm:space-x-5 group">
                
                {/* Athletic Timeline Node */}
                <button
                  onClick={() => handleSelectDay(day)}
                  className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 rounded-xl flex flex-col items-center justify-center transition-all duration-150 relative select-none cursor-pointer ${
                    isDone
                      ? 'bg-volt-500 text-black shadow-[0_0_18px_rgba(204,255,0,0.35)] scale-100 group-hover:scale-105'
                      : isToday
                        ? 'bg-surface-900 border-2 border-volt-400 text-volt-400 shadow-[0_0_20px_rgba(204,255,0,0.25)] animate-pulse'
                        : 'bg-surface-950 border border-surface-800 text-surface-400 group-hover:border-surface-700 group-hover:text-surface-200'
                  }`}
                >
                  {isDone ? (
                    <Icons.Check size={26} className="text-black stroke-[3]" />
                  ) : (
                    <>
                      <span className="font-athletic text-[10px] sm:text-xs font-black uppercase tracking-tight opacity-70">
                        DAY
                      </span>
                      <span className="font-athletic font-black text-base sm:text-xl leading-none">
                        {String(day.day_number).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </button>

                {/* Day Training Details Card */}
                <div
                  onClick={() => handleSelectDay(day)}
                  className={`flex-1 p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                    isToday
                      ? 'bg-surface-900 border-volt-500/50 shadow-[0_0_25px_rgba(204,255,0,0.1)]'
                      : isDone
                        ? 'bg-surface-900/60 border-surface-800 hover:border-surface-700'
                        : 'bg-surface-950/60 border-surface-850 hover:border-surface-750'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-athletic font-extrabold uppercase tracking-wider ${
                        day.day_type === 'gym'
                          ? 'bg-volt-500/10 text-volt-400 border border-volt-500/30'
                          : day.day_type === 'football'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-surface-800 text-surface-400 border border-surface-700'
                      }`}>
                        {day.day_type === 'gym' ? '🏋️ GYM TRAINING' : day.day_type === 'football' ? '⚽ FOOTBALL MATCH' : '💤 ACTIVE RECOVERY'}
                      </span>

                      {isToday && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-athletic font-black bg-volt-500 text-black uppercase tracking-wider shadow-[0_0_10px_rgba(204,255,0,0.4)]">
                          TODAY'S TARGET
                        </span>
                      )}

                      {isMilestone && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-athletic font-black bg-amber-500/15 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                          🏆 MILESTONE {day.day_number}
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-mono text-surface-400 font-semibold">
                      {formatShortDate(day.date)} // {day.day_of_week}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-athletic font-black uppercase text-white tracking-wide group-hover:text-volt-400 transition-colors">
                        {day.workout_name}
                      </h3>
                      {day.day_type === 'gym' && (
                        <p className="text-xs text-surface-400 font-mono mt-0.5">
                          {day.exercises.length} Exercises // Heavy Progressive Sets
                        </p>
                      )}
                    </div>

                    <button className="px-3 py-1.5 rounded-lg text-xs font-athletic font-extrabold uppercase tracking-wider bg-surface-850 hover:bg-surface-750 text-surface-200 border border-surface-750 group-hover:border-volt-500/40 group-hover:text-white transition-all">
                      {isDone ? 'VIEW LOG →' : isToday ? 'EXECUTE →' : 'PREVIEW →'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. ATHLETIC GRID MATRIX VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2.5">
          {filteredDays.map((day) => {
            const isDone = isDayCompleted(day.id);
            const isToday = day.day_number === currentDayNumber;

            let cardClass = 'bg-surface-950/70 border-surface-850 hover:border-surface-700';
            let statusBadge = 'bg-surface-900 text-surface-500';
            let statusText = 'UPCOMING';

            if (isDone) {
              cardClass = 'bg-surface-900 border-volt-500/40 shadow-[0_0_12px_rgba(204,255,0,0.06)]';
              statusBadge = 'bg-volt-500/15 text-volt-400 font-black';
              statusText = 'COMPLETED';
            } else if (isToday) {
              cardClass = 'bg-surface-900 border-volt-400 shadow-[0_0_18px_rgba(204,255,0,0.15)] ring-1 ring-volt-400';
              statusBadge = 'bg-volt-500 text-black font-black';
              statusText = 'TODAY';
            }

            return (
              <div
                key={day.id}
                onClick={() => handleSelectDay(day)}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all cursor-pointer select-none group active:scale-95 ${cardClass}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-athletic text-sm font-black text-white group-hover:text-volt-400 transition-colors">
                    DAY {String(day.day_number).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-surface-500">
                    {formatShortDate(day.date)}
                  </span>
                </div>

                <div className="my-1">
                  <div className="text-xs font-athletic font-extrabold uppercase text-surface-200 line-clamp-1">
                    {day.workout_name}
                  </div>
                  <div className="text-[10px] font-mono text-surface-400">
                    {day.day_of_week}
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-surface-800/80 flex items-center justify-between">
                  <span className={`text-[9px] font-athletic font-bold px-1.5 py-0.5 rounded tracking-wider ${statusBadge}`}>
                    {statusText}
                  </span>
                  {day.day_type === 'gym' && (
                    <span className="text-[10px] font-mono text-surface-500">
                      {day.exercises.length}ex
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
