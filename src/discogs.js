const TOKEN = import.meta.env.VITE_DISCOGS_TOKEN
const BASE   = 'https://api.discogs.com'
const AUTH   = {
  'Authorization': `Discogs token=${TOKEN}`,
  'User-Agent':    'VinilSeeker/1.0',
}

function parseArtistTitle(raw = '') {
  const sep = raw.indexOf(' - ')
  return sep === -1
    ? { artist: '', title: raw }
    : { artist: raw.slice(0, sep), title: raw.slice(sep + 3) }
}

function mapGenre(g = '') {
  const l = g.toLowerCase()
  if (l.includes('rock'))                              return 'rock'
  if (l.includes('metal'))                             return 'metal'
  if (l.includes('jazz'))                              return 'jazz'
  if (l.includes('pop'))                               return 'pop'
  if (l.includes('classic'))                           return 'classical'
  if (l.includes('electro'))                           return 'electronic'
  if (l.includes('israel') || l.includes('middle'))   return 'israeli'
  return null
}

function pickFormat(formats = []) {
  for (const k of ['2LP', 'LP', '12"', '7"', 'EP']) {
    if (formats.includes(k)) return k
  }
  return formats[0] ?? 'LP'
}

export function normalizeResult(item) {
  const { artist, title } = parseArtistTitle(item.title)
  return {
    id:        `discogs-${item.id}`,
    discogsId: item.id,
    title,
    artist,
    year:   item.year ? parseInt(item.year) : null,
    format: pickFormat(item.format ?? []),
    genre:  mapGenre(item.genre?.[0] ?? ''),
    genres: (item.genre ?? []).map(mapGenre).filter(Boolean),
    img:    item.cover_image || item.thumb || null,
    price:  null,
    city:   null,
    badge:  { label: 'Discogs', variant: 'dark' },
    source: 'discogs',
  }
}

export async function searchDiscogs(query, { page = 1 } = {}) {
  const params = new URLSearchParams({ q: query, type: 'release', format: 'Vinyl', per_page: 12, page })
  const res  = await fetch(`${BASE}/database/search?${params}`, { headers: AUTH })
  if (!res.ok) throw new Error(`Discogs ${res.status}`)
  const data = await res.json()
  return {
    results: (data.results ?? []).map(normalizeResult),
    total:   data.pagination?.items ?? 0,
    pages:   data.pagination?.pages ?? 1,
  }
}

export async function getDiscogsRelease(id) {
  const res = await fetch(`${BASE}/releases/${id}`, { headers: AUTH })
  if (!res.ok) throw new Error(`Discogs ${res.status}`)
  return res.json()
}

export function normalizeTracklist(discogsTracks = []) {
  return discogsTracks
    .filter(t => t.type_ !== 'heading' && t.position)
    .map(t => {
      const side = t.position?.[0]?.toUpperCase()
      return {
        side:     ['A', 'B', 'C', 'D'].includes(side) ? side : 'A',
        title:    t.title,
        duration: t.duration || '',
      }
    })
}
