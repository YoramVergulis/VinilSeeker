import { useState } from 'react'
import Layout from '../components/Layout'
import styles from './BlogPage.module.css'

const CATEGORIES = [
  { key: 'all',      label: 'הכל' },
  { key: 'guides',   label: 'מדריכים' },
  { key: 'interviews', label: 'ראיונות' },
  { key: 'history',  label: 'היסטוריה' },
  { key: 'gear',     label: 'ציוד' },
  { key: 'compare',  label: 'השוואות' },
]

const ARTICLES = [
  {
    id: 1,
    category: 'history',
    categoryLabel: 'היסטוריה',
    title: 'איך ויניל שרד את עידן ה-CD — וחזר חזק יותר',
    excerpt: 'בשנות ה-80 הכריזו על מות הוויניל. 40 שנה אחר כך, מכירות תקליטים גוברות על מכירות CD לראשונה מאז 1987. מה קרה?',
    author: 'יונתן לוי',
    date: '12 במאי 2026',
    readTime: '8 דק׳',
    featured: true,
  },
  {
    id: 2,
    category: 'guides',
    categoryLabel: 'מדריכים',
    title: 'מדריך לניקוי תקליטים: מהמים ועד למכונת ניקוי',
    excerpt: 'תקליט נקי מצלצל טוב יותר. מסביר שיטות ניקוי לפי תקציב — מהחינמי ועד הפרופסיונלי.',
    author: 'מיכל בן-דוד',
    date: '8 במאי 2026',
    readTime: '6 דק׳',
    featured: false,
  },
  {
    id: 3,
    category: 'gear',
    categoryLabel: 'ציוד',
    title: '5 מחטים שיקפיצו את מערכת הוויניל שלך ב-2026',
    excerpt: 'מחט טובה היא ההשקעה הטובה ביותר אחרי פטיפון איכותי. בדקנו 5 מחטים בטווח מחירים שונה.',
    author: 'דני כהן',
    date: '3 במאי 2026',
    readTime: '10 דק׳',
    featured: false,
  },
  {
    id: 4,
    category: 'interviews',
    categoryLabel: 'ראיונות',
    title: 'ראיון: אספן שצבר 12,000 תקליטים ב-30 שנה',
    excerpt: 'שוחחנו עם אביבה שפיר, אחת האספניות הוותיקות בישראל, על ה"מחלה" שאין לה תרופה.',
    author: 'שרה גולן',
    date: '29 באפריל 2026',
    readTime: '5 דק׳',
    featured: false,
  },
  {
    id: 5,
    category: 'compare',
    categoryLabel: 'השוואות',
    title: 'LP מקורי לעומת Reissue: האם ההבדל באמת שמיע?',
    excerpt: 'ניסינו עיוור: 20 מאזינים, אותו אלבום, גרסה מקורית מול Remaster. התוצאות הפתיעו.',
    author: 'יונתן לוי',
    date: '22 באפריל 2026',
    readTime: '7 דק׳',
    featured: false,
  },
  {
    id: 6,
    category: 'history',
    categoryLabel: 'היסטוריה',
    title: 'רוק ישראלי על ויניל: 50 שנה של תקליטים מקומיים',
    excerpt: 'מהתקליטים הראשונים של אריק איינשטיין ועד ההפקות העכשוויות — סיפור הוויניל הישראלי.',
    author: 'רינה לוי',
    date: '15 באפריל 2026',
    readTime: '12 דק׳',
    featured: false,
  },
  {
    id: 7,
    category: 'guides',
    categoryLabel: 'מדריכים',
    title: 'כיצד לאחסן תקליטים נכון: 7 כללי זהב',
    excerpt: 'אחסון שגוי הורס תקליטים. מסביר על אחסון זקוף, טמפרטורה, לחות ותיקיות מגן.',
    author: 'מיכל בן-דוד',
    date: '10 באפריל 2026',
    readTime: '4 דק׳',
    featured: false,
  },
]

const ITEMS_PER_PAGE = 6

export default function BlogPage({ onNavigate, currentUser, onLogout }) {
  const [category, setCategory] = useState('all')
  const [page,     setPage]     = useState(1)

  const filtered  = ARTICLES.filter(a => category === 'all' || a.category === category)
  const featured  = category === 'all' ? ARTICLES.find(a => a.featured) : null
  const rest      = featured ? filtered.filter(a => !a.featured) : filtered
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE)
  const visible   = rest.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  function handleCategory(key) {
    setCategory(key)
    setPage(1)
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>מגזין הוויניל</span>
          <h1 className={styles.heroTitle}>בלוג VinilSeeker</h1>
          <p className={styles.heroSub}>מדריכים, ראיונות, היסטוריה וכל מה שאספן ויניל צריך לדעת.</p>
        </div>
      </div>

      {/* Category pills */}
      <div className={styles.filterBar}>
        <div className={styles.filterInner}>
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              type="button"
              className={`${styles.pill} ${category === c.key ? styles.pillActive : ''}`}
              onClick={() => handleCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.body}>

        {/* Featured */}
        {category === 'all' && featured && (
          <div className={styles.featured}>
            <div className={styles.featuredImg} aria-hidden="true">
              <div className={styles.featuredDisc}>
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="98" fill="var(--vinyl-black)" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="var(--purple-700)" strokeWidth="0.5" />
                  <circle cx="100" cy="100" r="44" fill="none" stroke="var(--purple-700)" strokeWidth="0.5" opacity="0.5" />
                  <circle cx="100" cy="100" r="20" fill="var(--purple-700)" opacity="0.6" />
                  <circle cx="100" cy="100" r="5" fill="var(--gold-500)" />
                </svg>
              </div>
            </div>
            <div className={styles.featuredContent}>
              <span className={styles.featuredBadge}>כתבת השער</span>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
              <div className={styles.featuredMeta}>
                <span>{featured.author}</span>
                <span className={styles.metaDot}>&middot;</span>
                <span>{featured.date}</span>
                <span className={styles.metaDot}>&middot;</span>
                <span>{featured.readTime} קריאה</span>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {visible.length > 0 && (
          <>
            <h2 className={styles.gridHeading}>
              {category === 'all' ? 'כתבות נוספות' : CATEGORIES.find(c => c.key === category)?.label}
            </h2>
            <div className={styles.grid}>
              {visible.map(article => (
                <article key={article.id} className={styles.card}>
                  <div className={styles.cardImg} aria-hidden="true">
                    <svg viewBox="0 0 160 100" fill="none" width="100%" height="100%">
                      <rect width="160" height="100" fill="var(--cream-deep)" />
                      <circle cx="80" cy="50" r="36" fill="var(--vinyl-black)" opacity="0.7" />
                      <circle cx="80" cy="50" r="12" fill="var(--purple-700)" opacity="0.5" />
                      <circle cx="80" cy="50" r="3" fill="var(--gold-500)" />
                    </svg>
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardCategory}>{article.categoryLabel}</span>
                    <h3 className={styles.cardTitle}>{article.title}</h3>
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                    <div className={styles.cardMeta}>
                      <span>{article.author}</span>
                      <span className={styles.metaDot}>&middot;</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  &rsaquo;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.pageBtn} ${page === n ? styles.pageBtnActive : ''}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  &lsaquo;
                </button>
              </div>
            )}
          </>
        )}

        {visible.length === 0 && (
          <div className={styles.empty}>
            <p className={styles.emptyText}>אין כתבות בקטגוריה זו עדיין.</p>
            <button type="button" className={styles.btnPrimary} onClick={() => handleCategory('all')}>
              הצג הכל
            </button>
          </div>
        )}

      </div>
    </Layout>
  )
}
