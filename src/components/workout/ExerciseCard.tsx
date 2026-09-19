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
      className={`group p-3.5 sm:p-4 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
        isCompleted
          ? 'bg-surface-900/80 border-volt-500/40 shadow-[0_0_15px_rgba(204,255,0,0.06)]'
          : 'bg-surface-900/90 border-surface-800 hover:border-surface-700 hover:bg-surface-850/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3 sm:space-x-3.5 flex-1 min-w-0">
          
          {/* GIF Animated Thumbnail or Number Badge */}
          {exercise.gif_url ? (
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border border-surface-800 bg-surface-950 shrink-0 group-hover:border-volt-500/50 transition-colors">
              <img
                src={exercise.gif_url}
                alt={exercise.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-0.5 left-0.5 px-1 bg-surface-950/80 backdrop-blur-xs rounded text-[9px] font-athletic font-black text-volt-400">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ) : (
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-athletic text-sm font-black shrink-0 ${
              isCompleted 
                ? 'bg-volt-500 text-black shadow-[0_0_10px_rgba(204,255,0,0.5)]' 
                : 'bg-surface-950 border border-surface-800 text-surface-300'
            }`}>
              {String(index + 1).padStart(2, '0')}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Title & Muscle Badge */}
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-volt-400 transition-colors uppercase font-athletic tracking-wide truncate">
                {exercise.name}
              </h3>
              {exercise.is_optional && (
                <span className="text-[10px] font-athletic px-1.5 py-0.5 rounded bg-surface-800 text-surface-400 border border-surface-700 font-bold uppercase tracking-wider">
                  OPTIONAL
                </span>
              )}
            </div>

            {/* Target Specs */}
            <div className="text-xs font-mono text-surface-400 mt-0.5 flex items-center space-x-2 font-semibold">
              <span className="text-surface-200">
                {exercise.sets} SETS × {exercise.min_reps}–{exercise.max_reps} REPS
              </span>
              <span className="text-surface-600">·</span>
              <span className="text-volt-400 font-bold uppercase">{exercise.muscle_group}</span>
            </div>

            {/* Logged Sets Pill List */}
            {hasLogs && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {logs.map((log) => {
                  const weightDisplay = formatWeight(log.weight, unit);
                  return (
                    <span
                      key={log.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-surface-950 border border-surface-800 text-surface-200 font-bold"
                    >
                      <span className="text-surface-500 mr-1">S{log.set_number}:</span>
                      <span className="text-white font-black">{weightDisplay.value} {unit}</span>
                      <span className="text-surface-500 mx-1">×</span>
                      <span className="text-volt-400 font-black">{log.reps}</span>
                    </span>
                  );
                })}
              </div>
            )}

            {/* Notes if any */}
            {logs[0]?.notes && (
              <p className="mt-1.5 text-xs text-surface-400 italic font-mono truncate">
                "{logs[0].notes}"
              </p>
            )}
          </div>
        </div>

        {/* Action / Log Button */}
        <div className="shrink-0 self-center">
          {isCompleted ? (
            <div className="flex items-center space-x-1.5 text-volt-400 font-athletic text-xs font-black bg-volt-500/10 px-3 py-1.5 rounded-lg border border-volt-500/30">
              <Icons.CheckCircle size={15} className="text-volt-400" />
              <span className="hidden sm:inline">LOGGED ✓</span>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenLogModal(exercise);
              }}
              className="btn-athletic-primary px-3 py-1.5 text-xs font-athletic font-black flex items-center space-x-1"
            >
              <Icons.Plus size={14} className="stroke-[3]" />
              <span>LOG</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
