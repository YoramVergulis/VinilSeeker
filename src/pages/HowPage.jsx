import Layout from '../components/Layout'
import styles from './HowPage.module.css'

const BUYER_STEPS = [
  { num: '1', title: 'חפש', desc: 'מחפשים תקליטים לפי ז\'אנר, אמן, שם אלבום, מצב ומחיר — הכל במנוע חיפוש אחד.' },
  { num: '2', title: 'השווה', desc: 'רואים את כל ההצעות הזמינות לאותו אלבום: מחנויות ומיד שנייה, עם מחירים, מצבים ותמונות.' },
  { num: '3', title: 'תקשר', desc: 'יוצרים קשר ישיר עם המוכר דרך הצ\'אט המובנה ומסכמים על מקום ואופן המסירה.' },
]

const SELLER_STEPS = [
  { num: '1', title: 'הכנס', desc: 'מוסיפים תמונה, שם האמן, שם האלבום, מצב, פורמט ומחיר — בתהליך מודרך של דקות.' },
  { num: '2', title: 'פרסם', desc: 'בלחיצה אחת המכירה חיה ומופיעה לכל המשתמשים בחיפוש ובדף האלבום.' },
  { num: '3', title: 'מכור', desc: 'מקבלים פניות ישירות מקונים מעוניינים, מתאמים מסירה וסוגרים עסקה בלי עמלות.' },
]

const TRUST_POINTS = [
  'פלטפורמה ישראלית המוקדשת אך ורק לתקליטי ויניל — לא סחורה כללית',
  'מוכרים מדורגים על ידי קונים שרכשו בפועל',
  'כל מכירה עוברת בדיקת תוכן בסיסית לפני פרסום',
  'קהילה אקטיבית של אספנים שמדווחים על בעיות ועוזרים אחד לשני',
]

function StepCard({ num, title, desc }) {
  return (
    <div className={styles.stepCard}>
      <span className={styles.stepNum}>{num}</span>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDesc}>{desc}</p>
    </div>
  )
}

export default function HowPage({ onNavigate, currentUser, onLogout }) {
  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>מדריך מהיר</span>
          <h1 className={styles.heroTitle}>איך זה עובד?</h1>
          <p className={styles.heroSub}>VinilSeeker מחבר בין אספנים, מוכרים פרטיים וחנויות — פשוט, ישיר, בלי עמלות.</p>
        </div>
      </div>

      <div className={styles.body}>

        {/* Buyers section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>לקונים</span>
            <h2 className={styles.sectionTitle}>מחפשים תקליט? כך עושים את זה</h2>
          </div>
          <div className={styles.stepsGrid}>
            {BUYER_STEPS.map(s => <StepCard key={s.num} {...s} />)}
          </div>
        </section>

        {/* Sellers section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionEyebrow}>למוכרים</span>
            <h2 className={styles.sectionTitle}>רוצים למכור? שלושה צעדים בלבד</h2>
          </div>
          <div className={styles.stepsGrid}>
            {SELLER_STEPS.map(s => <StepCard key={s.num} {...s} />)}
          </div>
        </section>

        {/* Callout */}
        <div className={styles.callout}>
          <div className={styles.calloutIcon} aria-hidden="true">
            <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
              <circle cx="16" cy="16" r="15" fill="var(--gold-500)" opacity=".15" />
              <path d="M16 8v8l5 3" stroke="var(--gold-500)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className={styles.calloutTitle}>חינם לחלוטין · בלי עמלות · לא נהיה בין הקונה למוכר</p>
            <p className={styles.calloutSub}>VinilSeeker היא פלטפורמת חיבור בלבד — העסקה נעשית ישירות ביניכם.</p>
          </div>
        </div>

        {/* Trust section */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>למה לסמוך עלינו?</h2>
          </div>
          <ul className={styles.trustList}>
            {TRUST_POINTS.map((p, i) => (
              <li key={i} className={styles.trustItem}>
                <svg viewBox="0 0 16 16" fill="none" width="16" height="16" className={styles.trustCheck} aria-hidden="true">
                  <circle cx="8" cy="8" r="7" fill="var(--purple-700)" opacity=".1" />
                  <path d="M5 8l2 2 4-4" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {p}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <button type="button" className={styles.btnPrimary} onClick={() => onNavigate('search')}>
            התחל לחפש
          </button>
          <button type="button" className={styles.btnSecondary} onClick={() => onNavigate('upload')}>
            פרסם תקליט +
          </button>
        </div>

      </div>
    </Layout>
  )
}
