import { useQuery } from '@tanstack/react-query'
import { fetchAllSubwayFeeds } from '../api/mta'

export function useSubwayData() {
  return useQuery({
    queryKey: ['subway'],
    queryFn: fetchAllSubwayFeeds,
    refetchInterval: 30 * 1000,
    staleTime: 25 * 1000,
  })
}
