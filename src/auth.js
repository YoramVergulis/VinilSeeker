import { supabase } from './supabase'

const ADMIN_EMAIL = 'admin@vinilseeker.com'
const SAVED_KEY   = 'vs_saved'
const ALERTS_KEY  = 'vs_alerts'

export function checkIsAdmin(user) {
  return user?.isAdmin === true || user?.email?.toLowerCase() === ADMIN_EMAIL
}

export function formatUser(supabaseUser) {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  return {
    id:       supabaseUser.id,
    email:    supabaseUser.email,
    name:     meta.name     || '',
    city:     meta.city     || '',
    isAdmin:  meta.isAdmin  || supabaseUser.email?.toLowerCase() === ADMIN_EMAIL,
    joinedAt: supabaseUser.created_at,
  }
}

export async function register(name, email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name,
        city: '',
        isAdmin: email.trim().toLowerCase() === ADMIN_EMAIL,
      },
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

// kept for backward compat — App uses onAuthStateChange instead
export function getCurrentUser() { return null }

// getUserById is not available without a profiles table — returns null for now
export function getUserById() { return null }

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
  return {
    id:          r.id,
    title:       r.title,
    artist:      r.artist?.name || '',
    year:        r.release_year,
    format:      r.format,
    genre:       r.listing_genres?.[0]?.genre?.name || '',
    genres:      r.listing_genres?.map(lg => lg.genre?.name).filter(Boolean) || [],
    price:       Number(r.price),
    city:        r.city || '',
    desc:        r.description,
    condition:   r.condition,
    img:         r.cover_image_url,
    type:        'private',
    uploaderId:  r.user_id,
  }
}

export async function getListings() {
  const { data, error } = await supabase
    .from('listing')
    .select(`
      id, title, format, condition, price, description,
      cover_image_url, user_id, release_year, city,
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
  for (const name of genreNames) {
    const genreId = await findOrCreateGenre(name)
    if (genreId) {
      await supabase.from('listing_genres').insert({ listing_id: listing.id, genre_id: genreId })
    }
  }

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
      release_year:    updates.year,
      city:            updates.city,
      ...(artistId !== undefined && { artist_id: artistId }),
    })
    .eq('id', id)
  if (error) throw new Error(error.message)

  await supabase.from('listing_genres').delete().eq('listing_id', id)
  const genreNames = updates.genres?.length ? updates.genres : (updates.genre ? [updates.genre] : [])
  for (const name of genreNames) {
    const genreId = await findOrCreateGenre(name)
    if (genreId) {
      await supabase.from('listing_genres').insert({ listing_id: id, genre_id: genreId })
    }
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
