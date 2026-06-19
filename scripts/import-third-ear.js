/**
 * Generic store inventory importer for VinilSeeker.
 * Usage: node scripts/import-third-ear.js path/to/file.json "Store Name" "City"
 *
 * Defaults to Third Ear / תל אביב if store name/city are omitted.
 * Re-running is safe — clears existing rows for the store before re-inserting.
 *
 * JSON items expected shape: { artist, album_name, price_ils, type, style, url, tracks }
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync }  from 'fs'
import { resolve }       from 'path'

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), '.env'), 'utf-8')
    return Object.fromEntries(
      raw.split('\n')
        .filter(l => l && !l.startsWith('#') && l.includes('='))
        .map(l => {
          const [k, ...rest] = l.split('=')
          return [k.trim(), rest.join('=').trim().replace(/^["']|["']$/g, '')]
        })
    )
  } catch {
    console.error('Could not read .env — run from project root.')
    process.exit(1)
  }
}

const env = loadEnv()
// Use service role key for imports (bypasses RLS). Falls back to anon key.
const apiKey   = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(env.VITE_SUPABASE_URL, apiKey)
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠  No SUPABASE_SERVICE_ROLE_KEY in .env — album inserts may fail due to RLS.')
}

const MUSIC_TYPES = ['vinyl', 'cd', 'blu-ray', 'dvd', 'cassette']
const isMusic = item => MUSIC_TYPES.some(m => (item.type || '').toLowerCase().includes(m))

// Returns Map<"lower_artist|lower_title" → albumId>.
// Fetches all existing albums once, then batch-inserts anything new.
async function buildAlbumMap(items) {
  const { data: existing } = await supabase.from('albums').select('id, artist, title')
  const map = new Map((existing || []).map(a => [
    `${a.artist.toLowerCase()}|${a.title.toLowerCase()}`, a.id,
  ]))

  const toInsert = []
  const seen     = new Set()
  for (const item of items) {
    const a   = (item.artist     || '').trim()
    const t   = (item.album_name || '').trim()
    const key = `${a.toLowerCase()}|${t.toLowerCase()}`
    if (!map.has(key) && !seen.has(key)) {
      seen.add(key)
      toInsert.push({ artist: a, title: t })
    }
  }

  if (toInsert.length) {
    console.log(`Creating ${toInsert.length} new album records...`)
    const BATCH = 100
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const { data: created, error } = await supabase
        .from('albums')
        .insert(toInsert.slice(i, i + BATCH))
        .select('id, artist, title')
      if (error) { console.error('Album batch error:', error.message); continue }
      for (const a of created || []) {
        map.set(`${a.artist.toLowerCase()}|${a.title.toLowerCase()}`, a.id)
      }
    }
  }

  return map
}

// ── CLI args ──────────────────────────────────────────────────────────────────
const jsonPath  = process.argv[2]
const storeName = process.argv[3] || 'Third Ear'
const storeCity = process.argv[4] || 'תל אביב'

if (!jsonPath) {
  console.error('Usage: node scripts/import-third-ear.js path/to/file.json "Store Name" "City"')
  process.exit(1)
}

let items
try {
  items = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'))
  if (!Array.isArray(items)) items = [items]
} catch (e) {
  console.error('Failed to parse JSON:', e.message)
  process.exit(1)
}

const musicItems = items.filter(isMusic)
console.log(`Total: ${items.length} | Music: ${musicItems.length} | Store: ${storeName} (${storeCity})`)

async function main() {
  // 1. Clear existing rows for this store (makes re-import safe)
  const { error: delErr } = await supabase
    .from('store_inventory')
    .delete()
    .eq('store_name', storeName)
  if (delErr) console.warn('Could not clear old rows (RLS?):', delErr.message)
  else console.log(`Cleared existing "${storeName}" rows.`)

  // 2. Find-or-create albums for every unique artist+title pair
  const albumMap = await buildAlbumMap(musicItems)

  // 3. Build store_inventory rows
  const rows = musicItems.map(item => {
    const a   = (item.artist     || '').trim()
    const t   = (item.album_name || '').trim()
    const key = `${a.toLowerCase()}|${t.toLowerCase()}`
    return {
      store_name: storeName,
      store_city: storeCity,
      artist:     a || null,
      album_name: t || null,
      album_id:   albumMap.get(key) ?? null,
      price_ils:  item.price_ils != null ? Math.round(Number(item.price_ils)) : null,
      type:       item.type  || null,
      style:      item.style || null,
      url:        item.url   || null,
      tracks:     Array.isArray(item.tracks) ? item.tracks : [],
    }
  })

  // 4. Batch insert
  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('store_inventory').insert(batch)
    if (error) console.error(`Batch ${Math.floor(i / BATCH) + 1} error:`, error.message)
    else { inserted += batch.length; process.stdout.write(`\rInserted ${inserted}/${rows.length}`) }
  }
  console.log(`\nDone — ${inserted}/${rows.length} rows imported.`)
}

main().catch(err => { console.error(err); process.exit(1) })
