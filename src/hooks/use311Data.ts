import { useQuery } from '@tanstack/react-query'
import { fetch311Data } from '../api/nyc-open-data'

export function use311Data() {
  return useQuery({
    queryKey: ['311'],
    queryFn: fetch311Data,
    refetchInterval: 60 * 1000, // Every minute for live data
    staleTime: 45 * 1000,
  })
}
