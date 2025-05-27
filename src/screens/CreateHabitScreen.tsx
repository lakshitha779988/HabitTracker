"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useHabits } from "../context/HabitContext"

const HABIT_EMOJIS = ["💪", "📚", "💧", "🏃", "🧘", "🥗", "😴", "🎯", "✍️", "🎵", "🎨", "🌱", "🧹", "💰", "📱", "🚫"]

const CreateHabitScreen: React.FC = () => {
  const [habitName, setHabitName] = useState("")
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily")
  const [selectedEmoji, setSelectedEmoji] = useState("💪")
  const [loading, setLoading] = useState(false)
  const { addHabit } = useHabits()

  const handleCreateHabit = async () => {
    if (!habitName.trim()) {
      Alert.alert("Error", "Please enter a habit name")
      return
    }

    setLoading(true)
    try {
      await addHabit(habitName.trim(), frequency, selectedEmoji)
      setHabitName("")
      setFrequency("daily")
      setSelectedEmoji("💪")
      Alert.alert("Success", "Habit created successfully! 🎉")
    } catch (error) {
      Alert.alert("Error", "Failed to create habit. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderFrequencyOption = (option: "daily" | "weekly", label: string, emoji: string) => (
    <TouchableOpacity
      style={[styles.frequencyOption, frequency === option && styles.selectedFrequency]}
      onPress={() => setFrequency(option)}
    >
      <Text style={styles.frequencyEmoji}>{emoji}</Text>
      <Text style={[styles.frequencyText, frequency === option && styles.selectedFrequencyText]}>{label}</Text>
      {frequency === option && <Text style={styles.checkEmoji}>✅</Text>}
    </TouchableOpacity>
  )

  const renderEmojiOption = (emoji: string) => (
    <TouchableOpacity
      key={emoji}
      style={[styles.emojiOption, selectedEmoji === emoji && styles.selectedEmoji]}
      onPress={() => setSelectedEmoji(emoji)}
    >
      <Text style={styles.emojiText}>{emoji}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Create New Habit ✨</Text>
            <Text style={styles.subtitle}>Start building a positive routine today</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>🏷️ Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Exercise, Read, Drink Water"
                value={habitName}
                onChangeText={setHabitName}
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
              />
              <Text style={styles.characterCount}>{habitName.length}/50</Text>
            </View>

            <View style={styles.emojiContainer}>
              <Text style={styles.label}>😊 Choose an Emoji</Text>
              <View style={styles.emojiGrid}>{HABIT_EMOJIS.map(renderEmojiOption)}</View>
            </View>

            <View style={styles.frequencyContainer}>
              <Text style={styles.label}>📅 Frequency</Text>
              <View style={styles.frequencyOptions}>
                {renderFrequencyOption("daily", "Daily", "🌅")}
                {renderFrequencyOption("weekly", "Weekly", "📆")}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.createButton, loading && styles.buttonDisabled]}
              onPress={handleCreateHabit}
              disabled={loading || !habitName.trim()}
            >
              <Text style={styles.createButtonText}>{loading ? "Creating... ⏳" : "Create Habit 🚀"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tips}>
            <Text style={styles.tipsTitle}>💡 Tips for Success</Text>
            <Text style={styles.tipText}>• Start small and be specific</Text>
            <Text style={styles.tipText}>• Choose habits you can do consistently</Text>
            <Text style={styles.tipText}>• Focus on one habit at a time</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "right",
    marginTop: 4,
  },
  emojiContainer: {
    marginBottom: 24,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emojiOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  selectedEmoji: {
    borderColor: "#6366f1",
    backgroundColor: "#f0f9ff",
  },
  emojiText: {
    fontSize: 24,
  },
  frequencyContainer: {
    marginBottom: 32,
  },
  frequencyOptions: {
    flexDirection: "row",
    gap: 12,
  },
  frequencyOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  selectedFrequency: {
    borderColor: "#6366f1",
    backgroundColor: "#f0f9ff",
  },
  frequencyEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  frequencyText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    flex: 1,
  },
  selectedFrequencyText: {
    color: "#6366f1",
  },
  checkEmoji: {
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  tips: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
    marginBottom: 4,
  },
})

export default CreateHabitScreen
