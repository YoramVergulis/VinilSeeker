import { useState } from 'react'
import { isSaved, toggleSaved } from '../auth'
import styles from './VinylCard.module.css'

const BADGE_CLASS = {
  gold:     '',
  burgundy: styles.badgeBurgundy,
  dark:     styles.badgeDark,
}

export default function VinylCard({
  id, title, artist, year, format, genre,
  price, originalPrice, city, badge, img,
  onNavigate,
  ...rest
}) {
  const [cardSaved, setCardSaved] = useState(() => isSaved(id))

  function handleClick(e) {
    e.preventDefault()
    onNavigate?.('product', {
      product: { id, title, artist, year, format, genre, price, originalPrice, city, badge, img, ...rest }
    })
  }

  return (
    <a href="#" className={styles.card} onClick={handleClick}>
      <div className={styles.cover}>
        <div className={styles.vinylPeek} aria-hidden="true" />

        {badge && (
          <span className={`${styles.badge} ${BADGE_CLASS[badge.variant] ?? ''}`}>
            {badge.label}
          </span>
        )}

        <button
          className={`${styles.saveBtn} ${cardSaved ? styles.saveBtnActive : ''}`}
          aria-label={cardSaved ? 'הסר ממועדפים' : 'שמור במועדפים'}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCardSaved(toggleSaved(id)) }}
        >
          <svg viewBox="0 0 20 20" fill={cardSaved ? 'currentColor' : 'none'} width="14" height="14" aria-hidden="true">
            <path d="M10 17s-7-4.35-7-9a5 5 0 0 1 7-4.58A5 5 0 0 1 17 8c0 4.65-7 9-7 9Z"
              stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>

        {img && <img src={img} alt={`${title} — ${artist}`} className={styles.coverImg} />}
      </div>

      <div className={styles.body}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{artist} · {year} · {format}</div>
        <div className={styles.foot}>
          {price != null && (
            <div>
              {originalPrice && <div className={styles.priceOld}>₪{originalPrice}</div>}
              <div className={styles.price}>₪{price}</div>
            </div>
          )}
          {city && (
            <div className={styles.loc}>
              <svg viewBox="0 0 16 16" fill="none" width="11" height="11" aria-hidden="true">
                <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              {city}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
