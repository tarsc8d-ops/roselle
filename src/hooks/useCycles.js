import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export function useCycles() {
  const { user } = useAuth()
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCycles = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', user.id)
      .order('start_date', { ascending: false })
    setCycles(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchCycles() }, [fetchCycles])

  async function addCycle(cycle) {
    const { data, error } = await supabase
      .from('cycles')
      .insert({ ...cycle, user_id: user.id })
      .select()
      .single()
    if (!error) {
      setCycles(prev => [data, ...prev])
      if (cycles.length > 0) {
        const prevCycle = cycles[0]
        const daysDiff = Math.round(
          (new Date(cycle.start_date) - new Date(prevCycle.start_date)) / (1000 * 60 * 60 * 24)
        )
        if (daysDiff > 0) {
          await supabase.from('cycles').update({ cycle_length: daysDiff }).eq('id', prevCycle.id)
          setCycles(prev => prev.map(c => c.id === prevCycle.id ? { ...c, cycle_length: daysDiff } : c))
        }
      }
    }
    return { data, error }
  }

  async function updateCycle(id, updates) {
    const { data, error } = await supabase
      .from('cycles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (!error) setCycles(prev => prev.map(c => c.id === id ? data : c))
    return { data, error }
  }

  async function deleteCycle(id) {
    const { error } = await supabase.from('cycles').delete().eq('id', id)
    if (!error) setCycles(prev => prev.filter(c => c.id !== id))
    return { error }
  }

  return { cycles, loading, addCycle, updateCycle, deleteCycle, latestCycle: cycles[0] || null, refetch: fetchCycles }
}