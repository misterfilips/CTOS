import type { Map as MapLibreMap, StyleSpecification } from 'maplibre-gl'

export const MAP_INITIAL_VIEW = {
  longitude: -87.68,
  latitude: 41.85,
  zoom: 11.5,
  pitch: 50,
  bearing: 0,
} as const

export const MAP_CINEMATIC_START = {
  longitude: -87.68,
  latitude: 41.85,
  zoom: 9,
  pitch: 0,
  bearing: 0,
} as const

// CartoDB dark tiles — completely free, no API key, no domain restrictions
const DARK_TILES = [
  'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
  'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
]

export const DARK_STYLE: StyleSpecification = {
  version: 8,
  name: 'ctOS Dark',
  sources: {
    'dark-tiles': {
      type: 'raster',
      tiles: DARK_TILES,
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: 'dark-tiles-layer',
      type: 'raster',
      source: 'dark-tiles',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
}

export const DARK_STYLE_3D: StyleSpecification = {
  version: 8,
  name: 'ctOS Dark 3D',
  sources: {
    'dark-tiles': {
      type: 'raster',
      tiles: DARK_TILES,
      tileSize: 256,
      attribution: '&copy; CARTO &copy; OpenStreetMap',
    },
    'openmaptiles': {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
    },
  },
  layers: [
    {
      id: 'dark-tiles-layer',
      type: 'raster',
      source: 'dark-tiles',
      minzoom: 0,
      maxzoom: 20,
    },
    {
      id: '3d-buildings',
      source: 'openmaptiles',
      'source-layer': 'building',
      type: 'fill-extrusion',
      minzoom: 13,
      paint: {
        'fill-extrusion-color': '#1a1a2e',
        'fill-extrusion-height': ['coalesce', ['get', 'render_height'], 10],
        'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
        'fill-extrusion-opacity': 0.7,
      },
    },
  ],
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
}

export function add3DBuildingLayer(_map: MapLibreMap) {
  // Buildings are now part of the style spec when 3D is enabled
}
