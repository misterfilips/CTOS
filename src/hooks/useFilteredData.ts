import { useMemo } from 'react'
import { useDashboardStore } from '../store/dashboardStore'
import { getTimeCutoff, passesTimeFilter } from '../utils/geo'
import { useCrimeData } from './useCrimeData'
import { use311Data } from './use311Data'
import { useShootingData } from './useShootingData'
import { useCollisionData } from './useCollisionData'

export function useFilteredCrime() {
  const { data } = useCrimeData()
  const district = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  return useMemo(() => {
    if (!data) return []
    const cutoff = getTimeCutoff(timeRange)
    return data.filter((d) => {
      if (district && d.district !== district) return false
      return passesTimeFilter(d.date, cutoff)
    })
  }, [data, district, timeRange, liveTick])
}

export function useFiltered311() {
  const { data } = use311Data()
  const district = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  return useMemo(() => {
    if (!data) return []
    const cutoff = getTimeCutoff(timeRange)
    return data.filter((d) => {
      if (district && d.ward !== district) return false
      return passesTimeFilter(d.created_date, cutoff)
    })
  }, [data, district, timeRange, liveTick])
}

export function useFilteredShootings() {
  const { data } = useShootingData()
  const district = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  return useMemo(() => {
    if (!data) return []
    const cutoff = getTimeCutoff(timeRange)
    return data.filter((d) => {
      if (district && d.district !== district) return false
      return passesTimeFilter(d.date, cutoff)
    })
  }, [data, district, timeRange, liveTick])
}

export function useFilteredCollisions() {
  const { data } = useCollisionData()
  const district = useDashboardStore((s) => s.selectedBorough)
  const timeRange = useDashboardStore((s) => s.timeRangeHours)
  const liveTick = useDashboardStore((s) => s.liveTick)

  return useMemo(() => {
    if (!data) return []
    const cutoff = getTimeCutoff(timeRange)
    return data.filter((d) => {
      if (district && d.beat_of_occurrence !== district) return false
      return passesTimeFilter(d.crash_date, cutoff)
    })
  }, [data, district, timeRange, liveTick])
}

