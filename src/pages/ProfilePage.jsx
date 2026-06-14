import { useState } from 'react'
import Layout from '../components/Layout'
import VinylCard from '../components/VinylCard'
import styles from './ProfilePage.module.css'

const CITIES = ['תל אביב', 'חיפה', 'ירושלים', 'ראשל"צ', 'פ"ת', 'נתניה', 'ב"ש', 'רמת גן', 'אחר']

function Avatar({ name, size = 88 }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  return (
    <div
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.42) }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}

export default function ProfilePage({ currentUser, onNavigate, onLogout, onUpdateUser, vinylList = [] }) {
  const [editing,  setEditing]  = useState(false)
  const [editName, setEditName] = useState(currentUser?.name ?? '')
  const [editCity, setEditCity] = useState(currentUser?.city ?? '')

  if (!currentUser) return null

  const myListings = vinylList.filter(v => v.uploaderId === currentUser.id)

  const joinedDate = currentUser.joinedAt
    ? new Date(currentUser.joinedAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
    : null

  function handleSave() {
    const trimmed = editName.trim()
    if (!trimmed) return
    onUpdateUser({ name: trimmed, city: editCity })
    setEditing(false)
  }

  function handleCancel() {
    setEditName(currentUser.name)
    setEditCity(currentUser.city ?? '')
    setEditing(false)
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* ── Profile header ── */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <Avatar name={currentUser.name} size={88} />

          <div className={styles.headerInfo}>
            <h1 className={styles.userName}>{currentUser.name}</h1>
            <p className={styles.userEmail}>{currentUser.email}</p>
            <div className={styles.userMeta}>
              {currentUser.city && (
                <span className={styles.metaChip}>{currentUser.city}</span>
              )}
              {currentUser.city && joinedDate && <span className={styles.metaDot}>·</span>}
              {joinedDate && (
                <span className={styles.metaText}>הצטרף {joinedDate}</span>
              )}
            </div>
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => { setEditing(e => !e); setEditName(currentUser.name); setEditCity(currentUser.city ?? '') }}
            >
              {editing ? 'סגור עריכה' : 'ערוך פרופיל'}
            </button>
            <button type="button" className={styles.btnSignOut} onClick={onLogout}>
              יציאה
            </button>
          </div>
        </div>
      </div>

      {/* ── Edit form ── */}
      {editing && (
        <div className={styles.editWrap}>
          <div className={styles.editCard}>
            <h2 className={styles.editTitle}>עריכת פרופיל</h2>
            <div className={styles.editGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-name">שם מלא</label>
                <input
                  id="p-name"
                  type="text"
                  className={styles.input}
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="p-city">עיר</label>
                <select
                  id="p-city"
                  className={styles.input}
                  value={editCity}
                  onChange={e => setEditCity(e.target.value)}
                >
                  <option value="">לא צוין</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.editActions}>
              <button type="button" className={styles.btnPrimary} onClick={handleSave}>
                שמור שינויים
              </button>
              <button type="button" className={styles.btnGhost} onClick={handleCancel}>
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── My listings ── */}
      <div className={styles.listings}>
        <div className={styles.listingsHeader}>
          <span className={styles.eyebrow}>מכירות</span>
          <h2 className={styles.sectionTitle}>
            המכירות שלי
            {myListings.length > 0 && (
              <span className={styles.count}>{myListings.length}</span>
            )}
          </h2>
        </div>

        {myListings.length === 0 ? (
          <div className={styles.emptyState}>
            <svg viewBox="0 0 64 64" fill="none" width="72" height="72" aria-hidden="true">
              <circle cx="32" cy="32" r="30" fill="none" stroke="var(--rule)" strokeWidth="2" />
              <circle cx="32" cy="32" r="18" fill="none" stroke="var(--rule)" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="8"  fill="none" stroke="var(--rule)" strokeWidth="1.5" />
              <circle cx="32" cy="32" r="2.5" fill="var(--rule)" />
            </svg>
            <p className={styles.emptyTitle}>עדיין לא פרסמת תקליטים</p>
            <p className={styles.emptyBody}>פרסם את התקליטים שלך ותגיע לאלפי אספנים</p>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => onNavigate('upload')}
            >
              פרסם תקליט ראשון +
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {myListings.map(v => (
              <div key={v.id} className={styles.cardWrap}>
                <VinylCard {...v} onNavigate={onNavigate} />
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => onNavigate('edit', { listing: v })}
                >
                  <svg viewBox="0 0 20 20" fill="none" width="14" height="14" aria-hidden="true">
                    <path d="M13.5 3.5l3 3L7 16H4v-3L13.5 3.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  </svg>
                  ערוך מכירה
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </Layout>
  )
}
