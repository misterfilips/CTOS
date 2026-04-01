import { useQuery } from '@tanstack/react-query'
import { fetchRestaurantData } from '../api/nyc-open-data'

export function useRestaurantData() {
  return useQuery({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurantData,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 25 * 60 * 1000,
  })
}
