import { useQuery } from '@tanstack/react-query'
import { fetchCollisionData } from '../api/nyc-open-data'

export function useCollisionData() {
  return useQuery({
    queryKey: ['collisions'],
    queryFn: fetchCollisionData,
    refetchInterval: 5 * 60 * 1000,
    staleTime: 4 * 60 * 1000,
  })
}
