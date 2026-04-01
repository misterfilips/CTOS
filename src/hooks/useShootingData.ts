import { useQuery } from '@tanstack/react-query'
import { fetchShootingData } from '../api/nyc-open-data'

export function useShootingData() {
  return useQuery({
    queryKey: ['shootings'],
    queryFn: fetchShootingData,
    refetchInterval: 10 * 60 * 1000,
    staleTime: 9 * 60 * 1000,
  })
}
