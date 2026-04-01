export const COLORS = {
  bg: '#0a0a0f',
  bgCard: 'rgba(15, 15, 35, 0.85)',
  primary: '#00f0ff',
  alert: '#ff0066',
  warning: '#ffaa00',
  success: '#00ff88',
  textPrimary: '#ffffff',
  textSecondary: '#8892b0',
  borderGlow: 'rgba(0, 240, 255, 0.15)',
} as const

export const LAYER_COLORS = {
  crime: '#ff3366',
  misdemeanor: '#ff8800',
  violation: '#ffcc00',
  shooting: '#ff0033',
  service311: '#4488ff',
  collision: '#ff8800',
  trafficFast: '#00ff88',
  trafficMedium: '#ffaa00',
  trafficSlow: '#ff3333',
  subway: '#00f0ff',
  bike: '#00ff88',
  restaurant: '#ffaa00',
  news: '#bb66ff',
} as const

export const SUBWAY_LINE_COLORS: Record<string, string> = {
  '1': '#EE352E', '2': '#EE352E', '3': '#EE352E',
  '4': '#00933C', '5': '#00933C', '6': '#00933C',
  '7': '#B933AD',
  A: '#0039A6', C: '#0039A6', E: '#0039A6',
  B: '#FF6319', D: '#FF6319', F: '#FF6319', M: '#FF6319',
  G: '#6CBE45',
  J: '#996633', Z: '#996633',
  L: '#A7A9AC',
  N: '#FCCC0A', Q: '#FCCC0A', R: '#FCCC0A', W: '#FCCC0A',
  S: '#808183',
}
