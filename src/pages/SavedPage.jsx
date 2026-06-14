import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { getSaved, toggleSaved, getAlerts, removeAlert, updateAlertPrice } from '../auth'
import styles from './SavedPage.module.css'

function VinylRow({ record, onView, onRemove }) {
  const cover = record.cover || record.image || null
  const price = record.price ?? record.currentPrice ?? null

  return (
    <div className={styles.row}>
      <div className={styles.rowCover}>
        {cover
          ? <img src={cover} alt={record.title} className={styles.rowImg} />
          : (
            <svg viewBox="0 0 60 60" width="60" height="60" aria-hidden="true">
              <circle cx="30" cy="30" r="30" fill="var(--vinyl-black)" />
              <circle cx="30" cy="30" r="10" fill="var(--purple-700)" />
              <circle cx="30" cy="30" r="2" fill="var(--gold-500)" />
            </svg>
          )
        }
      </div>

      <div className={styles.rowInfo}>
        <span className={styles.rowTitle}>{record.title}</span>
        <span className={styles.rowArtist}>{record.artist}</span>
        <div className={styles.rowChips}>
          {record.format && <span className={styles.chip}>{record.format}</span>}
          {record.condition && <span className={styles.chip}>{record.condition}</span>}
          {record.genre && (
            Array.isArray(record.genre)
              ? record.genre.slice(0, 2).map(g => <span key={g} className={styles.chip}>{g}</span>)
              : <span className={styles.chip}>{record.genre}</span>
          )}
        </div>
      </div>

      {price !== null && (
        <span className={styles.rowPrice}>₪{price}</span>
      )}

      <button type="button" className={styles.btnView} onClick={onView}>
        צפה
      </button>

      <button type="button" className={styles.btnRemove} onClick={onRemove} aria-label="הסר מהמועדפים">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function AlertRow({ alert, onRemove }) {
  const [targetPrice, setTargetPrice] = useState(alert.targetPrice ?? '')
  const currentPrice = alert.currentPrice ?? null

  function handleBlur() {
    const val = Number(targetPrice)
    if (!isNaN(val) && val > 0) updateAlertPrice(alert.id, val)
  }

  return (
    <div className={styles.row}>
      <div className={styles.alertInfo}>
        <span className={styles.rowTitle}>{alert.title}</span>
        <span className={styles.rowArtist}>{alert.artist}</span>
        <div className={styles.alertPriceRow}>
          <span className={styles.alertLabel}>התראה כאשר מחיר יורד מתחת ל:</span>
          <span className={styles.alertPriceWrap}>
            <span className={styles.shekel}>₪</span>
            <input
              type="number"
              className={styles.alertInput}
              value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              onBlur={handleBlur}
              placeholder="0"
            />
          </span>
        </div>
      </div>

      <div className={styles.alertStatus}>
        {currentPrice !== null && (
          <span className={styles.alertCurrentPrice}>מחיר נוכחי: ₪{currentPrice}</span>
        )}
        <span className={styles.alertBadge}>פעיל</span>
      </div>

      <button type="button" className={styles.btnRemove} onClick={onRemove} aria-label="הסר התראה">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

function EmptyState({ icon, title, body, action, onAction }) {
  return (
    <div className={styles.emptyState}>
      {icon}
      <p className={styles.emptyTitle}>{title}</p>
      <p className={styles.emptyBody}>{body}</p>
      {action && (
        <button type="button" className={styles.btnPrimary} onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

const HeartEmptySVG = (
  <svg viewBox="0 0 64 64" fill="none" width="72" height="72" aria-hidden="true">
    <path d="M32 56S8 41.4 8 24a16 16 0 0 1 24-13.86A16 16 0 0 1 56 24c0 17.4-24 32-24 32Z"
      stroke="var(--rule)" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

const BellSVG = (
  <svg viewBox="0 0 64 64" fill="none" width="72" height="72" aria-hidden="true">
    <path d="M32 8a18 18 0 0 0-18 18c0 8-4 13-4 13h44s-4-5-4-13A18 18 0 0 0 32 8Z"
      stroke="var(--rule)" strokeWidth="2" strokeLinejoin="round" />
    <path d="M28 52a4 4 0 0 0 8 0" stroke="var(--rule)" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export default function SavedPage({ onNavigate, vinylList = [], currentUser, onLogout }) {
  const [tab, setTab] = useState('saved')
  const [savedIds, setSavedIds] = useState([])
  const [alerts, setAlerts] = useState(getAlerts)

  useEffect(() => {
    getSaved().then(ids => setSavedIds(ids))
  }, [])

  const savedRecords = vinylList.filter(v => savedIds.includes(v.id))

  function handleRemoveSaved(id) {
    toggleSaved(id)
    getSaved().then(ids => setSavedIds(ids))
  }

  function handleRemoveAlert(id) {
    removeAlert(id)
    setAlerts(getAlerts())
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>אוסף אישי</span>
          <h1 className={styles.title}>הרשימה שלי</h1>
        </div>

        <div className={styles.tabBar}>
          <div className={styles.tabBarInner}>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'saved' ? styles.tabActive : ''}`}
              onClick={() => setTab('saved')}
            >
              פריטים שמורים
              {savedRecords.length > 0 && (
                <span className={styles.tabCount}>{savedRecords.length}</span>
              )}
            </button>
            <button
              type="button"
              className={`${styles.tab} ${tab === 'alerts' ? styles.tabActive : ''}`}
              onClick={() => setTab('alerts')}
            >
              התראות מחיר
              {alerts.length > 0 && (
                <span className={styles.tabCount}>{alerts.length}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.body}>

        {tab === 'saved' && (
          savedRecords.length === 0
            ? <EmptyState
                icon={HeartEmptySVG}
                title="עוד לא שמרת תקליטים"
                body='לחץ על הלב בכרטיס תקליט כדי לשמור אותו לכאן'
                action="גלה תקליטים"
                onAction={() => onNavigate('search')}
              />
            : <div className={styles.list}>
                {savedRecords.map(v => (
                  <VinylRow
                    key={v.id}
                    record={v}
                    onView={() => onNavigate('product', { product: v })}
                    onRemove={() => handleRemoveSaved(v.id)}
                  />
                ))}
              </div>
        )}

        {tab === 'alerts' && (
          alerts.length === 0
            ? <EmptyState
                icon={BellSVG}
                title="אין התראות מחיר"
                body='פתח דף תקליט ולחץ "התראת מחיר" כדי לקבל עדכון כשהמחיר יורד'
                action="חפש תקליטים"
                onAction={() => onNavigate('search')}
              />
            : <div className={styles.list}>
                {alerts.map(a => (
                  <AlertRow
                    key={a.id}
                    alert={a}
                    onRemove={() => handleRemoveAlert(a.id)}
                  />
                ))}
              </div>
        )}

      </div>

    </Layout>
  )
}
