const SYMPTOMS = [
  { key: 'cramps', label: 'Cramps', icon: '😣', type: 'severity' },
  { key: 'headache', label: 'Headache', icon: '🤕', type: 'severity' },
  { key: 'bloating', label: 'Bloating', icon: '🫧', type: 'severity' },
  { key: 'breast_tenderness', label: 'Breast Tenderness', icon: '💗', type: 'severity' },
  { key: 'acne', label: 'Acne', icon: '🔴', type: 'severity' },
  { key: 'back_pain', label: 'Back Pain', icon: '🔙', type: 'severity' },
  { key: 'nausea', label: 'Nausea', icon: '🤢', type: 'severity' },
  { key: 'cravings', label: 'Cravings', icon: '🍫', type: 'severity' },
  { key: 'insomnia', label: 'Poor Sleep', icon: '😴', type: 'severity' }
]

const SEVERITY_LEVELS = ['none', 'mild', 'moderate', 'severe']
const SEVERITY_COLORS = { none: 'var(--text-tertiary)', mild: '#F2B5A0', moderate: '#E8A0BF', severe: '#E85577' }

export default function SymptomPicker({ symptoms = {}, onChange }) {
  function toggle(key) {
    const current = symptoms[key] || 'none'
    const idx = SEVERITY_LEVELS.indexOf(current)
    onChange({ ...symptoms, [key]: SEVERITY_LEVELS[(idx + 1) % 4] })
  }

  return (
    <div className="symptom-picker">
      {SYMPTOMS.map(s => {
        const sev = symptoms[s.key] || 'none'
        const active = sev !== 'none'
        return (
          <button key={s.key} className={`symptom-btn ${active ? 'active' : ''}`} onClick={() => toggle(s.key)} style={active ? { borderColor: SEVERITY_COLORS[sev] } : {}}>
            <span className="symptom-icon">{s.icon}</span>
            <span className="symptom-label">{s.label}</span>
            <span className="symptom-severity" style={{ color: SEVERITY_COLORS[sev] }}>{sev !== 'none' ? sev : ''}</span>
          </button>
        )
      })}
      <p className="symptom-hint">Tap to cycle: none → mild → moderate → severe</p>
    </div>
  )
}

export { SYMPTOMS }