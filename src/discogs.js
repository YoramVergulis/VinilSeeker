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
