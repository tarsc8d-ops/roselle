import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

export default function TemperatureChart({ logs }) {
  if (!logs || logs.length === 0) return <div className="empty-chart"><p>No temperature data yet. Start logging your BBT!</p></div>

  const data = logs
    .filter(l => l.temperature)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((l, i) => ({
      day: i + 1,
      temp: Number(l.temperature),
      label: new Date(l.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))

  if (data.length === 0) return <div className="empty-chart"><p>No temperature data yet. Start logging your BBT!</p></div>

  const temps = data.map(d => d.temp)
  const minT = Math.floor(Math.min(...temps) * 2) / 2 - 0.5
  const maxT = Math.ceil(Math.max(...temps) * 2) / 2 + 0.5
  const avg = temps.reduce((a, b) => a + b, 0) / temps.length

  return (
    <div className="temperature-chart">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis domain={[minT, maxT]} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={v => `${v}°`} />
          <Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }} formatter={v => [`${v}°F`, 'Temp']} />
          <ReferenceLine y={avg} stroke="var(--primary)" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="temp" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--primary)', r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}