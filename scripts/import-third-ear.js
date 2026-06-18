/**
 * Import Third Ear inventory JSON into Supabase store_inventory table.
 * Usage:  node scripts/import-third-ear.js path/to/third_ear_products.json
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync }  from 'fs'
import { resolve }       from 'path'

// ── Read .env manually (no dotenv dependency needed) ──────────────────────────
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
    console.error('Could not read .env file — make sure you run from the project root.')
    process.exit(1)
  }
}

const env = loadEnv()
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)

// ── Music types to include (everything else is equipment / books) ─────────────
const MUSIC_TYPES = ['vinyl', 'cd', 'blu-ray', 'dvd', 'cassette']
function isMusic(item) {
  const t = (item.type || '').toLowerCase()
  return MUSIC_TYPES.some(m => t.includes(m))
}

// ── Main ──────────────────────────────────────────────────────────────────────
const jsonPath = process.argv[2]
if (!jsonPath) {
  console.error('Usage: node scripts/import-third-ear.js path/to/third_ear_products.json')
  process.exit(1)
}

let items
try {
  items = JSON.parse(readFileSync(resolve(jsonPath), 'utf-8'))
  if (!Array.isArray(items)) items = [items]
} catch (e) {
  console.error('Failed to parse JSON file:', e.message)
  process.exit(1)
}

const musicItems = items.filter(isMusic)
console.log(`Total items: ${items.length} | Music items to import: ${musicItems.length}`)

// ── Look up Third Ear store id (read-only, won't fail on RLS) ────────────────
async function getThirdEarStoreId() {
  const { data } = await supabase
    .from('store')
    .select('id')
    .ilike('name', 'Third Ear')
    .limit(1)
  if (data && data.length > 0) {
    console.log('Found Third Ear store, id:', data[0].id)
    return data[0].id
  }
  console.log('Third Ear not found in store table — store_id will be null (that is fine)')
  return null
}

// ── Import in batches of 50 ───────────────────────────────────────────────────
async function batchInsert(rows, storeId) {
  const BATCH = 50
  let inserted = 0
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error } = await supabase.from('store_inventory').insert(batch)
    if (error) {
      console.error(`Batch ${Math.floor(i / BATCH) + 1} failed:`, error.message)
    } else {
      inserted += batch.length
      console.log(`Inserted ${inserted}/${rows.length}`)
    }
  }
  return inserted
}

async function main() {
  const storeId = await getThirdEarStoreId()

  const rows = musicItems.map(item => ({
    store_id:   storeId,
    store_name: 'Third Ear',
    store_city: 'תל אביב',
    artist:     item.artist    || null,
    album_name: item.album_name || null,
    price_ils:  item.price_ils  != null ? Math.round(Number(item.price_ils)) : null,
    type:       item.type       || null,
    style:      item.style      || null,
    url:        item.url        || null,
    tracks:     Array.isArray(item.tracks) ? item.tracks : [],
  }))

  const count = await batchInsert(rows, storeId)
  console.log(`\nDone — ${count} items imported.`)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
