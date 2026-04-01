import { useQuery } from '@tanstack/react-query'
import { fetchBikeStations, fetchBikeStatus } from '../api/citibike'

export function useBikeStations() {
  return useQuery({
    queryKey: ['bikeStations'],
    queryFn: fetchBikeStations,
    staleTime: 60 * 60 * 1000,
  })
}

export function useBikeStatus() {
  return useQuery({
    queryKey: ['bikeStatus'],
    queryFn: fetchBikeStatus,
    refetchInterval: 60 * 1000,
    staleTime: 50 * 1000,
  })
}
