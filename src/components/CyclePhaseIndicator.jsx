export default function CyclePhaseIndicator({ phase, cycleDay, avgCycleLength = 28 }) {
  if (!phase || !cycleDay) return null
  const progress = Math.min((cycleDay / avgCycleLength) * 100, 100)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="phase-indicator">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="70" cy="70" r="54" fill="none" stroke={phase.color} strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="phase-inner">
        <span className="phase-day">Day {cycleDay}</span>
        <span className="phase-name" style={{ color: phase.color }}>{phase.name}</span>
      </div>
    </div>
  )
}