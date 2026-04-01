import type { CSSProperties, ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  color?: string
  style?: CSSProperties
}

export default function GlowCard({ children, className = '', color, style }: Props) {
  const borderColor = color || 'rgba(255,255,255,0.1)'
  return (
    <div
      className={`rounded-lg backdrop-blur-xl ${className}`}
      style={{
        background: 'rgba(10,10,10,0.9)',
        border: `1px solid ${borderColor}`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
