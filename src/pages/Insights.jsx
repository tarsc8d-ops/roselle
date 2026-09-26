import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { useCycles } from '../hooks/useCycles'
import { useDailyLogs } from '../hooks/useDailyLogs'
import { calculateAverages } from '../utils/cycleCalculations'
import TemperatureChart from '../components/TemperatureChart'
import { SYMPTOMS } from '../components/SymptomPicker'

export default function Insights() {
  const { cycles } = useCycles()
  const { logs } = useDailyLogs()
  const { avgCycleLength, avgPeriodDuration } = useMemo(() => calculateAverages(cycles), [cycles])
  const cycleLengths = useMemo(() => cycles.filter(c => c.cycle_length).map(c => c.cycle_length), [cycles])

  const variability = useMemo(() => {
    if (cycleLengths.length < 2) return null
    const mean = cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length
    const variance = cycleLengths.reduce((s, l) => s + Math.pow(l - mean, 2), 0) / cycleLengths.length
    return Math.round(Math.sqrt(variance) * 10) / 10
  }, [cycleLengths])

  const symptomPatterns = useMemo(() => {
    const counts = {}
    logs.forEach(l => { if (l.symptoms) Object.entries(l.symptoms).forEach(([k, v]) => { if (v && v !== 'none') { if (!counts[k]) counts[k] = { total: 0 }; counts[k].total++ } }) })
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total).slice(0, 8)
  }, [logs])

  const moodDist = useMemo(() => {
    const c = {}; logs.forEach(l => { if (l.mood) c[l.mood] = (c[l.mood] || 0) + 1 }); return c
  }, [logs])

  const emojis = { happy: '😊', calm: '😌', neutral: '😐', sad: '😢', anxious: '😰', irritable: '😤' }

  return (
    <div className="page insights-page">
      <header className="page-header"><h1>Insights</h1></header>
      <div className="insights-stats">
        <div className="card stat-box"><span className="stat-number">{avgCycleLength}</span><span className="stat-desc">Avg. Cycle</span></div>
        <div className="card stat-box"><span className="stat-number">{avgPeriodDuration}</span><span className="stat-desc">Avg. Period</span></div>
        <div className="card stat-box"><span className="stat-number">{cycles.length}</span><span className="stat-desc">Cycles</span></div>
        <div className="card stat-box"><span className="stat-number">{variability !== null ? `±${variability}` : '—'}</span><span className="stat-desc">Variability</span></div>
      </div>

      <div className="card"><h3>Temperature Chart</h3><TemperatureChart logs={logs} /></div>

      {symptomPatterns.length > 0 && (
        <div className="card"><h3>Common Symptoms</h3>
          <div className="symptom-bars">
            {symptomPatterns.map(([k, d]) => {
              const pct = Math.round((d.total / symptomPatterns[0][1].total) * 100)
              const si = SYMPTOMS.find(s => s.key === k)
              return <div key={k} className="symptom-bar-row"><span className="symptom-bar-label">{si?.icon} {k.replace(/_/g,' ')}</span><div className="symptom-bar-track"><div className="symptom-bar-fill" style={{ width: `${pct}%` }} /></div><span className="symptom-bar-count">{d.total}</span></div>
            })}
          </div>
        </div>
      )}

      {Object.keys(moodDist).length > 0 && (
        <div className="card"><h3>Mood Distribution</h3>
          <div className="mood-dist">
            {Object.entries(moodDist).sort((a,b) => b[1]-a[1]).map(([mood, count]) => {
              const total = Object.values(moodDist).reduce((a,b) => a+b, 0)
              return <div key={mood} className="mood-dist-item"><span className="mood-dist-emoji">{emojis[mood]||'😐'}</span><span className="mood-dist-label">{mood}</span><div className="mood-dist-bar"><div className="mood-dist-fill" style={{ width: `${(count/total)*100}%` }} /></div><span className="mood-dist-pct">{Math.round((count/total)*100)}%</span></div>
            })}
          </div>
        </div>
      )}

      <div className="card"><h3>Cycle History</h3>
        {cycles.length === 0 ? <p className="text-secondary">No cycles logged yet.</p> : (
          <div className="cycle-history">
            {cycles.map(c => (
              <div key={c.id} className="cycle-history-item">
                <div className="cycle-history-dates">
                  <span>{format(parseISO(c.start_date), 'MMM d, yyyy')}</span>
                  {c.end_date && <span> — {format(parseISO(c.end_date), 'MMM d, yyyy')}</span>}
                </div>
                <div className="cycle-history-stats">
                  {c.cycle_length && <span className="tag">{c.cycle_length}d cycle</span>}
                  {c.period_duration && <span className="tag">{c.period_duration}d period</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}