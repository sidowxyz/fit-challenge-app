export type DayType = 'gym' | 'football' | 'rest';

export type WeightUnit = 'kg' | 'lb';

export interface Profile {
  id: string;
  name: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  units: WeightUnit;
  notifications_enabled: boolean;
  created_at: string;
}

export interface Challenge {
  id: string;
  name: string;
  invite_code: string;
  start_date: string; // '2026-09-19'
  end_date: string; // '2026-12-27'
  created_by: string;
  created_at: string;
}

export interface ChallengeMember {
  id: string;
  challenge_id: string;
  user_id: string;
  joined_at: string;
  profile?: Profile;
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  muscle_group: string;
  sets: number;
  min_reps: number;
  max_reps: number;
  sort_order: number;
  is_optional?: boolean;
  notes?: string;
  gif_url?: string;
}

export interface WorkoutDay {
  id: string; // 'day-1' ... 'day-100'
  day_number: number; // 1 to 100
  date: string; // 'YYYY-MM-DD'
  day_of_week: string; // 'Monday', 'Tuesday', etc.
  day_type: DayType;
  workout_name: string;
  exercises: ExerciseTemplate[];
  description?: string;
  instructions?: string[];
}

export interface ExerciseSetLog {
  set_number: number;
  weight: number; // always stored in kg in DB or active unit
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_id: string;
  workout_day_id: string;
  weight: number;
  reps: number;
  set_number: number;
  notes?: string;
  completed: boolean;
  created_at: string;
}

export interface WorkoutCompletion {
  id: string;
  user_id: string;
  workout_day_id: string;
  completed: boolean;
  completed_at: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  workoutsCompleted: number;
  footballSessions: number;
  restDaysLogged: number;
  totalDaysCompleted: number;
  consistencyPercentage: number;
}

export interface PartnerProgress {
  userId: string;
  name: string;
  avatarUrl?: string;
  currentDay: number;
  workoutsCompleted: number;
  footballSessions: number;
  restDaysLogged: number;
  consistencyPercentage: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}
