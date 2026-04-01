import { useQuery } from '@tanstack/react-query'
import { fetchCrimeData } from '../api/nyc-open-data'

export function useCrimeData() {
  return useQuery({
    queryKey: ['crime'],
    queryFn: fetchCrimeData,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  })
}
