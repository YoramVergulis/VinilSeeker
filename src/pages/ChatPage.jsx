import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import styles from './ChatPage.module.css'
import {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  subscribeToMessages,
  getProfile,
} from '../chat'

function Avatar({ name, size = 40 }) {
  return (
    <div className={styles.avatar} style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function formatTime(iso) {
  if (!iso) return ''
  const d   = new Date(iso)
  const now = new Date()
  const diffDays = Math.floor((now - d) / 86400000)
  if (diffDays === 0) return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
  if (diffDays === 1) return 'אתמול'
  if (diffDays < 7)  return d.toLocaleDateString('he-IL', { weekday: 'short' })
  return d.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
}

export default function ChatPage({ onNavigate, currentUser, onLogout, chatContext }) {
  const [conversations, setConversations] = useState([])
  const [selectedId,    setSelectedId]    = useState(null)
  const [messages,      setMessages]      = useState([])
  const [input,         setInput]         = useState('')
  const [searchQuery,   setSearchQuery]   = useState('')
  const [loadingConvs,  setLoadingConvs]  = useState(true)
  const [loadingMsgs,   setLoadingMsgs]   = useState(false)
  const [sending,       setSending]       = useState(false)
  const [chatError,     setChatError]     = useState('')
  const messagesBoxRef  = useRef(null)
  const unsubscribeRef  = useRef(null)

  const selected = conversations.find(c => c.id === selectedId) ?? null

  const filtered = searchQuery.trim()
    ? conversations.filter(c =>
        c.otherName.includes(searchQuery) ||
        c.listing?.title?.includes(searchQuery)
      )
    : conversations

  // ── Load conversations on mount ──
  useEffect(() => {
    if (!currentUser) return
    loadConvs()
  }, [currentUser])

  // ── Handle incoming chatContext (from ProductPage "צור קשר") ──
  useEffect(() => {
    if (!chatContext || !currentUser) return
    handleChatContext()
  }, [chatContext, currentUser])

  // ── Load messages + subscribe when conversation is selected ──
  useEffect(() => {
    if (!selectedId) { setMessages([]); return }

    if (unsubscribeRef.current) unsubscribeRef.current()

    loadMsgs(selectedId)
    unsubscribeRef.current = subscribeToMessages(selectedId, handleNewMessage)

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current()
    }
  }, [selectedId])

  // ── Scroll to bottom inside the messages box (not the whole page) ──
  useEffect(() => {
    const el = messagesBoxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function loadConvs() {
    setLoadingConvs(true)
    const convs = await getConversations()
    setConversations(convs)
    setLoadingConvs(false)
    if (convs.length > 0 && !selectedId && !chatContext) {
      setSelectedId(convs[0].id)
    }
  }

  async function handleChatContext() {
    if (!chatContext.sellerId) {
      setChatError('מכירה זו לא ניתנת לשיחה (נתוני הדגמה)')
      return
    }
    setChatError('')

    // Look up the seller's real registered name from profiles
    const sellerProfile = await getProfile(chatContext.sellerId)
    const sellerName = sellerProfile?.name || chatContext.sellerName || 'מוכר'

    const result = await getOrCreateConversation({
      listingId:  chatContext.listingId,
      sellerId:   chatContext.sellerId,
      sellerName: sellerName,
      buyerName:  currentUser.name,
    })
    if (!result) {
      setChatError('לא ניתן ליצור שיחה — בדוק את הקונסול לפרטים')
      return
    }
    if (result?.error) {
      setChatError(`שגיאה: ${result.error}`)
      return
    }

    const convId = result.id

    // Send auto-first message for NEW conversations
    if (result.isNew) {
      const parts = []
      if (chatContext.listingTitle)     parts.push(chatContext.listingTitle)
      const meta = [
        chatContext.listingCondition && `מצב: ${chatContext.listingCondition}`,
        chatContext.listingPrice     && `מחיר: ₪${chatContext.listingPrice}`,
        chatContext.sellerCity       && chatContext.sellerCity,
      ].filter(Boolean)
      if (meta.length) parts.push(meta.join(' | '))
      parts.push('האם עדיין זמין?')
      await sendMessage(convId, parts.join('\n'))
    }

    // Build a local conversation object so the sidebar shows immediately with real name/city
    const localConv = {
      id:        convId,
      listingId: chatContext.listingId,
      buyerId:   currentUser.id,
      sellerId:  chatContext.sellerId,
      otherName: sellerName,
      iAmBuyer:  true,
      updatedAt: new Date().toISOString(),
      city:      chatContext.sellerCity || '',
      listing:   chatContext.listingTitle ? {
        title:     chatContext.listingTitle,
        city:      chatContext.sellerCity      || '',
        condition: chatContext.listingCondition || '',
        price:     chatContext.listingPrice     ?? null,
      } : null,
    }

    // Merge with DB conversations (avoids duplicate if getConversations returns it too)
    const convs = await getConversations()
    const merged = convs.some(c => c.id === convId)
      ? convs.map(c => c.id === convId ? { ...c, otherName: sellerName, city: localConv.city } : c)
      : [localConv, ...convs]
    setConversations(merged)
    setSelectedId(convId)
  }

  async function loadMsgs(convId) {
    setLoadingMsgs(true)
    const msgs = await getMessages(convId)
    setMessages(msgs)
    setLoadingMsgs(false)
    markAsRead(convId)
  }

  function handleNewMessage(msg) {
    setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
    if (msg.sender_id !== currentUser?.id) markAsRead(selectedId)
  }

  function handleSelect(id) {
    setSelectedId(id)
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || !selectedId || sending) return
    setInput('')
    setSending(true)

    // Optimistic message
    const tempId = `opt_${Date.now()}`
    const opt = { id: tempId, sender_id: currentUser.id, content: text, created_at: new Date().toISOString(), is_read: false }
    setMessages(prev => [...prev, opt])

    const sent = await sendMessage(selectedId, text)
    if (sent) {
      setMessages(prev => prev.map(m => m.id === tempId ? sent : m))
      setConversations(prev =>
        prev.map(c => c.id === selectedId ? { ...c, updatedAt: sent.created_at } : c)
      )
    } else {
      // Roll back optimistic on failure
      setMessages(prev => prev.filter(m => m.id !== tempId))
    }
    setSending(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentUser) return null

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>
      <div className={styles.chatShell}>

        {/* ── Sidebar ── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>שיחות</h2>
            <div className={styles.searchWrap}>
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" className={styles.searchIcon} aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="חפש שיחות..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.convList}>
            {loadingConvs ? (
              <div className={styles.sidebarEmpty}>
                <div className={styles.spinner} />
                <span>טוען שיחות...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className={styles.sidebarEmpty}>
                <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
                  <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
                  <circle cx="32" cy="32" r="10" fill="var(--purple-700)" />
                  <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
                </svg>
                <span>{conversations.length === 0 ? 'אין שיחות עדיין' : 'לא נמצאו תוצאות'}</span>
              </div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.id}
                  type="button"
                  className={`${styles.convItem} ${conv.id === selectedId ? styles.convItemActive : ''}`}
                  onClick={() => handleSelect(conv.id)}
                >
                  <Avatar name={conv.otherName} size={40} />
                  <div className={styles.convInfo}>
                    <div className={styles.convTopRow}>
                      <span className={styles.convName}>{conv.otherName}</span>
                      <span className={styles.convTime}>{formatTime(conv.updatedAt)}</span>
                    </div>
                    {(conv.city || conv.listing?.city) && (
                      <span className={styles.convCity}>{conv.city || conv.listing?.city}</span>
                    )}
                    {conv.listing?.title && (
                      <span className={styles.convListing}>על: {conv.listing.title}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Conversation panel ── */}
        {selected ? (
          <div className={styles.convPanel}>

            {/* Header */}
            <div className={styles.convHeader}>
              <div className={styles.convHeaderTop}>
                <Avatar name={selected.otherName} size={42} />
                <div className={styles.convHeaderInfo}>
                  <span className={styles.convHeaderName}>{selected.otherName}</span>
                  {(selected.city || selected.listing?.city) && (
                    <span className={styles.convHeaderMeta}>
                      {selected.city || selected.listing?.city}
                    </span>
                  )}
                </div>
              </div>

              {selected.listing && (
                <div className={styles.convHeaderListing}>
                  <div className={styles.listingThumb}>
                    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden="true">
                      <circle cx="24" cy="24" r="24" fill="var(--vinyl-black)" />
                      <circle cx="24" cy="24" r="8" fill="var(--purple-700)" />
                      <circle cx="24" cy="24" r="2" fill="var(--gold-500)" />
                    </svg>
                  </div>
                  <div className={styles.listingInfo}>
                    <span className={styles.listingLabel}>על:</span>
                    <span className={styles.listingTitle}>
                      {selected.listing.title}
                      {selected.listing.year ? ` (${selected.listing.year})` : ''}
                    </span>
                    <div className={styles.listingChips}>
                      {selected.listing.format    && <span className={styles.chip}>{selected.listing.format}</span>}
                      {selected.listing.condition && <span className={styles.chip}>{selected.listing.condition}</span>}
                      {selected.listing.price     && <span className={styles.priceChip}>₪{selected.listing.price}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={styles.btnOutline}
                    onClick={() => onNavigate?.('product', { product: { id: selected.listing.id, title: selected.listing.title } })}
                  >
                    צפה במכירה
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className={styles.messages} ref={messagesBoxRef}>
              {loadingMsgs ? (
                <div className={styles.loadingState}>
                  <div className={styles.spinner} />
                  <span>טוען הודעות...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className={styles.loadingState}>
                  <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
                    <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
                    <circle cx="32" cy="32" r="10" fill="var(--purple-700)" />
                    <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
                  </svg>
                  <span>שלח הודעה ראשונה</span>
                </div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.sender_id === currentUser.id
                  return (
                    <div
                      key={msg.id}
                      className={`${styles.msgRow} ${isMe ? styles.msgRowMe : styles.msgRowThem}`}
                    >
                      {!isMe && <Avatar name={selected.otherName} size={28} />}
                      <div className={`${styles.bubble} ${isMe ? styles.bubbleMe : styles.bubbleThem}`}>
                        <p className={styles.bubbleText}>{msg.content}</p>
                        <span className={styles.bubbleTime}>
                          {formatTime(msg.created_at)}
                          {isMe && (msg.is_read ? ' ✓✓' : ' ✓')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Composer */}
            <div className={styles.composer}>
              <div className={styles.composerInner}>
                <textarea
                  className={styles.composerInput}
                  placeholder="הקלד הודעה..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  type="button"
                  className={styles.sendBtn}
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  aria-label="שלח הודעה"
                >
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                    <path d="M3 10l14-7-7 14V10H3Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <p className={styles.composerNote}>
                אל תשתף פרטי תשלום בצ׳אט
              </p>
            </div>

          </div>
        ) : !loadingConvs ? (
          <div className={styles.noConv}>
            {chatError ? (
              <div className={styles.chatErrorBox}>
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="var(--danger)" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 11v.5" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {chatError}
              </div>
            ) : (
              <>
                <svg viewBox="0 0 64 64" fill="none" width="80" height="80" aria-hidden="true">
                  <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
                  <circle cx="32" cy="32" r="10" fill="var(--purple-700)" />
                  <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
                </svg>
                <p className={styles.noConvText}>
                  {conversations.length === 0 ? 'לחץ "צור קשר" על מכירה כדי להתחיל שיחה' : 'בחר שיחה מהרשימה'}
                </p>
              </>
            )}
          </div>
        ) : null}

      </div>
    </Layout>
  )
}
