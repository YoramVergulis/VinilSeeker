import { useState } from 'react'
import Layout from '../components/Layout'
import { checkIsAdmin } from '../auth'
import styles from './AdminPage.module.css'

const MOCK_LISTINGS = [
  { id: 1, title: 'Pink Floyd — DSOTM',             seller: 'יוסי כהן',  cond: 'VG+', price: 220, date: '08/05', status: 'פעיל',   flagged: false },
  { id: 2, title: 'Beatles — Abbey Road',           seller: 'רינה לוי',  cond: 'חדש', price: 380, date: '07/05', status: 'פעיל',   flagged: false },
  { id: 3, title: 'Miles Davis — Kind of Blue',     seller: 'דני אבן',   cond: 'VG',  price: 95,  date: '07/05', status: 'מדווח',  flagged: true  },
  { id: 4, title: 'Led Zeppelin IV',                seller: 'שרה גולן',  cond: 'VG+', price: 290, date: '06/05', status: 'נמכר',   flagged: false },
  { id: 5, title: 'Radiohead — OK Computer',        seller: 'אמיר ברוך', cond: 'VG',  price: 180, date: '05/05', status: 'פעיל',   flagged: false },
]

const MOCK_USERS = [
  { id: 1, name: 'יוסי כהן',          email: 'yossi@example.com',    type: 'מוכר',  joined: '01/2024', status: 'פעיל'   },
  { id: 2, name: 'רינה לוי',          email: 'rina@example.com',     type: 'קונה',  joined: '03/2024', status: 'פעיל'   },
  { id: 3, name: 'חנות רקורד ת"א',   email: 'shop@records.co.il',   type: 'חנות',  joined: '11/2023', status: 'מאומת'  },
  { id: 4, name: 'משתמש חסום',        email: 'spam@bad.com',         type: 'קונה',  joined: '08/05',   status: 'חסום'   },
]

const MOCK_REPORTS = [
  { id: 1, reporter: 'רינה לוי',  target: 'מכירה: Miles Davis — Kind of Blue', reason: 'תיאור מטעה',                     status: 'פתוח',   priority: 'גבוה',  ago: 'לפני שעתיים' },
  { id: 2, reporter: 'דני אבן',   target: 'משתמש: spam@bad.com',               reason: 'ספאם / הודעות לא רצויות',       status: 'פתוח',   priority: 'בינוני', ago: 'לפני 4 שעות' },
  { id: 3, reporter: 'יוסי כהן',  target: 'מכירה: (אלבום מוסר)',               reason: 'מצב התקליט שונה מהמתואר',       status: 'בטיפול', priority: 'בינוני', ago: 'אתמול'        },
]

const MOCK_STORES = [
  { id: 1, name: 'רקורד תל אביב',  city: 'תל אביב',     items: 482, status: 'מאומת'   },
  { id: 2, name: 'מוסיקה לכל',     city: 'ירושלים',    items: 215, status: 'מאומת'   },
  { id: 3, name: 'Vinyl Heaven',    city: 'חיפה',        items: 138, status: 'בהמתנה'  },
  { id: 4, name: 'הכל בויניל',     city: 'פתח תקווה',  items: 92,  status: 'מאומת'   },
]

const STATS = [
  { label: 'סה"כ משתמשים',   value: '4,832', sub: '+18 השבוע'         },
  { label: 'מכירות פעילות',  value: '1,247', sub: '+62 היום'          },
  { label: 'דיווחים פתוחים', value: '7',     sub: 'דורש טיפול'        },
  { label: 'הכנסות (חודש)',  value: '—',     sub: 'אין מודל מסחרי'   },
]

const STATUS_COLORS = {
  'פעיל':   { bg: 'rgba(46,125,91,.1)',   color: 'var(--success)'  },
  'מאומת':  { bg: 'rgba(46,125,91,.1)',   color: 'var(--success)'  },
  'נמכר':   { bg: 'rgba(74,61,92,.1)',    color: 'var(--ink-2)'    },
  'מדווח':  { bg: 'rgba(168,50,74,.1)',   color: 'var(--danger)'   },
  'חסום':   { bg: 'rgba(168,50,74,.1)',   color: 'var(--danger)'   },
  'בהמתנה': { bg: 'rgba(184,128,26,.1)', color: 'var(--warning)'  },
  'בטיפול': { bg: 'rgba(184,128,26,.1)', color: 'var(--warning)'  },
  'פתוח':   { bg: 'rgba(168,50,74,.1)',   color: 'var(--danger)'   },
}

function StatusBadge({ label }) {
  const style = STATUS_COLORS[label] ?? { bg: 'var(--cream-deep)', color: 'var(--ink-2)' }
  return (
    <span className={styles.badge} style={{ background: style.bg, color: style.color }}>
      {label}
    </span>
  )
}

function ListingsTab({ listings, onNavigate }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const filtered = search ? listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.seller.includes(search)
  ) : listings

  function toggleRow(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div>
      <div className={styles.tableToolbar}>
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="חפש מכירה לפי שם / מוכר..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button type="button" className={styles.btnOutline}>ייצא CSV</button>
      </div>

      <div className={styles.table}>
        <div className={`${styles.tableRow} ${styles.tableHead}`}>
          <span></span>
          <span>תקליט</span>
          <span>מוכר</span>
          <span>מצב</span>
          <span>מחיר</span>
          <span>תאריך</span>
          <span>סטטוס</span>
          <span>פעולות</span>
        </div>
        {filtered.map(row => (
          <div
            key={row.id}
            className={`${styles.tableRow} ${row.flagged ? styles.rowFlagged : ''}`}
          >
            <input
              type="checkbox"
              checked={selected.includes(row.id)}
              onChange={() => toggleRow(row.id)}
              className={styles.checkbox}
            />
            <span className={styles.cellTitle}>{row.title}</span>
            <span className={styles.cellMuted}>{row.seller}</span>
            <span><StatusBadge label={row.cond} /></span>
            <span className={styles.cellPrice}>₪{row.price}</span>
            <span className={styles.cellMuted}>{row.date}</span>
            <span><StatusBadge label={row.status} /></span>
            <div className={styles.cellActions}>
              <button type="button" className={styles.actionBtn} onClick={() => {}}>צפה</button>
              <button type="button" className={styles.actionBtn} onClick={() => {}}>ערוך</button>
              <button type="button" className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={() => {}}>הסר</button>
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className={styles.bulkBar}>
          <span className={styles.bulkLabel}>{selected.length} פריטים נבחרו · פעולות:</span>
          <button type="button" className={styles.btnOutline} onClick={() => setSelected([])}>בטל בחירה</button>
          <button type="button" className={styles.btnOutline}>אישור נבחרים</button>
          <button type="button" className={styles.btnDanger}>הסר נבחרים</button>
        </div>
      )}

      <div className={styles.pagination}>
        {['‹', '1', '2', '3', '...', '125', '›'].map((p, i) => (
          <button key={i} type="button" className={`${styles.pageBtn} ${p === '1' ? styles.pageBtnActive : ''}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

function UsersTab() {
  const [search, setSearch] = useState('')
  const filtered = search
    ? MOCK_USERS.filter(u => u.name.includes(search) || u.email.includes(search))
    : MOCK_USERS

  return (
    <div>
      <div className={styles.tableToolbar}>
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="חפש משתמש לפי שם / אימייל..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.table}>
        <div className={`${styles.tableRow} ${styles.tableHead} ${styles.tableHeadUsers}`}>
          <span></span>
          <span></span>
          <span>שם</span>
          <span>אימייל</span>
          <span>סוג</span>
          <span>הצטרף</span>
          <span>סטטוס</span>
          <span>פעולות</span>
        </div>
        {filtered.map(user => (
          <div
            key={user.id}
            className={`${styles.tableRow} ${styles.tableRowUsers} ${user.status === 'חסום' ? styles.rowFlagged : ''}`}
          >
            <input type="checkbox" className={styles.checkbox} onChange={() => {}} />
            <div className={styles.userAvatar}>{user.name[0]}</div>
            <span className={styles.cellTitle}>{user.name}</span>
            <span className={styles.cellMuted}>{user.email}</span>
            <span><StatusBadge label={user.type} /></span>
            <span className={styles.cellMuted}>{user.joined}</span>
            <span><StatusBadge label={user.status} /></span>
            <div className={styles.cellActions}>
              <button type="button" className={styles.actionBtn}>צפה</button>
              <button type="button" className={styles.actionBtn}>
                {user.status === 'חסום' ? 'בטל חסימה' : 'חסום'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsTab() {
  return (
    <div className={styles.reportsList}>
      {MOCK_REPORTS.map(r => (
        <div
          key={r.id}
          className={styles.reportCard}
          style={{ borderRightColor: r.priority === 'גבוה' ? 'var(--danger)' : 'var(--rule)' }}
        >
          <div className={styles.reportHeader}>
            <div className={styles.reportBadges}>
              <span className={styles.badge} style={r.priority === 'גבוה'
                ? { background: 'rgba(168,50,74,.1)', color: 'var(--danger)' }
                : { background: 'rgba(184,128,26,.1)', color: 'var(--warning)' }
              }>
                עדיפות: {r.priority}
              </span>
              <StatusBadge label={r.status} />
            </div>
            <span className={styles.reportTime}>{r.ago}</span>
          </div>
          <p className={styles.reportTarget}>{r.target}</p>
          <p className={styles.reportReason}>סיבה: {r.reason}</p>
          <p className={styles.reportBy}>דווח על ידי: {r.reporter}</p>
          <div className={styles.reportActions}>
            <button type="button" className={styles.btnPrimary}>חקור</button>
            <button type="button" className={styles.btnOutline}>פתור — תקין</button>
            <button type="button" className={styles.btnOutline}>הסר את הפריט</button>
            <button type="button" className={styles.btnDanger}>חסום משתמש</button>
          </div>
        </div>
      ))}
    </div>
  )
}

function StoresTab() {
  return (
    <div>
      <div className={styles.tableToolbar}>
        <div className={styles.searchWrap}>
          <input type="search" className={styles.searchInput} placeholder="חפש חנות..." />
        </div>
        <button type="button" className={styles.btnPrimary}>+ הוסף חנות</button>
      </div>
      <div className={styles.storesGrid}>
        {MOCK_STORES.map(s => (
          <div key={s.id} className={styles.storeCard}>
            <div className={styles.storeCardTop}>
              <span className={styles.storeName}>{s.name}</span>
              <StatusBadge label={s.status} />
            </div>
            <p className={styles.storeMeta}>{s.city} · {s.items} פריטים בקטלוג</p>
            <div className={styles.storeActions}>
              <button type="button" className={styles.btnOutline}>ערוך</button>
              <button type="button" className={styles.btnOutline}>סנכרן מלאי</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const TABS = [
  { id: 'listings', label: 'מכירות (1,247)'  },
  { id: 'users',    label: 'משתמשים (4,832)' },
  { id: 'reports',  label: 'דיווחים (7) ⚠'  },
  { id: 'stores',   label: 'חנויות (38)'     },
]

export default function AdminPage({ currentUser, onNavigate, onLogout, vinylList = [] }) {
  const [tab, setTab] = useState('listings')

  if (!currentUser || !checkIsAdmin(currentUser)) {
    return (
      <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>
        <div className={styles.denied}>
          <svg viewBox="0 0 64 64" fill="none" width="80" height="80" aria-hidden="true">
            <circle cx="32" cy="32" r="29" stroke="var(--danger)" strokeWidth="2" />
            <path d="M20 20l24 24M44 20L20 44" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <h1 className={styles.deniedTitle}>גישה נדחתה</h1>
          <p className={styles.deniedBody}>אין לך הרשאות אדמין לגשת לדף זה.</p>
          <button type="button" className={styles.btnPrimary} onClick={() => onNavigate('home')}>
            חזרה לדף הבית
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* Admin header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderInner}>
          <div className={styles.adminHeaderLeft}>
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22" aria-hidden="true">
              <path d="M10 2L12.4 7.4H18L13.6 10.8l1.8 5.6L10 13l-5.4 3.4 1.8-5.6L2 7.4h5.6L10 2Z"
                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
            <h1 className={styles.adminTitle}>פאנל ניהול</h1>
          </div>
          <span className={styles.adminEmail}>מחובר כ: {currentUser.email}</span>
        </div>
      </div>

      {/* Stats cards */}
      <div className={styles.statsStrip}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.statCard}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>{s.value}</span>
            <span className={styles.statSub}>{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.tabBar}>
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            className={`${styles.tabBtn} ${tab === t.id ? styles.tabBtnActive : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.tabContent}>
        {tab === 'listings' && <ListingsTab listings={MOCK_LISTINGS} onNavigate={onNavigate} />}
        {tab === 'users'    && <UsersTab />}
        {tab === 'reports'  && <ReportsTab />}
        {tab === 'stores'   && <StoresTab />}
      </div>

    </Layout>
  )
}
