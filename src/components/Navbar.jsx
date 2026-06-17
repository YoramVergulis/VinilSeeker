import { useState } from 'react'
import { checkIsAdmin } from '../auth'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'בית',         page: 'home',       opts: {}                           },
  { label: 'חיפוש',       page: 'search',     opts: {}                           },
  { label: 'קטגוריות',    page: 'categories', opts: {}                           },
  { label: 'חנויות',      page: 'stores',     opts: {}                           },
  { label: 'איך זה עובד', page: 'home',       opts: { scrollTo: 'how-it-works' } },
]

function LogoDisc() {
  return (
    <svg className={styles.logoDisc} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="var(--vinyl-black)" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="var(--purple-800)" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="13" fill="var(--purple-700)" />
      <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
    </svg>
  )
}

export default function Navbar({ activePage = 'בית', onNavigate, currentUser = null, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() { setMenuOpen(false) }
  function nav(page, opts) { onNavigate?.(page, opts); closeMenu() }

  return (
    <>
      <nav className={styles.nav}>
        <button
          type="button"
          className={styles.logo}
          onClick={() => nav('home')}
          aria-label="VinilSeeker — דף הבית"
        >
          <LogoDisc />
          <span className={styles.logoText}>VinilSeeker</span>
        </button>

        <div className={styles.links}>
          {NAV_LINKS.map(({ label, page, opts }) => (
            <button
              key={label}
              type="button"
              className={`${styles.link} ${label === activePage ? styles.linkActive : ''}`}
              onClick={() => nav(page, opts)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          {currentUser ? (
            <>
              {checkIsAdmin(currentUser) && (
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={() => nav('admin')}
                  title="פאנל ניהול"
                >
                  ניהול
                </button>
              )}
              <button
                type="button"
                className={styles.heartBtn}
                onClick={() => nav('chat')}
                aria-label="הודעות"
                title="ההודעות שלי"
              >
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                  <path d="M4 4h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6l-3 3V5a1 1 0 0 1 1-1Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.heartBtn}
                onClick={() => nav('saved')}
                aria-label="מועדפים"
                title="המועדפים שלי"
              >
                <svg viewBox="0 0 20 20" fill="none" width="18" height="18" aria-hidden="true">
                  <path d="M10 17s-7-4.35-7-9a5 5 0 0 1 7-4.58A5 5 0 0 1 17 8c0 4.65-7 9-7 9Z"
                    stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className={styles.avatarBtn}
                onClick={() => nav('profile')}
                title="הפרופיל שלי"
              >
                <span className={styles.avatarCircle}>
                  {currentUser.name?.[0]?.toUpperCase() ?? '?'}
                </span>
                <span className={styles.avatarName}>{currentUser.name}</span>
              </button>
              <button type="button" className={`${styles.btnGhost} ${styles.desktopOnly}`} onClick={onLogout}>
                יציאה
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`${styles.btnGhost} ${styles.desktopOnly}`}
              onClick={() => nav('auth')}
            >
              התחברות
            </button>
          )}
          <button
            type="button"
            className={`${styles.btnPrimary} ${styles.desktopOnly}`}
            onClick={() => nav('upload')}
          >
            פרסם תקליט +
          </button>
        </div>

        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" width="22" height="22">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <>
          <div className={styles.mobileOverlay} onClick={closeMenu} />
          <div className={styles.mobileMenu}>
            <div className={styles.mobileLinks}>
              {NAV_LINKS.map(({ label, page, opts }) => (
                <button
                  key={label}
                  type="button"
                  className={`${styles.mobileLink} ${label === activePage ? styles.mobileLinkActive : ''}`}
                  onClick={() => nav(page, opts)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className={styles.mobileDivider} />
            <div className={styles.mobileActions}>
              {currentUser ? (
                <>
                  <button type="button" className={styles.mobileLink} onClick={() => nav('profile')}>
                    הפרופיל שלי
                  </button>
                  {checkIsAdmin(currentUser) && (
                    <button type="button" className={styles.mobileLink} onClick={() => nav('admin')}>
                      ניהול
                    </button>
                  )}
                  <button type="button" className={styles.mobileLink} onClick={() => { onLogout?.(); closeMenu() }}>
                    יציאה
                  </button>
                </>
              ) : (
                <button type="button" className={styles.mobileLink} onClick={() => nav('auth')}>
                  התחברות
                </button>
              )}
              <button type="button" className={styles.mobilePrimary} onClick={() => nav('upload')}>
                פרסם תקליט +
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
