import { useQuery } from '@tanstack/react-query'

export interface PotholeReport {
  sr_number: string
  created_date: string
  latitude: string
  longitude: string
  street_address: string
  status: string
}

async function fetchPotholes(): Promise<PotholeReport[]> {
  const d = new Date()
  d.setDate(d.getDate() - 90)
  const dateStr = d.toISOString().split('T')[0]
  const url = `https://data.cityofchicago.org/resource/v6vf-nfxy.json?$where=sr_type='Pothole in Street Complaint' AND created_date >= '${dateStr}' AND latitude IS NOT NULL&$order=created_date DESC&$limit=3000`
  const res = await fetch(url)
  return res.json()
}

export function usePotholeData() {
  return useQuery({
    queryKey: ['potholes'],
    queryFn: fetchPotholes,
    refetchInterval: 30 * 60 * 1000,
    staleTime: 25 * 60 * 1000,
  })
}
