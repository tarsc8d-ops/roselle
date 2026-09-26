import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { LogOut, Moon, Sun, User } from 'lucide-react'

export default function Account() {
  const { user, profile, signOut, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [editing, setEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || '')

  async function handleSave() {
    await updateProfile({ display_name: displayName })
    setEditing(false)
  }

  return (
    <div className="page account-page">
      <header className="page-header"><h1>Account</h1></header>
      <div className="account-profile card">
        {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="account-avatar" referrerPolicy="no-referrer" /> : <div className="account-avatar-placeholder"><User size={32} /></div>}
        {editing ? (
          <div className="edit-name">
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="name-input" autoFocus />
            <div className="edit-actions">
              <button className="btn-sm" onClick={handleSave}>Save</button>
              <button className="btn-sm btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <h2>{profile?.display_name || 'User'}</h2>
            <p className="text-secondary">{user?.email}</p>
            <button className="btn-sm btn-ghost" onClick={() => { setDisplayName(profile?.display_name || ''); setEditing(true) }}>Edit Name</button>
          </div>
        )}
      </div>
      <div className="settings-list card">
        <button className="settings-item" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
      <div className="card">
        <button className="settings-item danger" onClick={signOut}><LogOut size={20} /><span>Sign Out</span></button>
      </div>
      <p className="account-footer text-secondary">Roselle v1.0 • Made with 🌺</p>
    </div>
  )
}