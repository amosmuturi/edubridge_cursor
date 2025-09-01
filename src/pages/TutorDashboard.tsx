import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Star, Users, Calendar, DollarSign, Save, RefreshCw, LogOut } from 'lucide-react'

interface TutorProfile {
  subject: string
  pricePerHour: number
  availability: string
  whatsappNumber: string
  location: string
  bio: string
  rating: number
  totalSessions: number
}

export default function TutorDashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<TutorProfile>({
    subject: '',
    pricePerHour: 25,
    availability: '',
    whatsappNumber: '',
    location: '',
    bio: '',
    rating: 4.8,
    totalSessions: 45
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    
    // Load existing profile (mock data)
    setProfile({
      subject: 'Mathematics',
      pricePerHour: 35,
      availability: 'Weekdays 6-9 PM, Weekends 10 AM-2 PM',
      whatsappNumber: '+1234567890',
      location: 'New York, NY',
      bio: 'PhD in Mathematics with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.',
      rating: 4.8,
      totalSessions: 45
    })
  }, [isAuthenticated, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: name === 'pricePerHour' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSaved(true)
    setLoading(false)
    
    // Hide success message after 3 seconds
    setTimeout(() => setSaved(false), 3000)
  }

  const thisMonthSessions = Math.floor(profile.totalSessions * 0.3)
  const totalEarnings = profile.totalSessions * profile.pricePerHour

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EduBridge</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.name}!</span>
              <button onClick={logout} className="btn btn-ghost">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{profile.rating}</div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{profile.totalSessions}</div>
            <p className="text-gray-600">Total Sessions</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{thisMonthSessions}</div>
            <p className="text-gray-600">This Month</p>
          </div>
          
          <div className="card text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">${totalEarnings.toLocaleString()}</div>
            <p className="text-gray-600">Total Earnings</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h2>
            <p className="text-gray-600">Keep your profile updated to attract more students</p>
          </div>

          {saved && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              Profile saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject/Subject Area *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={profile.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Physics, English Literature"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Hour ($) *
                </label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={profile.pricePerHour}
                  onChange={handleInputChange}
                  min="10"
                  max="200"
                  step="5"
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                  placeholder="e.g., New York, NY or Online"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  name="whatsappNumber"
                  value={profile.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="input"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability *
              </label>
              <textarea
                name="availability"
                value={profile.availability}
                onChange={handleInputChange}
                rows={3}
                placeholder="e.g., Weekdays 6-9 PM, Weekends 10 AM-2 PM"
                className="input resize-none"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio/About Me
              </label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell students about your teaching experience, qualifications, and teaching style..."
                className="input resize-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button type="button" className="btn btn-outline">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tips to Attract More Students</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">Add a detailed bio, clear availability, and competitive pricing to stand out.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Be Responsive</h3>
              <p className="text-gray-600">Reply quickly to student inquiries to build trust and increase bookings.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintain Quality</h3>
              <p className="text-gray-600">Deliver excellent sessions to earn positive reviews and recommendations.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}