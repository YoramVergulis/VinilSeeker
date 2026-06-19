import { useState, useEffect, useMemo } from 'react'
import Layout from '../components/Layout'
import VinylCard from '../components/VinylCard'
import { isSaved, toggleSaved, checkIsAdmin } from '../auth'
import { lookupDiscogs, getDiscogsRelease, normalizeTracklist } from '../discogs'
import { TRACKLISTS } from '../data/tracklists'
import { supabase } from '../supabase'
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

function OfferCard({ offer, isBest, onNavigate, productTitle }) {
  const isStore   = offer.type === 'store'
  const initial   = isStore
    ? (offer.storeName?.[0] ?? 'ח')
    : (offer.sellerName?.[0]?.toUpperCase() ?? offer.city?.[0] ?? 'מ')
  const name      = isStore ? offer.storeName : (offer.sellerName || `מוכר מ${offer.city}`)
  const location  = isStore ? offer.storeCity : (offer.sellerCity || offer.city)

  const canContact = !!offer.uploaderId

  function handleContact() {
    if (!canContact) return
    onNavigate?.('chat', {
      chatContext: {
        listingId:        offer.id,
        sellerId:         offer.uploaderId,
        sellerName:       name,
        sellerCity:       offer.city        || '',
        listingTitle:     productTitle      || offer.title || '',
        listingPrice:     offer.price       ?? null,
        listingCondition: offer.condition   || '',
      },
    })
  }

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
          {isStore && offer.storeUrl ? (
            <a href={offer.storeUrl} target="_blank" rel="noopener noreferrer" className={styles.contactBtn}>
              צור קשר
            </a>
          ) : (
            <button
              type="button"
              className={styles.contactBtn}
              onClick={handleContact}
              disabled={!canContact}
              title={!canContact ? 'לא ניתן ליצור קשר' : undefined}
            >
              צור קשר
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function OffersSection({ title, icon, offers, cheapestPrice, emptyText, onNavigate, productTitle }) {
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
            <OfferCard key={offer.id} offer={offer} isBest={offer.price === cheapestPrice} onNavigate={onNavigate} productTitle={productTitle} />
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

function StoreInventorySection({ stores }) {
  if (!stores.length) return null
  return (
    <div className={styles.storesWithItem}>
      <div className={styles.storesInner}>
        <div className={styles.storesHeader}>
          <p className={styles.storesEyebrow}>זמין בחנויות</p>
          <h2 className={styles.storesTitle}>איפה ניתן למצוא</h2>
        </div>
        <div className={styles.storesList}>
          {stores.map(entry => (
            <div key={entry.id} className={styles.storeRow}>
              <div className={styles.storeRowAvatar}>{entry.store_name?.[0] ?? 'ח'}</div>
              <div className={styles.storeRowInfo}>
                <div className={styles.storeRowName}>{entry.store_name}</div>
                <div className={styles.storeRowCity}>{entry.store_city}</div>
                {entry.type && <span className={styles.storeRowType}>{entry.type}</span>}
                {entry.style && <div className={styles.storeRowNotes}>{entry.style}</div>}
                {entry.notes && <div className={styles.storeRowNotes}>{entry.notes}</div>}
              </div>
              <div className={styles.storeRowRight}>
                {entry.price_ils != null && (
                  <div className={styles.storeRowPrice}>₪{Math.round(entry.price_ils)}</div>
                )}
                {entry.url && (
                  <a href={entry.url} target="_blank" rel="noopener noreferrer" className={styles.storeRowLink}>
                    צור קשר
                    <svg viewBox="0 0 16 16" fill="none" width="11" height="11" aria-hidden="true">
                      <path d="M6 3H3v10h10v-3M9 3h4m0 0v4m0-4L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Real covers are on i.discogs.com; placeholders are on st.discogs.com
const hasRealCover = url => !!(url && !url.includes('st.discogs.com'))

export default function ProductPage({ product: snapshotProduct, onNavigate, vinylList = [], currentUser = null, onLogout, onDeleteVinyl, onUpdateVinyl }) {
  // Use the live version from vinylList so background enrichment (discogsId, img) is reflected
  const product = vinylList.find(v => v.id === snapshotProduct?.id) || snapshotProduct

  const [saved,           setSaved]           = useState(() => isSaved(product?.id))
  const [discogsRelease,  setDiscogsRelease]  = useState(null)
  const [storeInventory,  setStoreInventory]  = useState([])
  const [confirmDelete,   setConfirmDelete]   = useState(false)
  const [deleting,        setDeleting]        = useState(false)
  const isAdmin = checkIsAdmin(currentUser)

  useEffect(() => { setSaved(isSaved(product?.id)) }, [product?.id])

  // If we already know the Discogs release ID, fetch the full release (tracklist + images)
  useEffect(() => {
    if (!product?.discogsId) return
    setDiscogsRelease(null)
    getDiscogsRelease(product.discogsId)
      .then(setDiscogsRelease)
      .catch(() => {})
  }, [product?.discogsId])

  // Auto-enrich items with no known Discogs ID and no real cover yet
  useEffect(() => {
    // Skip if Effect 1 already handles it, or if we already have a real cover
    if (product?.discogsId) return
    if (hasRealCover(product?.img)) return
    if (!product?.artist || !product?.title) return

    setDiscogsRelease(null)
    ;(async () => {
      try {
        const { id, img: thumb } = await lookupDiscogs(product.artist, product.title)
        if (!id && !thumb) return
        if (!id) {
          setDiscogsRelease({ images: [{ type: 'primary', uri: thumb }] })
          return
        }
        const rel = await getDiscogsRelease(id)
        // Best image: primary from release → any image → thumbnail from search
        const resolvedImg = rel.images?.find(x => x.type === 'primary')?.uri
          || rel.images?.[0]?.uri
          || thumb
        // Save to DB (fire-and-forget)
        if (product?.albumId) {
          const upd = {}
          if (resolvedImg) upd.cover_image_url = resolvedImg
          if (id) upd.discogs_id = String(id)
          if (Object.keys(upd).length)
            supabase.from('albums').update(upd).eq('id', product.albumId).then(() => {}).catch(() => {})
        } else if (product?.id?.startsWith?.('si-')) {
          if (resolvedImg)
            supabase.from('store_inventory').update({ cover_image_url: resolvedImg }).eq('id', product.id.replace('si-', '')).then(() => {}).catch(() => {})
        } else if (product?.type === 'private' && product?.id) {
          const upd = {}
          if (resolvedImg) upd.cover_image_url = resolvedImg
          if (id) upd.discogs_id = String(id)
          if (Object.keys(upd).length) {
            supabase.from('listing').update(upd).eq('id', product.id).then(() => {}).catch(() => {})
            onUpdateVinyl?.(product.id, {
              ...(resolvedImg ? { img: resolvedImg } : {}),
              ...(id ? { discogsId: String(id) } : {}),
            })
          }
        }
        // Ensure a primary image is always present for the renderer
        const hasPrimary = rel.images?.some(x => x.type === 'primary')
        setDiscogsRelease(
          hasPrimary ? rel
            : { ...rel, images: [{ type: 'primary', uri: resolvedImg || thumb }, ...(rel.images || [])] }
        )
      } catch {}
    })()
  }, [product?.id])

  useEffect(() => {
    if (!product || product.type === 'store') { setStoreInventory([]); return }
    setStoreInventory([])
    const artist = product.artist?.toLowerCase().trim() || ''
    const title  = product.title?.toLowerCase().trim()  || ''
    supabase
      .from('store_inventory')
      .select('id, store_name, store_city, url, price_ils, artist, album_name, type, style, notes, listing_id')
      .or(`listing_id.eq.${product.id},artist.ilike.%${artist}%`)
      .then(({ data }) => {
        const rows = (data || []).filter(r =>
          r.listing_id === String(product.id) ||
          (r.artist?.toLowerCase().includes(artist) && r.album_name?.toLowerCase().includes(title))
        )
        setStoreInventory(rows)
      })
  }, [product?.id])

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
  const coverImg    = discogsRelease?.images?.find(i => i.type === 'primary')?.uri
    || discogsRelease?.images?.[0]?.uri
    || (hasRealCover(img) ? img : null)
  const description = discogsRelease?.notes || desc || DESCRIPTIONS[genre] || DESCRIPTIONS.default

  // ── Find all offers for this album ──
  const albumId  = product?.albumId
  const albumKey = `${title?.toLowerCase()}|${artist?.toLowerCase()}`
  const tracks   = discogsRelease
    ? normalizeTracklist(discogsRelease.tracklist)
    : (TRACKLISTS[albumKey] || null)
  // Prefer FK match (album_id) for reliability; fall back to string match
  const allOffers = useMemo(() =>
    vinylList.filter(v =>
      (albumId && v.albumId === albumId) ||
      `${v.title?.toLowerCase()}|${v.artist?.toLowerCase()}` === albumKey
    )
  , [vinylList, albumKey, albumId])
  const storeOffers   = allOffers.filter(v => v.type === 'store').sort((a, b) => a.price - b.price)
  const privateOffers = allOffers.filter(v => v.type !== 'store').sort((a, b) => a.price - b.price)
  const cheapestPrice = allOffers.length > 0 ? Math.min(...allOffers.map(v => v.price)) : null

  const similar = vinylList
    .filter(v => v.id !== product.id && v.genre === genre && v.type !== 'store')
    .slice(0, 3)

  async function handleDelete() {
    if (!onDeleteVinyl) return
    setDeleting(true)
    try {
      await onDeleteVinyl(product)
      onNavigate('search')
    } catch (err) {
      console.error('Delete failed:', err)
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

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

      {/* ── Admin bar ── */}
      {isAdmin && (
        <div className={styles.adminBar}>
          <div className={styles.adminBarInner}>
            {!confirmDelete ? (
              <button
                type="button"
                className={styles.btnDeleteAdmin}
                onClick={() => setConfirmDelete(true)}
              >
                <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <path d="M2 4h12M6 4V2h4v2M5 4l1 9h4l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                מחק מכירה
              </button>
            ) : (
              <div className={styles.adminConfirm}>
                <span className={styles.adminConfirmText}>האם אתה בטוח? פעולה זו אינה הפיכה.</span>
                <button
                  type="button"
                  className={styles.btnDangerSm}
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? 'מוחק…' : 'מחק'}
                </button>
                <button
                  type="button"
                  className={styles.btnCancelSm}
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  ביטול
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
            productTitle={title}
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
            productTitle={title}
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

      {/* ── Stores carrying this item ── */}
      <StoreInventorySection stores={storeInventory} />

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
