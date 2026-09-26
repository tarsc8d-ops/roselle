import { useLocation, useNavigate } from 'react-router-dom'
import { Home, CalendarDays, PenSquare, BarChart3, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { path: '/log', icon: PenSquare, label: 'Log' },
  { path: '/insights', icon: BarChart3, label: 'Insights' },
  { path: '/account', icon: User, label: 'Account' }
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {navItems.map(item => {
        const isActive = item.path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(item.path)
        return (
          <button
            key={item.path}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}