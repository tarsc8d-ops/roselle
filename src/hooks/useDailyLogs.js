import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

export function useDailyLogs(dateRange) {
  const { user } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    if (!user) return
    setLoading(true)
    let query = supabase
      .from('daily_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
    if (dateRange?.start) query = query.gte('date', dateRange.start)
    if (dateRange?.end) query = query.lte('date', dateRange.end)
    if (!dateRange) query = query.limit(90)
    const { data } = await query
    setLogs(data || [])
    setLoading(false)
  }, [user, dateRange?.start, dateRange?.end])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  async function upsertLog(log) {
    const dateStr = typeof log.date === 'string' ? log.date : format(log.date, 'yyyy-MM-dd')
    const { data, error } = await supabase
      .from('daily_logs')
      .upsert({ ...log, date: dateStr, user_id: user.id }, { onConflict: 'user_id,date' })
      .select()
      .single()
    if (!error) {
      setLogs(prev => {
        const idx = prev.findIndex(l => l.date === dateStr)
        if (idx >= 0) { const u = [...prev]; u[idx] = data; return u }
        return [data, ...prev]
      })
    }
    return { data, error }
  }

  function getLogForDate(date) {
    const dateStr = typeof date === 'string' ? date : format(date, 'yyyy-MM-dd')
    return logs.find(l => l.date === dateStr) || null
  }

  return { logs, loading, upsertLog, getLogForDate, refetch: fetchLogs }
}