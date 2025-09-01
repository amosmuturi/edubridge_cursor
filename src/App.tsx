import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import TutorDashboard from './pages/TutorDashboard'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/tutor" element={<TutorDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App