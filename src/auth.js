import { supabase } from './supabase'

const SAVED_KEY  = 'vs_saved'
const ALERTS_KEY = 'vs_alerts'

// Discogs placeholder art is on st.discogs.com; real covers are on i.discogs.com
const realImg = url => (url && url.includes('i.discogs.com')) ? url : null

export function checkIsAdmin(user) {
  return user?.isAdmin === true
}

// isAdmin is intentionally always false here — App.jsx overwrites it
// after fetching profiles.is_admin from the database.
export function formatUser(supabaseUser) {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  return {
    id:       supabaseUser.id,
    email:    supabaseUser.email,
    name:     meta.name || '',
    city:     meta.city || '',
    isAdmin:  false,
    joinedAt: supabaseUser.created_at,
  }
}

export async function register(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: { name, city: '' },
    },
  })
  if (error) throw new Error(error.message)
  if (!data.session) throw new Error('נשלח אימייל אישור — אנא אשר את כתובתך לפני הכניסה')
  // Sync name to profiles table (trigger may not fire fast enough in dev)
  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, name, city: '' })
  }
  return formatUser(data.user)
}

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) throw new Error('אימייל או סיסמה שגויים')
  return formatUser(data.user)
}

export async function logout() {
  await supabase.auth.signOut()
}

export async function updateUser(updates) {
  const { data, error } = await supabase.auth.updateUser({ data: updates })
  if (error) throw new Error(error.message)
  // Keep profiles table in sync
  if (data.user) {
    await supabase.from('profiles').upsert({
      id:   data.user.id,
      name: updates.name ?? data.user.user_metadata?.name ?? '',
      city: updates.city ?? data.user.user_metadata?.city ?? '',
    })
  }
  return formatUser(data.user)
}

// --- Listings (Supabase) ---

async function findOrCreateArtist(name) {
  const { data: existing } = await supabase
    .from('artist')
    .select('id')
    .ilike('name', name.trim())
    .maybeSingle()
  if (existing) return existing.id
  const { data: created } = await supabase
    .from('artist')
    .insert({ name: name.trim() })
    .select('id')
    .single()
  return created?.id ?? null
}

async function findOrCreateGenre(name) {
  const { data: existing } = await supabase
    .from('genre')
    .select('id')
    .ilike('name', name.trim())
    .maybeSingle()
  if (existing) return existing.id
  const { data: created } = await supabase
    .from('genre')
    .insert({ name: name.trim() })
    .select('id')
    .single()
  return created?.id ?? null
}

function mapRow(r) {
  const cover = r.cover_image_url
  return {
    id:           r.id,
    albumId:      r.album_id    || null,
    discogsId:    r.discogs_id  || null,
    title:        r.title,
    artist:       r.artist?.name || '',
    year:         r.release_year,
    format:       r.format,
    genre:        r.listing_genres?.[0]?.genre?.name || '',
    genres:       r.listing_genres?.map(lg => lg.genre?.name).filter(Boolean) || [],
    price:        Number(r.price),
    city:         r.city || '',
    desc:         r.description,
    condition:    r.condition,
    img:          (cover && !cover.includes('st.discogs.com')) ? cover : null,
    coloredVinyl: r.colored_vinyl || false,
    type:         'private',
    uploaderId:   r.user_id,
  }
}

export async function getListings() {
  const { data, error } = await supabase
    .from('listing')
    .select(`
      id, title, format, condition, price, description,
      cover_image_url, discogs_id, user_id, release_year, city, album_id, colored_vinyl,
      artist:artist_id(name),
      listing_genres(genre:genre_id(name))
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false })
  if (error) return []
  return data.map(mapRow)
}

export async function addListing(record) {
  const artistId = record.artist?.trim() ? await findOrCreateArtist(record.artist) : null

  const { data: listing, error } = await supabase
    .from('listing')
    .insert({
      title:           record.title,
      format:          record.format,
      condition:       record.condition,
      price:           record.price,
      description:     record.desc,
      cover_image_url: record.img,
      discogs_id:      record.discogsId  || null,
      colored_vinyl:   record.coloredVinyl || false,
      is_available:    true,
      user_id:         record.uploaderId,
      artist_id:       artistId,
      release_year:    record.year,
      city:            record.city,
    })
    .select('id')
    .single()
  if (error) throw new Error(error.message)

  const genreNames = record.genres?.length ? record.genres : (record.genre ? [record.genre] : [])
  const genreIds = await Promise.all(genreNames.map(findOrCreateGenre))
  await Promise.all(
    genreIds.filter(Boolean).map(genreId =>
      supabase.from('listing_genres').insert({ listing_id: listing.id, genre_id: genreId })
    )
  )

  return { ...record, id: listing.id }
}

export async function updateListing(id, updates) {
  let artistId = undefined
  if (updates.artist?.trim()) {
    artistId = await findOrCreateArtist(updates.artist)
  }

  const { error } = await supabase
    .from('listing')
    .update({
      title:           updates.title,
      format:          updates.format,
      condition:       updates.condition,
      price:           updates.price,
      description:     updates.desc,
      cover_image_url: updates.img,
      discogs_id:      updates.discogsId   || null,
      colored_vinyl:   updates.coloredVinyl ?? false,
      release_year:    updates.year,
      city:            updates.city,
      ...(artistId !== undefined && { artist_id: artistId }),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)

  await supabase.from('listing_genres').delete().eq('listing_id', id)
  const genreNames = updates.genres?.length ? updates.genres : (updates.genre ? [updates.genre] : [])
  const genreIds = await Promise.all(genreNames.map(findOrCreateGenre))
  await Promise.all(
    genreIds.filter(Boolean).map(genreId =>
      supabase.from('listing_genres').insert({ listing_id: id, genre_id: genreId })
    )
  )
}

export async function getStoreInventory() {
  const { data } = await supabase
    .from('store_inventory')
    .select('id, store_name, store_city, artist, album_name, price_ils, type, style, url, album_id, cover_image_url, albums(cover_image_url, discogs_id, release_year, genres)')
  return (data || []).map(r => {
    const t = (r.type || '').toLowerCase()
    const format    = t.includes('2lp') ? '2LP' : t.includes('vinyl') ? 'LP' : t.includes('cd') ? 'CD' : 'LP'
    const condition = t.includes('new') ? 'New' : t.includes('used') ? 'VG' : ''
    return {
      id:          `si-${r.id}`,
      albumId:     r.album_id              || null,
      discogsId:   r.albums?.discogs_id    || null,
      title:       r.album_name            || '',
      artist:      r.artist                || '',
      year:        r.albums?.release_year  || null,
      format,
      genre:       r.albums?.genres?.[0] || '',
      genres:      r.albums?.genres      || [],
      price:       r.price_ils,
      city:        r.store_city            || '',
      img:         realImg(r.albums?.cover_image_url) || realImg(r.cover_image_url) || null,
      condition,
      type:        'store',
      rawType:     r.type                  || '',
      storeStyle:  r.style                 || '',
      storeName:   r.store_name            || '',
      storeCity:   r.store_city            || '',
      storeUrl:    r.url                   || '',
      uploaderId:  null,
      badge:       { label: r.store_name || 'חנות', variant: 'dark' },
    }
  })
}

export async function updateStoreItem(numericId, updates) {
  const { error } = await supabase
    .from('store_inventory')
    .update({
      artist:     updates.artist,
      album_name: updates.title,
      price_ils:  updates.price,
      type:       updates.rawType,
      style:      updates.storeStyle,
    })
    .eq('id', numericId)
  if (error) throw new Error(error.message)
}

export async function deleteListing(product) {
  if (!product) return
  if (product.type === 'store') {
    const numId = String(product.id).replace('si-', '')
    const { error } = await supabase.from('store_inventory').delete().eq('id', numId)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await supabase.from('listing').delete().eq('id', product.id)
    if (error) throw new Error(error.message)
  }
}

// --- Saved items (localStorage + Supabase) ---

function isUUID(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(id)
}

function getSavedLocal() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || [] } catch { return [] }
}

export async function getSaved() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return getSavedLocal()
  const { data } = await supabase
    .from('user_wishlist')
    .select('listing_id')
    .eq('user_id', session.user.id)
  const remoteIds = data?.map(r => r.listing_id) || []
  const merged = [...new Set([...getSavedLocal(), ...remoteIds])]
  localStorage.setItem(SAVED_KEY, JSON.stringify(merged))
  return merged
}

export function isSaved(id) {
  return getSavedLocal().includes(id)
}

export function toggleSaved(id) {
  const current = getSavedLocal()
  const nowSaved = !current.includes(id)
  const next = nowSaved ? [...current, id] : current.filter(s => s !== id)
  localStorage.setItem(SAVED_KEY, JSON.stringify(next))
  if (isUUID(id)) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      if (nowSaved) {
        supabase.from('user_wishlist').insert({ user_id: session.user.id, listing_id: id })
      } else {
        supabase.from('user_wishlist').delete()
          .eq('user_id', session.user.id)
          .eq('listing_id', id)
      }
    })
  }
  return nowSaved
}

// --- Price alerts (localStorage) ---

export function getAlerts() {
  try { return JSON.parse(localStorage.getItem(ALERTS_KEY)) || [] } catch { return [] }
}

export function addAlert(alertData) {
  const alerts = getAlerts()
  if (alerts.find(a => a.id === alertData.id)) return
  localStorage.setItem(ALERTS_KEY, JSON.stringify([...alerts, alertData]))
}

export function removeAlert(id) {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(getAlerts().filter(a => a.id !== id)))
}

export function updateAlertPrice(id, targetPrice) {
  const alerts = getAlerts().map(a => a.id === id ? { ...a, targetPrice } : a)
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts))
}
