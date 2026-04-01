import AnimatedCounter from '../common/AnimatedCounter'
import {
  useFilteredCrime,
  useFiltered311,
  useFilteredShootings,
  useFilteredCollisions,
} from '../../hooks/useFilteredData'

export default function StatsPanel() {
  const crime = useFilteredCrime()
  const service311 = useFiltered311()
  const shootings = useFilteredShootings()
  const collisions = useFilteredCollisions()

  // Combine crime + shootings for total incidents
  const totalIncidents = crime.length + shootings.length
  const arrests = crime.filter(c => c.arrest === 'true').length
  const homicides = shootings.filter(s => s.victimization_primary?.toUpperCase() === 'HOMICIDE').length
  const fatal = collisions.filter(c => parseInt(c.injuries_fatal) > 0).length

  const stats = [
    { label: 'INCIDENTS', value: totalIncidents, color: '#c45c5c' },
    { label: 'SHOOTINGS', value: shootings.length, color: '#b84040' },
    { label: 'HOMICIDES', value: homicides, color: '#b84040' },
    { label: 'ARRESTS', value: arrests, color: '#c45c5c' },
    { label: 'CRASHES', value: collisions.length, color: '#b8963c' },
    { label: '311 ACTIVE', value: service311.length, color: '#6688aa' },
  ]

  return (
    <div className="grid grid-cols-3 gap-2 mb-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="text-center"
          style={{ padding: '10px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>
            {s.label}
          </div>
          <div className="text-base font-bold" style={{ color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>
            <AnimatedCounter value={s.value} />
          </div>
        </div>
      ))}
    </div>
  )
}
