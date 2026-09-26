import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCycles } from '../hooks/useCycles'
import { useDailyLogs } from '../hooks/useDailyLogs'
import { calculateAverages, getPhaseForDate, getFertileWindow } from '../utils/cycleCalculations'

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const { cycles } = useCycles()
  const { logs, getLogForDate } = useDailyLogs({
    start: format(startOfMonth(subMonths(currentMonth, 1)), 'yyyy-MM-dd'),
    end: format(endOfMonth(addMonths(currentMonth, 1)), 'yyyy-MM-dd')
  })
  const navigate = useNavigate()
  const { avgCycleLength, avgPeriodDuration } = useMemo(() => calculateAverages(cycles), [cycles])
  const latestCycle = cycles[0]

  const calendarDays = useMemo(() => {
    const ms = startOfMonth(currentMonth)
    return eachDayOfInterval({ start: startOfWeek(ms), end: endOfWeek(endOfMonth(currentMonth)) })
  }, [currentMonth])

  const periodDays = useMemo(() => {
    const days = new Set()
    cycles.forEach(c => {
      const s = parseISO(c.start_date)
      const e = c.end_date ? parseISO(c.end_date) : addDays(s, (c.period_duration || avgPeriodDuration) - 1)
      eachDayOfInterval({ start: s, end: e }).forEach(d => days.add(format(d, 'yyyy-MM-dd')))
    })
    return days
  }, [cycles, avgPeriodDuration])

  const flowDays = useMemo(() => {
    const days = new Set()
    logs.forEach(l => { if (l.flow_intensity) days.add(l.date) })
    return days
  }, [logs])

  function getDayInfo(date) {
    const dateStr = format(date, 'yyyy-MM-dd')
    const isPeriod = periodDays.has(dateStr) || flowDays.has(dateStr)
    const log = getLogForDate(dateStr)
    const isFuture = date > new Date()
    let phase = latestCycle ? getPhaseForDate(date, latestCycle.start_date, avgCycleLength, avgPeriodDuration) : null
    let isFertile = false, isOvulation = false, isPredictedPeriod = false
    if (latestCycle) {
      const ls = parseISO(latestCycle.start_date)
      for (let i = 0; i < 6; i++) {
        const cs = addDays(ls, avgCycleLength * i)
        const od = Math.round(avgCycleLength - 14)
        const fs = addDays(cs, od - 5), fe = addDays(cs, od + 1)
        if (date >= fs && date <= fe) { isFertile = true; if (isSameDay(date, addDays(cs, od))) isOvulation = true }
        if (isFuture && i > 0) {
          const pe = addDays(cs, avgPeriodDuration - 1)
          if (date >= cs && date <= pe) isPredictedPeriod = true
        }
      }
    }
    return { isPeriod, isPredictedPeriod, isFertile, isOvulation, phase, log, isFuture }
  }

  const selLog = selectedDate ? getLogForDate(format(selectedDate, 'yyyy-MM-dd')) : null
  const selInfo = selectedDate ? getDayInfo(selectedDate) : null

  return (
    <div className="page calendar-page">
      <header className="page-header"><h1>Calendar</h1></header>
      <div className="calendar-nav">
        <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="icon-btn"><ChevronLeft size={24} /></button>
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="icon-btn"><ChevronRight size={24} /></button>
      </div>
      <div className="calendar-legend">
        <span className="legend-item"><span className="legend-dot period" />Period</span>
        <span className="legend-item"><span className="legend-dot fertile" />Fertile</span>
        <span className="legend-item"><span className="legend-dot ovulation" />Ovulation</span>
        <span className="legend-item"><span className="legend-dot predicted" />Predicted</span>
      </div>
      <div className="calendar-grid">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="calendar-weekday">{d}</div>)}
        {calendarDays.map(day => {
          const info = getDayInfo(day)
          const inMonth = isSameMonth(day, currentMonth)
          let cn = 'calendar-day'
          if (!inMonth) cn += ' other-month'
          if (isToday(day)) cn += ' today'
          if (selectedDate && isSameDay(day, selectedDate)) cn += ' selected'
          if (info.isPeriod) cn += ' period'
          if (info.isPredictedPeriod) cn += ' predicted-period'
          if (info.isFertile) cn += ' fertile'
          if (info.isOvulation) cn += ' ovulation'
          if (info.log) cn += ' has-log'
          return (
            <button key={day.toISOString()} className={cn} onClick={() => setSelectedDate(day)}>
              <span className="day-number">{format(day, 'd')}</span>
              {info.log && <span className="day-dot" />}
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="day-detail card">
          <div className="day-detail-header">
            <h3>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
            <button className="btn-sm" onClick={() => navigate(`/log/${format(selectedDate, 'yyyy-MM-dd')}`)}>{selLog ? 'Edit' : 'Log'}</button>
          </div>
          {selInfo?.phase && <span className="phase-badge" style={{ background: selInfo.phase.color + '22', color: selInfo.phase.color }}>{selInfo.phase.name} Phase</span>}
          {selInfo?.isOvulation && <span className="phase-badge" style={{ background: '#6BB87022', color: '#6BB870' }}>Estimated Ovulation</span>}
          {selInfo?.isFertile && !selInfo?.isOvulation && <span className="phase-badge" style={{ background: '#6BB87022', color: '#6BB870' }}>Fertile Window</span>}
          {selLog && (
            <div className="day-detail-content">
              {selLog.flow_intensity && <p>Flow: <strong>{selLog.flow_intensity}</strong></p>}
              {selLog.mood && <p>Mood: <strong>{selLog.mood}</strong></p>}
              {selLog.energy && <p>Energy: <strong>{selLog.energy}/5</strong></p>}
              {selLog.temperature && <p>Temperature: <strong>{selLog.temperature}°F</strong></p>}
              {selLog.symptoms && Object.entries(selLog.symptoms).filter(([,v]) => v && v !== 'none').length > 0 && (
                <div className="day-symptoms">{Object.entries(selLog.symptoms).filter(([,v]) => v && v !== 'none').map(([k,v]) => <span key={k} className="tag">{k.replace(/_/g,' ')}: {v}</span>)}</div>
              )}
              {selLog.notes && <p className="log-notes">{selLog.notes}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}