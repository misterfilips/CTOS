import { create } from 'zustand'
import type { ActivityItem } from '../api/types'

export interface LayerVisibility {
  crime: boolean
  service311: boolean
  collisions: boolean
  news: boolean
  shootings: boolean
  cameras: boolean
  permits: boolean
  potholes: boolean
  buildings3d: boolean
}

interface DashboardState {
  layers: LayerVisibility
  toggleLayer: (layer: keyof LayerVisibility) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  selectedBorough: string | null  // used as district filter for Chicago
  setSelectedBorough: (b: string | null) => void
  timeRangeHours: number
  setTimeRangeHours: (h: number) => void
  liveTick: number
  incrementLiveTick: () => void
  introComplete: boolean
  setIntroComplete: (v: boolean) => void
  activityFeed: ActivityItem[]
  addActivity: (items: ActivityItem[]) => void
  selectedCamera: { lng: number; lat: number; props: Record<string, string> } | null
  setSelectedCamera: (c: { lng: number; lat: number; props: Record<string, string> } | null) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  layers: {
    crime: true,
    service311: true,
    collisions: true,
    news: true,
    shootings: true,
    cameras: true,
    permits: false,
    potholes: false,
    buildings3d: false,
  },
  toggleLayer: (layer) =>
    set((s) => ({ layers: { ...s.layers, [layer]: !s.layers[layer] } })),
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  selectedBorough: null,
  setSelectedBorough: (b) => set({ selectedBorough: b }),
  timeRangeHours: 2160, // 90d default
  setTimeRangeHours: (h) => set({ timeRangeHours: h }),
  liveTick: 0,
  incrementLiveTick: () => set((s) => ({ liveTick: s.liveTick + 1 })),
  introComplete: false,
  setIntroComplete: (v) => set({ introComplete: v }),
  activityFeed: [],
  addActivity: (items) =>
    set((s) => ({
      activityFeed: [...items, ...s.activityFeed].slice(0, 100),
    })),
  selectedCamera: null,
  setSelectedCamera: (c) => set({ selectedCamera: c }),
  darkMode: true,
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
}))
