import type { CitiBikeStation, CitiBikeStationStatus } from './types'

const STATION_INFO_URL = 'https://gbfs.citibikenyc.com/gbfs/en/station_information.json'
const STATION_STATUS_URL = 'https://gbfs.citibikenyc.com/gbfs/en/station_status.json'

export async function fetchBikeStations(): Promise<CitiBikeStation[]> {
  const res = await fetch(STATION_INFO_URL)
  const data = await res.json()
  return data.data.stations
}

export async function fetchBikeStatus(): Promise<CitiBikeStationStatus[]> {
  const res = await fetch(STATION_STATUS_URL)
  const data = await res.json()
  return data.data.stations
}
