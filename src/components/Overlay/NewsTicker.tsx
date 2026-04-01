import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useNewsData } from '../../hooks/useNewsData'
import { useDashboardStore } from '../../store/dashboardStore'

export default function NewsTicker() {
  const { data: articles } = useNewsData()
  const visible = useDashboardStore((s) => s.layers.news)
  const [expanded, setExpanded] = useState(false)

  if (!visible || !articles?.length) return null

  return (
    <>
      {/* Collapsed: tab button at bottom center */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:scale-105"
          style={{
            background: 'rgba(15,15,35,0.9)',
            border: '1px solid rgba(187,102,255,0.3)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 15px rgba(187,102,255,0.1)',
          }}
        >
          <span className="text-base">📰</span>
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#bb66ff' }}>
            NEWS
          </span>
          <span className="text-[10px] font-mono" style={{ color: '#8892b0' }}>
            {articles.length} articles
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#bb66ff" strokeWidth="2">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      )}

      {/* Expanded: horizontal card bar */}
      {expanded && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500"
          style={{
            background: 'linear-gradient(to top, rgba(10,10,15,0.97), rgba(10,10,15,0.92))',
            borderTop: '1px solid rgba(187,102,255,0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-base">📰</span>
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: '#bb66ff' }}>
                Chicago News Feed
              </span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-all"
              style={{ color: '#8892b0' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>

          {/* Scrollable card row */}
          <div className="flex gap-3 px-4 pb-4 overflow-x-auto custom-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
            {articles.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 w-[280px] rounded-lg p-3 transition-all hover:scale-[1.02] hover:brightness-110 cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(187,102,255,0.12)',
                  scrollSnapAlign: 'start',
                }}
              >
                {article.image && (
                  <div
                    className="w-full h-24 rounded-md mb-2 bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${article.image})`,
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                  />
                )}
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: '#bb66ff' }}>
                  {article.source.name}
                </div>
                <div className="text-xs text-gray-200 line-clamp-2 leading-snug mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {article.title}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono" style={{ color: '#8892b0' }}>
                    {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : ''}
                  </span>
                  <span className="text-[10px]" style={{ color: '#bb66ff' }}>Read →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
