import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  className?: string
}

export default function AnimatedCounter({ value, duration = 800, className = '' }: Props) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)

  useEffect(() => {
    const start = prev.current
    const diff = value - start
    if (diff === 0) return
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(step)
      else prev.current = value
    }

    requestAnimationFrame(step)
  }, [value, duration])

  return <span className={`font-mono tabular-nums ${className}`}>{display.toLocaleString()}</span>
}
