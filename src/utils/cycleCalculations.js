import { differenceInDays, addDays, startOfDay, parseISO } from 'date-fns'

export function calculateAverages(cycles) {
  if (!cycles || cycles.length === 0) return { avgCycleLength: 28, avgPeriodDuration: 5 }
  const completedCycles = cycles.filter(c => c.cycle_length)
  const cyclesWithDuration = cycles.filter(c => c.period_duration)
  const avgCycleLength = completedCycles.length > 0
    ? Math.round(completedCycles.reduce((sum, c) => sum + c.cycle_length, 0) / completedCycles.length)
    : 28
  const avgPeriodDuration = cyclesWithDuration.length > 0
    ? Math.round(cyclesWithDuration.reduce((sum, c) => sum + c.period_duration, 0) / cyclesWithDuration.length)
    : 5
  return { avgCycleLength, avgPeriodDuration }
}

export function getCurrentCycleDay(lastPeriodStart) {
  if (!lastPeriodStart) return null
  const start = typeof lastPeriodStart === 'string' ? parseISO(lastPeriodStart) : lastPeriodStart
  return differenceInDays(startOfDay(new Date()), startOfDay(start)) + 1
}

export function getCyclePhase(cycleDay, avgCycleLength = 28, avgPeriodDuration = 5) {
  if (!cycleDay || cycleDay < 1) return { phase: 'unknown', name: 'Unknown', color: '#888' }
  if (cycleDay <= avgPeriodDuration) return { phase: 'menstrual', name: 'Menstrual', color: '#E85577' }
  const ovulationDay = Math.round(avgCycleLength - 14)
  const follicularEnd = ovulationDay - 3
  const ovulationEnd = ovulationDay + 1
  if (cycleDay <= follicularEnd) return { phase: 'follicular', name: 'Follicular', color: '#4EADAD' }
  if (cycleDay <= ovulationEnd) return { phase: 'ovulation', name: 'Ovulation', color: '#6BB870' }
  return { phase: 'luteal', name: 'Luteal', color: '#A06AB4' }
}

export function predictNextPeriod(lastPeriodStart, avgCycleLength = 28) {
  if (!lastPeriodStart) return null
  const start = typeof lastPeriodStart === 'string' ? parseISO(lastPeriodStart) : lastPeriodStart
  return addDays(start, avgCycleLength)
}

export function getDaysUntilNextPeriod(lastPeriodStart, avgCycleLength = 28) {
  const nextPeriod = predictNextPeriod(lastPeriodStart, avgCycleLength)
  if (!nextPeriod) return null
  const days = differenceInDays(startOfDay(nextPeriod), startOfDay(new Date()))
  return Math.max(0, days)
}

export function getFertileWindow(lastPeriodStart, avgCycleLength = 28) {
  if (!lastPeriodStart) return null
  const start = typeof lastPeriodStart === 'string' ? parseISO(lastPeriodStart) : lastPeriodStart
  const ovulationDay = Math.round(avgCycleLength - 14)
  return {
    start: addDays(start, ovulationDay - 5),
    end: addDays(start, ovulationDay + 1),
    ovulation: addDays(start, ovulationDay)
  }
}

export function getPhaseForDate(date, lastPeriodStart, avgCycleLength = 28, avgPeriodDuration = 5) {
  if (!lastPeriodStart) return null
  const start = typeof lastPeriodStart === 'string' ? parseISO(lastPeriodStart) : lastPeriodStart
  const d = typeof date === 'string' ? parseISO(date) : date
  const daysSinceStart = differenceInDays(startOfDay(d), startOfDay(start))
  if (daysSinceStart < 0) return null
  const cycleDay = (daysSinceStart % avgCycleLength) + 1
  return getCyclePhase(cycleDay, avgCycleLength, avgPeriodDuration)
}