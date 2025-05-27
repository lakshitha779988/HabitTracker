export interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

export interface Habit {
  id: string
  name: string
  frequency: "daily" | "weekly"
  createdAt: string
  userId: string
  emoji: string
}

export interface HabitCompletion {
  id: string
  habitId: string
  completedAt: string
  date: string // YYYY-MM-DD format
}

export type FilterType = "all" | "today" | "completed"

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

export interface HabitContextType {
  habits: Habit[]
  completions: HabitCompletion[]
  addHabit: (name: string, frequency: "daily" | "weekly", emoji: string) => Promise<void>
  markHabitComplete: (habitId: string) => Promise<void>
  unmarkHabitComplete: (habitId: string) => Promise<void>
  getHabitCompletions: (habitId: string) => HabitCompletion[]
  isHabitCompletedToday: (habitId: string) => boolean
  isHabitCompletedOnDate: (habitId: string, date: string) => boolean
  getTodayProgress: () => number
  getWeeklyProgress: () => number[]
  getMonthlyData: (year: number, month: number) => { [key: string]: HabitCompletion[] }
}
