"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, AuthContextType } from "../types"
import { StorageService } from "../service/StorageService"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      const savedUser = await StorageService.getUser()
      if (savedUser) {
        setUser(savedUser)
      }
    } catch (error) {
      console.error("Error checking auth state:", error)
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      }

      await StorageService.saveUser(newUser)
      setUser(newUser)
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const savedUser = await StorageService.getUser()

      if (savedUser && savedUser.email === email && savedUser.password === password) {
        setUser(savedUser)
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await StorageService.clearAll()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
