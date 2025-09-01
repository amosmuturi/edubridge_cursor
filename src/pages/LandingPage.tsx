import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Search, MessageCircle, Shield, Clock, Star, Users, BookOpen, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from '../components/AuthModal'

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.userType === 'student' ? '/student' : '/tutor')
    }
  }, [isAuthenticated, user, navigate])

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EduBridge</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">How it Works</a>
              <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">About</a>
              <button onClick={() => openAuth('login')} className="btn btn-ghost">Login</button>
              <button onClick={() => openAuth('signup')} className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Find Your Perfect
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600"> Tutor</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect with expert tutors across all subjects. Learn at your own pace with personalized guidance and achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => openAuth('signup')} className="btn btn-primary text-lg px-8 py-3">
                  <Users className="h-5 w-5" />
                  Find a Tutor
                </button>
                <button onClick={() => openAuth('signup')} className="btn btn-outline text-lg px-8 py-3">
                  <GraduationCap className="h-5 w-5" />
                  Become a Tutor
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. Sarah Johnson</h3>
                    <p className="text-gray-600">Mathematics Expert</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
                </div>
                <p className="text-gray-700 mb-4">
                  "Helping students master calculus and algebra with personalized teaching methods."
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">$35/hr</span>
                  <button className="btn btn-primary">Connect</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EduBridge?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with human expertise to deliver the best tutoring experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-gray-600">AI-powered search to find the perfect tutor based on your needs and preferences.</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Direct Connection</h3>
              <p className="text-gray-600">Connect directly with tutors for instant communication and scheduling.</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Tutors</h3>
              <p className="text-gray-600">All tutors are verified and rated by students to ensure quality education.</p>
            </div>
            <div className="card text-center group hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Book sessions at your convenience with flexible scheduling options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in just three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Search</h3>
              <p className="text-gray-600 text-lg">
                Browse tutors by subject, location, or use our AI-powered search to find the perfect match for your learning needs.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Connect</h3>
              <p className="text-gray-600 text-lg">
                View detailed tutor profiles, read reviews, and connect directly to discuss your goals and schedule sessions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Learn</h3>
              <p className="text-gray-600 text-lg">
                Start your personalized learning journey with expert guidance and achieve your academic goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">About EduBridge</h2>
              <p className="text-lg text-gray-600 mb-6">
                EduBridge is a revolutionary tutoring platform that connects students with qualified tutors 
                using advanced AI technology. Our mission is to make quality education accessible to everyone, 
                regardless of location or background.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're struggling with math, need help with English, or want to excel in science, 
                our platform helps you find the perfect tutor to guide your learning journey.
              </p>
              <button onClick={() => openAuth('signup')} className="btn btn-primary text-lg px-8 py-3">
                <BookOpen className="h-5 w-5" />
                Start Learning Today
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">1000+</div>
                <p className="text-gray-600">Expert Tutors</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">5000+</div>
                <p className="text-gray-600">Happy Students</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
                <p className="text-gray-600">Subjects</p>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">4.9</div>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Learning?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have found their perfect tutor on EduBridge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => openAuth('signup')} className="bg-white text-primary-600 hover:bg-gray-50 btn text-lg px-8 py-3">
              <Users className="h-5 w-5" />
              Find a Tutor
            </button>
            <button onClick={() => openAuth('signup')} className="border-2 border-white text-white hover:bg-white hover:text-primary-600 btn text-lg px-8 py-3">
              <GraduationCap className="h-5 w-5" />
              Become a Tutor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="text-lg font-bold">EduBridge</span>
              </div>
              <p className="text-gray-400">
                Connecting students with expert tutors for better learning outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 mb-2">info@edubridge.com</p>
              <p className="text-gray-400">+254 700 660 694</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduBridge. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}