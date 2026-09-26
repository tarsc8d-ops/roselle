import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCycles } from '../hooks/useCycles'
import { useDailyLogs } from '../hooks/useDailyLogs'
import { getCurrentCycleDay, getCyclePhase, getDaysUntilNextPeriod, calculateAverages } from '../utils/cycleCalculations'
import CyclePhaseIndicator from '../components/CyclePhaseIndicator'
import NutritionCard from '../components/NutritionCard'
import { Droplets, Thermometer, Brain, CalendarDays } from 'lucide-react'
import { format } from 'date-fns'

export default function Dashboard() {
  const { profile } = useAuth()
  const { cycles, loading: cyclesLoading } = useCycles()
  const { logs } = useDailyLogs()
  const navigate = useNavigate()

  const { avgCycleLength, avgPeriodDuration } = useMemo(() => calculateAverages(cycles), [cycles])
  const latestCycle = cycles[0]
  const cycleDay = latestCycle ? getCurrentCycleDay(latestCycle.start_date) : null
  const phase = cycleDay ? getCyclePhase(cycleDay, avgCycleLength, avgPeriodDuration) : null
  const daysUntil = latestCycle ? getDaysUntilNextPeriod(latestCycle.start_date, avgCycleLength) : null
  const todayLog = logs.find(l => l.date === format(new Date(), 'yyyy-MM-dd'))

  const recentSymptoms = useMemo(() => {
    const last7 = logs.slice(0, 7)
    const counts = {}
    last7.forEach(log => {
      if (log.symptoms) Object.entries(log.symptoms).forEach(([k, v]) => {
        if (v && v !== 'none') counts[k] = (counts[k] || 0) + 1
      })
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k.replace(/_/g, ' '))
  }, [logs])

  if (cyclesLoading) return <div className="page-loading"><div className="spinner" /></div>

  return (
    <div className="page dashboard-page">
      <header className="page-header">
        <div>
          <h1>Hello{profile?.display_name ? `, ${profile.display_name.split(' ')[0]}` : ''}</h1>
          <p className="header-date">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        {profile?.avatar_url && <img src={profile.avatar_url} alt="" className="header-avatar" referrerPolicy="no-referrer" />}
      </header>

      {!latestCycle ? (
        <div className="empty-state">
          <div className="empty-icon">🌸</div>
          <h2>Welcome to Roselle</h2>
          <p>Log your first period to get started with cycle tracking, predictions, and personalized nutrition.</p>
          <button className="btn-primary" onClick={() => navigate('/log')}>
            <Droplets size={18} /> Log Your Period
          </button>
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="cycle-overview card">
              <CyclePhaseIndicator phase={phase} cycleDay={cycleDay} avgCycleLength={avgCycleLength} />
              {daysUntil !== null && daysUntil > 0 && (
                <p className="next-period">Next period in <strong>{daysUntil} day{daysUntil !== 1 ? 's' : ''}</strong></p>
              )}
              {daysUntil === 0 && <p className="next-period period-due">Period expected today</p>}
            </div>
            <div className="quick-stats">
              <div className="stat-card card" onClick={() => navigate('/insights')}>
                <Droplets size={20} style={{ color: '#E85577' }} />
                <div><span className="stat-value">{avgPeriodDuration}</span><span className="stat-label">Avg. period</span></div>
              </div>
              <div className="stat-card card" onClick={() => navigate('/insights')}>
                <Brain size={20} style={{ color: '#A06AB4' }} />
                <div><span className="stat-value">{avgCycleLength}</span><span className="stat-label">Avg. cycle</span></div>
              </div>
            </div>
          </div>

          {todayLog && (
            <div className="today-summary card">
              <h3>Today's Log</h3>
              <div className="today-tags">
                {todayLog.flow_intensity && <span className="tag flow-tag">Flow: {todayLog.flow_intensity}</span>}
                {todayLog.mood && todayLog.mood !== 'neutral' && <span className="tag mood-tag">Mood: {todayLog.mood}</span>}
                {todayLog.temperature && <span className="tag temp-tag">{todayLog.temperature}°F</span>}
              </div>
            </div>
          )}

          {recentSymptoms.length > 0 && (
            <div className="card"><h3>Recent Symptoms</h3>
              <div className="recent-symptoms">{recentSymptoms.map(s => <span key={s} className="tag symptom-tag">{s}</span>)}</div>
            </div>
          )}

          <div className="quick-actions">
            <button className="action-btn" onClick={() => navigate('/log')}><Droplets size={20} /><span>Log Today</span></button>
            <button className="action-btn" onClick={() => navigate('/log')}><Thermometer size={20} /><span>Add Temp</span></button>
            <button className="action-btn" onClick={() => navigate('/calendar')}><CalendarDays size={20} /><span>Calendar</span></button>
          </div>

          {phase && <NutritionCard phase={phase.phase} />}
        </>
      )}
    </div>
  )
}