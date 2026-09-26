import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { useDailyLogs } from '../hooks/useDailyLogs'
import { useCycles } from '../hooks/useCycles'
import SymptomPicker from '../components/SymptomPicker'
import { Check, ChevronLeft } from 'lucide-react'

const MOODS = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'irritable', emoji: '😤', label: 'Irritable' }
]

const FLOW_LEVELS = [
  { value: null, label: 'None', icon: '○' },
  { value: 'spotting', label: 'Spotting', icon: '💧' },
  { value: 'light', label: 'Light', icon: '🩸' },
  { value: 'medium', label: 'Medium', icon: '🩸🩸' },
  { value: 'heavy', label: 'Heavy', icon: '🩸🩸🩸' }
]

export default function Log() {
  const { date: dateParam } = useParams()
  const navigate = useNavigate()
  const logDate = dateParam || format(new Date(), 'yyyy-MM-dd')
  const displayDate = parseISO(logDate)
  const { logs, upsertLog, getLogForDate } = useDailyLogs()
  const { cycles, addCycle, updateCycle } = useCycles()
  const [flow, setFlow] = useState(null)
  const [mood, setMood] = useState('neutral')
  const [energy, setEnergy] = useState(3)
  const [temperature, setTemperature] = useState('')
  const [symptoms, setSymptoms] = useState({})
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [periodStart, setPeriodStart] = useState(false)
  const [periodEnd, setPeriodEnd] = useState(false)

  useEffect(() => {
    const existing = getLogForDate(logDate)
    if (existing) {
      setFlow(existing.flow_intensity)
      setMood(existing.mood || 'neutral')
      setEnergy(existing.energy || 3)
      setTemperature(existing.temperature ? String(existing.temperature) : '')
      setSymptoms(existing.symptoms || {})
      setNotes(existing.notes || '')
    }
  }, [logDate, logs])

  async function handleSave() {
    setSaving(true)
    await upsertLog({ date: logDate, flow_intensity: flow, mood, energy, temperature: temperature ? parseFloat(temperature) : null, symptoms, notes: notes || null })
    if (periodStart) await addCycle({ start_date: logDate })
    if (periodEnd && cycles[0] && !cycles[0].end_date) {
      const dur = Math.round((new Date(logDate) - new Date(cycles[0].start_date)) / 86400000) + 1
      await updateCycle(cycles[0].id, { end_date: logDate, period_duration: dur })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="page log-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)}><ChevronLeft size={24} /></button>
        <h1>{format(displayDate, 'MMM d, yyyy')}</h1>
        <div style={{ width: 40 }} />
      </header>

      <div className="log-section">
        <h3>Period</h3>
        <div className="period-actions">
          <button className={`btn-outline ${periodStart ? 'active' : ''}`} onClick={() => { setPeriodStart(!periodStart); if (!periodStart) setPeriodEnd(false) }}>Period Started</button>
          <button className={`btn-outline ${periodEnd ? 'active' : ''}`} onClick={() => { setPeriodEnd(!periodEnd); if (!periodEnd) setPeriodStart(false) }} disabled={!cycles[0] || !!cycles[0]?.end_date}>Period Ended</button>
        </div>
      </div>

      <div className="log-section">
        <h3>Flow</h3>
        <div className="flow-selector">
          {FLOW_LEVELS.map(l => <button key={l.label} className={`flow-btn ${flow === l.value ? 'active' : ''}`} onClick={() => setFlow(l.value)}><span className="flow-icon">{l.icon}</span><span>{l.label}</span></button>)}
        </div>
      </div>

      <div className="log-section">
        <h3>Mood</h3>
        <div className="mood-selector">
          {MOODS.map(m => <button key={m.value} className={`mood-btn ${mood === m.value ? 'active' : ''}`} onClick={() => setMood(m.value)}><span className="mood-emoji">{m.emoji}</span><span>{m.label}</span></button>)}
        </div>
      </div>

      <div className="log-section">
        <h3>Energy Level</h3>
        <div className="energy-selector">
          <input type="range" min="1" max="5" value={energy} onChange={e => setEnergy(Number(e.target.value))} className="energy-slider" />
          <div className="energy-labels"><span>Low</span><span className="energy-value">{energy}/5</span><span>High</span></div>
        </div>
      </div>

      <div className="log-section">
        <h3>Temperature (BBT)</h3>
        <div className="temp-input-wrapper">
          <input type="number" step="0.1" min="95" max="100" placeholder="e.g. 97.8" value={temperature} onChange={e => setTemperature(e.target.value)} className="temp-input" />
          <span className="temp-unit">°F</span>
        </div>
      </div>

      <div className="log-section"><h3>Symptoms</h3><SymptomPicker symptoms={symptoms} onChange={setSymptoms} /></div>

      <div className="log-section">
        <h3>Notes</h3>
        <textarea placeholder="How are you feeling today?" value={notes} onChange={e => setNotes(e.target.value)} className="notes-input" rows={3} />
      </div>

      <button className={`btn-primary save-btn ${saved ? 'saved' : ''}`} onClick={handleSave} disabled={saving}>
        {saved ? <><Check size={18} /> Saved!</> : saving ? 'Saving...' : 'Save Log'}
      </button>
    </div>
  )
}