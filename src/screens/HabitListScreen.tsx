"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from "react-native"
import { useHabits } from "../context/HabitContext"
import type { FilterType, Habit } from "../types"

const HabitListScreen: React.FC = () => {
  const { habits, markHabitComplete, unmarkHabitComplete, isHabitCompletedToday } = useHabits()
  const [filter, setFilter] = useState<FilterType>("all")

  const getFilteredHabits = (): Habit[] => {
    switch (filter) {
      case "today":
        return habits.filter((habit) => habit.frequency === "daily")
      case "completed":
        return habits.filter((habit) => isHabitCompletedToday(habit.id))
      default:
        return habits
    }
  }

  const handleToggleHabit = async (habitId: string) => {
    const isCompleted = isHabitCompletedToday(habitId)
    if (isCompleted) {
      await unmarkHabitComplete(habitId)
    } else {
      await markHabitComplete(habitId)
    }
  }

  const renderHabitItem = ({ item }: { item: Habit }) => {
    const isCompleted = isHabitCompletedToday(item.id)
    const scaleValue = new Animated.Value(1)
    const opacityValue = new Animated.Value(1)

    const animatePress = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.7,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleValue, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start()
    }

    return (
      <Animated.View
        style={[
          styles.habitItem,
          isCompleted && styles.completedHabitItem,
          {
            transform: [{ scale: scaleValue }],
            opacity: opacityValue,
          },
        ]}
      >
        <View style={styles.habitInfo}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitEmoji}>{item.emoji}</Text>
            <Text style={[styles.habitName, isCompleted && styles.completedText]}>{item.name}</Text>
          </View>
          <Text style={styles.habitFrequency}>{item.frequency === "daily" ? "📅 Daily" : "📆 Weekly"}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, isCompleted && styles.checkedButton]}
          onPress={() => {
            animatePress()
            handleToggleHabit(item.id)
          }}
        >
          <Text style={styles.checkEmoji}>{isCompleted ? "✅" : "⭕"}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const renderFilterButton = (filterType: FilterType, label: string, emoji: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === filterType && styles.activeFilterButton]}
      onPress={() => setFilter(filterType)}
    >
      <Text style={styles.filterEmoji}>{emoji}</Text>
      <Text style={[styles.filterText, filter === filterType && styles.activeFilterText]}>{label}</Text>
    </TouchableOpacity>
  )

  const filteredHabits = getFilteredHabits()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Habits 📋</Text>
        <Text style={styles.subtitle}>
          {filteredHabits.length} {filteredHabits.length === 1 ? "habit" : "habits"}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All", "📝")}
        {renderFilterButton("today", "Today's", "🌅")}
        {renderFilterButton("completed", "Done", "✅")}
      </View>

      {filteredHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📝</Text>
          <Text style={styles.emptyTitle}>No habits found</Text>
          <Text style={styles.emptySubtitle}>
            {filter === "all"
              ? "Create your first habit to get started!"
              : filter === "today"
                ? "No daily habits created yet."
                : "No habits completed today."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHabits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    paddingHorizontal: 24,
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
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
  },
  activeFilterButton: {
    backgroundColor: "#6366f1",
  },
  filterEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  activeFilterText: {
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  habitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  completedHabitItem: {
    borderColor: "#10b981",
    backgroundColor: "#f0fdf4",
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  habitEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    flex: 1,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  habitFrequency: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 36,
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  checkedButton: {
    backgroundColor: "#dcfce7",
  },
  checkEmoji: {
    fontSize: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
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

export default HabitListScreen
