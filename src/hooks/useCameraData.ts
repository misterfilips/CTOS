import { useQuery } from '@tanstack/react-query'
import { fetchCameraData } from '../api/nyc-open-data'

export function useCameraData() {
  return useQuery({
    queryKey: ['cameras'],
    queryFn: fetchCameraData,
    staleTime: 60 * 60 * 1000, // 1 hour — camera locations rarely change
    refetchInterval: 60 * 60 * 1000,
  })
}
