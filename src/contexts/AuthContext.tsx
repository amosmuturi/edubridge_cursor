import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  userType: 'student' | 'tutor'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, userType: 'student' | 'tutor') => Promise<boolean>
  signup: (name: string, email: string, password: string, userType: 'student' | 'tutor') => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string, userType: 'student' | 'tutor'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - in real app, this would call your backend
    if (email && password) {
      const mockUser: User = {
        id: '1',
        name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        userType
      }
      setUser(mockUser)
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, password: string, userType: 'student' | 'tutor'): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock signup - in real app, this would call your backend
    if (name && email && password) {
      const mockUser: User = {
        id: '1',
        name,
        email,
        userType
      }
      setUser(mockUser)
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}