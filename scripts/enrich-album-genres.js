/**
 * Enrich albums table with genres from the Discogs API.
 *
 * Usage: node scripts/enrich-album-genres.js
 *
 * Requires in .env:
 *   VITE_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (or VITE_SUPABASE_ANON_KEY as fallback)
 *   VITE_DISCOGS_TOKEN
 *
 * Fetches every album row that has a discogs_id but an empty genres array,
 * calls Discogs /releases/{id}, maps genres + styles to app genre keys,
 * and updates albums.genres.
 *
 * Rate limit: 60 req/min authenticated → 1 call per 1.2 s.
 * Run time estimate: ~4 min for 200 albums.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync }  from 'fs'
import { resolve }       from 'path'

// ── env ──────────────────────────────────────────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) process.env[m[1].trim()] = m[2].trim()
    }
  } catch {}
}
loadEnv()

const SUPABASE_URL  = process.env.VITE_SUPABASE_URL
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
const DISCOGS_TOKEN = process.env.VITE_DISCOGS_TOKEN

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing Supabase env vars'); process.exit(1) }
if (!DISCOGS_TOKEN)                  { console.error('Missing VITE_DISCOGS_TOKEN');  process.exit(1) }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const BASE     = 'https://api.discogs.com'
const HEADERS  = { Authorization: `Discogs token=${DISCOGS_TOKEN}`, 'User-Agent': 'VinilSeeker/1.0' }

// ── genre mapping (ordered — first match wins) ────────────────────────────────
// Checks both Discogs top-level genres and styles (lowercased)
const GENRE_MAP = [
  { test: l => l.includes('metal') || l === 'hard rock',                              value: 'metal'      },
  { test: l => l.includes('rock'),                                                     value: 'rock'       },
  { test: l => l.includes('hip') || l.includes('rap'),                                value: 'hiphop'     },
  { test: l => l.includes('funk') || l.includes('soul') || l.includes('r&b'),         value: 'funk'       },
  { test: l => l.includes('reggae') || l.includes('ska') || l.includes('dub'),        value: 'reggae'     },
  { test: l => l.includes('blues'),                                                    value: 'blues'      },
  { test: l => l.includes('folk') || l.includes('country') || l.includes('world'),    value: 'folk'       },
  { test: l => l.includes('latin') || l.includes('bossa') || l.includes('salsa'),     value: 'latin'      },
  { test: l => l.includes('jazz'),                                                     value: 'jazz'       },
  { test: l => l.includes('pop'),                                                      value: 'pop'        },
  { test: l => l.includes('classical') || l.includes('orchestral'),                   value: 'classical'  },
  { test: l => l.includes('electro') || l.includes('synth') || l.includes('ambient'), value: 'electronic' },
  { test: l => l.includes('israel') || l.includes('middle east') || l.includes('mizrahi'), value: 'israeli' },
]

function mapLabel(label) {
  const l = label.toLowerCase()
  return GENRE_MAP.find(m => m.test(l))?.value ?? null
}

function extractGenres(release) {
  const all = [
    ...(release.genres || []),
    ...(release.styles || []),
  ]
  const seen   = new Set()
  const result = []
  for (const label of all) {
    const key = mapLabel(label)
    if (key && !seen.has(key)) {
      seen.add(key)
      result.push(key)
    }
  }
  return result
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  // Fetch albums with discogs_id but no genres
  const { data: albums, error } = await supabase
    .from('albums')
    .select('id, title, artist, discogs_id, genres')
    .not('discogs_id', 'is', null)

  if (error) { console.error('Supabase fetch error:', error.message); process.exit(1) }

  const toEnrich = albums.filter(a => !a.genres || a.genres.length === 0)
  console.log(`Albums with discogs_id: ${albums.length} | Missing genres: ${toEnrich.length}`)

  if (toEnrich.length === 0) {
    console.log('Nothing to do.')
    return
  }

  let ok = 0, skipped = 0, failed = 0

  for (let i = 0; i < toEnrich.length; i++) {
    const album = toEnrich[i]
    const progress = `[${i + 1}/${toEnrich.length}]`

    try {
      const res = await fetch(`${BASE}/releases/${album.discogs_id}`, { headers: HEADERS })
      if (res.status === 429) {
        console.log(`${progress} rate-limited — waiting 10s…`)
        await sleep(10000)
        i--  // retry this album
        continue
      }
      if (!res.ok) {
        console.log(`${progress} Discogs ${res.status} for "${album.title}" — skipping`)
        skipped++
        await sleep(1200)
        continue
      }

      const release = await res.json()
      const genres  = extractGenres(release)

      if (genres.length === 0) {
        console.log(`${progress} no mappable genres for "${album.title}" (${album.artist}) — skipping`)
        skipped++
      } else {
        const { error: updateErr } = await supabase
          .from('albums')
          .update({ genres })
          .eq('id', album.id)

        if (updateErr) {
          console.log(`${progress} save failed for "${album.title}": ${updateErr.message}`)
          failed++
        } else {
          console.log(`${progress} "${album.artist} — ${album.title}" → [${genres.join(', ')}]`)
          ok++
        }
      }
    } catch (err) {
      console.log(`${progress} error for "${album.title}": ${err.message}`)
      failed++
    }

    await sleep(1200)
  }

  console.log(`\nDone — enriched: ${ok} | no match: ${skipped} | errors: ${failed}`)
}

main()
