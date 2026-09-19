import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  WorkoutDay, 
  ExerciseLog, 
  WorkoutCompletion, 
  UserStats, 
  PartnerProgress, 
  Challenge, 
  UserPreferences,
  WeightUnit
} from '../types';
import { 
  getCurrentChallengeDayNumber, 
  getWorkoutDayByNumber, 
  ALL_100_DAYS,
  CHALLENGE_START_DATE,
  CHALLENGE_END_DATE
} from '../utils/schedule';
import { 
  getLocalLogs, 
  saveLocalLogs, 
  getLocalCompletions, 
  saveLocalCompletions,
  getLocalPreferences,
  saveLocalPreferences,
  getLocalChallenge,
  saveLocalChallenge,
  getLocalPartner,
  saveLocalPartner,
  calculateUserStats
} from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface FitnessContextType {
  currentDayNumber: number;
  selectedDayNumber: number;
  setSelectedDayNumber: (day: number) => void;
  selectedWorkoutDay: WorkoutDay;
  todayWorkoutDay: WorkoutDay;
  allDays: WorkoutDay[];
  logs: ExerciseLog[];
  completions: WorkoutCompletion[];
  stats: UserStats;
  challenge: Challenge;
  partner: PartnerProgress;
  preferences: UserPreferences;
  isSaving: boolean;
  saveError: string | null;
  logExerciseSet: (params: {
    exerciseId: string;
    workoutDayId: string;
    setNumber: number;
    weight: number;
    reps: number;
    notes?: string;
  }) => Promise<void>;
  deleteExerciseSet: (logId: string) => Promise<void>;
  getExerciseLogsForDay: (workoutDayId: string, exerciseId: string) => ExerciseLog[];
  getLastLoggedForExercise: (exerciseName: string) => ExerciseLog[];
  getExerciseHistory: (exerciseName: string) => { dayNumber: number; date: string; weight: number; reps: number; volume: number }[];
  completeWorkout: (workoutDayId: string, completed?: boolean) => Promise<void>;
  isDayCompleted: (workoutDayId: string) => boolean;
  getWorkoutProgress: (day: WorkoutDay) => { completedCount: number; totalCount: number; percentage: number };
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  createChallenge: (name: string) => Promise<string>;
  joinChallenge: (inviteCode: string) => Promise<{ success: boolean; error?: string }>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const currentDayNumber = useMemo(() => getCurrentChallengeDayNumber(), []);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(currentDayNumber);

  const [logs, setLogs] = useState<ExerciseLog[]>(getLocalLogs);
  const [completions, setCompletions] = useState<WorkoutCompletion[]>(getLocalCompletions);
  const [preferences, setPreferences] = useState<UserPreferences>(getLocalPreferences);
  const [challenge, setChallenge] = useState<Challenge>(getLocalChallenge);
  const [partner, setPartner] = useState<PartnerProgress>(getLocalPartner);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync with Supabase if configured & user logged in
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    const fetchData = async () => {
      try {
        // Fetch logs
        const { data: logsData } = await supabase
          .from('exercise_logs')
          .select('*')
          .eq('user_id', user.id);
        if (logsData) {
          setLogs(logsData);
          saveLocalLogs(logsData);
        }

        // Fetch completions
        const { data: completionsData } = await supabase
          .from('workout_completions')
          .select('*')
          .eq('user_id', user.id);
        if (completionsData) {
          setCompletions(completionsData);
          saveLocalCompletions(completionsData);
        }

        // Fetch preferences
        const { data: prefData } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (prefData) {
          setPreferences(prefData);
          saveLocalPreferences(prefData);
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
      }
    };

    fetchData();
  }, [user]);

  const selectedWorkoutDay = useMemo(() => {
    return getWorkoutDayByNumber(selectedDayNumber);
  }, [selectedDayNumber]);

  const todayWorkoutDay = useMemo(() => {
    return getWorkoutDayByNumber(currentDayNumber);
  }, [currentDayNumber]);

  const stats = useMemo(() => {
    return calculateUserStats(completions, currentDayNumber);
  }, [completions, currentDayNumber]);

  // Log single exercise set
  const logExerciseSet = async ({
    exerciseId,
    workoutDayId,
    setNumber,
    weight,
    reps,
    notes = ''
  }: {
    exerciseId: string;
    workoutDayId: string;
    setNumber: number;
    weight: number;
    reps: number;
    notes?: string;
  }) => {
    setIsSaving(true);
    setSaveError(null);

    const userId = user?.id || 'user-self-100';

    try {
      // Check if existing set log for this user, day, exercise, and set_number
      const existingIdx = logs.findIndex(
        l => l.workout_day_id === workoutDayId && l.exercise_id === exerciseId && l.set_number === setNumber
      );

      let updatedLogs: ExerciseLog[];
      let targetLog: ExerciseLog;

      if (existingIdx >= 0) {
        targetLog = {
          ...logs[existingIdx],
          weight,
          reps,
          notes,
          completed: true
        };
        updatedLogs = [...logs];
        updatedLogs[existingIdx] = targetLog;
      } else {
        targetLog = {
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          user_id: userId,
          exercise_id: exerciseId,
          workout_day_id: workoutDayId,
          weight,
          reps,
          set_number: setNumber,
          notes,
          completed: true,
          created_at: new Date().toISOString()
        };
        updatedLogs = [...logs, targetLog];
      }

      setLogs(updatedLogs);
      saveLocalLogs(updatedLogs);

      if (isSupabaseConfigured && user) {
        const { error } = await supabase.from('exercise_logs').upsert({
          id: targetLog.id.startsWith('log-') ? undefined : targetLog.id,
          user_id: user.id,
          exercise_id: targetLog.exercise_id,
          workout_day_id: targetLog.workout_day_id,
          weight: targetLog.weight,
          reps: targetLog.reps,
          set_number: targetLog.set_number,
          notes: targetLog.notes,
          completed: true
        });
        if (error) {
          console.error('Failed to sync log to Supabase:', error);
        }
      }
    } catch (e: any) {
      setSaveError(e?.message || "Couldn't save your workout. Check connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteExerciseSet = async (logId: string) => {
    const updated = logs.filter(l => l.id !== logId);
    setLogs(updated);
    saveLocalLogs(updated);

    if (isSupabaseConfigured && user) {
      await supabase.from('exercise_logs').delete().eq('id', logId);
    }
  };

  const getExerciseLogsForDay = (workoutDayId: string, exerciseId: string): ExerciseLog[] => {
    return logs
      .filter(l => l.workout_day_id === workoutDayId && l.exercise_id === exerciseId)
      .sort((a, b) => a.set_number - b.set_number);
  };

  // Find last logged sets for the same exercise across any previous workout day
  const getLastLoggedForExercise = (exerciseName: string): ExerciseLog[] => {
    const matchingLogs = logs.filter(l => {
      // Check exercise name matching
      const day = ALL_100_DAYS.find(d => d.id === l.workout_day_id);
      const ex = day?.exercises.find(e => e.id === l.exercise_id);
      return ex?.name.toLowerCase() === exerciseName.toLowerCase() || l.exercise_id.includes(exerciseName.toLowerCase().replace(/\s+/g, '-'));
    });

    if (matchingLogs.length === 0) return [];

    // Sort by created_at desc
    matchingLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const latestDayId = matchingLogs[0].workout_day_id;
    return matchingLogs
      .filter(l => l.workout_day_id === latestDayId)
      .sort((a, b) => a.set_number - b.set_number);
  };

  // Get progressive overload history for an exercise across days
  const getExerciseHistory = (exerciseName: string) => {
    const dayMap = new Map<number, { dayNumber: number; date: string; weight: number; reps: number; volume: number }>();

    for (const log of logs) {
      const day = ALL_100_DAYS.find(d => d.id === log.workout_day_id);
      const ex = day?.exercises.find(e => e.id === log.exercise_id);
      
      const isMatch = (ex && (ex.name.toLowerCase().includes(exerciseName.toLowerCase()) || exerciseName.toLowerCase().includes(ex.name.toLowerCase()))) ||
                      log.exercise_id.toLowerCase().includes(exerciseName.toLowerCase());

      if (isMatch && day) {
        const existing = dayMap.get(day.day_number);
        const setVolume = log.weight * log.reps;

        if (!existing || log.weight > existing.weight) {
          dayMap.set(day.day_number, {
            dayNumber: day.day_number,
            date: day.date,
            weight: log.weight,
            reps: log.reps,
            volume: (existing?.volume || 0) + setVolume
          });
        }
      }
    }

    return Array.from(dayMap.values()).sort((a, b) => a.dayNumber - b.dayNumber);
  };

  const completeWorkout = async (workoutDayId: string, completed: boolean = true) => {
    setIsSaving(true);
    setSaveError(null);
    const userId = user?.id || 'user-self-100';

    try {
      const existingIdx = completions.findIndex(c => c.workout_day_id === workoutDayId);
      let updated: WorkoutCompletion[];

      if (existingIdx >= 0) {
        updated = [...completions];
        updated[existingIdx] = {
          ...updated[existingIdx],
          completed,
          completed_at: new Date().toISOString()
        };
      } else {
        updated = [
          ...completions,
          {
            id: `comp-${Date.now()}`,
            user_id: userId,
            workout_day_id: workoutDayId,
            completed,
            completed_at: new Date().toISOString()
          }
        ];
      }

      setCompletions(updated);
      saveLocalCompletions(updated);

      if (isSupabaseConfigured && user) {
        await supabase.from('workout_completions').upsert({
          user_id: user.id,
          workout_day_id: workoutDayId,
          completed,
          completed_at: new Date().toISOString()
        });
      }
    } catch (e: any) {
      setSaveError(e?.message || 'Failed to update workout completion status.');
    } finally {
      setIsSaving(false);
    }
  };

  const isDayCompleted = (workoutDayId: string): boolean => {
    const found = completions.find(c => c.workout_day_id === workoutDayId);
    return Boolean(found?.completed);
  };

  const getWorkoutProgress = (day: WorkoutDay) => {
    if (day.day_type !== 'gym' || day.exercises.length === 0) {
      const done = isDayCompleted(day.id);
      return {
        completedCount: done ? 1 : 0,
        totalCount: 1,
        percentage: done ? 100 : 0
      };
    }

    const requiredExercises = day.exercises.filter(e => !e.is_optional);
    let completedCount = 0;

    for (const ex of requiredExercises) {
      const exLogs = getExerciseLogsForDay(day.id, ex.id);
      if (exLogs.length >= ex.sets || (exLogs.length > 0 && exLogs.some(l => l.completed))) {
        completedCount++;
      }
    }

    const totalCount = requiredExercises.length;
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return { completedCount, totalCount, percentage };
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    const updated: UserPreferences = {
      ...preferences,
      ...updates
    };
    setPreferences(updated);
    saveLocalPreferences(updated);

    if (isSupabaseConfigured && user) {
      await supabase.from('user_preferences').upsert(updated);
    }
  };

  const createChallenge = async (name: string): Promise<string> => {
    const code = `FIT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-100`;
    const newChallenge: Challenge = {
      id: `chal-${Date.now()}`,
      name: name || '100-Day Fitness Challenge',
      invite_code: code,
      start_date: CHALLENGE_START_DATE,
      end_date: CHALLENGE_END_DATE,
      created_by: user?.id || 'user-self-100',
      created_at: new Date().toISOString()
    };
    setChallenge(newChallenge);
    saveLocalChallenge(newChallenge);

    if (isSupabaseConfigured && user) {
      await supabase.from('challenges').insert({
        name: newChallenge.name,
        invite_code: code,
        start_date: CHALLENGE_START_DATE,
        end_date: CHALLENGE_END_DATE,
        created_by: user.id
      });
    }

    return code;
  };

  const joinChallenge = async (inviteCode: string): Promise<{ success: boolean; error?: string }> => {
    const cleanCode = inviteCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, error: 'Please enter a valid challenge invite code.' };
    }

    // Set active challenge code
    const updated = {
      ...challenge,
      invite_code: cleanCode
    };
    setChallenge(updated);
    saveLocalChallenge(updated);

    // Provide partner demo sync
    const simulatedPartner: PartnerProgress = {
      userId: 'partner-active',
      name: 'Sidow',
      currentDay: currentDayNumber,
      workoutsCompleted: Math.max(0, stats.workoutsCompleted),
      footballSessions: stats.footballSessions,
      restDaysLogged: stats.restDaysLogged,
      consistencyPercentage: stats.consistencyPercentage,
      currentStreak: stats.currentStreak,
      longestStreak: stats.longestStreak,
      lastActiveDate: '2026-09-19'
    };
    setPartner(simulatedPartner);
    saveLocalPartner(simulatedPartner);

    return { success: true };
  };

  return (
    <FitnessContext.Provider
      value={{
        currentDayNumber,
        selectedDayNumber,
        setSelectedDayNumber,
        selectedWorkoutDay,
        todayWorkoutDay,
        allDays: ALL_100_DAYS,
        logs,
        completions,
        stats,
        challenge,
        partner,
        preferences,
        isSaving,
        saveError,
        logExerciseSet,
        deleteExerciseSet,
        getExerciseLogsForDay,
        getLastLoggedForExercise,
        getExerciseHistory,
        completeWorkout,
        isDayCompleted,
        getWorkoutProgress,
        updatePreferences,
        createChallenge,
        joinChallenge
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
