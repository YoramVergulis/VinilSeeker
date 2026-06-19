/**
 * Import Disc Center inventory from diskcenter.txt scraped data.
 * Usage: node scripts/import-disccenter.js path/to/diskcenter.txt "Store Name" "City"
 *
 * Defaults to "Disc Center" / "ירושלים" if store name/city are omitted.
 * Keeps only vinyl (LP, תקליט) and CD items — filters out DVD, Blu-Ray, and combos.
 * Re-running is safe — clears existing rows for the store before re-inserting.
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

const env     = loadEnv()
const apiKey  = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(env.VITE_SUPABASE_URL, apiKey)
if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠  No SUPABASE_SERVICE_ROLE_KEY — album inserts may fail due to RLS.')
}

// ── Parsing helpers ───────────────────────────────────────────────────────────

function extractArtists(raw) {
  return raw
    .replace(/\*\*\/\*\*/g, ' / ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\\-/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function classifyItem(rawTitle) {
  const title = rawTitle.replace(/\\-/g, '-').trim()
  const t     = title.toLowerCase()

  // Hard-exclude: any item with DVD or Blu-Ray in the title
  if (t.includes('blu-ray') || t.includes('blu ray') || t.includes('bluray')) {
    return { albumName: title, type: 'Blu-Ray' }
  }
  if (/\bdvd\b/.test(t) || t.includes('+dvd') || t.includes('cd+dvd')) {
    return { albumName: title, type: 'DVD' }
  }

  // Strip trailing format suffix after the last " - "
  const lastDash = title.lastIndexOf(' - ')
  if (lastDash !== -1) {
    const suffix      = title.slice(lastDash + 3)
    const albumName   = title.slice(0, lastDash)
    const combined    = (albumName + ' ' + suffix).toLowerCase()

    const isColored =
      /colou?red|red|blue|yellow|green|pink|purple|clear|marble|splatter|opaque|transparent|black ice/i.test(combined) ||
      /צבעוני|אדום|ורוד|כחול|ירוק|שקוף/.test(combined)

    if (/^\d*lp\b/i.test(suffix) || /^\d+"/.test(suffix)) {
      return { albumName, type: isColored ? 'Coloured Vinyl (new)' : 'Vinyl (new)' }
    }
    if (/^תקליט/.test(suffix)) {
      return { albumName, type: isColored ? 'Coloured Vinyl (new)' : 'Vinyl (new)' }
    }
    if (/^\d*cd\b/i.test(suffix)) {
      return { albumName, type: 'CD (new)' }
    }
  }

  // Fallback: check for format anywhere in the title
  if (t.includes('תקליט')) {
    const albumName = title.replace(/\s*-\s*תקליט.*$/, '').trim() || title
    return { albumName, type: 'Vinyl (new)' }
  }
  if (/\b\d*lp\b/i.test(t))  return { albumName: title, type: 'Vinyl (new)' }
  if (/\b\d*cd\b/i.test(t))  return { albumName: title, type: 'CD (new)' }

  return { albumName: title, type: 'other' }
}

function isVinylOrCD(type) {
  return type === 'Vinyl (new)' || type === 'Coloured Vinyl (new)' || type === 'CD (new)'
}

function parseProducts(markdown) {
  const items = []

  // Split at each product entry: **[title](disccenter prod url)** **אמן:**
  const parts = markdown.split(
    /(?=\*\*\[[^\]]+\]\(https?:\/\/www\.disccenter\.co\.il\/prod\/\d+\/[^)]+\)\*\* \*\*אמן:\*\*)/
  )

  for (const chunk of parts) {
    const titleM = chunk.match(
      /^\*\*\[([^\]]+)\]\((https?:\/\/www\.disccenter\.co\.il\/prod\/\d+\/[^)]+)\)\*\* \*\*אמן:\*\*(.*)/
    )
    if (!titleM) continue

    const [, rawTitle, url, firstLine] = titleM

    // Artist: everything before "תאריך יציאה:" on the first line
    const artistRaw = firstLine.split('תאריך יציאה:')[0]
    const artist    = extractArtists(artistRaw)

    // Price
    const priceM = chunk.match(/מחיר:\s*([\d,.]+)\s*₪/)
    const price  = priceM ? Math.round(parseFloat(priceM[1].replace(',', ''))) : null

    // Style/genre (one line after סגנון: or ז'אנר:)
    const styleM = chunk.match(/(?:סגנון|ז'אנר):\n([^\n]+)/)
    const style  = styleM
      ? styleM[1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ', ').trim()
      : ''

    const { albumName, type } = classifyItem(rawTitle)

    items.push({ album_name: albumName, artist: artist || null, url, price_ils: price, style, type, tracks: [] })
  }

  return items
}

// ── Album map (same logic as import-third-ear.js) ────────────────────────────

async function buildAlbumMap(items) {
  const { data: existing } = await supabase.from('albums').select('id, artist, title')
  const map = new Map((existing || []).map(a => [
    `${(a.artist || '').toLowerCase()}|${a.title.toLowerCase()}`, a.id,
  ]))

  const toInsert = []
  const seen     = new Set()
  for (const item of items) {
    const a   = (item.artist     || '').trim()
    const t   = (item.album_name || '').trim()
    const key = `${a.toLowerCase()}|${t.toLowerCase()}`
    if (!map.has(key) && !seen.has(key)) {
      seen.add(key)
      toInsert.push({ artist: a || null, title: t })
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
        map.set(`${(a.artist || '').toLowerCase()}|${a.title.toLowerCase()}`, a.id)
      }
    }
  }

  return map
}

// ── CLI & main ────────────────────────────────────────────────────────────────

const txtPath   = process.argv[2]
const storeName = process.argv[3] || 'Disc Center'
const storeCity = process.argv[4] || 'ירושלים'

if (!txtPath) {
  console.error('Usage: node scripts/import-disccenter.js path/to/diskcenter.txt "Store Name" "City"')
  process.exit(1)
}

let rawText
try {
  rawText = readFileSync(resolve(txtPath), 'utf-8')
} catch (e) {
  console.error('Cannot read file:', e.message)
  process.exit(1)
}

// Parse all JSON blocks from the txt file
const jsonBlocks = []
let depth = 0, start = -1
for (let i = 0; i < rawText.length; i++) {
  if (rawText[i] === '{') {
    if (depth === 0) start = i
    depth++
  } else if (rawText[i] === '}') {
    depth--
    if (depth === 0 && start !== -1) {
      try { jsonBlocks.push(JSON.parse(rawText.slice(start, i + 1))) }
      catch { /* skip malformed block */ }
      start = -1
    }
  }
}

// Extract all products, deduplicate by URL
const seen = new Set()
const allItems = []
for (const block of jsonBlocks) {
  const products = parseProducts(block.markdown || '')
  for (const p of products) {
    if (!seen.has(p.url)) {
      seen.add(p.url)
      allItems.push(p)
    }
  }
}

const musicItems = allItems.filter(i => isVinylOrCD(i.type))
const filtered   = allItems.filter(i => !isVinylOrCD(i.type))

console.log(`Parsed: ${allItems.length} total (${seen.size} unique URLs)`)
console.log(`Keeping: ${musicItems.length} vinyl/CD items`)
console.log(`Filtered out: ${filtered.length} items (${[...new Set(filtered.map(i => i.type))].join(', ')})`)
if (musicItems.length === 0) {
  console.error('No vinyl/CD items found — aborting.')
  process.exit(1)
}

async function main() {
  // 1. Clear existing rows for this store
  const { error: delErr } = await supabase
    .from('store_inventory')
    .delete()
    .eq('store_name', storeName)
  if (delErr) console.warn('Could not clear old rows (RLS?):', delErr.message)
  else console.log(`Cleared existing "${storeName}" rows.`)

  // 2. Find-or-create albums
  const albumMap = await buildAlbumMap(musicItems)

  // 3. Build rows
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
      price_ils:  item.price_ils ?? null,
      type:       item.type  || null,
      style:      item.style || null,
      url:        item.url   || null,
      tracks:     [],
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
  console.log(`\nDone — ${inserted}/${rows.length} rows imported for "${storeName}" (${storeCity}).`)
}

main().catch(err => { console.error(err); process.exit(1) })
