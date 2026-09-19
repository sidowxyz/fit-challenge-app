import { WorkoutDay, ExerciseTemplate, DayType } from '../types';

export const CHALLENGE_START_DATE = '2026-09-19';
export const CHALLENGE_END_DATE = '2026-12-27';
export const TOTAL_CHALLENGE_DAYS = 100;

export const EXERCISE_GIF_MAP: Record<string, string> = {
  'Bench Press': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Decline-Bench-Press.gif?resize=600%2C600&ssl=1',
  'Incline Dumbbell Press': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Incline-Press.gif?fit=600%2C600&ssl=1',
  'Chest Fly Machine / Cable Fly': 'https://i.makeagif.com/media/11-30-2023/1I-_Ge.gif',
  'Cable Triceps Pushdown': 'https://www.strengthlog.com/wp-content/uploads/2020/03/triceps-pushdown-with-rope.gif',
  'Overhead Triceps Extension': 'https://media.tenor.com/TC6IqRAa9csAAAAM/dumbell-overhead-tricep-extension.gif',
  'Assisted Dips / Machine Dips': 'https://cdn.jefit.com/assets/img/exercises/gifs/1261.gif',
  'Plank': 'https://cdn.jefit.com/assets/img/exercises/gifs/631.gif',
  'Bench Press / Machine Chest Press': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Decline-Bench-Press.gif?resize=600%2C600&ssl=1',
  'Incline Bench Press': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Incline-Press.gif?fit=600%2C600&ssl=1',
  'Cable / Machine Fly': 'https://i.makeagif.com/media/11-30-2023/1I-_Ge.gif',
  'Machine Chest Press': 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Decline-Bench-Press.gif?resize=600%2C600&ssl=1',
};

// Base exercise templates by weekday
export const ROUTINE_TEMPLATES: Record<string, { type: DayType; name: string; exercises: Omit<ExerciseTemplate, 'id'>[]; instructions?: string[] }> = {
  Monday: {
    type: 'gym',
    name: 'Chest + Triceps',
    exercises: [
      { name: 'Bench Press', muscle_group: 'Chest', sets: 3, min_reps: 8, max_reps: 12, sort_order: 1, gif_url: 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Decline-Bench-Press.gif?resize=600%2C600&ssl=1' },
      { name: 'Incline Dumbbell Press', muscle_group: 'Chest', sets: 3, min_reps: 8, max_reps: 12, sort_order: 2, gif_url: 'https://i0.wp.com/www.strengthlog.com/wp-content/uploads/2020/03/Dumbbell-Incline-Press.gif?fit=600%2C600&ssl=1' },
      { name: 'Chest Fly Machine / Cable Fly', muscle_group: 'Chest', sets: 3, min_reps: 10, max_reps: 15, sort_order: 3, gif_url: 'https://i.makeagif.com/media/11-30-2023/1I-_Ge.gif' },
      { name: 'Cable Triceps Pushdown', muscle_group: 'Triceps', sets: 3, min_reps: 10, max_reps: 15, sort_order: 4, gif_url: 'https://www.strengthlog.com/wp-content/uploads/2020/03/triceps-pushdown-with-rope.gif' },
      { name: 'Overhead Triceps Extension', muscle_group: 'Triceps', sets: 3, min_reps: 10, max_reps: 15, sort_order: 5, gif_url: 'https://media.tenor.com/TC6IqRAa9csAAAAM/dumbell-overhead-tricep-extension.gif' },
      { name: 'Assisted Dips / Machine Dips', muscle_group: 'Chest & Triceps', sets: 2, min_reps: 8, max_reps: 12, sort_order: 6, gif_url: 'https://cdn.jefit.com/assets/img/exercises/gifs/1261.gif' },
      { name: 'Plank', muscle_group: 'Core', sets: 3, min_reps: 30, max_reps: 60, sort_order: 7, is_optional: true, notes: 'Hold for 30-60 sec', gif_url: 'https://cdn.jefit.com/assets/img/exercises/gifs/631.gif' },
    ]
  },
  Tuesday: {
    type: 'football',
    name: 'Football Day',
    exercises: [],
    instructions: [
      '⚽ Conditioning + Football Session',
      'Warm up dynamic mobility & sprints for 10 minutes',
      'Play match or high-intensity conditioning drills',
      'Post-match recovery: Hydrate with electrolytes',
      'Nutrient-dense post-workout meal',
      'Prioritize 8+ hours quality sleep'
    ]
  },
  Wednesday: {
    type: 'gym',
    name: 'Back + Biceps',
    exercises: [
      { name: 'Lat Pulldown / Assisted Pull-up', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 1 },
      { name: 'Seated Cable Row', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 2 },
      { name: 'Machine Row / Dumbbell Row', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 3 },
      { name: 'Face Pull', muscle_group: 'Upper Back / Delts', sets: 3, min_reps: 12, max_reps: 15, sort_order: 4 },
      { name: 'Dumbbell Curl', muscle_group: 'Biceps', sets: 3, min_reps: 10, max_reps: 12, sort_order: 5 },
      { name: 'Hammer Curl', muscle_group: 'Biceps / Forearms', sets: 3, min_reps: 10, max_reps: 15, sort_order: 6 },
      { name: 'Cable Curl', muscle_group: 'Biceps', sets: 2, min_reps: 10, max_reps: 15, sort_order: 7 },
      { name: 'Dead Bug', muscle_group: 'Core', sets: 3, min_reps: 8, max_reps: 12, sort_order: 8, notes: 'Each side controlled' },
    ]
  },
  Thursday: {
    type: 'gym',
    name: 'Full Body',
    exercises: [
      { name: 'Squat / Leg Press', muscle_group: 'Quads & Glutes', sets: 3, min_reps: 8, max_reps: 12, sort_order: 1 },
      { name: 'Bench Press / Machine Chest Press', muscle_group: 'Chest', sets: 3, min_reps: 8, max_reps: 12, sort_order: 2 },
      { name: 'Lat Pulldown', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 3 },
      { name: 'Romanian Deadlift', muscle_group: 'Hamstrings & Glutes', sets: 3, min_reps: 8, max_reps: 12, sort_order: 4 },
      { name: 'Shoulder Press', muscle_group: 'Shoulders', sets: 2, min_reps: 8, max_reps: 12, sort_order: 5 },
      { name: 'Cable Crunch / Plank', muscle_group: 'Core', sets: 3, min_reps: 12, max_reps: 15, sort_order: 6 },
    ]
  },
  Friday: {
    type: 'rest',
    name: 'Rest Day',
    exercises: [],
    instructions: [
      'Recovery is a vital part of training and muscular adaptation.',
      'Take a 20-30 min gentle walk or light mobility work',
      'Gentle hamstring & chest stretches',
      'Hydrate well and hit protein goals',
      'Prioritize early sleep'
    ]
  },
  Saturday: {
    type: 'gym',
    name: 'Legs + Shoulders',
    exercises: [
      { name: 'Squat / Leg Press', muscle_group: 'Quads & Glutes', sets: 3, min_reps: 8, max_reps: 12, sort_order: 1 },
      { name: 'Romanian Deadlift', muscle_group: 'Hamstrings & Glutes', sets: 3, min_reps: 8, max_reps: 12, sort_order: 2 },
      { name: 'Leg Curl', muscle_group: 'Hamstrings', sets: 3, min_reps: 10, max_reps: 15, sort_order: 3 },
      { name: 'Leg Extension', muscle_group: 'Quads', sets: 3, min_reps: 10, max_reps: 15, sort_order: 4 },
      { name: 'Calf Raises', muscle_group: 'Calves', sets: 3, min_reps: 12, max_reps: 15, sort_order: 5 },
      { name: 'Shoulder Press', muscle_group: 'Shoulders', sets: 3, min_reps: 8, max_reps: 12, sort_order: 6 },
      { name: 'Lateral Raise', muscle_group: 'Side Delts', sets: 3, min_reps: 12, max_reps: 15, sort_order: 7 },
      { name: 'Rear Delt Fly / Reverse Pec Deck', muscle_group: 'Rear Delts', sets: 3, min_reps: 12, max_reps: 15, sort_order: 8 },
    ]
  },
  Sunday: {
    type: 'gym',
    name: 'Chest + Back',
    exercises: [
      { name: 'Incline Bench Press', muscle_group: 'Upper Chest', sets: 3, min_reps: 8, max_reps: 12, sort_order: 1 },
      { name: 'Machine Chest Press', muscle_group: 'Chest', sets: 3, min_reps: 8, max_reps: 12, sort_order: 2 },
      { name: 'Cable / Machine Fly', muscle_group: 'Chest', sets: 2, min_reps: 10, max_reps: 15, sort_order: 3 },
      { name: 'Lat Pulldown / Pull-ups', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 4 },
      { name: 'Seated Cable Row', muscle_group: 'Back', sets: 3, min_reps: 8, max_reps: 12, sort_order: 5 },
      { name: 'Face Pull', muscle_group: 'Upper Back / Rear Delts', sets: 3, min_reps: 12, max_reps: 15, sort_order: 6 },
      { name: 'Plank', muscle_group: 'Core', sets: 3, min_reps: 30, max_reps: 60, sort_order: 7, is_optional: true, notes: 'Hold 30-60 sec' },
    ]
  },
};

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to format Date to 'YYYY-MM-DD'
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate the 100 days dynamically
export function generate100Days(): WorkoutDay[] {
  const days: WorkoutDay[] = [];
  const start = new Date(CHALLENGE_START_DATE + 'T00:00:00');

  for (let i = 0; i < TOTAL_CHALLENGE_DAYS; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const dateStr = formatDate(currentDate);
    const dayOfWeek = WEEKDAYS[currentDate.getDay()];
    const routine = ROUTINE_TEMPLATES[dayOfWeek];
    const dayNumber = i + 1;
    const dayId = `day-${dayNumber}`;

    const exercises: ExerciseTemplate[] = routine.exercises.map((ex, idx) => ({
      ...ex,
      id: `${dayId}-ex-${idx + 1}`,
      gif_url: ex.gif_url || EXERCISE_GIF_MAP[ex.name]
    }));

    days.push({
      id: dayId,
      day_number: dayNumber,
      date: dateStr,
      day_of_week: dayOfWeek,
      day_type: routine.type,
      workout_name: routine.name,
      exercises,
      instructions: routine.instructions,
    });
  }

  return days;
}

export const ALL_100_DAYS = generate100Days();

// Calculate current day number based on current date
export function getCurrentChallengeDayNumber(targetDate: Date = new Date()): number {
  const start = new Date(CHALLENGE_START_DATE + 'T00:00:00');
  const target = new Date(formatDate(targetDate) + 'T00:00:00');
  
  const diffTime = target.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const calculatedDay = diffDays + 1;

  if (calculatedDay < 1) return 1;
  if (calculatedDay > TOTAL_CHALLENGE_DAYS) return TOTAL_CHALLENGE_DAYS;
  return calculatedDay;
}

// Get day by day_number
export function getWorkoutDayByNumber(dayNumber: number): WorkoutDay {
  const clamped = Math.max(1, Math.min(TOTAL_CHALLENGE_DAYS, dayNumber));
  return ALL_100_DAYS[clamped - 1];
}

// Human formatted date string: e.g. "Saturday, September 19"
export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
}

// Short date format: "Sep 19"
export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Key lift names tracked for progressive overload
export const TRACKED_PROGRESSION_LIFTS = [
  'Bench Press',
  'Squat / Leg Press',
  'Lat Pulldown',
  'Shoulder Press',
  'Romanian Deadlift'
] as const;
