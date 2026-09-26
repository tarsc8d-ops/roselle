import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signInWithGoogle } = useAuth()
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    await signInWithGoogle()
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="login-logo">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" fill="var(--primary)" opacity="0.15" />
            <circle cx="40" cy="40" r="24" fill="var(--primary)" opacity="0.25" />
            <path d="M40 12C40 12 56 24 56 40C56 56 40 68 40 68C40 68 24 56 24 40C24 24 40 12 40 12Z" fill="var(--primary)" />
            <circle cx="40" cy="36" r="4" fill="white" opacity="0.6" />
          </svg>
        </div>
        <h1 className="login-title">Roselle</h1>
        <p className="login-subtitle">Your cycle, your way</p>
        <p className="login-description">
          Track your period, understand your body, and get personalized nutrition recommendations for every phase of your cycle.
        </p>
        <div className="login-features">
          <div className="feature"><span>🌸</span><span>Period & symptom tracking</span></div>
          <div className="feature"><span>🥗</span><span>Phase-based nutrition</span></div>
          <div className="feature"><span>🌡️</span><span>Temperature charting</span></div>
          <div className="feature"><span>📊</span><span>Cycle insights & predictions</span></div>
        </div>
        <button className="google-btn" onClick={handleLogin} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  )
}