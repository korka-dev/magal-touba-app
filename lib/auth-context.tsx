"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "pelerin" | "responsable" | "admin"

export interface User {
  id: string
  name: string
  phone: string
  role: UserRole
  dahiraId?: string
}

interface AuthContextType {
  user: User | null
  login: (phone: string, password: string, role: UserRole) => Promise<void>
  register: (name: string, phone: string, password: string, role: UserRole) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (localStorage)
    const storedUser = localStorage.getItem("magal_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (phone: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulation d'appel API - À remplacer par un vrai backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: phone.replace(/\D/g, "").slice(-9), // Extraire les derniers chiffres comme nom temporaire
        phone,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("magal_user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, phone: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        phone,
        role,
      }

      setUser(mockUser)
      localStorage.setItem("magal_user", JSON.stringify(mockUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("magal_user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
