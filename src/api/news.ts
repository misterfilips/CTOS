import type { NewsArticle } from './types'

const GNEWS_KEY = import.meta.env.VITE_GNEWS_API_KEY || ''

export async function fetchNews(): Promise<NewsArticle[]> {
  // Try GNews first if key available
  if (GNEWS_KEY) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=Chicago&lang=en&country=us&max=10&apikey=${GNEWS_KEY}`
      )
      const data = await res.json()
      if (data.articles?.length) return data.articles
    } catch {
      // Fall through
    }
  }

  // Fallback: RSS via public CORS proxy
  try {
    const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=Chicago+crime+safety&hl=en-US&gl=US&ceid=US:en')
    const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`)
    const data = await res.json()
    if (data.status === 'ok' && data.items?.length) {
      return data.items.slice(0, 10).map((item: Record<string, string>) => ({
        title: item.title || '',
        description: item.description || '',
        url: item.link || '',
        image: item.thumbnail || item.enclosure?.link || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        source: { name: item.author || 'Google News', url: '' },
      }))
    }
  } catch {
    // Fall through
  }

  // Final fallback: hardcoded placeholder so the UI still shows
  return [
    { title: 'Chicago news feed loading...', description: '', url: '#', image: '', publishedAt: new Date().toISOString(), source: { name: 'System', url: '' } },
  ]
}
