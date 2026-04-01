import { useQuery } from '@tanstack/react-query'

export interface BuildingPermit {
  id: string
  permit_type: string
  issue_date: string
  latitude: string
  longitude: string
  street_number: string
  street_direction: string
  street_name: string
  work_description: string
}

async function fetchPermits(): Promise<BuildingPermit[]> {
  const d = new Date()
  d.setDate(d.getDate() - 90)
  const dateStr = d.toISOString().split('T')[0]
  const url = `https://data.cityofchicago.org/resource/ydr8-5enu.json?$where=issue_date >= '${dateStr}' AND latitude IS NOT NULL&$order=issue_date DESC&$limit=1000`
  const res = await fetch(url)
  return res.json()
}

export function usePermitData() {
  return useQuery({
    queryKey: ['permits'],
    queryFn: fetchPermits,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 25 * 60 * 1000,
  })
}
