import { useDashboardStore } from '../../store/dashboardStore'

export default function CameraModal() {
  const selectedCamera = useDashboardStore((s) => s.selectedCamera)
  const setSelectedCamera = useDashboardStore((s) => s.setSelectedCamera)

  if (!selectedCamera) return null

  const p = selectedCamera.props
  const type = p.camType || 'unknown'
  const intersection = p.intersection || 'Unknown Location'
  const approach = p.approach || ''
  const goLive = p.goLive || ''
  const isRedLight = type === 'red_light'
  const accentColor = isRedLight ? '#ff2244' : '#ffaa00'

  const close = () => setSelectedCamera(null)

  return (
    <div className="fixed z-[998] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <div
        className="p-4 rounded-xl w-[320px]"
        style={{
          background: 'rgba(15,15,35,0.97)',
          border: `1px solid ${accentColor}44`,
          boxShadow: `0 0 30px ${accentColor}22`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold" style={{ color: accentColor }}>
            📹 {isRedLight ? 'RED LIGHT CAMERA' : 'SPEED CAMERA'}
          </span>
          <button onClick={close} className="text-gray-500 hover:text-white text-lg leading-none">&times;</button>
        </div>

        {/* Info */}
        <div className="space-y-2 text-xs" style={{ color: '#ccc' }}>
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Intersection</div>
            <div className="text-sm text-white">{intersection}</div>
          </div>
          {approach && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Approach Direction</div>
              <div>{approach}</div>
            </div>
          )}
          {goLive && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Active Since</div>
              <div>{new Date(goLive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#8892b0' }}>Type</div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              {isRedLight ? 'Red Light Enforcement' : 'Speed Enforcement (School/Park Zone)'}
            </div>
          </div>
        </div>

        {/* Feed status */}
        <div className="mt-3 pt-2 text-[10px] text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>
          Live feed not available in demo
        </div>
      </div>
      {/* Click backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={close} />
    </div>
  )
}
