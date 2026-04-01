import { useDashboardStore } from '../../store/dashboardStore'

export default function BoroughFilter() {
  const selected = useDashboardStore((s) => s.selectedBorough)
  const setBorough = useDashboardStore((s) => s.setSelectedBorough)

  return (
    <div className="fixed top-28 left-56 z-40 flex gap-1">
      <button
        onClick={() => setBorough(null)}
        className="rounded text-[10px] font-mono tracking-[0.15em] transition-all"
        style={{
          padding: '8px 15px',
          background: !selected ? 'rgba(255,255,255,0.1)' : 'rgba(10,10,10,0.7)',
          color: !selected ? '#fff' : '#555',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        CITYWIDE
      </button>
    </div>
  )
}
