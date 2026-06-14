import { useState } from 'react'
import Layout from '../components/Layout'
import VinylCard from '../components/VinylCard'
import styles from './RarePage.module.css'

const FILTERS = [
  { key: 'all',     label: 'הכל'              },
  { key: 'first',   label: 'First Press'       },
  { key: 'signed',  label: 'חתום'              },
  { key: 'limited', label: 'מהדורה מוגבלת'    },
  { key: 'colored', label: 'Colored Vinyl'     },
  { key: 'top',     label: '★★★★★ בלבד'      },
]

const RARITY_KEYS = {
  all:     () => true,
  first:   v => v.badge === 'rare' || v.rarity >= 4,
  signed:  v => v.signed,
  limited: v => v.badge === 'limited' || v.badge === 'burgundy',
  colored: v => v.colored,
  top:     v => v.rarity >= 5,
}

function RarityStars({ count = 3 }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= count ? styles.starFull : styles.starEmpty}>★</span>
      ))}
      <span className={styles.starsLabel}>נדירות</span>
    </div>
  )
}

export default function RarePage({ onNavigate, vinylList = [], currentUser, onLogout }) {
  const [filter, setFilter] = useState('all')

  const rareVinyl = vinylList
    .map(v => ({ ...v, rarity: v.rarity ?? (v.badge === 'rare' ? 5 : v.badge === 'limited' ? 4 : 3) }))
    .filter(v => v.rarity >= 3)
    .filter(RARITY_KEYS[filter] ?? (() => true))
    .slice(0, 12)

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>קולקציה ייחודית</span>
          <h1 className={styles.heroTitle}>תקליטים נדירים ואספנות</h1>
          <p className={styles.heroSub}>
            First pressings, מהדורות מוגבלות, תקליטים חתומים ועותקים שלא תמצא בשום מקום אחר.
          </p>
        </div>
      </div>

      {/* Filter pills */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              className={`${styles.pill} ${filter === f.key ? styles.pillActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className={styles.body}>
        {rareVinyl.length === 0 ? (
          <div className={styles.empty}>
            <svg viewBox="0 0 64 64" fill="none" width="72" height="72" aria-hidden="true">
              <circle cx="32" cy="32" r="29" stroke="var(--rule)" strokeWidth="2" />
              <circle cx="32" cy="32" r="10" fill="var(--purple-700)" opacity=".4" />
              <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
            </svg>
            <p className={styles.emptyTitle}>לא נמצאו תקליטים בקטגוריה זו</p>
            <button type="button" className={styles.btnPrimary} onClick={() => setFilter('all')}>
              הצג הכל
            </button>
          </div>
        ) : (
          <>
            <p className={styles.count}>{rareVinyl.length} תקליטים נדירים</p>
            <div className={styles.grid}>
              {rareVinyl.map(v => (
                <div key={v.id} className={styles.cardWrap}>
                  <VinylCard {...v} onNavigate={onNavigate} />
                  <RarityStars count={v.rarity} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </Layout>
  )
}
