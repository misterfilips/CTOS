// Chicago Crime (ijzp-q8t2)
export interface CrimeIncident {
  id: string
  case_number: string
  date: string
  primary_type: string
  description: string
  location_description: string
  block: string
  beat: string
  district: string
  ward: string
  community_area: string
  arrest: string
  domestic: string
  latitude: string
  longitude: string
  year: string
}

// Chicago 311 (v6vf-nfxy)
export interface ServiceRequest311 {
  sr_number: string
  created_date: string
  sr_type: string
  sr_short_code: string
  status: string
  owner_department: string
  street_address: string
  ward: string
  community_area: string
  latitude: string
  longitude: string
}

// Chicago Shootings/Violence (gumc-mgzr)
export interface ShootingIncident {
  unique_id: string
  case_number: string
  date: string
  victimization_primary: string
  gunshot_injury_i: string
  incident_primary: string
  incident_iucr_secondary: string
  age: string
  sex: string
  race: string
  latitude: string
  longitude: string
  location_description: string
  ward: string
  community_area: string
  district: string
  beat: string
}

// Chicago Traffic Crashes (85ca-t3if)
export interface VehicleCollision {
  crash_record_id: string
  crash_date: string
  crash_type: string
  first_crash_type: string
  prim_contributory_cause: string
  weather_condition: string
  lighting_condition: string
  injuries_total: string
  injuries_fatal: string
  most_severe_injury: string
  hit_and_run_i: string
  damage: string
  beat_of_occurrence: string
  latitude: string
  longitude: string
  posted_speed_limit: string
  street_name: string
  street_no: string
  street_direction: string
}

// Chicago Traffic Congestion - Segments (n4j6-wkkf)
export interface TrafficSpeed {
  segmentid: string
  street: string
  _direction: string
  _fromst: string
  _tost: string
  _length: string
  _traffic: string   // current speed, -1 = no data
  _last_updt: string
  start_lon: string
  _lif_lat: string
  _lit_lon: string
  _lit_lat: string
  _strheading: string
}

// Chicago Enforcement Cameras (red light + speed)
export interface CameraLocation {
  type: 'red_light' | 'speed'
  intersection: string
  latitude: string
  longitude: string
  first_approach: string
  second_approach?: string
  go_live_date: string
  location_id?: string
}

export interface CitiBikeStation {
  station_id: string
  name: string
  lat: number
  lon: number
  capacity: number
}

export interface CitiBikeStationStatus {
  station_id: string
  num_bikes_available: number
  num_docks_available: number
  is_renting: boolean
  is_returning: boolean
}

export interface NewsArticle {
  title: string
  description: string
  url: string
  image: string
  publishedAt: string
  source: { name: string; url: string }
}

export interface ActivityItem {
  id: string
  type: 'crime' | '311' | 'shooting' | 'collision' | 'traffic' | 'news' | '911'
  text: string
  timestamp: Date
  color: string
}
