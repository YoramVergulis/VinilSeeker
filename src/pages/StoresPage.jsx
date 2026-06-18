import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { STORES } from '../data/stores'
import { supabase } from '../supabase'
import styles from './StoresPage.module.css'

const GENRE_LABELS = {
  rock: 'רוק', metal: 'מטאל', jazz: "ג'אז",
  israeli: 'ישראלי', pop: 'פופ', classical: 'קלאסי', electronic: 'אלקטרוני',
}

function StoreCard({ name, city, genres, desc, since }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>{name[0]}</div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.meta}>
            <svg viewBox="0 0 16 16" fill="none" width="11" height="11" aria-hidden="true">
              <path d="M8 1.5A4.5 4.5 0 0 1 12.5 6c0 3-4.5 8.5-4.5 8.5S3.5 9 3.5 6A4.5 4.5 0 0 1 8 1.5Z" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="8" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            {city}
            <span className={styles.dot}>·</span>
            פועלת מ-{since}
          </div>
        </div>
      </div>

      <p className={styles.desc}>{desc}</p>

      <div className={styles.footer}>
        <div className={styles.genres}>
          {genres.map(g => (
            <span key={g} className={styles.genrePill}>{GENRE_LABELS[g]}</span>
          ))}
        </div>
        <button type="button" className={styles.contactBtn}>צור קשר</button>
      </div>
    </div>
  )
}

export default function StoresPage({ onNavigate, currentUser, onLogout }) {
  const [stores, setStores] = useState(STORES)

  useEffect(() => {
    supabase
      .from('store')
      .select('*')
      .order('since', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setStores(data.map(s => ({ ...s, desc: s.description })))
        }
      })
  }, [])

  return (
    <Layout activePage="חנויות" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>שותפים</span>
          <h1 className={styles.title}>חנויות מובחרות</h1>
          <p className={styles.subtitle}>חנויות ויניל ישראליות שאנחנו עובדים איתן — מומחים אמיתיים לתקליטים</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.grid}>
          {stores.map(store => (
            <StoreCard key={store.id} {...store} />
          ))}
        </div>
      </div>

    </Layout>
  )
}
