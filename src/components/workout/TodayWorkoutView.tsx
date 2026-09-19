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
      <div className="card-athletic p-5 sm:p-6 border border-surface-800 bg-surface-900 shadow-xl">
        
        {/* Navigation Bar between days */}
        <div className="flex items-center justify-between border-b border-surface-800 pb-4 mb-4">
          <button
            onClick={handlePrevDay}
            disabled={selectedDayNumber <= 1}
            className="btn-athletic-secondary px-3 py-1.5 text-xs font-athletic disabled:opacity-30 flex items-center space-x-1"
          >
            <Icons.ChevronLeft size={16} />
            <span className="hidden sm:inline">DAY {selectedDayNumber - 1}</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-athletic px-3 py-1.5 rounded-lg bg-surface-950 border border-surface-800 font-black text-white tracking-wider">
              DAY {String(selectedDayNumber).padStart(2, '0')} // 100
            </span>
            {!isToday && (
              <button
                onClick={() => setSelectedDayNumber(currentDayNumber)}
                className="text-[11px] font-athletic font-bold uppercase text-volt-400 hover:underline px-2 py-0.5 tracking-wider"
              >
                BACK TO TODAY (DAY {currentDayNumber})
              </button>
            )}
          </div>

          <button
            onClick={handleNextDay}
            disabled={selectedDayNumber >= 100}
            className="btn-athletic-secondary px-3 py-1.5 text-xs font-athletic disabled:opacity-30 flex items-center space-x-1"
          >
            <span className="hidden sm:inline">DAY {selectedDayNumber + 1}</span>
            <Icons.ChevronRight size={16} />
          </button>
        </div>

        {/* Workout Day Title & Overview */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-surface-400 font-bold mb-1">
              <span>{formatDisplayDate(selectedWorkoutDay.date)}</span>
              <span>·</span>
              <span className="uppercase text-volt-400 font-black">
                {selectedWorkoutDay.day_type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-athletic">
              {selectedWorkoutDay.workout_name}
            </h1>
          </div>

          {/* Quick Specs */}
          {selectedWorkoutDay.day_type === 'gym' && (
            <div className="flex items-center space-x-4 text-xs font-mono text-surface-300 font-semibold">
              <div className="flex items-center space-x-1.5">
                <Icons.Activity size={16} className="text-volt-400" />
                <span>{selectedWorkoutDay.exercises.length} EXERCISES</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Icons.Clock size={16} className="text-surface-400" />
                <span>~60 MIN</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GYM WORKOUT EXERCISES VIEW */}
      {selectedWorkoutDay.day_type === 'gym' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-athletic font-bold tracking-wider text-surface-400 uppercase px-1">
            <span>TRAINING PROTOCOL</span>
            <span className="text-volt-400 font-black">
              {progress.completedCount} / {progress.totalCount} EXERCISES COMPLETED ({progress.percentage}%)
            </span>
          </div>

          <div className="space-y-2.5">
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

          {/* STICKY BOTTOM ACTION FOOTER */}
          <div className="sticky bottom-20 lg:bottom-4 z-30 mt-8 p-4 sm:p-5 rounded-2xl bg-surface-900/95 backdrop-blur-xl border border-surface-800 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs font-athletic text-surface-300 mb-2 font-bold uppercase tracking-wider">
                  <span className="text-surface-400">
                    SESSION PROGRESS
                  </span>
                  <span className="text-white font-black">
                    {progress.completedCount} / {progress.totalCount} ({progress.percentage}%)
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-surface-950 rounded-full overflow-hidden border border-surface-800 p-0.5">
                  <div 
                    className="h-full bg-volt-500 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(204,255,0,0.8)]"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center space-x-3 shrink-0">
                {isCompleted ? (
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center space-x-2 text-xs font-athletic font-black text-volt-400 bg-volt-500/15 px-5 py-2.5 rounded-lg border border-volt-500/40 shadow-[0_0_15px_rgba(204,255,0,0.15)] uppercase tracking-wider">
                      <Icons.CheckCircle size={18} className="text-volt-400" />
                      <span>SESSION LOGGED ✓</span>
                    </div>
                    <button
                      onClick={handleUnmarkCompletion}
                      className="btn-athletic-secondary p-2.5 rounded-lg text-surface-400 hover:text-white"
                      title="Reset completion"
                    >
                      <Icons.Reload size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="btn-athletic-primary w-full sm:w-auto px-7 py-3 text-sm font-athletic font-black uppercase tracking-wider shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                  >
                    COMPLETE WORKOUT SESSION
                  </button>
                )}
              </div>
            </div>

            {/* Completion feedback */}
            {isCompleted && (
              <div className="mt-3 pt-3 border-t border-surface-800 text-xs font-athletic uppercase tracking-wider text-surface-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold">
                <span className="text-surface-200">DAY {selectedDayNumber} VERIFIED COMPLETED</span>
                <span className="text-volt-400">STREAK INTACT // HIGH-OCTANE PERFORMANCE 🔥</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FOOTBALL DAY VIEW */}
      {selectedWorkoutDay.day_type === 'football' && (
        <div className="card-athletic p-6 sm:p-8 space-y-6 border border-surface-800">
          <div className="flex items-center space-x-3 text-volt-400">
            <span className="text-4xl">⚽</span>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-athletic">
                FOOTBALL CONDITIONING SESSION
              </h2>
              <p className="text-xs font-mono text-surface-400">
                Cardiovascular performance and high-intensity sprint conditioning.
              </p>
            </div>
          </div>

          <div className="bg-surface-950 p-4 sm:p-5 rounded-xl border border-surface-800 space-y-3">
            <div className="text-xs font-athletic uppercase tracking-wider text-volt-400 font-black">
              MATCHDAY CONDITIONING PROTOCOL:
            </div>
            <ul className="space-y-2 text-sm text-surface-200 list-disc list-inside font-medium font-mono">
              {selectedWorkoutDay.instructions?.map((inst, idx) => (
                <li key={idx} className="leading-relaxed text-surface-300">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-800">
            <span className="text-xs font-mono text-surface-400">
              Conditioning & agility metric tracking.
            </span>
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-xs font-athletic font-black text-volt-400 bg-volt-500/15 px-4 py-2 rounded-lg border border-volt-500/40 uppercase tracking-wider">
                  <Icons.CheckCircle size={16} />
                  <span>FOOTBALL LOGGED ✓</span>
                </div>
                <button
                  onClick={handleUnmarkCompletion}
                  className="btn-athletic-secondary p-2 rounded-lg text-xs"
                >
                  <Icons.Reload size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => completeWorkout(selectedWorkoutDay.id, true)}
                className="btn-athletic-primary px-6 py-2.5 text-xs font-athletic font-black uppercase tracking-wider"
              >
                LOG FOOTBALL COMPLETED
              </button>
            )}
          </div>
        </div>
      )}

      {/* REST DAY VIEW */}
      {selectedWorkoutDay.day_type === 'rest' && (
        <div className="card-athletic p-6 sm:p-8 space-y-6 border border-surface-800">
          <div className="flex items-center space-x-3 text-surface-300">
            <div className="w-12 h-12 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-center font-bold text-2xl">
              💤
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight font-athletic">
                SCHEDULED RECOVERY & MOBILITY
              </h2>
              <p className="text-xs font-mono text-surface-400">
                Systemic restoration is required for neuromuscular adaptation.
              </p>
            </div>
          </div>

          <div className="bg-surface-950 p-4 sm:p-5 rounded-xl border border-surface-800 space-y-3">
            <div className="text-xs font-athletic uppercase tracking-wider text-surface-400 font-black">
              RESTORATION PROTOCOL:
            </div>
            <ul className="space-y-2 text-sm text-surface-300 list-disc list-inside font-medium font-mono">
              {selectedWorkoutDay.instructions?.map((inst, idx) => (
                <li key={idx} className="leading-relaxed">
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-surface-800">
            <span className="text-xs font-mono text-surface-400">
              Streak is honored automatically on scheduled rest.
            </span>
            {isCompleted ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 text-xs font-athletic font-black text-volt-400 bg-volt-500/15 px-4 py-2 rounded-lg border border-volt-500/40 uppercase tracking-wider">
                  <Icons.CheckCircle size={16} />
                  <span>REST HONORED ✓</span>
                </div>
                <button
                  onClick={handleUnmarkCompletion}
                  className="btn-athletic-secondary p-2 rounded-lg text-xs"
                >
                  <Icons.Reload size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => completeWorkout(selectedWorkoutDay.id, true)}
                className="btn-athletic-secondary px-6 py-2.5 text-xs font-athletic font-bold uppercase tracking-wider"
              >
                MARK REST HONORED
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-surface-900 border border-surface-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-black text-white uppercase tracking-tight font-athletic">
              VERIFY SESSION COMPLETION
            </h3>
            
            <p className="text-sm text-surface-300 leading-relaxed font-mono">
              You have logged <strong className="text-white">{progress.completedCount} of {progress.totalCount}</strong> exercises for Day {selectedDayNumber} ({selectedWorkoutDay.workout_name}).
            </p>

            {progress.completedCount < progress.totalCount && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                NOTICE: Some exercises have unlogged sets. You can confirm completion now or return to finish logging.
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-athletic-secondary px-4 py-2 text-xs"
              >
                GO BACK
              </button>
              <button
                onClick={handleConfirmCompletion}
                disabled={isSubmitting}
                className="btn-athletic-primary px-6 py-2 text-xs font-athletic font-black uppercase tracking-wider"
              >
                {isSubmitting ? 'CONFIRMING...' : 'CONFIRM COMPLETION'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
