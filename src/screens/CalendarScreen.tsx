"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { useHabits } from "../context/HabitContext"

const CalendarScreen: React.FC = () => {
  const { habits, getMonthlyData, isHabitCompletedOnDate } = useHabits()
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return firstDay === 0 ? 6 : firstDay - 1 // Convert Sunday (0) to be last (6)
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getCompletionPercentage = (dateString: string) => {
    if (habits.length === 0) return 0

    const completedHabits = habits.filter((habit) => isHabitCompletedOnDate(habit.id, dateString)).length

    return Math.round((completedHabits / habits.length) * 100)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const renderCalendarDay = (day: number | null, isCurrentMonth = true) => {
    if (!day) {
      return <View key={`empty-${Math.random()}`} style={styles.emptyDay} />
    }

    const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
    const completionPercentage = getCompletionPercentage(dateString)
    const today = new Date()
    const isToday =
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()

    const getDayStyle = () => {
      if (completionPercentage === 100) {
        return styles.perfectDay
      } else if (completionPercentage >= 75) {
        return styles.greatDay
      } else if (completionPercentage >= 50) {
        return styles.goodDay
      } else if (completionPercentage > 0) {
        return styles.someProgress
      }
      return styles.noProgress
    }

    return (
      <View key={day} style={[styles.calendarDay, getDayStyle(), isToday && styles.today]}>
        <Text style={[styles.dayNumber, isToday && styles.todayText]}>{day}</Text>
        {completionPercentage > 0 && <Text style={styles.completionText}>{completionPercentage}%</Text>}
      </View>
    )
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(renderCalendarDay(null))
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day))
    }

    return (
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>{days}</View>
      </View>
    )
  }

  const renderLegend = () => (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>📊 Completion Legend</Text>
      <View style={styles.legendItems}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.perfectDay]} />
          <Text style={styles.legendText}>100% Perfect</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.greatDay]} />
          <Text style={styles.legendText}>75%+ Great</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.goodDay]} />
          <Text style={styles.legendText}>50%+ Good</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.someProgress]} />
          <Text style={styles.legendText}>Some Progress</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.noProgress]} />
          <Text style={styles.legendText}>No Progress</Text>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendar 📅</Text>
          <Text style={styles.subtitle}>Track your habit completion history</Text>
        </View>

        <View style={styles.calendarContainer}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("prev")}>
              <Text style={styles.navButtonText}>← Previous</Text>
            </TouchableOpacity>

            <Text style={styles.monthYear}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>

            <TouchableOpacity style={styles.navButton} onPress={() => navigateMonth("next")}>
              <Text style={styles.navButtonText}>Next →</Text>
            </TouchableOpacity>
          </View>

          {renderCalendar()}
        </View>

        {renderLegend()}

        {habits.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>No Habits to Track</Text>
            <Text style={styles.emptySubtitle}>Create some habits to see your progress on the calendar!</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  calendarContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  monthNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: "500",
  },
  monthYear: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  calendar: {
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    paddingVertical: 8,
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 4,
    position: "relative",
  },
  emptyDay: {
    width: "14.28%",
    aspectRatio: 1,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1e293b",
  },
  completionText: {
    fontSize: 8,
    color: "#64748b",
    position: "absolute",
    bottom: 2,
  },
  today: {
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  todayText: {
    color: "#6366f1",
    fontWeight: "bold",
  },
  perfectDay: {
    backgroundColor: "#dcfce7",
  },
  greatDay: {
    backgroundColor: "#fef3c7",
  },
  goodDay: {
    backgroundColor: "#dbeafe",
  },
  someProgress: {
    backgroundColor: "#f3e8ff",
  },
  noProgress: {
    backgroundColor: "#f8fafc",
  },
  legend: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#64748b",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
  },
})

export default CalendarScreen
