"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ScrollView } from "react-native"
import { useAuth } from "../context/AuthContext"
import { useHabits } from "../context/HabitContext"

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth()
  const { habits, completions } = useHabits()

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout? This will clear all your data.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ])
  }

  const getTotalCompletions = () => {
    return completions.length
  }

  const getJoinDate = () => {
    if (!user?.createdAt) return "Unknown"
    const date = new Date(user.createdAt)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderProfileInfo = () => (
    <View style={styles.profileCard}>
      <Text style={styles.avatarEmoji}>👤</Text>
      <Text style={styles.userName}>{user?.name}</Text>
      <Text style={styles.userEmail}>{user?.email}</Text>
      <Text style={styles.joinDate}>📅 Member since {getJoinDate()}</Text>
    </View>
  )

  const renderStats = () => (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>📊 Your Statistics</Text>

      <View style={styles.statRow}>
        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>📝</Text>
          <Text style={styles.statNumber}>{habits.length}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statEmoji}>✅</Text>
          <Text style={styles.statNumber}>{getTotalCompletions()}</Text>
          <Text style={styles.statLabel}>Completions</Text>
        </View>
      </View>
    </View>
  )

  const renderSettings = () => (
    <View style={styles.settingsCard}>
      <Text style={styles.settingsTitle}>⚙️ Settings</Text>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingEmoji}>🔔</Text>
        <Text style={styles.settingText}>Notifications</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingEmoji}>🌙</Text>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingEmoji}>❓</Text>
        <Text style={styles.settingText}>Help & Support</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingEmoji}>ℹ️</Text>
        <Text style={styles.settingText}>About</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile 👤</Text>
        </View>

        {renderProfileInfo()}
        {renderStats()}
        {renderSettings()}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutEmoji}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>🎯 Habit Tracker v1.0.0</Text>
          <Text style={styles.footerSubtext}>Build good habits, break bad ones!</Text>
        </View>
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
  },
  profileCard: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: "#94a3b8",
  },
  statsCard: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
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
  settingsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    padding: 20,
    paddingBottom: 0,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  settingEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
  },
  chevron: {
    fontSize: 18,
    color: "#94a3b8",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 32,
  },
  logoutEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#cbd5e1",
  },
})

export default ProfileScreen
