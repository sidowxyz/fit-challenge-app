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

  const currentWeekDays = ALL_100_DAYS.slice(0, 7).map(d => ({
    day: d.day_of_week.slice(0, 3).toUpperCase(),
    routine: d.workout_name.toUpperCase(),
    type: d.day_type
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* 1. ATHLETIC CAMPAIGN PROGRESSION BANNER */}
      <div className="card-athletic p-5 sm:p-6 border border-surface-800 bg-surface-900 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-volt-500 shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
            <span className="text-xs font-athletic font-black tracking-widest uppercase text-volt-400">
              100-DAY PRO ATHLETIC CAMPAIGN
            </span>
          </div>
          <span className="text-xs font-athletic font-black text-volt-400 uppercase tracking-wider">
            {currentDayNumber}% COMPLETED
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <h1 className="text-3xl sm:text-4xl font-black font-athletic text-white uppercase tracking-tight">
            DAY {String(currentDayNumber).padStart(2, '0')} <span className="text-surface-500 text-xl font-normal">// 100</span>
          </h1>
          <span className="text-xs font-mono text-surface-400 hidden sm:inline">
            SEP 19 → DEC 27, 2026
          </span>
        </div>

        {/* Athletic Progress Bar with Glow */}
        <div className="w-full h-3 bg-surface-950 rounded-full overflow-hidden border border-surface-800 p-0.5">
          <div 
            className="h-full bg-volt-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(204,255,0,0.8)]"
            style={{ width: `${currentDayNumber}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-athletic font-bold uppercase tracking-wider text-surface-400">
          <span>DAY 01 (SEP 19)</span>
          <span className="text-volt-400">⚡ PHASE {Math.min(4, Math.ceil(currentDayNumber / 25))} IN PROGRESS</span>
          <span>DAY 100 (DEC 27)</span>
        </div>
      </div>

      {/* 2. TODAY'S WORKOUT MISSION CARD */}
      <div className="card-athletic-volt p-6 relative overflow-hidden bg-gradient-to-r from-surface-900 via-surface-900 to-surface-850">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-athletic font-black uppercase tracking-wider text-black bg-volt-500 px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(204,255,0,0.3)]">
                TODAY'S COMBAT TARGET
              </span>
              <span className="text-xs font-mono text-surface-400">
                {formatDisplayDate(todayWorkoutDay.date)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-athletic">
              {todayWorkoutDay.workout_name}
            </h2>

            {todayWorkoutDay.day_type === 'gym' ? (
              <div className="flex items-center space-x-4 text-xs font-mono text-surface-300 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Icons.Activity size={16} className="text-volt-400" />
                  <span>{todayWorkoutDay.exercises.length} EXERCISES</span>
                </span>
                <span>·</span>
                <span className="flex items-center space-x-1.5">
                  <Icons.Clock size={16} className="text-surface-400" />
                  <span>~60 MIN TARGET DURATION</span>
                </span>
              </div>
            ) : todayWorkoutDay.day_type === 'football' ? (
              <p className="text-xs font-mono text-surface-300 font-bold">
                ⚽ High-Intensity Football match & sprint agility protocol.
              </p>
            ) : (
              <p className="text-xs font-mono text-surface-300 font-bold">
                💤 Active neuromuscular recovery and mobility reset.
              </p>
            )}
          </div>

          {/* Athletic Action Button */}
          <div className="shrink-0 flex items-center space-x-3">
            {isTodayDone ? (
              <div className="flex items-center space-x-2 px-5 py-3 rounded-lg bg-volt-500/15 border border-volt-500/50 text-volt-400 font-athletic text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                <Icons.CheckCircle size={20} className="text-volt-400" />
                <span>TODAY'S TARGET COMPLETED ✓</span>
              </div>
            ) : (
              <button
                onClick={handleStartTodayWorkout}
                className="btn-athletic-primary px-7 py-3 text-base font-athletic font-black uppercase tracking-wider flex items-center space-x-2"
              >
                <span>
                  {todayWorkoutDay.day_type === 'gym' ? 'EXECUTE WORKOUT' : 'OPEN PROTOCOL'}
                </span>
                <Icons.ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE TELEMETRY STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Current Streak */}
        <div className="card-athletic p-4 border border-surface-800">
          <div className="flex items-center justify-between text-surface-400 text-xs font-athletic font-bold uppercase tracking-wider mb-1">
            <span>ACTIVE STREAK</span>
            <Icons.Fire size={18} className="text-amber-400" />
          </div>
          <div className="text-3xl font-black font-athletic text-amber-400">
            {stats.currentStreak} <span className="text-xs text-surface-400 font-normal font-mono">DAYS</span>
          </div>
          <div className="text-[10px] text-surface-500 font-mono mt-1">
            RECORD: {stats.longestStreak} DAYS
          </div>
        </div>

        {/* Workouts Completed */}
        <div className="card-athletic p-4 border border-surface-800">
          <div className="flex items-center justify-between text-surface-400 text-xs font-athletic font-bold uppercase tracking-wider mb-1">
            <span>GYM SESSIONS</span>
            <Icons.Dumbbell size={18} className="text-volt-400" />
          </div>
          <div className="text-3xl font-black font-athletic text-white">
            {stats.workoutsCompleted}
          </div>
          <div className="text-[10px] text-surface-500 font-mono mt-1">
            + {stats.footballSessions} FOOTBALL MATCHES
          </div>
        </div>

        {/* Consistency */}
        <div className="card-athletic p-4 border border-surface-800">
          <div className="flex items-center justify-between text-surface-400 text-xs font-athletic font-bold uppercase tracking-wider mb-1">
            <span>COMPLIANCE RATE</span>
            <Icons.TrendingUp size={18} className="text-volt-400" />
          </div>
          <div className="text-3xl font-black font-athletic text-volt-400">
            {stats.consistencyPercentage}%
          </div>
          <div className="text-[10px] text-surface-500 font-mono mt-1">
            {stats.totalDaysCompleted} / {currentDayNumber} LOGGED
          </div>
        </div>

        {/* Next Events */}
        <div className="card-athletic p-4 border border-surface-800">
          <div className="flex items-center justify-between text-surface-400 text-xs font-athletic font-bold uppercase tracking-wider mb-1">
            <span>UPCOMING SPLIT</span>
            <Icons.Calendar size={18} className="text-surface-400" />
          </div>
          <div className="text-xs font-mono font-bold space-y-1 mt-1">
            <div className="flex justify-between">
              <span className="text-surface-400">REST:</span>
              <span className="text-surface-200">
                {nextRestDay ? `DAY ${nextRestDay.day_number}` : 'NONE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-400">MATCH:</span>
              <span className="text-surface-200">
                {nextFootballDay ? `DAY ${nextFootballDay.day_number}` : 'NONE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. WEEKLY TRAINING SPLIT CYCLE */}
      <div className="card-athletic p-5 sm:p-6 space-y-4 border border-surface-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider font-athletic">
              7-DAY ATHLETIC ROTATION
            </h3>
            <p className="text-xs font-mono text-surface-400">
              High-frequency training split with weekly football integration
            </p>
          </div>
          <button
            onClick={() => onNavigate('calendar')}
            className="btn-athletic-secondary px-3 py-1.5 text-xs flex items-center space-x-1.5"
          >
            <span>FULL 100-DAY TIMELINE</span>
            <Icons.ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {currentWeekDays.map((item, idx) => {
            const isGym = item.type === 'gym';
            const isFootball = item.type === 'football';

            return (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  isGym
                    ? 'bg-surface-900 border-surface-800 hover:border-surface-700'
                    : isFootball
                    ? 'bg-emerald-950/20 border-emerald-800/60'
                    : 'bg-surface-950 border-surface-850'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-athletic font-black text-sm text-surface-200">
                    {item.day}
                  </span>
                  <span className={`text-[9px] font-athletic font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    isGym
                      ? 'bg-surface-800 text-surface-300'
                      : isFootball
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-surface-800 text-surface-500'
                  }`}>
                    {item.type}
                  </span>
                </div>
                <div className="text-xs font-athletic font-extrabold uppercase text-surface-300 leading-tight">
                  {item.routine}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. TWO-PERSON ATHLETIC CO-OP SNAPSHOT */}
      <div className="card-athletic p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-surface-800">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-volt-500/10 border border-volt-500/30 flex items-center justify-center text-volt-400 shadow-[0_0_15px_rgba(204,255,0,0.1)]">
            <Icons.Users size={24} />
          </div>
          <div>
            <div className="text-[10px] font-athletic font-black uppercase tracking-wider text-volt-400">
              DUAL ATHLETE CO-OP CHALLENGE
            </div>
            <div className="text-sm font-athletic font-extrabold text-surface-100 uppercase tracking-wide mt-0.5">
              YOU (DAY {currentDayNumber} · {stats.workoutsCompleted} LOGS) VS {partner.name.toUpperCase()} (DAY {partner.currentDay} · {partner.workoutsCompleted} LOGS)
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigate('challenge')}
          className="btn-athletic-secondary px-4 py-2 text-xs"
        >
          COMPARE ATHLETE STATS →
        </button>
      </div>

    </div>
  );
};
