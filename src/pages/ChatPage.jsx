import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import styles from './ChatPage.module.css'

const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    sellerName: 'יוסי כהן',
    sellerRating: 4.7,
    lastSeen: 'פעיל עכשיו',
    unread: 2,
    time: '14:32',
    listingTitle: 'Pink Floyd — The Wall',
    listingArtist: 'Pink Floyd',
    listingYear: '1979',
    listingFormat: 'LP',
    listingCondition: 'VG+',
    listingPrice: 220,
    messages: [
      { id: 1, from: 'them', text: 'שלום, האם התקליט עדיין זמין?', time: '14:20' },
      { id: 2, from: 'me',   text: 'כן, זמין! במצב מצוין', time: '14:25' },
      { id: 3, from: 'them', text: 'מתי תוכל לאסוף? אני בדיזנגוף', time: '14:32' },
    ],
  },
  {
    id: 'c2',
    sellerName: 'רינה לוי',
    sellerRating: 4.9,
    lastSeen: 'פעיל לפני שעה',
    unread: 0,
    time: '12:15',
    listingTitle: 'Beatles — Abbey Road',
    listingArtist: 'The Beatles',
    listingYear: '1969',
    listingFormat: 'LP',
    listingCondition: 'VG',
    listingPrice: 380,
    messages: [
      { id: 1, from: 'me',   text: 'שלום! האם המצב באמת VG?', time: '11:00' },
      { id: 2, from: 'them', text: 'כן, כריכה מצוינת, תקליט בלאי קל', time: '11:30' },
      { id: 3, from: 'me',   text: 'אשמח לקחת, מה הכתובת לאיסוף?', time: '12:00' },
      { id: 4, from: 'them', text: 'תודה רבה! נשמח לעוד עסקה בעתיד', time: '12:15' },
    ],
  },
  {
    id: 'c3',
    sellerName: 'דני אבן',
    sellerRating: 4.5,
    lastSeen: 'פעיל אתמול',
    unread: 1,
    time: 'אתמול',
    listingTitle: 'Miles Davis — Kind of Blue',
    listingArtist: 'Miles Davis',
    listingYear: '1959',
    listingFormat: 'LP',
    listingCondition: 'VG+',
    listingPrice: 95,
    messages: [
      { id: 1, from: 'them', text: 'האם המחיר עוד פתוח לדיון?', time: 'אתמול' },
    ],
  },
  {
    id: 'c4',
    sellerName: 'שרה גולן',
    sellerRating: 4.8,
    lastSeen: 'פעיל לפני יומיים',
    unread: 0,
    time: 'שישי',
    listingTitle: 'Led Zeppelin IV',
    listingArtist: 'Led Zeppelin',
    listingYear: '1971',
    listingFormat: 'LP',
    listingCondition: 'VG',
    listingPrice: 290,
    messages: [
      { id: 1, from: 'me',   text: 'האם אפשר להשתמש בדואר?', time: 'חמישי' },
      { id: 2, from: 'them', text: 'כן, שליח עד 35 ₪', time: 'חמישי' },
      { id: 3, from: 'me',   text: 'מצוין! אשלח פרטי משלוח', time: 'שישי' },
      { id: 4, from: 'them', text: 'נהדר, נתראה ביום ראשון', time: 'שישי' },
    ],
  },
]

function Avatar({ name, size = 40 }) {
  return (
    <div className={styles.avatar} style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

function Stars({ rating }) {
  const full  = Math.floor(rating)
  const half  = rating - full >= 0.5
  const empty = 5 - full - (half ? 1 : 0)
  return (
    <span className={styles.stars} aria-label={`דירוג ${rating}`}>
      {'★'.repeat(full)}
      {half ? '½' : ''}
      {'☆'.repeat(empty)}
    </span>
  )
}

export default function ChatPage({ onNavigate, currentUser, onLogout, initialConvId }) {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [selectedId, setSelectedId]       = useState(initialConvId ?? MOCK_CONVERSATIONS[0].id)
  const [input, setInput]                 = useState('')
  const [searchQuery, setSearchQuery]     = useState('')
  const messagesEndRef                    = useRef(null)

  const selected = conversations.find(c => c.id === selectedId)

  const filtered = searchQuery.trim()
    ? conversations.filter(c =>
        c.sellerName.includes(searchQuery) ||
        c.listingTitle.includes(searchQuery)
      )
    : conversations

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedId, selected?.messages?.length])

  function handleSelect(id) {
    setSelectedId(id)
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, unread: 0 } : c)
    )
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    setConversations(prev =>
      prev.map(c =>
        c.id === selectedId
          ? { ...c, time: now, messages: [...c.messages, { id: Date.now(), from: 'me', text, time: now }] }
          : c
      )
    )
    setInput('')
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
                placeholder="חפש בשיחות..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.convList}>
            {filtered.length === 0 ? (
              <div className={styles.sidebarEmpty}>
                <svg viewBox="0 0 64 64" fill="none" width="48" height="48" aria-hidden="true">
                  <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
                  <circle cx="32" cy="32" r="10" fill="var(--purple-700)" />
                  <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
                </svg>
                <span>אין שיחות עדיין</span>
              </div>
            ) : (
              filtered.map(conv => (
                <button
                  key={conv.id}
                  type="button"
                  className={`${styles.convItem} ${conv.id === selectedId ? styles.convItemActive : ''}`}
                  onClick={() => handleSelect(conv.id)}
                >
                  <Avatar name={conv.sellerName} size={40} />
                  <div className={styles.convInfo}>
                    <div className={styles.convTopRow}>
                      <span className={styles.convName}>{conv.sellerName}</span>
                      <span className={styles.convTime}>{conv.time}</span>
                    </div>
                    <span className={styles.convListing}>על: {conv.listingTitle}</span>
                    <div className={styles.convBottom}>
                      <span className={styles.convPreview}>
                        {conv.messages[conv.messages.length - 1]?.text ?? ''}
                      </span>
                      {conv.unread > 0 && (
                        <span className={styles.unreadBadge}>{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* ── Conversation panel ── */}
        {selected ? (
          <div className={styles.convPanel}>

            {/* Conv header */}
            <div className={styles.convHeader}>
              <div className={styles.convHeaderTop}>
                <Avatar name={selected.sellerName} size={42} />
                <div className={styles.convHeaderInfo}>
                  <span className={styles.convHeaderName}>{selected.sellerName}</span>
                  <span className={styles.convHeaderMeta}>
                    {selected.lastSeen}
                    {' · '}
                    <Stars rating={selected.sellerRating} />
                    {' '}
                    {selected.sellerRating}
                  </span>
                </div>
                <button type="button" className={styles.btnOutline} onClick={() => {}}>
                  צפה בפרופיל
                </button>
              </div>

              <div className={styles.convHeaderListing}>
                <div className={styles.listingThumb}>
                  <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true">
                    <circle cx="24" cy="24" r="24" fill="var(--vinyl-black)" />
                    <circle cx="24" cy="24" r="8" fill="var(--purple-700)" />
                    <circle cx="24" cy="24" r="2" fill="var(--gold-500)" />
                  </svg>
                </div>
                <div className={styles.listingInfo}>
                  <span className={styles.listingLabel}>על:</span>
                  <span className={styles.listingTitle}>
                    {selected.listingTitle} ({selected.listingYear})
                  </span>
                  <div className={styles.listingChips}>
                    <span className={styles.chip}>{selected.listingFormat}</span>
                    <span className={styles.chip}>{selected.listingCondition}</span>
                    <span className={styles.priceChip}>₪{selected.listingPrice}</span>
                  </div>
                </div>
                <button type="button" className={styles.btnOutline} onClick={() => {}}>
                  צפה במכירה
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
              <div className={styles.dateSeparator}>היום</div>

              {selected.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`${styles.msgRow} ${msg.from === 'me' ? styles.msgRowMe : styles.msgRowThem}`}
                >
                  {msg.from === 'them' && (
                    <Avatar name={selected.sellerName} size={28} />
                  )}
                  <div className={`${styles.bubble} ${msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem}`}>
                    <p className={styles.bubbleText}>{msg.text}</p>
                    <span className={styles.bubbleTime}>
                      {msg.time}
                      {msg.from === 'me' && ' ✓✓'}
                    </span>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Composer */}
            <div className={styles.composer}>
              <div className={styles.composerInner}>
                <button type="button" className={styles.attachBtn} title="צרף תמונה">
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                    <path d="M9 4H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M17 3l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 3h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
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
                  disabled={!input.trim()}
                  aria-label="שלח הודעה"
                >
                  <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                    <path d="M3 10l14-7-7 14V10H3Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
              <p className={styles.composerNote}>
                הודעות אינן מוצפנות מקצה לקצה — אל תשתף פרטי תשלום בצ'אט
              </p>
            </div>

          </div>
        ) : (
          <div className={styles.noConv}>
            <svg viewBox="0 0 64 64" fill="none" width="80" height="80" aria-hidden="true">
              <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
              <circle cx="32" cy="32" r="10" fill="var(--purple-700)" />
              <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
            </svg>
            <p className={styles.noConvText}>בחר שיחה מהרשימה</p>
          </div>
        )}

      </div>

    </Layout>
  )
}
