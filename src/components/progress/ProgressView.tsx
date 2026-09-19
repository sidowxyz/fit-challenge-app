import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { TRACKED_PROGRESSION_LIFTS, formatShortDate } from '../../utils/schedule';
import { formatWeight } from '../../lib/storage';

export const ProgressView: React.FC = () => {
  const {
    currentDayNumber,
    stats,
    preferences,
    getExerciseHistory,
    completions,
    allDays
  } = useFitness();

  const [selectedLift, setSelectedLift] = useState<string>(TRACKED_PROGRESSION_LIFTS[0]);

  const liftHistory = getExerciseHistory(selectedLift);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayNameMapping: Record<string, string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun'
  };

  const dayCounts: Record<string, { completed: number; total: number }> = {
    Mon: { completed: 0, total: 0 },
    Tue: { completed: 0, total: 0 },
    Wed: { completed: 0, total: 0 },
    Thu: { completed: 0, total: 0 },
    Fri: { completed: 0, total: 0 },
    Sat: { completed: 0, total: 0 },
    Sun: { completed: 0, total: 0 },
  };

  for (let i = 0; i < currentDayNumber; i++) {
    const d = allDays[i];
    const key = dayNameMapping[d.day_of_week];
    if (key) {
      dayCounts[key].total++;
      if (completions.some(c => c.workout_day_id === d.id && c.completed) || d.day_type === 'rest') {
        dayCounts[key].completed++;
      }
    }
  }

  const maxWeight = liftHistory.length > 0 
    ? Math.max(...liftHistory.map(h => formatWeight(h.weight, preferences.units).value), 50)
    : 50;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-duo p-5 sm:p-6">
        <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-black mb-1">
          Performance Analytics
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-surface-100 font-mono">
          Progress & Overload
        </h1>
        <p className="text-xs font-mono text-surface-400 font-semibold mt-1">
          Track compound lift progression, challenge consistency, and weekly training volume.
        </p>
      </div>

      {/* 1. PROGRESSIVE OVERLOAD GUIDE CARD */}
      <div className="card-duo p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 text-surface-100">
          <Icons.Info size={20} className="text-brand-400" />
          <h2 className="text-base font-black uppercase tracking-tight font-mono">
            The 5 Rules of Progressive Overload
          </h2>
        </div>

        <p className="text-xs text-surface-300 leading-relaxed font-medium">
          Muscular development and strength adaptations occur when muscles are progressively challenged over time. Advance using one of the variables below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
          {[
            { title: 'More Reps', desc: 'Add 1-2 reps with identical weight until hitting upper rep bracket.' },
            { title: 'Higher Load', desc: 'Once max reps are achieved, increase weight by 1.25kg - 2.5kg.' },
            { title: 'Better Form', desc: 'Improve time under tension, deeper range of motion, and zero momentum.' },
            { title: 'Better Control', desc: 'Execute controlled 2-3 second eccentric (lowering) phases.' },
            { title: 'Consistency', desc: 'Show up without skipping scheduled gym and football sessions.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800 text-xs">
              <div className="font-mono font-black text-brand-400 mb-1">0{idx + 1}. {item.title}</div>
              <p className="text-surface-400 leading-snug font-medium">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Progression Example */}
        <div className="bg-surface-950 p-3.5 rounded-2xl border-2 border-surface-800 text-xs font-mono text-surface-400 flex flex-wrap items-center justify-between gap-2 font-bold">
          <span className="text-surface-200">Bench Press Progression Example:</span>
          <span>W1: 20kg × 8</span>
          <span>→</span>
          <span>W2: 20kg × 10</span>
          <span>→</span>
          <span>W3: 20kg × 12</span>
          <span>→</span>
          <span className="text-brand-400 font-black">W4: 22.5kg × 8 (New load!)</span>
        </div>
      </div>

      {/* 2. EXERCISE PROGRESSION 3D CHARTS */}
      <div className="card-duo p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-surface-100 uppercase tracking-tight font-mono">
              Compound Lift Progression
            </h3>
            <p className="text-xs font-mono text-surface-400 font-semibold">
              Logged peak load curves over 100 days
            </p>
          </div>

          {/* Lift Selector 3D Buttons */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-surface-950 rounded-2xl border-2 border-surface-800">
            {TRACKED_PROGRESSION_LIFTS.map((lift) => (
              <button
                key={lift}
                onClick={() => setSelectedLift(lift)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-extrabold transition-all ${
                  selectedLift === lift
                    ? 'bg-brand-500 text-surface-950 shadow-sm'
                    : 'text-surface-400 hover:text-surface-200'
                }`}
              >
                {lift}
              </button>
            ))}
          </div>
        </div>

        {/* Lift Progression Data View */}
        {liftHistory.length === 0 ? (
          <div className="py-12 text-center bg-surface-950/60 rounded-2xl border-2 border-dashed border-surface-800 text-xs font-mono text-surface-500 font-bold">
            <Icons.Dumbbell size={36} className="mx-auto text-surface-600 mb-2" />
            No sets logged for {selectedLift} yet. Log your next session to plot your progression curve!
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart Area */}
            <div className="p-4 sm:p-6 bg-surface-950 rounded-2xl border-2 border-surface-800">
              <div className="h-48 flex items-end justify-between gap-2.5 pt-6">
                {liftHistory.map((item, idx) => {
                  const weightDisplay = formatWeight(item.weight, preferences.units);
                  const heightPercent = Math.max(15, Math.min(100, Math.round((weightDisplay.value / (maxWeight * 1.15)) * 100)));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-9 px-2.5 py-1 bg-surface-900 border-2 border-brand-500 rounded-xl text-[10px] font-mono text-surface-100 font-bold pointer-events-none transition-opacity whitespace-nowrap z-10 shadow-lg">
                        {weightDisplay.value} {preferences.units} × {item.reps} reps
                      </div>

                      <div 
                        className="w-full max-w-[36px] bg-brand-500 hover:bg-brand-400 rounded-t-xl transition-all duration-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                        style={{ height: `${heightPercent}%` }}
                      />

                      <span className="text-[10px] font-mono font-bold text-surface-400 mt-2">
                        D{item.dayNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Historical Logged Rows */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-surface-400 font-black px-1">
                Recorded Sessions ({liftHistory.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {liftHistory.map((h, i) => {
                  const w = formatWeight(h.weight, preferences.units);
                  return (
                    <div key={i} className="p-3 rounded-2xl bg-surface-950 border-2 border-surface-800 flex items-center justify-between text-xs font-mono font-bold">
                      <div>
                        <span className="text-surface-300">Day {h.dayNumber}</span>
                        <span className="text-surface-600 mx-1.5">·</span>
                        <span className="text-surface-500">{formatShortDate(h.date)}</span>
                      </div>
                      <div className="text-brand-400 font-black">
                        {w.value} {preferences.units} × {h.reps}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. WEEKLY CONSISTENCY & CHALLENGE METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Weekly Consistency Bar Chart */}
        <div className="card-duo p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-surface-100 uppercase tracking-tight font-mono">
            Weekly Consistency
          </h3>
          <p className="text-xs font-mono text-surface-400 font-semibold">
            Adherence across days of the week
          </p>

          <div className="space-y-3 pt-2">
            {daysOfWeek.map((dayName) => {
              const data = dayCounts[dayName];
              const pct = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
              const isRestDay = dayName === 'Fri';

              return (
                <div key={dayName} className="flex items-center space-x-3 text-xs font-mono font-bold">
                  <span className="w-8 text-surface-200 font-black">{dayName}</span>
                  <div className="flex-1 h-3.5 bg-surface-950 rounded-full overflow-hidden border-2 border-surface-800 p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isRestDay ? 'bg-surface-600' : 'bg-brand-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-surface-300 font-black">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Challenge Completion Breakdown */}
        <div className="card-duo p-5 sm:p-6 space-y-4">
          <h3 className="text-base font-black text-surface-100 uppercase tracking-tight font-mono">
            Workout Completion
          </h3>
          <p className="text-xs font-mono text-surface-400 font-semibold">
            Current challenge stats through Day {currentDayNumber}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-surface-950 border-2 border-surface-800">
              <span className="text-xs font-mono text-surface-400 font-bold">Gym Workouts</span>
              <div className="text-2xl font-black font-mono text-surface-100 mt-1">
                {stats.workoutsCompleted}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-950 border-2 border-surface-800">
              <span className="text-xs font-mono text-surface-400 font-bold">Football Sessions</span>
              <div className="text-2xl font-black font-mono text-surface-100 mt-1">
                {stats.footballSessions}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-950 border-2 border-surface-800">
              <span className="text-xs font-mono text-surface-400 font-bold">Rest Honored</span>
              <div className="text-2xl font-black font-mono text-surface-100 mt-1">
                {stats.restDaysLogged}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-950 border-2 border-surface-800">
              <span className="text-xs font-mono text-surface-400 font-bold">Consistency Score</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {stats.consistencyPercentage}%
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
