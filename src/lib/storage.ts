import { 
  Profile, 
  UserPreferences, 
  ExerciseLog, 
  WorkoutCompletion, 
  UserStats, 
  PartnerProgress, 
  Challenge,
  WeightUnit
} from '../types';
import { ALL_100_DAYS, getCurrentChallengeDayNumber, getWorkoutDayByNumber } from '../utils/schedule';

const STORAGE_KEYS = {
  PROFILE: 'fitness_100_profile',
  PREFERENCES: 'fitness_100_prefs',
  CHALLENGE: 'fitness_100_challenge',
  LOGS: 'fitness_100_logs',
  COMPLETIONS: 'fitness_100_completions',
  PARTNER: 'fitness_100_partner'
};

// Default profile for local/mock session
export const DEFAULT_PROFILE: Profile = {
  id: 'user-self-100',
  name: 'Alex',
  avatar_url: '',
  created_at: new Date().toISOString()
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  id: 'pref-1',
  user_id: 'user-self-100',
  units: 'kg',
  notifications_enabled: false,
  created_at: new Date().toISOString()
};

export const DEFAULT_CHALLENGE: Challenge = {
  id: 'chal-100-primary',
  name: '100-Day Fitness Challenge',
  invite_code: 'FIT-100-2026',
  start_date: '2026-09-19',
  end_date: '2026-12-27',
  created_by: 'user-self-100',
  created_at: new Date().toISOString()
};

export const DEFAULT_PARTNER: PartnerProgress = {
  userId: 'partner-sidow-2',
  name: 'Sidow',
  avatarUrl: '',
  currentDay: getCurrentChallengeDayNumber(),
  workoutsCompleted: 0,
  footballSessions: 0,
  restDaysLogged: 0,
  consistencyPercentage: 100,
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: '2026-09-19'
};

export function getLocalProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PROFILE;
}

export function saveLocalProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getLocalPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PREFERENCES;
}

export function saveLocalPreferences(prefs: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
}

export function getLocalChallenge(): Challenge {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHALLENGE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_CHALLENGE;
}

export function saveLocalChallenge(chal: Challenge): void {
  localStorage.setItem(STORAGE_KEYS.CHALLENGE, JSON.stringify(chal));
}

export function getLocalPartner(): PartnerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PARTNER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return DEFAULT_PARTNER;
}

export function saveLocalPartner(partner: PartnerProgress): void {
  localStorage.setItem(STORAGE_KEYS.PARTNER, JSON.stringify(partner));
}

export function getLocalLogs(): ExerciseLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveLocalLogs(logs: ExerciseLog[]): void {
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
}

export function getLocalCompletions(): WorkoutCompletion[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COMPLETIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function saveLocalCompletions(completions: WorkoutCompletion[]): void {
  localStorage.setItem(STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
}

// Calculate comprehensive user stats & streaks
export function calculateUserStats(
  completions: WorkoutCompletion[],
  currentDayNumber: number
): UserStats {
  const completionMap = new Set(
    completions.filter(c => c.completed).map(c => c.workout_day_id)
  );

  let workoutsCompleted = 0;
  let footballSessions = 0;
  let restDaysLogged = 0;

  // Tally counts up to current day
  for (let d = 1; d <= currentDayNumber; d++) {
    const day = getWorkoutDayByNumber(d);
    const isCompleted = completionMap.has(day.id);

    if (day.day_type === 'gym' && isCompleted) {
      workoutsCompleted++;
    } else if (day.day_type === 'football' && isCompleted) {
      footballSessions++;
    } else if (day.day_type === 'rest') {
      // Rest day is considered honored if completed or passed
      if (isCompleted || d < currentDayNumber) {
        restDaysLogged++;
      }
    }
  }

  // Calculate Streak
  // Rule: Football counts as active day. Rest day does NOT break streak.
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Go day by day from Day 1 to current day
  for (let d = 1; d <= currentDayNumber; d++) {
    const day = getWorkoutDayByNumber(d);
    const isDone = completionMap.has(day.id);

    if (day.day_type === 'gym') {
      if (isDone) {
        tempStreak++;
      } else if (d < currentDayNumber) {
        // missed past gym workout breaks streak
        tempStreak = 0;
      }
    } else if (day.day_type === 'football') {
      if (isDone || d === currentDayNumber) {
        tempStreak++;
      } else {
        // Missed past football
        tempStreak = 0;
      }
    } else if (day.day_type === 'rest') {
      // Scheduled rest day does NOT break streak; adds to streak if active
      if (tempStreak > 0) {
        tempStreak++;
      }
    }

    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  currentStreak = tempStreak;
  const totalDaysCompleted = workoutsCompleted + footballSessions + restDaysLogged;
  const plannedActiveDays = currentDayNumber;
  const consistencyPercentage = plannedActiveDays > 0 
    ? Math.min(100, Math.round((totalDaysCompleted / plannedActiveDays) * 100))
    : 100;

  return {
    currentStreak: Math.max(0, currentStreak),
    longestStreak: Math.max(currentStreak, longestStreak),
    workoutsCompleted,
    footballSessions,
    restDaysLogged,
    totalDaysCompleted,
    consistencyPercentage
  };
}

// Convert weight between kg and lb
export function formatWeight(valInKg: number, unit: WeightUnit): { value: number; label: string } {
  if (unit === 'lb') {
    const lb = Math.round((valInKg * 2.20462) * 10) / 10;
    return { value: lb, label: `${lb} lb` };
  }
  return { value: valInKg, label: `${valInKg} kg` };
}

export function parseInputWeightToKg(inputVal: number, unit: WeightUnit): number {
  if (unit === 'lb') {
    return Math.round((inputVal / 2.20462) * 10) / 10;
  }
  return inputVal;
}
