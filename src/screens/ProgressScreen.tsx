import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { useHabits } from "../context/HabitContext"

const ProgressScreen: React.FC = () => {
  const { habits, getTodayProgress, getWeeklyProgress } = useHabits()

  const todayProgress = getTodayProgress()
  const weeklyProgress = getWeeklyProgress()

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const renderProgressBar = (percentage: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.progressPercentage}>{percentage}%</Text>
      </View>
    )
  }

  const renderWeeklyChart = () => {
    const maxHeight = 80

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>📊 Weekly Progress</Text>
        <View style={styles.chart}>
          {weeklyProgress.map((progress, index) => (
            <View key={index} style={styles.chartBar}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max((progress / 100) * maxHeight, 4),
                    backgroundColor: progress > 0 ? "#6366f1" : "#e2e8f0",
                  },
                ]}
              />
              <Text style={styles.dayLabel}>{days[index]}</Text>
              <Text style={styles.percentageLabel}>{progress}%</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  const renderStats = () => {
    const totalHabits = habits.length
    const completedToday = Math.round((todayProgress / 100) * totalHabits)
    const weeklyAverage = Math.round(weeklyProgress.reduce((sum, progress) => sum + progress, 0) / 7)

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📝</Text>
          <Text style={styles.statNumber}>{totalHabits}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={styles.statNumber}>{completedToday}</Text>
          <Text style={styles.statLabel}>Completed Today</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📈</Text>
          <Text style={styles.statNumber}>{weeklyAverage}%</Text>
          <Text style={styles.statLabel}>Weekly Average</Text>
        </View>
      </View>
    )
  }

  const getMotivationMessage = () => {
    if (todayProgress === 100) {
      return {
        emoji: "🎉",
        title: "Perfect Day!",
        message: "You completed all your habits today! Amazing work!",
      }
    } else if (todayProgress >= 75) {
      return {
        emoji: "🔥",
        title: "Great Progress!",
        message: "You're doing fantastic! Just a few more habits to go.",
      }
    } else if (todayProgress >= 50) {
      return {
        emoji: "💪",
        title: "Keep Going!",
        message: "You're halfway there! Keep up the momentum.",
      }
    } else {
      return {
        emoji: "🌱",
        title: "Every Step Counts!",
        message: "Small steps lead to big changes. You've got this!",
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tracking 📊</Text>
          <Text style={styles.subtitle}>Keep up the great work!</Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No Progress Yet</Text>
            <Text style={styles.emptySubtitle}>Create some habits to start tracking your progress!</Text>
          </View>
        ) : (
          <>
            <View style={styles.todayProgressContainer}>
              <Text style={styles.todayTitle}>🌅 Today's Progress</Text>
              {renderProgressBar(todayProgress)}
              <Text style={styles.todayDescription}>
                You've completed {Math.round((todayProgress / 100) * habits.length)} out of {habits.length} habits today
              </Text>
            </View>

            {renderStats()}
            {renderWeeklyChart()}

            <View style={styles.motivationContainer}>
              {(() => {
                const motivation = getMotivationMessage()
                return (
                  <>
                    <Text style={styles.motivationTitle}>
                      {motivation.emoji} {motivation.title}
                    </Text>
                    <Text style={styles.motivationText}>{motivation.message}</Text>
                  </>
                )
              })()}
            </View>
          </>
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
  todayProgressContainer: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 12,
    backgroundColor: "#e2e8f0",
    borderRadius: 6,
    marginRight: 12,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6366f1",
    borderRadius: 6,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    minWidth: 40,
  },
  todayDescription: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: "#6366f1",
    borderRadius: 4,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: "#64748b",
    marginBottom: 4,
  },
  percentageLabel: {
    fontSize: 10,
    color: "#94a3b8",
  },
  motivationContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
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

export default ProgressScreen
