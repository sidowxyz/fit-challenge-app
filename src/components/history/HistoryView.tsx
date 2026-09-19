import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { formatDisplayDate } from '../../utils/schedule';
import { formatWeight } from '../../lib/storage';

type AnyTab = 'dashboard' | 'workout' | 'calendar' | 'more' | 'history' | 'progress' | 'challenge' | 'settings';

interface HistoryViewProps {
  onNavigate: (tab: AnyTab) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const {
    completions,
    logs,
    setSelectedDayNumber,
    currentDayNumber,
    preferences,
    allDays
  } = useFitness();

  const loggedDays = allDays.filter((day) => {
    const isCompleted = completions.some(c => c.workout_day_id === day.id && c.completed);
    const hasLogs = logs.some(l => l.workout_day_id === day.id);
    return isCompleted || hasLogs;
  }).sort((a, b) => b.day_number - a.day_number);

  const handleOpenDay = (dayNumber: number) => {
    setSelectedDayNumber(dayNumber);
    onNavigate('workout');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header */}
      <div className="card-duo p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-black mb-1">
            Training Records
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-surface-100 font-mono">
            Workout History
          </h1>
          <p className="text-xs font-mono text-surface-400 font-semibold mt-1">
            Chronological log of completed workouts and performance metrics.
          </p>
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-surface-950 border-2 border-surface-800 text-xs font-mono font-bold text-surface-300 self-start sm:self-auto">
          Logged: <strong className="text-brand-400 font-black">{loggedDays.length} sessions</strong>
        </div>
      </div>

      {/* Empty State */}
      {loggedDays.length === 0 ? (
        <div className="card-duo p-8 sm:p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-950 border-2 border-surface-800 flex items-center justify-center mx-auto text-surface-400">
            <Icons.History size={32} />
          </div>
          <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight font-mono">
            No Workouts Logged Yet
          </h3>
          <p className="text-xs font-mono text-surface-400 max-w-sm mx-auto leading-relaxed font-semibold">
            Complete your first workout to start building your chronological history.
          </p>
          <button
            onClick={() => {
              setSelectedDayNumber(currentDayNumber);
              onNavigate('workout');
            }}
            className="btn-duo-primary px-6 py-3 text-xs font-black uppercase tracking-wider flex items-center space-x-2 mx-auto"
          >
            <span>Start Today's Workout</span>
            <Icons.ArrowRight size={16} />
          </button>
        </div>
      ) : (
        /* Chronological Log List */
        <div className="space-y-4">
          {loggedDays.map((day) => {
            const dayLogs = logs.filter(l => l.workout_day_id === day.id);
            const isDone = completions.some(c => c.workout_day_id === day.id && c.completed);

            const exerciseMap = new Map<string, typeof dayLogs>();
            dayLogs.forEach(l => {
              const current = exerciseMap.get(l.exercise_id) || [];
              exerciseMap.set(l.exercise_id, [...current, l]);
            });

            return (
              <div
                key={day.id}
                onClick={() => handleOpenDay(day.day_number)}
                className="card-duo-interactive p-5 transition-all"
              >
                {/* Top info */}
                <div className="flex items-start justify-between border-b-2 border-surface-800 pb-3 mb-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono text-surface-400 font-bold">
                      <span>Day {day.day_number}</span>
                      <span>·</span>
                      <span>{formatDisplayDate(day.date)}</span>
                    </div>
                    <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight group-hover:text-brand-300 transition-colors mt-0.5 font-mono">
                      {day.workout_name}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isDone ? (
                      <span className="flex items-center space-x-1.5 text-emerald-400 text-xs font-mono font-black bg-emerald-500/15 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        <Icons.CheckCircle size={15} />
                        <span>Completed ✓</span>
                      </span>
                    ) : (
                      <span className="text-xs font-mono font-bold text-surface-400 bg-surface-950 px-2.5 py-1 rounded-lg border border-surface-800">
                        In Progress
                      </span>
                    )}
                    <Icons.ChevronRight size={18} className="text-surface-500 group-hover:text-surface-200 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Logged Exercise Summaries */}
                {day.day_type === 'gym' ? (
                  exerciseMap.size > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {Array.from(exerciseMap.entries()).map(([exId, setLogs]) => {
                        const exTemplate = day.exercises.find(e => e.id === exId);
                        const exName = exTemplate?.name || 'Exercise';
                        const sortedSets = setLogs.sort((a, b) => a.set_number - b.set_number);
                        
                        const setsFormatted = sortedSets.map(s => s.reps).join('/');
                        const topWeight = Math.max(...sortedSets.map(s => s.weight));
                        const weightDisplay = formatWeight(topWeight, preferences.units);

                        return (
                          <div key={exId} className="bg-surface-950 p-3 rounded-xl border-2 border-surface-800/80 text-xs">
                            <div className="font-extrabold text-surface-200 truncate uppercase font-mono">
                              {exName}
                            </div>
                            <div className="font-mono text-surface-400 mt-1 flex items-center space-x-2 font-bold">
                              <span className="text-brand-400 font-black">
                                {weightDisplay.value} {preferences.units}
                              </span>
                              <span>·</span>
                              <span className="text-surface-300">
                                {setsFormatted} reps ({sortedSets.length} sets)
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-surface-500 italic font-medium">
                      Completed without set breakdown.
                    </p>
                  )
                ) : (
                  <p className="text-xs font-mono text-surface-400 font-bold">
                    {day.day_type === 'football' ? '⚽ Football & Conditioning session logged.' : '💤 Rest & Recovery day honored.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
