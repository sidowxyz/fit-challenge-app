import React, { useState } from 'react';
import { Icons } from '../icons/HugeIcon';
import { useFitness } from '../../context/FitnessContext';
import { ExerciseCard } from './ExerciseCard';
import { ExerciseLogModal } from './ExerciseLogModal';
import { ExerciseTemplate } from '../../types';
import { formatDisplayDate } from '../../utils/schedule';

interface TodayWorkoutViewProps {
  onNavigateToCalendar?: () => void;
}

export const TodayWorkoutView: React.FC<TodayWorkoutViewProps> = ({ onNavigateToCalendar }) => {
  const {
    currentDayNumber,
    selectedDayNumber,
    setSelectedDayNumber,
    selectedWorkoutDay,
    getExerciseLogsForDay,
    preferences,
    completeWorkout,
    isDayCompleted,
    getWorkoutProgress
  } = useFitness();

  const [activeLogExercise, setActiveLogExercise] = useState<ExerciseTemplate | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isToday = selectedDayNumber === currentDayNumber;
  const isCompleted = isDayCompleted(selectedWorkoutDay.id);
  const progress = getWorkoutProgress(selectedWorkoutDay);

  const handleNextDay = () => {
    if (selectedDayNumber < 100) {
      setSelectedDayNumber(selectedDayNumber + 1);
    }
  };

  const handlePrevDay = () => {
    if (selectedDayNumber > 1) {
      setSelectedDayNumber(selectedDayNumber - 1);
    }
  };

  const handleConfirmCompletion = async () => {
    setIsSubmitting(true);
    await completeWorkout(selectedWorkoutDay.id, true);
    setIsSubmitting(false);
    setShowConfirmModal(false);
  };

  const handleUnmarkCompletion = async () => {
    setIsSubmitting(true);
    await completeWorkout(selectedWorkoutDay.id, false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      
      {/* Day Navigation & Header Card */}
      <div className="card-duo p-5 sm:p-6">
        
        {/* Navigation Bar between days */}
        <div className="flex items-center justify-between border-b-2 border-surface-800 pb-4 mb-4">
          <button
            onClick={handlePrevDay}
            disabled={selectedDayNumber <= 1}
            className="btn-duo-secondary px-3 py-1.5 text-xs font-mono disabled:opacity-30 flex items-center space-x-1"
          >
            <Icons.ChevronLeft size={16} />
            <span className="hidden sm:inline">Day {selectedDayNumber - 1}</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-surface-950 border-2 border-surface-800 font-black text-surface-200">
              Day {selectedDayNumber} of 100
            </span>
            {!isToday && (
              <button
                onClick={() => setSelectedDayNumber(currentDayNumber)}
                className="text-[11px] font-mono text-brand-400 hover:underline px-2 py-0.5 font-bold"
              >
                Back to Today (Day {currentDayNumber})
              </button>
            )}
          </div>

          <button
            onClick={handleNextDay}
            disabled={selectedDayNumber >= 100}
            className="btn-duo-secondary px-3 py-1.5 text-xs font-mono disabled:opacity-30 flex items-center space-x-1"
          >
            <span className="hidden sm:inline">Day {selectedDayNumber + 1}</span>
            <Icons.ChevronRight size={16} />
          </button>
        </div>

        {/* Workout Day Title & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-surface-400 font-bold mb-1">
              <span>{formatDisplayDate(selectedWorkoutDay.date)}</span>
              <span>·</span>
              <span className="uppercase text-brand-400 font-black">
                {selectedWorkoutDay.day_type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-surface-100 font-mono">
              {selectedWorkoutDay.workout_name}
            </h1>
          </div>

          {/* Quick Specs */}
          {selectedWorkoutDay.day_type === 'gym' && (
            <div className="flex items-center space-x-4 text-xs font-mono text-surface-300 font-bold">
              <div className="flex items-center space-x-1.5">
                <Icons.Activity size={16} className="text-brand-400" />
                <span>{selectedWorkoutDay.exercises.length} exercises</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Icons.Clock size={16} className="text-surface-400" />
                <span>~60 min</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GYM WORKOUT EXERCISES VIEW */}
      {selectedWorkoutDay.day_type === 'gym' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-surface-400 font-bold px-1">
            <span className="uppercase">Exercise Routine</span>
            <span className="text-brand-400">
              {progress.completedCount} / {progress.totalCount} completed ({progress.percentage}%)
            </span>
          </div>

          <div className="space-y-3">
            {selectedWorkoutDay.exercises.map((exercise, index) => {
              const exerciseLogs = getExerciseLogsForDay(selectedWorkoutDay.id, exercise.id);
              return (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  logs={exerciseLogs}
                  unit={preferences.units}
                  onOpenLogModal={(ex) => setActiveLogExercise(ex)}
                />
              );
            })}
          </div>

          {/* DUOLINGO 3D STICKY BOTTOM ACTION FOOTER */}
          <div className="sticky bottom-20 lg:bottom-4 z-30 mt-8 p-4 sm:p-5 rounded-3xl bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-mono text-surface-300 mb-2 font-bold">
                  <span className="uppercase tracking-wider text-[11px] text-surface-400">
                    Workout Quest Progress
                  </span>
                  <span className="text-surface-100 font-black">
                    {progress.completedCount} / {progress.totalCount} completed ({progress.percentage}%)
                  </span>
                </div>
                
                {/* 3D Progress Bar */}
                <div className="w-full h-3 bg-surface-950 rounded-full overflow-hidden border-2 border-surface-800 p-0.5">
                  <div 
                    className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center space-x-3 shrink-0">
                {isCompleted ? (
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center space-x-2 text-xs font-mono font-black text-emerald-300 bg-emerald-500/20 px-5 py-3 rounded-2xl border-2 border-emerald-500/50">
                      <Icons.CheckCircle size={18} />
                      <span>DAY COMPLETED ✓</span>
                    </div>
                    <button
                      onClick={handleUnmarkCompletion}
                      className="btn-duo-secondary p-3 rounded-2xl"
                      title="Reset completion"
                    >
                      <Icons.Reload size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="btn-duo-primary w-full sm:w-auto px-8 py-3.5 text-xs font-black uppercase tracking-wider"
                  >
                    Complete Workout
                  </button>
                )}
              </div>
            </div>

            {/* Completion feedback */}
            {isCompleted && (
              <div className="mt-3 pt-3 border-t-2 border-surface-800 text-xs font-mono text-surface-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold">
                <span className="text-surface-200">Workout completed for Day {selectedDayNumber} ✓</span>
                <span className="text-brand-400">Streak is active! 🔥</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTBALL DAY VIEW */}
      {selectedWorkoutDay.day_type === 'football' && (
        <div className="card-duo p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 text-brand-400">
            <span className="text-4xl">⚽</span>
            <div>
              <h2 className="text-xl font-black text-surface-100 uppercase tracking-tight font-mono">
                Football Conditioning Session
              </h2>
              <p className="text-xs font-mono text-surface-400 font-bold">
                No bodybuilding workout scheduled today.
              </p>
            </div>
          </div>

          <div className="bg-surface-950 p-4 sm:p-5 rounded-2xl border-2 border-surface-800 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-brand-400 font-black">
              Conditioning Protocol:
            </div>
            <ul className="space-y-2 text-sm text-surface-200 list-disc list-inside font-medium">
              {selectedWorkoutDay.instructions?.map((inst, idx) => (
                <li key={idx} className="leading-relaxed text-surface-300">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-surface-800">
            <span className="text-xs font-mono text-surface-400 font-bold">
              Cardiovascular conditioning & agility.
            </span>
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 px-4 py-2.5 rounded-2xl border-2 border-emerald-500/30">
                  <Icons.CheckCircle size={16} />
                  <span>Football Logged ✓</span>
                </div>
                <button
                  onClick={handleUnmarkCompletion}
                  className="btn-duo-secondary p-2.5 rounded-xl text-xs font-mono"
                >
                  <Icons.Reload size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => completeWorkout(selectedWorkoutDay.id, true)}
                className="btn-duo-primary px-6 py-3 text-xs font-black uppercase tracking-wider"
              >
                Log Football Completed
              </button>
            )}
          </div>
        </div>
      )}

      {/* REST DAY VIEW */}
      {selectedWorkoutDay.day_type === 'rest' && (
        <div className="card-duo p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-3 text-surface-300">
            <div className="w-12 h-12 rounded-2xl bg-surface-950 border-2 border-surface-800 flex items-center justify-center font-bold text-2xl">
              💤
            </div>
            <div>
              <h2 className="text-xl font-black text-surface-100 uppercase tracking-tight font-mono">
                Scheduled Rest & Recovery
              </h2>
              <p className="text-xs font-mono text-surface-400 font-bold">
                Recovery is part of training. Scheduled rest maintains your streak.
              </p>
            </div>
          </div>

          <div className="bg-surface-950 p-4 sm:p-5 rounded-2xl border-2 border-surface-800 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-surface-400 font-black">
              Recovery Checklist:
            </div>
            <ul className="space-y-2 text-sm text-surface-300 list-disc list-inside font-medium">
              {selectedWorkoutDay.instructions?.map((inst, idx) => (
                <li key={idx} className="leading-relaxed">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-surface-800">
            <span className="text-xs font-mono text-surface-400 font-bold">
              Streak is honored automatically.
            </span>
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-xs font-mono font-black text-emerald-400 bg-emerald-500/15 px-4 py-2.5 rounded-2xl border-2 border-emerald-500/30">
                  <Icons.CheckCircle size={16} />
                  <span>Rest Honored ✓</span>
                </div>
                <button
                  onClick={handleUnmarkCompletion}
                  className="btn-duo-secondary p-2.5 rounded-xl text-xs font-mono"
                >
                  <Icons.Reload size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => completeWorkout(selectedWorkoutDay.id, true)}
                className="btn-duo-secondary px-6 py-3 text-xs font-bold"
              >
                Mark Rest Honored
              </button>
            )}
          </div>
        </div>
      )}

      {/* EXERCISE LOGGING MODAL */}
      {activeLogExercise && (
        <ExerciseLogModal
          exercise={activeLogExercise}
          workoutDayId={selectedWorkoutDay.id}
          unit={preferences.units}
          onClose={() => setActiveLogExercise(null)}
        />
      )}

      {/* COMPLETE WORKOUT CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-surface-100 uppercase tracking-tight font-mono">
              Complete Workout?
            </h3>
            
            <p className="text-sm text-surface-300 leading-relaxed font-medium">
              You have logged <strong className="text-surface-100">{progress.completedCount} of {progress.totalCount}</strong> exercises for Day {selectedDayNumber} ({selectedWorkoutDay.workout_name}).
            </p>

            {progress.completedCount < progress.totalCount && (
              <div className="p-3 rounded-2xl bg-amber-500/15 border-2 border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                Note: Some exercises have unlogged sets. You can still confirm completion or finish logging.
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-duo-secondary px-4 py-2.5 text-xs font-mono"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmCompletion}
                disabled={isSubmitting}
                className="btn-duo-primary px-6 py-2.5 text-xs font-black uppercase tracking-wider"
              >
                {isSubmitting ? 'Confirming...' : 'Yes, Complete Quest'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
