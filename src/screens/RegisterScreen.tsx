"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useAuth } from "../context/AuthContext"
import type { StackNavigationProp } from "@react-navigation/stack"

type RegisterScreenNavigationProp = StackNavigationProp<any, "Register">

interface Props {
  navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const validateForm = (): boolean => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields")
      return false
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return false
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const success = await register(name.trim(), email.trim(), password)
      if (!success) {
        Alert.alert("Error", "Registration failed. Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your habit tracking journey today</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="👤 Full Name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="📧 Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="🔒 Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="🔒 Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Create Account 🎉"}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 64,
    textAlign: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 48,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#64748b",
  },
  linkText: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "600",
  },
})

export default RegisterScreen
