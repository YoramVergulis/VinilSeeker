import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import VinylCard from '../components/VinylCard'
import { isSaved, toggleSaved } from '../auth'
import { getDiscogsRelease, normalizeTracklist } from '../discogs'
import { TRACKLISTS } from '../data/tracklists'
import styles from './ProductPage.module.css'

const GENRE_LABELS = {
  rock: 'רוק', metal: 'מטאל', jazz: "ג'אז",
  israeli: 'ישראלי', pop: 'פופ', classical: 'קלאסי', electronic: 'אלקטרוני',
}

const DESCRIPTIONS = {
  metal:    'תקליט שמור היטב, נקי ומוכן להשמעה. הוינייל עצמו ללא שריטות משמעותיות. שרוול מקורי בתנאים טובים. נרכש ישירות ממהדורה מקורית.',
  rock:     'לחיצה מקורית במצב מצוין. ביתבים בולטים, אוויר פתוח בין הכלים. שרוול מקורי מלמינציה עם בליות קלות בלבד. חובה לכל אספן.',
  jazz:     'עותק אנלוגי ממקור ראשון, מצב VG+. סאונד חם ומלא כפי שהוינייל הישן יודע לתת. שמור בתיק ביתי, ללא עובש.',
  israeli:  'תקליט ישראלי קלאסי מהמדף. מצב תקין לגיל. מדבקות לייבל מקוריות, שרוול עם בלאי הולם גיל הפרסום.',
  pop:      'לחיצה מאוחרת, הדפסה אירופאית. מצב ויזואלי טוב. ההשמעה נקיה עם ציק מינימלי בכמה מקומות.',
  default:  'תקליט במצב טוב, שמור ומוכן להשמעה. ראה תיאור ותמונות לפני רכישה, שאלות ברוכות הבאות.',
}

function VinylDisc() {
  return (
    <div className={styles.discWrap} aria-hidden="true">
      <div className={styles.disc} />
    </div>
  )
}

function OfferCard({ offer, isBest, onNavigate }) {
  const isStore   = offer.type === 'store'
  const initial   = isStore
    ? (offer.storeName?.[0] ?? 'ח')
    : (offer.sellerName?.[0]?.toUpperCase() ?? offer.city?.[0] ?? 'מ')
  const name      = isStore ? offer.storeName : (offer.sellerName || `מוכר מ${offer.city}`)
  const location  = isStore ? offer.storeCity : (offer.sellerCity || offer.city)

  return (
    <div className={`${styles.offerCard} ${isBest ? styles.offerBest : ''}`}>
      {isBest && <span className={styles.bestBadge}>★ מחיר הכי טוב</span>}
      <div className={styles.offerRow}>
        <div className={styles.offerAvatar} data-store={isStore}>{initial}</div>
        <div className={styles.offerInfo}>
          <div className={styles.offerName}>
            {name}
            {isStore && (
              <span className={styles.storeBadge}>
                <svg viewBox="0 0 16 16" fill="none" width="11" height="11">
                  <circle cx="8" cy="8" r="7" fill="var(--purple-700)" />
                  <path d="M5 8l2.5 2.5L11 5.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                חנות מאושרת
              </span>
            )}
          </div>
          <div className={styles.offerMeta}>
            {location}
            {offer.condition && (
              <>
                <span className={styles.offerDot}>·</span>
                <span className={styles.condChip}>{offer.condition}</span>
              </>
            )}
          </div>
        </div>
        <div className={styles.offerRight}>
          <div className={styles.offerPrice}>₪{offer.price}</div>
          <button
            type="button"
            className={styles.contactBtn}
            onClick={() => onNavigate?.('chat')}
          >
            צור קשר
          </button>
        </div>
      </div>
    </div>
  )
}

function OffersSection({ title, icon, offers, cheapestPrice, emptyText, onNavigate }) {
  return (
    <div className={styles.offersGroup}>
      <div className={styles.offersGroupHeader}>
        {icon}
        <span className={styles.offersGroupTitle}>{title}</span>
        <span className={styles.offersGroupCount}>{offers.length}</span>
      </div>
      {offers.length > 0 ? (
        <div className={styles.offersList}>
          {offers.map(offer => (
            <OfferCard key={offer.id} offer={offer} isBest={offer.price === cheapestPrice} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <p className={styles.emptyOffers}>{emptyText}</p>
      )}
    </div>
  )
}

const SIDE_LABELS = { A: 'א', B: 'ב', C: 'ג', D: 'ד' }

function Tracklist({ tracks }) {
  const sides = [...new Set(tracks.map(t => t.side))]
  const numbered = tracks.map((t, i) => ({ ...t, num: i + 1 }))

  return (
    <div className={styles.tracklist}>
      <h3 className={styles.tracklistTitle}>רשימת שירים</h3>
      {sides.map(side => (
        <div key={side} className={styles.trackSide}>
          <div className={styles.sideLabel}>
            צד {SIDE_LABELS[side] ?? side}
          </div>
          <ol className={styles.tracks}>
            {numbered.filter(t => t.side === side).map(t => (
              <li key={t.num} className={styles.track}>
                <span className={styles.trackNum}>{t.num}</span>
                <span className={styles.trackTitle}>{t.title}</span>
                <span className={styles.trackDur}>{t.duration}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}

export default function ProductPage({ product, onNavigate, vinylList = [], currentUser = null, onLogout }) {
  const [saved,         setSaved]         = useState(() => isSaved(product?.id))
  const [discogsRelease, setDiscogsRelease] = useState(null)

  useEffect(() => {
    if (!product?.discogsId) return
    setDiscogsRelease(null)
    getDiscogsRelease(product.discogsId)
      .then(setDiscogsRelease)
      .catch(() => {})
  }, [product?.discogsId])

  if (!product) {
    return (
      <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>
        <div className={styles.notFound}>
          <p>לא נמצא תקליט. <button onClick={() => onNavigate('search')} className={styles.linkBtn}>חזרה לחיפוש</button></p>
        </div>
      </Layout>
    )
  }

  const { title, artist, year, format, genre, genres, badge, img, desc } = product

  const rawGenres   = genres?.length ? genres : genre ? [genre] : []
  const genreLabels = rawGenres.map(g => GENRE_LABELS[g]).filter(Boolean)
  const coverImg    = discogsRelease?.images?.find(i => i.type === 'primary')?.uri || img
  const description = discogsRelease?.notes || desc || DESCRIPTIONS[genre] || DESCRIPTIONS.default

  // ── Find all offers for this album ──
  const albumKey = `${title?.toLowerCase()}|${artist?.toLowerCase()}`
  const tracks   = discogsRelease
    ? normalizeTracklist(discogsRelease.tracklist)
    : (TRACKLISTS[albumKey] || null)
  const allOffers   = vinylList.filter(v =>
    `${v.title?.toLowerCase()}|${v.artist?.toLowerCase()}` === albumKey
  )
  const storeOffers   = allOffers.filter(v => v.type === 'store').sort((a, b) => a.price - b.price)
  const privateOffers = allOffers.filter(v => v.type !== 'store').sort((a, b) => a.price - b.price)
  const cheapestPrice = allOffers.length > 0 ? Math.min(...allOffers.map(v => v.price)) : null

  const similar = vinylList
    .filter(v => v.id !== product.id && v.genre === genre && v.type !== 'store')
    .slice(0, 3)

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* ── Breadcrumb ── */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <button className={styles.crumbBtn} onClick={() => onNavigate('search')}>חיפוש</button>
          <span className={styles.crumbSep}>›</span>
          <button className={styles.crumbBtn} onClick={() => onNavigate('search', { query: artist })}>{artist}</button>
          <span className={styles.crumbSep}>›</span>
          <span className={styles.crumbCurrent}>{title}</span>
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div className={styles.main}>

        {/* Details column — RIGHT in RTL */}
        <div className={styles.details}>

          {badge && (
            <span className={`${styles.badgePill} ${styles[`badge_${badge.variant}`]}`}>
              {badge.label}
            </span>
          )}

          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{artist} · {year} · {format}</p>

          <div className={styles.metaRow}>
            {genreLabels.map(label => (
              <span key={label} className={styles.metaChip}>{label}</span>
            ))}
          </div>

          <div className={styles.divider} />

          {/* ── Offers comparison ── */}
          <div className={styles.offersHeader}>
            <h2 className={styles.offersTitle}>
              מוכרים זמינים
              {allOffers.length > 0 && (
                <span className={styles.offersCount}>{allOffers.length} הצעות</span>
              )}
            </h2>
            {cheapestPrice && (
              <p className={styles.offersBestPrice}>
                מחיר מינימלי: <strong>₪{cheapestPrice}</strong>
              </p>
            )}
          </div>

          <OffersSection
            title="חנויות"
            icon={
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <rect x="1" y="6" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M1 6l2-5h10l2 5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M6 15v-4h4v4" stroke="currentColor" strokeWidth="1.3"/>
              </svg>
            }
            offers={storeOffers}
            cheapestPrice={cheapestPrice}
            emptyText="אין הצעות מחנויות לאלבום זה כרגע"
            onNavigate={onNavigate}
          />

          <OffersSection
            title="יד שנייה"
            icon={
              <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            }
            offers={privateOffers}
            cheapestPrice={cheapestPrice}
            emptyText="אין מוכרים פרטיים לאלבום זה כרגע"
            onNavigate={onNavigate}
          />

          {/* Wishlist CTA */}
          <button
            type="button"
            className={`${styles.btnSave} ${saved ? styles.btnSaved : ''}`}
            onClick={() => setSaved(toggleSaved(product.id))}
          >
            <svg viewBox="0 0 20 20" fill={saved ? 'currentColor' : 'none'} width="17" height="17">
              <path d="M10 17s-7-4.35-7-9a5 5 0 0 1 7-4.58A5 5 0 0 1 17 8c0 4.65-7 9-7 9Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            {saved ? 'נשמר במועדפים' : 'שמור למועדפים'}
          </button>

          <div className={styles.divider} />

          {/* Description */}
          <div className={styles.descBlock}>
            <h3 className={styles.descTitle}>על האלבום</h3>
            <p className={styles.desc}>{description}</p>
          </div>

          {/* Tracklist */}
          {tracks && (
            <>
              <div className={styles.divider} />
              <Tracklist tracks={tracks} />
            </>
          )}

        </div>

        {/* Cover column — LEFT in RTL */}
        <div className={styles.coverCol}>
          <div className={styles.coverWrap}>
            <VinylDisc />
            {coverImg
              ? <img src={coverImg} alt={`${title} — ${artist}`} className={styles.coverImg} />
              : <div className={styles.coverPlaceholder} />
            }
          </div>

          <div className={styles.tagRow}>
            <span className={styles.tag}>{format}</span>
            {genreLabels.map(label => (
              <span key={label} className={styles.tag}>{label}</span>
            ))}
            <span className={styles.tag}>{year}</span>
            {cheapestPrice && (
              <span className={`${styles.tag} ${styles.tagPrice}`}>
                מ-₪{cheapestPrice}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* ── Similar records ── */}
      {similar.length > 0 && (
        <div className={styles.similar}>
          <div className={styles.similarInner}>
            <div className={styles.similarHeader}>
              <p className={styles.similarEyebrow}>עוד תקליטים</p>
              <h2 className={styles.similarTitle}>תקליטים דומים</h2>
            </div>
            <div className={styles.similarGrid}>
              {similar.map(v => (
                <VinylCard key={v.id} {...v} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}
