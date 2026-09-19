import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { formatDisplayDate, ALL_100_DAYS } from '../../utils/schedule';

type AnyTab = 'dashboard' | 'workout' | 'calendar' | 'more' | 'history' | 'progress' | 'challenge' | 'settings';

interface DashboardViewProps {
  onNavigate: (tab: AnyTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    currentDayNumber,
    setSelectedDayNumber,
    todayWorkoutDay,
    stats,
    isDayCompleted,
    partner
  } = useFitness();

  const isTodayDone = isDayCompleted(todayWorkoutDay.id);

  const nextRestDay = ALL_100_DAYS.slice(currentDayNumber).find(d => d.day_type === 'rest');
  const nextFootballDay = ALL_100_DAYS.slice(currentDayNumber).find(d => d.day_type === 'football');

  const handleStartTodayWorkout = () => {
    setSelectedDayNumber(currentDayNumber);
    onNavigate('workout');
  };

  const currentWeekDays = [
    { day: 'Mon', routine: 'Chest + Tri', type: 'gym' },
    { day: 'Tue', routine: 'Football', type: 'football' },
    { day: 'Wed', routine: 'Back + Bi', type: 'gym' },
    { day: 'Thu', routine: 'Full Body', type: 'gym' },
    { day: 'Fri', routine: 'Rest Day', type: 'rest' },
    { day: 'Sat', routine: 'Legs + Delt', type: 'gym' },
    { day: 'Sun', routine: 'Chest + Back', type: 'gym' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">

      {/* 1. DUOLINGO-STYLE 100-DAY PROGRESS BANNER */}
      <div className="card-duo p-5 sm:p-6 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-extrabold tracking-wider uppercase text-surface-400">
            100 Day Fitness Quest
          </span>
          <span className="text-xs font-mono text-brand-400 font-black">
            {currentDayNumber}% Complete
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-2xl sm:text-3xl font-black font-mono text-surface-100 uppercase tracking-tight">
            Day {currentDayNumber} of 100
          </h1>
          <span className="text-xs font-mono text-surface-400 font-semibold hidden sm:inline">
            September 19 → December 27
          </span>
        </div>

        {/* 3D Progress Bar */}
        <div className="w-full h-4 bg-surface-950 rounded-full overflow-hidden border-2 border-surface-800 p-0.5">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            style={{ width: `${currentDayNumber}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-surface-500 font-bold">
          <span>Day 1 (Sep 19)</span>
          <span className="text-brand-400">🔥 Day {currentDayNumber} Active</span>
          <span>Day 100 (Dec 27)</span>
        </div>
      </div>

      {/* 2. TODAY'S DUOLINGO MISSION CARD */}
      <div className="bg-surface-900 border-2 border-brand-500 border-b-6 border-b-brand-600 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-brand-300 bg-brand-500/20 px-3 py-1 rounded-xl border border-brand-500/40">
                Today's Mission
              </span>
              <span className="text-xs font-mono text-surface-400 font-semibold">
                {formatDisplayDate(todayWorkoutDay.date)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-surface-100 font-mono">
              {todayWorkoutDay.workout_name}
            </h2>

            {todayWorkoutDay.day_type === 'gym' ? (
              <div className="flex items-center space-x-4 text-xs font-mono text-surface-300 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Icons.Activity size={16} className="text-brand-400" />
                  <span>{todayWorkoutDay.exercises.length} exercises</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1.5">
                  <Icons.Clock size={16} className="text-surface-400" />
                  <span>~60 minutes</span>
                </span>
              </div>
            ) : todayWorkoutDay.day_type === 'football' ? (
              <p className="text-xs font-mono text-surface-300 font-bold">
                ⚽ Football match & sprint conditioning. 10 min warm-up required.
              </p>
            ) : (
              <p className="text-xs font-mono text-surface-300 font-bold">
                💤 Active recovery, light mobility, and muscle restoration.
              </p>
            )}
          </div>

          {/* 3D Chunky Action Button */}
          <div className="shrink-0 flex items-center space-x-3">
            {isTodayDone ? (
              <div className="flex items-center space-x-2 px-6 py-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 border-b-4 border-b-emerald-600 text-emerald-400 font-mono text-xs font-black uppercase tracking-wider">
                <Icons.CheckCircle size={20} />
                <span>Today Completed ✓</span>
              </div>
            ) : (
              <button
                onClick={handleStartTodayWorkout}
                className="btn-duo-primary px-8 py-4 text-sm font-black uppercase tracking-wider shadow-lg flex items-center space-x-2"
              >
                <span>
                  {todayWorkoutDay.day_type === 'gym' ? 'Start Training' : 'View Protocol'}
                </span>
                <Icons.ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. DUOLINGO CHUNKY STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Current Streak */}
        <div className="card-duo p-4">
          <div className="flex items-center justify-between text-surface-400 text-xs font-mono font-bold mb-1">
            <span>Streak</span>
            <Icons.Fire size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-400">
            {stats.currentStreak} <span className="text-xs text-surface-400 font-bold">days</span>
          </div>
          <div className="text-[11px] text-surface-500 font-mono mt-1 font-semibold">
            Longest: {stats.longestStreak} days
          </div>
        </div>

        {/* Workouts Completed */}
        <div className="card-duo p-4">
          <div className="flex items-center justify-between text-surface-400 text-xs font-mono font-bold mb-1">
            <span>Gym Workouts</span>
            <Icons.Dumbbell size={18} className="text-brand-400" />
          </div>
          <div className="text-2xl font-black font-mono text-surface-100">
            {stats.workoutsCompleted}
          </div>
          <div className="text-[11px] text-surface-500 font-mono mt-1 font-semibold">
            + {stats.footballSessions} football
          </div>
        </div>

        {/* Consistency */}
        <div className="card-duo p-4">
          <div className="flex items-center justify-between text-surface-400 text-xs font-mono font-bold mb-1">
            <span>Consistency</span>
            <Icons.TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {stats.consistencyPercentage}%
          </div>
          <div className="text-[11px] text-surface-500 font-mono mt-1 font-semibold">
            {stats.totalDaysCompleted} / {currentDayNumber} logged
          </div>
        </div>

        {/* Next Events */}
        <div className="card-duo p-4">
          <div className="flex items-center justify-between text-surface-400 text-xs font-mono font-bold mb-1">
            <span>Next Events</span>
            <Icons.Calendar size={18} className="text-surface-400" />
          </div>
          <div className="text-xs font-mono font-bold space-y-1 mt-1">
            <div className="flex justify-between">
              <span className="text-surface-400">Rest:</span>
              <span className="text-surface-200">
                {nextRestDay ? `Day ${nextRestDay.day_number}` : 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">Football:</span>
              <span className="text-surface-200">
                {nextFootballDay ? `Day ${nextFootballDay.day_number}` : 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WEEKLY TRAINING SPLIT CHUNKY CARDS */}
      <div className="card-duo p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-surface-100 uppercase tracking-tight font-mono">
              Weekly Routine Split
            </h3>
            <p className="text-xs font-mono text-surface-400 font-semibold">
              Fixed 7-day progressive athletic cycle
            </p>
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="btn-duo-secondary px-3.5 py-1.5 text-xs font-mono flex items-center space-x-1.5"
          >
            <span>View 100-Day Path</span>
            <Icons.ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {currentWeekDays.map((item, idx) => {
            const isGym = item.type === 'gym';
            const isFootball = item.type === 'football';

            return (
              <div
                key={idx}
                className={`p-3 rounded-2xl border-2 border-b-4 flex flex-col justify-between transition-all ${
                  isGym
                    ? 'bg-surface-950/80 border-surface-800 border-b-surface-950'
                    : isFootball
                    ? 'bg-emerald-950/30 border-emerald-800/80 border-b-emerald-950'
                    : 'bg-surface-950/40 border-surface-850 border-b-surface-950'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-xs text-surface-200">
                    {item.day}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-lg font-bold uppercase ${
                    isGym
                      ? 'bg-surface-800 text-surface-300'
                      : isFootball
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-surface-800 text-surface-500'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="text-xs font-bold text-surface-300 leading-tight">
                  {item.routine}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TWO-PERSON CO-OP SNAPSHOT */}
      <div className="card-duo p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border-2 border-brand-500/40 border-b-4 border-b-brand-600 flex items-center justify-center text-brand-300">
            <Icons.Users size={24} />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-surface-400 font-bold">
              2-Person Co-Op Challenge
            </div>
            <div className="text-sm font-extrabold text-surface-100 mt-0.5 font-mono">
              You (Day {currentDayNumber} · {stats.workoutsCompleted} workouts) vs {partner.name} (Day {partner.currentDay} · {partner.workoutsCompleted} workouts)
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('challenge')}
          className="btn-duo-secondary px-4 py-2.5 text-xs font-mono"
        >
          View Partner Comparison
        </button>
      </div>

    </div>
  );
};
