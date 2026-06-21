import Layout from '../components/Layout'
import styles from './CategoriesPage.module.css'

const GENRES = [
  { key: 'rock',       label: 'רוק',         color: 'var(--purple-700)' },
  { key: 'metal',      label: 'מטאל',        color: 'var(--vinyl-black)' },
  { key: 'jazz',       label: "ג'אז",         color: 'var(--gold-700)' },
  { key: 'israeli',    label: 'ישראלי',      color: 'var(--burgundy)' },
  { key: 'pop',        label: 'פופ',          color: 'var(--purple-600)' },
  { key: 'classical',  label: 'קלאסי',       color: 'var(--success)' },
  { key: 'electronic', label: 'אלקטרוני',    color: 'var(--ink-2)' },
  { key: 'funk',       label: 'פאנק / סול',  color: 'var(--gold-500)' },
  { key: 'folk',       label: 'פולק',         color: 'var(--gold-700)' },
  { key: 'hiphop',     label: 'היפ הופ',     color: 'var(--ink)' },
  { key: 'reggae',     label: 'רגאיי',        color: 'var(--success)' },
  { key: 'blues',      label: 'בלוז',         color: 'var(--ink-3)' },
]

function DiscIcon({ color }) {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill={color} opacity="0.12" />
      <circle cx="32" cy="32" r="22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.4" />
      <circle cx="32" cy="32" r="14" fill="none" stroke={color} strokeWidth="0.6" opacity="0.3" />
      <circle cx="32" cy="32" r="7"  fill={color} opacity="0.18" />
      <circle cx="32" cy="32" r="2.5" fill={color} opacity="0.7" />
    </svg>
  )
}

export default function CategoriesPage({ onNavigate, vinylList = [], currentUser, onLogout }) {
  return (
    <Layout activePage="קטגוריות" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>קטלוג</span>
          <h1 className={styles.title}>גלה לפי סגנון</h1>
          <p className={styles.subtitle}>בחר ז'אנר וגלה את כל התקליטים הזמינים בו</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          {GENRES.map(({ key, label, color }) => {
            const count = vinylList.filter(v =>
              v.type !== 'store' &&
              (v.genre === key || (v.genres && v.genres.includes(key)))
            ).length

            return (
              <button
                key={key}
                className={styles.card}
                onClick={() => onNavigate('search', { genre: key })}
                style={{ '--genre-color': color }}
              >
                <div className={styles.discWrap}>
                  <DiscIcon color={color} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.genreLabel}>{label}</span>
                  <span className={styles.countBadge}>{count} תקליטים</span>
                </div>
                <svg className={styles.arrow} viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
                  <path d="M10 8H3m0 0 3-3M3 8l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )
          })}
        </div>
      </div>

    </Layout>
  )
}
