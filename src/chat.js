import { supabase } from './supabase'

// Fetch one user's profile (name, city)
export async function getProfile(userId) {
  if (!userId) return null
  const { data } = await supabase
    .from('profiles')
    .select('id, name, city')
    .eq('id', userId)
    .maybeSingle()
  return data
}

// Find existing conversation or create a new one.
// Returns { id, isNew } on success, { error } on failure, null if not allowed.
export async function getOrCreateConversation({ listingId, sellerId, sellerName, buyerName }) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session || !sellerId) return null
  const buyerId = session.user.id
  if (buyerId === sellerId) return null

  // Look for an existing conversation (.limit(1) avoids maybeSingle error when duplicates exist)
  const { data: existingRows } = await supabase
    .from('conversation')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id',   buyerId)
    .eq('seller_id',  sellerId)
    .limit(1)

  if (existingRows?.[0]) return { id: existingRows[0].id, isNew: false }

  // Try to create with buyer_name/seller_name; fall back without if columns missing
  const withNames = { listing_id: listingId, buyer_id: buyerId, seller_id: sellerId, buyer_name: buyerName || '', seller_name: sellerName || '' }
  let { data: created, error } = await supabase.from('conversation').insert(withNames).select('id').single()

  if (error?.message?.includes('buyer_name') || error?.message?.includes('seller_name')) {
    ;({ data: created, error } = await supabase
      .from('conversation')
      .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
      .select('id').single())
  }

  if (error) {
    console.error('[chat] create conversation error:', error)
    return { error: error.message }
  }
  return { id: created.id, isNew: true }
}

// All conversations for the current user, newest first — real names from profiles
export async function getConversations() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []
  const userId = session.user.id

  const { data, error } = await supabase
    .from('conversation')
    .select('id, listing_id, buyer_id, seller_id, created_at, listing:listing_id(title, city, format, condition, price)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) { console.error('getConversations error:', error); return [] }

  // Batch-fetch real names for all other participants
  const otherIds = [...new Set((data || []).map(c => c.buyer_id === userId ? c.seller_id : c.buyer_id))]
  const { data: profiles } = otherIds.length
    ? await supabase.from('profiles').select('id, name').in('id', otherIds)
    : { data: [] }
  const nameMap = Object.fromEntries((profiles || []).map(p => [p.id, p.name || '']))

  return (data || []).map(c => {
    const otherId = c.buyer_id === userId ? c.seller_id : c.buyer_id
    return {
      id:        c.id,
      listingId: c.listing_id,
      buyerId:   c.buyer_id,
      sellerId:  c.seller_id,
      otherName: nameMap[otherId] || (c.buyer_id === userId ? 'מוכר' : 'קונה'),
      iAmBuyer:  c.buyer_id === userId,
      updatedAt: c.created_at,
      city:      c.listing?.city || '',
      listing:   c.listing ? {
        title:     c.listing.title,
        city:      c.listing.city,
        format:    c.listing.format,
        condition: c.listing.condition,
        price:     c.listing.price,
      } : null,
    }
  })
}

// Messages for a specific conversation, oldest first
export async function getMessages(convId) {
  const { data, error } = await supabase
    .from('message')
    .select('id, sender_id, content, created_at, is_read')
    .eq('conversation_id', convId)
    .order('created_at', { ascending: true })

  if (error) { console.error('getMessages error:', error); return [] }
  return data || []
}

// Send a message
export async function sendMessage(convId, text) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('message')
    .insert({ conversation_id: convId, sender_id: session.user.id, content: text.trim(), is_read: false })
    .select('id, sender_id, content, created_at, is_read')
    .single()

  if (error) { console.error('sendMessage error:', error); return null }
  return data
}

// Mark all unread messages in a conversation as read (those not sent by me)
export async function markAsRead(convId) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return
  await supabase
    .from('message')
    .update({ is_read: true })
    .eq('conversation_id', convId)
    .neq('sender_id', session.user.id)
    .eq('is_read', false)
}

// Realtime subscription — returns an unsubscribe function
export function subscribeToMessages(convId, onInsert) {
  const channel = supabase
    .channel(`chat:${convId}`)
    .on('postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'message', filter: `conversation_id=eq.${convId}` },
      payload => onInsert(payload.new)
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}
