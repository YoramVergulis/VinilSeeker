import styles from './Footer.module.css'

const COLUMNS = [
  {
    title: 'תקליטים',
    links: [
      { label: 'חיפוש',           page: 'search'     },
      { label: "לפי ז'אנר",       page: 'categories' },
      { label: 'חנויות',          page: 'stores'     },
      { label: 'תקליטים נדירים',  page: 'rare'       },
    ],
  },
  {
    title: 'מכירה',
    links: [
      { label: 'פרסם תקליט',     page: 'upload'  },
      { label: 'מדריך למוכרים',  page: 'seller'  },
      { label: 'ייעוץ מחירים',   page: 'pricing' },
      { label: 'איך זה עובד',    page: 'how'     },
    ],
  },
  {
    title: 'קהילה',
    links: [
      { label: 'בלוג',    page: 'blog'    },
      { label: 'צור קשר', page: 'contact' },
      { label: 'תקנון',   page: 'terms'   },
      { label: 'פרטיות',  page: 'privacy' },
    ],
  },
]

function LogoDisc() {
  return (
    <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="var(--vinyl-black)" stroke="var(--purple-700)" strokeWidth="1" />
      <circle cx="32" cy="32" r="13" fill="var(--purple-700)" />
      <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
    </svg>
  )
}

export default function Footer({ onNavigate }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <button type="button" className={styles.brandBtn} onClick={() => onNavigate?.('home')}>
            <LogoDisc />
            <span className={styles.brandText}>VinilSeeker</span>
          </button>
          <p className={styles.tagline}>
            השוק הישראלי לתקליטי ויניל. מחבר אספנים, מוכרים וחנויות בכל הארץ — מ-2025.
          </p>
        </div>

        {COLUMNS.map(({ title, links }) => (
          <div key={title}>
            <h5 className={styles.colTitle}>{title}</h5>
            <ul className={styles.colList}>
              {links.map(({ label, page }) => (
                <li key={label}>
                  <button
                    type="button"
                    className={styles.footerLink}
                    onClick={() => onNavigate?.(page)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <span>© 2025 VinilSeeker · ויניל סיקר</span>
        <span>נבנה באהבה לתקליטים בישראל</span>
      </div>
    </footer>
  )
}
