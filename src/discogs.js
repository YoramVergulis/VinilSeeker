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

const GENRE_MAP = [
  { test: l => l.includes('rock'),                            value: 'rock'       },
  { test: l => l.includes('metal'),                           value: 'metal'      },
  { test: l => l.includes('jazz'),                            value: 'jazz'       },
  { test: l => l.includes('pop'),                             value: 'pop'        },
  { test: l => l.includes('classic'),                         value: 'classical'  },
  { test: l => l.includes('electro'),                         value: 'electronic' },
  { test: l => l.includes('israel') || l.includes('middle'),  value: 'israeli'    },
]

const FORMAT_PRIORITY = ['2LP', 'LP', '12"', '7"', 'EP']

function mapGenre(g = '') {
  const l = g.toLowerCase()
  return GENRE_MAP.find(m => m.test(l))?.value ?? null
}

function pickFormat(formats = []) {
  const found = FORMAT_PRIORITY.find(k => formats.includes(k))
  return found ?? formats[0] ?? 'LP'
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

// Discogs placeholder SVGs are served from st.discogs.com — real art is on i.discogs.com
function isRealImg(url) {
  return !!(url && url.includes('i.discogs.com'))
}

// Normalize a search query: em/en dashes → space, strip backslashes, collapse whitespace
function normalizeQ(q) {
  return q.replace(/[–—]/g, ' ').replace(/\\/g, '').replace(/\s+/g, ' ').trim()
}

// Strip store-data noise from album titles:
//   1. "Artist – Title" or "Artist - Title" prefix
//   2. Edition notes in parens/brackets: (Black Vinyl), [2LP], (Official Soundtrack)
function cleanAlbumTitle(artist, title) {
  let t = title
  if (artist) {
    const esc = artist.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`^${esc}\\s*[–—\\-]\\s*`, 'i'), '')
  }
  // Strip any remaining "Something – " em/en dash prefix
  t = t.replace(/^[^–—]+(–|—)\s*/, '')
  // Strip parentheticals and brackets
  t = t.replace(/\s*[\(\[][^\)\]]*[\)\]]/g, '').trim()
  return t
}

// Search Discogs for a single query.
// Returns { id, img } where img is only set when a REAL cover image is found.
// id is returned even if img is null so callers can fetch the full release.
async function discogsSearch(q) {
  const normalized = normalizeQ(q)
  if (!normalized) return null
  const params = new URLSearchParams({ q: normalized, type: 'release', per_page: 10 })
  const res = await fetch(`${BASE}/database/search?${params}`, { headers: AUTH })
  if (!res.ok) return null
  const data = await res.json()
  const results = data.results ?? []
  // Prefer results with real (non-placeholder) cover art
  const withArt  = results.find(r => isRealImg(r.cover_image) || isRealImg(r.thumb))
  const fallback = results[0]
  const hit = withArt || fallback
  if (!hit) return null
  const imgUrl = hit.cover_image || hit.thumb || ''
  return { id: hit.id, img: isRealImg(imgUrl) ? imgUrl : null }
}

// Look up a store item on Discogs.
// quick=true  — 1 API call max (background batch; must stay under 60 req/min rate limit).
// quick=false — up to 4 progressively looser queries (ProductPage single-item lookup).
//
// Returns { id, img }:
//   img — real cover URL (i.discogs.com), or null if only placeholder art found.
//   id  — best Discogs release match (lets caller do getDiscogsRelease for full images).
export async function lookupDiscogs(artist, title, { quick = false } = {}) {
  const clean = cleanAlbumTitle(artist, title)
  const seen  = new Set()
  const candidates = [
    `${artist} ${clean}`,  // "Alice In Chains Dirt"  /  "St. Vincent The Nowhere Inn"
    clean,                  // "Dirt"  /  "The Nowhere Inn"  — artist-name-mismatch fallback
    `${artist} ${title}`,  // original with parens
    title,
  ]
  const toTry = quick ? candidates.slice(0, 1) : candidates

  let bestId = null
  for (const q of toTry) {
    const key = normalizeQ(q)
    if (!key || seen.has(key)) continue
    seen.add(key)
    const hit = await discogsSearch(q)
    if (!hit) continue
    if (!bestId) bestId = hit.id
    if (hit.img) return hit  // found real art — stop here
  }
  // Return id even without real art so ProductPage can call getDiscogsRelease for full images
  return { id: bestId, img: null }
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
