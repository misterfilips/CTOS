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

// Dark raster style using multiple fallback tile sources
export const DARK_STYLE: StyleSpecification = {
  version: 8,
  name: 'PULSE Dark',
  sources: {
    'dark-tiles': {
      type: 'raster',
      tiles: [
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
  glyphs: 'https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf',
}

// 3D buildings style using OpenFreeMap vector tiles (completely free, no key)
export const DARK_STYLE_3D: StyleSpecification = {
  version: 8,
  name: 'PULSE Dark 3D',
  sources: {
    'dark-tiles': {
      type: 'raster',
      tiles: [
        'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}@2x.png',
      ],
      tileSize: 256,
      attribution: '&copy; Stadia Maps &copy; OpenStreetMap',
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
  glyphs: 'https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf',
}

export function add3DBuildingLayer(_map: MapLibreMap) {
  // Buildings are now part of the style spec when 3D is enabled
}
