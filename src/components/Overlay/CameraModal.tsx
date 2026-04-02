import { useDashboardStore } from '../../store/dashboardStore'

export default function CameraModal() {
  const selectedCamera = useDashboardStore((s) => s.selectedCamera)
  const setSelectedCamera = useDashboardStore((s) => s.setSelectedCamera)
  const dark = useDashboardStore((s) => s.darkMode)

  if (!selectedCamera) return null

  const p = selectedCamera.props
  const type = p.camType || 'unknown'
  const intersection = p.intersection || 'Unknown Location'
  const approach = p.approach || ''
  const goLive = p.goLive || ''
  const isRedLight = type === 'red_light'
  const accentColor = isRedLight ? '#c45c5c' : '#b8963c'

  const close = () => setSelectedCamera(null)

  return (
    <div className="fixed z-[998] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
      <div
        className="rounded-lg w-[320px]"
        style={{
          padding: 10,
          background: dark ? 'rgba(10,10,10,0.97)' : 'rgba(255,255,255,0.97)',
          border: `1px solid ${accentColor}44`,
          backdropFilter: 'blur(12px)',
          fontFamily: 'JetBrains Mono, monospace',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold" style={{ color: accentColor }}>
            {isRedLight ? 'RED LIGHT CAMERA' : 'SPEED CAMERA'}
          </span>
          <button onClick={close} className="text-lg leading-none" style={{ color: dark ? '#666' : '#999' }}>&times;</button>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: dark ? '#666' : '#999' }}>Intersection</div>
            <div style={{ color: dark ? '#ccc' : '#333' }}>{intersection}</div>
          </div>
          {approach && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: dark ? '#666' : '#999' }}>Approach Direction</div>
              <div style={{ color: dark ? '#ccc' : '#333' }}>{approach}</div>
            </div>
          )}
          {goLive && (
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: dark ? '#666' : '#999' }}>Active Since</div>
              <div style={{ color: dark ? '#ccc' : '#333' }}>{new Date(goLive).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: dark ? '#666' : '#999' }}>Type</div>
            <div className="flex items-center gap-1.5" style={{ color: dark ? '#ccc' : '#333' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
              {isRedLight ? 'Red Light Enforcement' : 'Speed Enforcement (School/Park Zone)'}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-2 text-[10px] text-center" style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, color: dark ? '#555' : '#aaa' }}>
          Live feed not available in demo
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={close} />
    </div>
  )
}
