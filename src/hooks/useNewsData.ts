import { useQuery } from '@tanstack/react-query'
import { fetchNews } from '../api/news'

export function useNewsData() {
  return useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    refetchInterval: 15 * 60 * 1000,
    staleTime: 14 * 60 * 1000,
  })
}
