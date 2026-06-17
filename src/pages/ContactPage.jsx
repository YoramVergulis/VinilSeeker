import { useState } from 'react'
import Layout from '../components/Layout'
import styles from './ContactPage.module.css'

const SUBJECTS = [
  'שאלה כללית',
  'בעיה טכנית',
  'דיווח על תוכן',
  'שיתוף פעולה עסקי',
  'בקשת הסרה',
  'אחר',
]

const INFO_CARDS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22 6l-10 7L2 6" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'אימייל',
    lines: ['support@vinilseeker.com', 'נשיב תוך יום עסקים אחד'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <circle cx="12" cy="12" r="10" stroke="var(--purple-700)" strokeWidth="1.8"/>
        <path d="M12 6v6l4 2" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'שעות מענה',
    lines: ['ראשון–חמישי: 9:00–18:00', 'שישי: 9:00–13:00'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="9" cy="7" r="4" stroke="var(--purple-700)" strokeWidth="1.8"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="var(--purple-700)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'שיתופי פעולה',
    lines: ['חנויות, אמנים ומשווקים:', 'partners@vinilseeker.com'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="var(--purple-700)" strokeWidth="1.8"/>
        <circle cx="12" cy="10" r="3" stroke="var(--purple-700)" strokeWidth="1.8"/>
      </svg>
    ),
    title: 'כתובת',
    lines: ['תל אביב–יפו, ישראל', 'פעולה דיגיטלית בלבד'],
  },
]

export default function ContactPage({ onNavigate, currentUser, onLogout }) {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [subject,   setSubject]   = useState(SUBJECTS[0])
  const [message,   setMessage]   = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('נא למלא את כל השדות הדרושים.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  function handleReset() {
    setName('')
    setEmail('')
    setSubject(SUBJECTS[0])
    setMessage('')
    setSubmitted(false)
  }

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>אנחנו כאן</span>
          <h1 className={styles.heroTitle}>צור קשר</h1>
          <p className={styles.heroSub}>יש שאלה, בעיה או הצעה? נשמח לשמוע ממך.</p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.layout}>

          {/* Form */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successState}>
                <svg viewBox="0 0 64 64" fill="none" width="64" height="64" aria-hidden="true">
                  <circle cx="32" cy="32" r="30" fill="var(--purple-700)" opacity=".1" />
                  <path d="M20 32l8 8 16-16" stroke="var(--purple-700)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h2 className={styles.successTitle}>תודה! הודעתך התקבלה</h2>
                <p className={styles.successText}>נחזור אליך תוך יום עסקים אחד לכתובת {email}.</p>
                <button type="button" className={styles.btnSecondary} onClick={handleReset}>שלח הודעה נוספת</button>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>שלח לנו הודעה</h2>
                <form className={styles.form} onSubmit={handleSubmit}>
                  <div className={styles.fieldWrap}>
                    <label className={styles.label} htmlFor="c-name">שם מלא</label>
                    <input
                      id="c-name"
                      type="text"
                      className={styles.input}
                      placeholder="ישראל ישראלי"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label className={styles.label} htmlFor="c-email">אימייל</label>
                    <input
                      id="c-email"
                      type="email"
                      className={styles.input}
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.fieldWrap}>
                    <label className={styles.label} htmlFor="c-subject">נושא</label>
                    <select
                      id="c-subject"
                      className={styles.select}
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                    >
                      {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className={styles.fieldWrap}>
                    <label className={styles.label} htmlFor="c-message">הודעה</label>
                    <textarea
                      id="c-message"
                      className={styles.textarea}
                      placeholder="ספר לנו במה אפשר לעזור..."
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className={styles.formError}>{error}</p>}
                  <button type="submit" className={styles.btnPrimary}>שלח הודעה &larr;</button>
                </form>
              </>
            )}
          </div>

          {/* Info cards */}
          <div className={styles.infoCol}>
            {INFO_CARDS.map(card => (
              <div key={card.title} className={styles.infoCard}>
                <div className={styles.infoIcon}>{card.icon}</div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>{card.title}</h3>
                  {card.lines.map((line, i) => (
                    <p key={i} className={styles.infoLine}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  )
}
