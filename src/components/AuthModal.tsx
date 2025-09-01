import React, { useState } from 'react'
import { X, User, Mail, Lock, UserCheck } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface AuthModalProps {
  mode: 'login' | 'signup'
  onClose: () => void
  onSwitchMode: (mode: 'login' | 'signup') => void
}

export default function AuthModal({ mode, onClose, onSwitchMode }: AuthModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'student' as 'student' | 'tutor'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let success = false
      
      if (mode === 'login') {
        success = await login(formData.email, formData.password, formData.userType)
      } else {
        success = await signup(formData.name, formData.email, formData.password, formData.userType)
      }

      if (success) {
        onClose()
        navigate(formData.userType === 'student' ? '/student' : '/tutor')
      } else {
        setError('Authentication failed. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Join EduBridge'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="h-4 w-4 inline mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="h-4 w-4 inline mr-2" />
                I am a:
              </label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                className="input"
                required
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}