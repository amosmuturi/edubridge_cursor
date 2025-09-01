import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Search, MapPin, Clock, Star, MessageCircle, CreditCard, LogOut } from 'lucide-react'

interface Tutor {
  id: string
  name: string
  subject: string
  pricePerHour: number
  availability: string
  location: string
  bio: string
  rating: number
  totalSessions: number
  whatsappNumber: string
}

export default function StudentDashboard() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock tutors data
  const mockTutors: Tutor[] = [
    {
      id: '1',
      name: 'Dr. Emily Brown',
      subject: 'Mathematics',
      pricePerHour: 35,
      availability: 'Weekdays 6-9 PM, Weekends 10 AM-2 PM',
      location: 'New York, NY',
      bio: 'PhD in Mathematics with 10+ years of teaching experience. Specializing in calculus, algebra, and statistics.',
      rating: 4.9,
      totalSessions: 127,
      whatsappNumber: '+1234567890'
    },
    {
      id: '2',
      name: 'Prof. David Lee',
      subject: 'Physics',
      pricePerHour: 40,
      availability: 'Monday-Friday 4-8 PM',
      location: 'Boston, MA',
      bio: 'Experienced physics professor with expertise in mechanics, thermodynamics, and quantum physics.',
      rating: 4.8,
      totalSessions: 89,
      whatsappNumber: '+1234567891'
    },
    {
      id: '3',
      name: 'Maria Garcia',
      subject: 'English Literature',
      pricePerHour: 30,
      availability: 'Tuesday-Thursday 5-9 PM, Saturday 9 AM-1 PM',
      location: 'Los Angeles, CA',
      bio: 'English literature specialist with focus on classic and modern literature, essay writing, and creative writing.',
      rating: 4.7,
      totalSessions: 156,
      whatsappNumber: '+1234567892'
    },
    {
      id: '4',
      name: 'Dr. James Chen',
      subject: 'Computer Science',
      pricePerHour: 45,
      availability: 'Weekdays 7-10 PM, Sunday 2-6 PM',
      location: 'San Francisco, CA',
      bio: 'Software engineer with 15+ years experience. Teaching programming, algorithms, and software development.',
      rating: 4.9,
      totalSessions: 203,
      whatsappNumber: '+1234567893'
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      subject: 'Chemistry',
      pricePerHour: 35,
      availability: 'Monday, Wednesday, Friday 6-9 PM',
      location: 'Chicago, IL',
      bio: 'Chemistry professor specializing in organic chemistry, biochemistry, and laboratory techniques.',
      rating: 4.6,
      totalSessions: 78,
      whatsappNumber: '+1234567894'
    },
    {
      id: '6',
      name: 'Robert Taylor',
      subject: 'Biology',
      pricePerHour: 32,
      availability: 'Tuesday, Thursday 4-7 PM, Saturday 10 AM-2 PM',
      location: 'Miami, FL',
      bio: 'Biology expert with focus on cell biology, genetics, and ecology.',
      rating: 4.8,
      totalSessions: 112,
      whatsappNumber: '+1234567895'
    }
  ]

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    
    // Load tutors
    setTutors(mockTutors)
    setFilteredTutors(mockTutors)
  }, [isAuthenticated, navigate])

  const handleSearch = () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      let filtered = mockTutors
      
      if (searchQuery) {
        filtered = filtered.filter(tutor => 
          tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tutor.bio.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      
      if (selectedSubject) {
        filtered = filtered.filter(tutor => 
          tutor.subject.toLowerCase().includes(selectedSubject.toLowerCase())
        )
      }
      
      if (selectedLocation) {
        filtered = filtered.filter(tutor => 
          tutor.location.toLowerCase().includes(selectedLocation.toLowerCase())
        )
      }
      
      setFilteredTutors(filtered)
      setLoading(false)
    }, 500)
  }

  const searchBySubject = (subject: string) => {
    setSelectedSubject(subject)
    setSearchQuery('')
    setTimeout(handleSearch, 100)
  }

  const generateStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />)
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }
    
    return stars
  }

  const connectWithTutor = (tutor: Tutor) => {
    const message = `Hello! I'm interested in ${tutor.subject} tutoring. I found your profile on EduBridge.`
    const whatsappUrl = `https://wa.me/${tutor.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

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
        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Tutor</h1>
          <p className="text-gray-600 mb-6">Search by subject, location, or describe what you need help with</p>
          
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you need help with? (e.g., calculus, essay writing)"
                className="input"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                placeholder="Subject (optional)"
                className="input"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                placeholder="Location (optional)"
                className="input"
              />
            </div>
            <button onClick={handleSearch} className="btn btn-primary px-8">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Subjects:</h3>
            <div className="flex flex-wrap gap-2">
              {['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'Biology'].map((subject) => (
                <button
                  key={subject}
                  onClick={() => searchBySubject(subject)}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary-600 hover:text-white rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105"
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Tutors</h2>
            <div className="text-gray-600">
              {filteredTutors.length} tutor{filteredTutors.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Searching for tutors...</p>
            </div>
          ) : filteredTutors.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No tutors found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all available tutors.</p>
              <button onClick={() => {
                setSearchQuery('')
                setSelectedSubject('')
                setSelectedLocation('')
                setFilteredTutors(mockTutors)
              }} className="btn btn-outline">
                View All Tutors
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutors.map((tutor) => (
                <div key={tutor.id} className="card group hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                      <p className="text-primary-600 text-sm font-medium">{tutor.subject}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {generateStars(tutor.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {tutor.rating} ({tutor.totalSessions} sessions)
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-primary-600" />
                      {tutor.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-primary-600" />
                      {tutor.availability}
                    </div>
                  </div>

                  <div className="text-2xl font-bold text-green-600 mb-3">
                    ${tutor.pricePerHour}/hour
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tutor.bio}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => connectWithTutor(tutor)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white btn"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Connect
                    </button>
                    <button className="btn btn-outline">
                      <CreditCard className="h-4 w-4" />
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}