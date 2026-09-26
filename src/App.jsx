import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import BottomNav from './components/BottomNav'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CalendarPage from './pages/Calendar'
import Log from './pages/Log'
import Insights from './pages/Insights'
import Account from './pages/Account'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-logo">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill="var(--primary)" opacity="0.2" />
            <path d="M24 8C24 8 32 16 32 24C32 32 24 40 24 40C24 40 16 32 16 24C16 16 24 8 24 8Z" fill="var(--primary)" />
          </svg>
        </div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
          <Route path="/log" element={<ProtectedRoute><Log /></ProtectedRoute>} />
          <Route path="/log/:date" element={<ProtectedRoute><Log /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {user && <BottomNav />}
    </div>
  )
}