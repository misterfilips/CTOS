import type { CSSProperties, ReactNode } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'

interface Props {
  children: ReactNode
  className?: string
  color?: string
  style?: CSSProperties
}

export default function GlowCard({ children, className = '', color, style }: Props) {
  const dark = useDashboardStore((s) => s.darkMode)
  const borderColor = color || (dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
  return (
    <div
      className={`rounded-lg backdrop-blur-xl ${className}`}
      style={{
        background: dark ? 'rgba(10,10,10,0.9)' : 'rgba(255,255,255,0.9)',
        border: `1px solid ${borderColor}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
