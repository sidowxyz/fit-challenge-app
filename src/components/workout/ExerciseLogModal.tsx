import React, { useState, useEffect } from 'react';
import { Icons } from '../icons/HugeIcon';
import { ExerciseTemplate, WeightUnit, ExerciseLog } from '../../types';
import { useFitness } from '../../context/FitnessContext';
import { formatWeight, parseInputWeightToKg } from '../../lib/storage';

interface ExerciseLogModalProps {
  exercise: ExerciseTemplate | null;
  workoutDayId: string;
  unit: WeightUnit;
  onClose: () => void;
}

interface EditableSet {
  setNumber: number;
  weight: number;
  reps: number;
  isExisting: boolean;
}

export const ExerciseLogModal: React.FC<ExerciseLogModalProps> = ({
  exercise,
  workoutDayId,
  unit,
  onClose
}) => {
  const { 
    getExerciseLogsForDay, 
    getLastLoggedForExercise, 
    logExerciseSet, 
    deleteExerciseSet,
    isSaving,
    saveError 
  } = useFitness();

  const [sets, setSets] = useState<EditableSet[]>([]);
  const [notes, setNotes] = useState<string>('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  useEffect(() => {
    if (!exercise) return;

    const existingLogs = getExerciseLogsForDay(workoutDayId, exercise.id);
    const lastLogs = getLastLoggedForExercise(exercise.name);

    if (existingLogs.length > 0) {
      setSets(
        existingLogs.map(l => ({
          setNumber: l.set_number,
          weight: formatWeight(l.weight, unit).value,
          reps: l.reps,
          isExisting: true
        }))
      );
      setNotes(existingLogs[0].notes || '');
    } else {
      const defaultWeight = lastLogs.length > 0 
        ? formatWeight(lastLogs[0].weight, unit).value 
        : 20;
      const defaultReps = lastLogs.length > 0 
        ? lastLogs[0].reps 
        : exercise.min_reps;

      const initialSets: EditableSet[] = [];
      for (let i = 1; i <= exercise.sets; i++) {
        initialSets.push({
          setNumber: i,
          weight: defaultWeight,
          reps: defaultReps,
          isExisting: false
        });
      }
      setSets(initialSets);
      setNotes('');
    }
  }, [exercise, workoutDayId, unit]);

  if (!exercise) return null;

  const lastLoggedSets = getLastLoggedForExercise(exercise.name);

  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newSetNumber = sets.length + 1;
    setSets([
      ...sets,
      {
        setNumber: newSetNumber,
        weight: lastSet ? lastSet.weight : 20,
        reps: lastSet ? lastSet.reps : exercise.min_reps,
        isExisting: false
      }
    ]);
  };

  const handleRemoveSet = async (indexToRemove: number) => {
    const targetSet = sets[indexToRemove];
    if (targetSet.isExisting) {
      const existingLogs = getExerciseLogsForDay(workoutDayId, exercise.id);
      const logToDelete = existingLogs.find(l => l.set_number === targetSet.setNumber);
      if (logToDelete) {
        await deleteExerciseSet(logToDelete.id);
      }
    }

    const filtered = sets.filter((_, idx) => idx !== indexToRemove);
    const reIndexed = filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    setSets(reIndexed);
  };

  const handleUpdateSet = (index: number, field: 'weight' | 'reps', val: number) => {
    const updated = [...sets];
    const safeVal = Math.max(0, val);
    updated[index] = {
      ...updated[index],
      [field]: safeVal
    };
    setSets(updated);
  };

  const handleSave = async () => {
    if (sets.length === 0) return;

    for (const setItem of sets) {
      const weightInKg = parseInputWeightToKg(setItem.weight, unit);
      await logExerciseSet({
        exerciseId: exercise.id,
        workoutDayId,
        setNumber: setItem.setNumber,
        weight: weightInKg,
        reps: setItem.reps,
        notes
      });
    }

    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-surface-950/85 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-surface-900 border-2 border-surface-800 border-b-6 border-b-surface-950 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2 border-surface-800 flex items-start justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-mono text-brand-400 font-black mb-0.5">
              {exercise.muscle_group}
            </div>
            <h2 className="text-lg sm:text-xl font-black text-surface-100 uppercase tracking-tight font-mono">
              {exercise.name}
            </h2>
            <div className="text-xs font-mono text-surface-400 mt-1 font-bold">
              Target: <span className="text-surface-100">{exercise.sets} × {exercise.min_reps}–{exercise.max_reps} reps</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-surface-400 hover:text-surface-100 bg-surface-950 hover:bg-surface-800 rounded-xl border border-surface-800 transition-colors"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        {/* Previous session reference */}
        {lastLoggedSets.length > 0 && (
          <div className="px-5 py-2.5 bg-surface-950/80 border-b border-surface-800 flex items-center justify-between text-xs font-mono text-surface-400 font-bold">
            <span className="flex items-center space-x-1.5">
              <Icons.History size={14} className="text-surface-400" />
              <span>Last session:</span>
            </span>
            <span className="text-surface-200">
              {lastLoggedSets.map(s => `${formatWeight(s.weight, unit).value} ${unit} × ${s.reps}`).join(' · ')}
            </span>
          </div>
        )}

        {/* Scrollable Set Table */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {saveError && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2 font-mono font-bold">
              <Icons.Alert size={16} className="shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-mono font-black uppercase text-surface-400 px-1">
            <span className="col-span-2">SET</span>
            <span className="col-span-5">WEIGHT ({unit})</span>
            <span className="col-span-4">REPS</span>
            <span className="col-span-1 text-right"></span>
          </div>

          {/* Set Rows */}
          <div className="space-y-2">
            {sets.map((item, idx) => (
              <div 
                key={idx}
                className="grid grid-cols-12 gap-2 items-center bg-surface-950 p-2.5 rounded-2xl border-2 border-surface-800 border-b-4 border-b-surface-950"
              >
                {/* Set # */}
                <div className="col-span-2 font-mono font-black text-sm text-surface-200 pl-1">
                  S{item.setNumber}
                </div>

                {/* Weight Input */}
                <div className="col-span-5 relative">
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      inputMode="decimal"
                      value={item.weight === 0 ? '' : item.weight}
                      onChange={(e) => handleUpdateSet(idx, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full bg-surface-900 border-2 border-surface-700 rounded-xl px-2.5 py-2 text-sm font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500 pr-7"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-surface-400 font-mono font-black pointer-events-none uppercase">
                      {unit}
                    </span>
                  </div>
                </div>

                {/* Reps Input */}
                <div className="col-span-4 relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    inputMode="numeric"
                    value={item.reps === 0 ? '' : item.reps}
                    onChange={(e) => handleUpdateSet(idx, 'reps', parseInt(e.target.value, 10) || 0)}
                    placeholder="reps"
                    className="w-full bg-surface-900 border-2 border-surface-700 rounded-xl px-2.5 py-2 text-sm font-mono font-bold text-surface-100 focus:outline-none focus:border-brand-500"
                  />
                </div>

                {/* Delete Set */}
                <div className="col-span-1 text-right">
                  {sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSet(idx)}
                      className="p-1.5 text-surface-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Remove set"
                    >
                      <Icons.Trash size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Set 3D Button */}
          <button
            type="button"
            onClick={handleAddSet}
            className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-surface-700 hover:border-brand-500/60 hover:bg-surface-800/40 text-xs font-mono font-bold text-surface-300 flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Icons.Plus size={16} className="text-brand-400" />
            <span>+ ADD SET</span>
          </button>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-black uppercase text-surface-400 mb-1.5">
              Notes (optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Felt strong, good RPE 8, increased +2.5kg"
              className="w-full bg-surface-950 border-2 border-surface-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-surface-200 placeholder:text-surface-600 focus:outline-none focus:border-brand-500"
              maxLength={150}
            />
          </div>
        </div>

        {/* Duolingo Style 3D Action Footer */}
        <div className="p-4 sm:p-5 border-t-2 border-surface-800 bg-surface-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-duo-secondary px-5 py-3 text-xs font-mono"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || sets.length === 0}
            className="btn-duo-primary px-7 py-3 text-xs font-mono flex items-center space-x-2"
          >
            {showSavedFeedback ? (
              <>
                <Icons.CheckCircle size={18} />
                <span>SAVED ✓</span>
              </>
            ) : (
              <span>{isSaving ? 'SAVING...' : 'SAVE EXERCISE'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
