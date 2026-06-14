import { useState } from 'react'
import Layout from '../components/Layout'
import styles from './PricingPage.module.css'

const CONDITIONS = ['Mint (M)', 'Near Mint (NM)', 'VG+', 'VG', 'Good (G)', 'Fair (F)']
const FORMATS    = ['LP (12")', '2xLP', 'EP (7")', '12" Single', '10"']
const EDITIONS   = ['First Press', 'Reissue', 'Remaster', 'מהדורה מוגבלת', 'Colored Vinyl', 'רגיל']

const FACTORS = [
  {
    title: 'מצב התקליט',
    desc: 'הגורם הכי משפיע. הפרש בין VG ל-NM יכול להגיע לפי 3 במחיר.',
  },
  {
    title: 'מהדורה ראשונה',
    desc: 'First pressings שווים פרמיה. גרסת ה-UK הראשונה של Led Zeppelin = פי 10.',
  },
  {
    title: 'נדירות וביקוש',
    desc: 'תקליטים שיצאו בתפוצה מצומצמת, או שהביקוש אליהם גבוה מהיצע — מחיריהם עולים.',
  },
]

function calcPrices(condition, edition) {
  const condMap = { 'Mint (M)': 1.4, 'Near Mint (NM)': 1.2, 'VG+': 1.0, 'VG': 0.7, 'Good (G)': 0.4, 'Fair (F)': 0.2 }
  const edMap   = { 'First Press': 2.0, 'מהדורה מוגבלת': 1.5, 'Colored Vinyl': 1.3, 'Remaster': 1.1, 'Reissue': 0.9, 'רגיל': 1.0 }
  const base   = 200
  const mult   = (condMap[condition] ?? 1) * (edMap[edition] ?? 1)
  const market = Math.round(base * mult / 10) * 10
  return {
    fast:   Math.round(market * 0.8 / 10) * 10,
    market,
    high:   Math.round(market * 1.3 / 10) * 10,
  }
}

export default function PricingPage({ onNavigate, currentUser, onLogout }) {
  const [artist,    setArtist]    = useState('')
  const [album,     setAlbum]     = useState('')
  const [year,      setYear]      = useState('')
  const [condition, setCondition] = useState('VG+')
  const [format,    setFormat]    = useState('LP (12")')
  const [edition,   setEdition]   = useState('רגיל')
  const [result,    setResult]    = useState(null)

  function handleCalc(e) {
    e.preventDefault()
    setResult(calcPrices(condition, edition))
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>כלי חינמי</span>
          <h1 className={styles.heroTitle}>ייעוץ מחירים לתקליטים</h1>
          <p className={styles.heroSub}>
            הזן פרטים על התקליט שלך וקבל טווח מחיר מומלץ על בסיס עסקאות עבר בשוק הישראלי.
          </p>
        </div>
      </div>

      <div className={styles.body}>

        {/* Calculator */}
        <section className={styles.calculatorSection}>
          <h2 className={styles.sectionTitle}>חשב מחיר לתקליט שלך</h2>
          <form className={styles.form} onSubmit={handleCalc}>
            <div className={styles.formGrid}>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-artist">אמן</label>
                <input
                  id="p-artist"
                  type="text"
                  className={styles.input}
                  placeholder="לדוגמה: Pink Floyd"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-album">אלבום</label>
                <input
                  id="p-album"
                  type="text"
                  className={styles.input}
                  placeholder="לדוגמה: The Wall"
                  value={album}
                  onChange={e => setAlbum(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-year">שנת הוצאה</label>
                <input
                  id="p-year"
                  type="number"
                  className={styles.input}
                  placeholder="1979"
                  min="1900"
                  max={new Date().getFullYear()}
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-cond">מצב</label>
                <select id="p-cond" className={styles.select} value={condition} onChange={e => setCondition(e.target.value)}>
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-format">פורמט</label>
                <select id="p-format" className={styles.select} value={format} onChange={e => setFormat(e.target.value)}>
                  {FORMATS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className={styles.fieldWrap}>
                <label className={styles.label} htmlFor="p-edition">מהדורה</label>
                <select id="p-edition" className={styles.select} value={edition} onChange={e => setEdition(e.target.value)}>
                  {EDITIONS.map(ed => <option key={ed}>{ed}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className={styles.btnCalc}>חשב טווח מחירים &larr;</button>
          </form>
        </section>

        {/* Result */}
        {result && (
          <section className={styles.resultSection}>
            <p className={styles.resultEyebrow}>טווח מחירים מומלץ</p>
            {artist && album && (
              <p className={styles.resultTitle}>{artist} — {album}</p>
            )}
            <p className={styles.resultSub}>
              {condition} · {format} · {edition}
            </p>
            <div className={styles.tierGrid}>
              <div className={styles.tier}>
                <span className={styles.tierLabel}>מכירה מהירה</span>
                <span className={styles.tierPrice}>₪{result.fast}</span>
                <span className={styles.tierNote}>מוכר תוך 1–3 ימים</span>
              </div>
              <div className={`${styles.tier} ${styles.tierMain}`}>
                <span className={styles.tierLabel}>ערך שוק</span>
                <span className={styles.tierPrice}>₪{result.market}</span>
                <span className={styles.tierNote}>המחיר הסביר ביותר</span>
              </div>
              <div className={styles.tier}>
                <span className={styles.tierLabel}>תמחור גבוה</span>
                <span className={styles.tierPrice}>₪{result.high}</span>
                <span className={styles.tierNote}>למי שיש סבלנות</span>
              </div>
            </div>
            <p className={styles.disclaimer}>
              * הערכה בלבד על בסיס מדד כללי. מחירים בפועל תלויים במצב ספציפי, נדירות ועוד.
            </p>
          </section>
        )}

        {/* Factors */}
        <section className={styles.factorsSection}>
          <h2 className={styles.sectionTitle}>מה משפיע על המחיר?</h2>
          <div className={styles.factorsGrid}>
            {FACTORS.map(f => (
              <div key={f.title} className={styles.factorCard}>
                <h3 className={styles.factorTitle}>{f.title}</h3>
                <p className={styles.factorDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </Layout>
  )
}
