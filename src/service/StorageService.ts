import AsyncStorage from "@react-native-async-storage/async-storage"
import type { User, Habit, HabitCompletion } from "../types"

const KEYS = {
  USER: "@habit_tracker_user",
  HABITS: "@habit_tracker_habits",
  COMPLETIONS: "@habit_tracker_completions",
}

export class StorageService {
  
  static async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user))
    } catch (error) {
      console.error("Error saving user:", error)
      throw error
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(KEYS.USER)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error getting user:", error)
      return null
    }
  }

  static async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER)
    } catch (error) {
      console.error("Error removing user:", error)
      throw error
    }
  }

 
  static async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HABITS, JSON.stringify(habits))
    } catch (error) {
      console.error("Error saving habits:", error)
      throw error
    }
  }

  static async getHabits(): Promise<Habit[]> {
    try {
      const habitsData = await AsyncStorage.getItem(KEYS.HABITS)
      return habitsData ? JSON.parse(habitsData) : []
    } catch (error) {
      console.error("Error getting habits:", error)
      return []
    }
  }

  static async saveCompletions(completions: HabitCompletion[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.COMPLETIONS, JSON.stringify(completions))
    } catch (error) {
      console.error("Error saving completions:", error)
      throw error
    }
  }

  static async getCompletions(): Promise<HabitCompletion[]> {
    try {
      const completionsData = await AsyncStorage.getItem(KEYS.COMPLETIONS)
      return completionsData ? JSON.parse(completionsData) : []
    } catch (error) {
      console.error("Error getting completions:", error)
      return []
    }
  }

 
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.USER, KEYS.HABITS, KEYS.COMPLETIONS])
    } catch (error) {
      console.error("Error clearing all data:", error)
      throw error
    }
  }
}
