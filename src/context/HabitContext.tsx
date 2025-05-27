"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Habit, HabitCompletion, HabitContextType } from "../types"
import { StorageService } from "../service/StorageService"
import { useAuth } from "./AuthContext"

const HabitContext = createContext<HabitContextType | undefined>(undefined)

interface HabitProviderProps {
  children: ReactNode
}

export const HabitProvider: React.FC<HabitProviderProps> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadData()
    } else {
      setHabits([])
      setCompletions([])
    }
  }, [user])

  const loadData = async () => {
    try {
      const [savedHabits, savedCompletions] = await Promise.all([
        StorageService.getHabits(),
        StorageService.getCompletions(),
      ])

      if (user) {
        const userHabits = savedHabits.filter((habit) => habit.userId === user.id)
        setHabits(userHabits)
        setCompletions(savedCompletions)
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const addHabit = async (name: string, frequency: "daily" | "weekly", emoji: string): Promise<void> => {
    if (!user) return

    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name,
        frequency,
        emoji,
        createdAt: new Date().toISOString(),
        userId: user.id,
      }

      const updatedHabits = [...habits, newHabit]
      setHabits(updatedHabits)

      const allHabits = await StorageService.getHabits()
      const otherUserHabits = allHabits.filter((habit) => habit.userId !== user.id)
      await StorageService.saveHabits([...otherUserHabits, ...updatedHabits])
    } catch (error) {
      console.error("Error adding habit:", error)
    }
  }

  const markHabitComplete = async (habitId: string): Promise<void> => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const existingCompletion = completions.find((c) => c.habitId === habitId && c.date === today)

      if (!existingCompletion) {
        const newCompletion: HabitCompletion = {
          id: Date.now().toString(),
          habitId,
          completedAt: new Date().toISOString(),
          date: today,
        }

        const updatedCompletions = [...completions, newCompletion]
        setCompletions(updatedCompletions)
        await StorageService.saveCompletions(updatedCompletions)
      }
    } catch (error) {
      console.error("Error marking habit complete:", error)
    }
  }

  const unmarkHabitComplete = async (habitId: string): Promise<void> => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const updatedCompletions = completions.filter((c) => !(c.habitId === habitId && c.date === today))

      setCompletions(updatedCompletions)
      await StorageService.saveCompletions(updatedCompletions)
    } catch (error) {
      console.error("Error unmarking habit complete:", error)
    }
  }

  const getHabitCompletions = (habitId: string): HabitCompletion[] => {
    return completions.filter((c) => c.habitId === habitId)
  }

  const isHabitCompletedToday = (habitId: string): boolean => {
    const today = new Date().toISOString().split("T")[0]
    return completions.some((c) => c.habitId === habitId && c.date === today)
  }

  const isHabitCompletedOnDate = (habitId: string, date: string): boolean => {
    return completions.some((c) => c.habitId === habitId && c.date === date)
  }

  const getTodayProgress = (): number => {
    if (habits.length === 0) return 0

    const today = new Date().toISOString().split("T")[0]
    const completedToday = completions.filter((c) => c.date === today).length

    return Math.round((completedToday / habits.length) * 100)
  }

  const getWeeklyProgress = (): number[] => {
    const weekProgress: number[] = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const completedOnDate = completions.filter((c) => c.date === dateString).length
      const progressPercentage = habits.length > 0 ? Math.round((completedOnDate / habits.length) * 100) : 0

      weekProgress.push(progressPercentage)
    }

    return weekProgress
  }

  const getMonthlyData = (year: number, month: number): { [key: string]: HabitCompletion[] } => {
    const monthlyData: { [key: string]: HabitCompletion[] } = {}

    completions.forEach((completion) => {
      const completionDate = new Date(completion.date)
      if (completionDate.getFullYear() === year && completionDate.getMonth() === month) {
        const dateKey = completion.date
        if (!monthlyData[dateKey]) {
          monthlyData[dateKey] = []
        }
        monthlyData[dateKey].push(completion)
      }
    })

    return monthlyData
  }

  const value: HabitContextType = {
    habits,
    completions,
    addHabit,
    markHabitComplete,
    unmarkHabitComplete,
    getHabitCompletions,
    isHabitCompletedToday,
    isHabitCompletedOnDate,
    getTodayProgress,
    getWeeklyProgress,
    getMonthlyData,
  }

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}

export const useHabits = (): HabitContextType => {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error("useHabits must be used within a HabitProvider")
  }
  return context
}
