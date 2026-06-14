import { useState } from 'react'
import styles from './HeroSection.module.css'

const QUICK_TAGS = ['Pink Floyd', 'Led Zeppelin', 'Hollywood Undead', 'Five Finger Death Punch']

export default function HeroSection({ onNavigate }) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onNavigate?.('search', { query: query.trim() })
  }

  function handleTagClick(tag) {
    onNavigate?.('search', { query: tag })
  }

  return (
    <section className={styles.hero}>
      <div className={styles.grid}>

        {/* ── Text side ── */}
        <div>
          <div className={styles.eyebrow}>★ השוק הישראלי לתקליטי ויניל</div>

          <h1 className={styles.heading}>
            תמצאו את <em>התקליט</em> שחיפשתם<br />כל החיים.
          </h1>

          <p className={styles.lede}>
            אלפי תקליטים מקוריים ממוכרים פרטיים וחנויות מובחרות בכל הארץ.
            רוק, ג׳אז, מטאל, ישראלי ועוד — בלחיצה אחת.
          </p>

          <form className={styles.searchBar} onSubmit={handleSubmit}>
            <span className={styles.searchIcon} aria-hidden="true">⌕</span>
            <input
              className={styles.searchInput}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="חפש אלבום, אמן, או ז׳אנר…"
              aria-label="חיפוש תקליטים"
            />
            <button type="submit" className={styles.searchBtn}>חפש</button>
          </form>

          <div className={styles.quickRow}>
            <span className={styles.quickLabel}>פופולריים:</span>
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={styles.quickTag}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Art side ── */}
        <div className={styles.art} aria-hidden="true">
          <div className={styles.disc}>
            <div className={styles.grooves} />
          </div>
          <div className={styles.cover}>
            <img src="/covers/hollywood-undead-v.png" alt="Hollywood Undead — V" />
          </div>
        </div>

      </div>
    </section>
  )
}
