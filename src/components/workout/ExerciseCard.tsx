import React from 'react';
import { Icons } from '../icons/HugeIcon';
import { ExerciseTemplate, ExerciseLog, WeightUnit } from '../../types';
import { formatWeight } from '../../lib/storage';

interface ExerciseCardProps {
  exercise: ExerciseTemplate;
  index: number;
  logs: ExerciseLog[];
  unit: WeightUnit;
  onOpenLogModal: (exercise: ExerciseTemplate) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  logs,
  unit,
  onOpenLogModal
}) => {
  const isCompleted = logs.length >= exercise.sets || (logs.length > 0 && logs.every(l => l.completed));
  const hasLogs = logs.length > 0;

  return (
    <div 
      onClick={() => onOpenLogModal(exercise)}
      className={`group p-4 sm:p-5 rounded-2xl border-2 border-b-4 transition-all duration-100 cursor-pointer active:translate-y-0.5 active:border-b-2 ${
        isCompleted
          ? 'bg-surface-900/60 border-emerald-900/60 border-b-emerald-950 hover:border-emerald-500/60'
          : 'bg-surface-900 border-surface-800 border-b-surface-950 hover:border-brand-500/50 hover:border-b-brand-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          {/* Index Number Badge */}
          <div className="w-8 h-8 rounded-xl bg-surface-950 border border-surface-800 flex items-center justify-center font-mono text-xs font-black text-surface-300 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </div>

          <div>
            {/* Title & Muscle Badge */}
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-black text-surface-100 group-hover:text-brand-300 transition-colors uppercase font-mono">
                {exercise.name}
              </h3>
              {exercise.is_optional && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-surface-800 text-surface-400 border border-surface-700 font-bold">
                  Optional
                </span>
              )}
            </div>

            {/* Target Specs */}
            <div className="text-xs font-mono text-surface-400 mt-1 flex items-center space-x-2 font-bold">
              <span className="text-surface-200">
                {exercise.sets} sets × {exercise.min_reps}–{exercise.max_reps} reps
              </span>
              <span className="text-surface-600">·</span>
              <span className="text-brand-400">{exercise.muscle_group}</span>
            </div>

            {/* Logged Sets Pill List */}
            {hasLogs && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {logs.map((log) => {
                  const weightDisplay = formatWeight(log.weight, unit);
                  return (
                    <span
                      key={log.id}
                      className="inline-flex items-center px-2.5 py-1 rounded-xl text-[11px] font-mono bg-surface-950 border-2 border-surface-800 text-surface-200 font-bold"
                    >
                      <span className="text-surface-500 mr-1">S{log.set_number}:</span>
                      <span className="text-surface-100 font-black">{weightDisplay.value} {unit}</span>
                      <span className="text-surface-500 mx-1">×</span>
                      <span className="text-brand-400 font-black">{log.reps}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Notes if any */}
            {logs[0]?.notes && (
              <p className="mt-2 text-xs text-surface-400 italic font-mono">
                "{logs[0].notes}"
              </p>
            )}
          </div>
        </div>

        {/* 3D Action / Log Button */}
        <div className="shrink-0">
          {isCompleted ? (
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-xs font-black bg-emerald-500/15 px-3 py-2 rounded-xl border border-emerald-500/30">
              <Icons.CheckCircle size={16} />
              <span className="hidden sm:inline">LOGGED ✓</span>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLogModal(exercise);
              }}
              className="btn-duo-primary px-3.5 py-2 text-xs font-mono font-black flex items-center space-x-1.5"
            >
              <Icons.Plus size={14} />
              <span>LOG</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
