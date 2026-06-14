import { useState } from 'react'
import Layout from '../components/Layout'
import { login, register } from '../auth'
import { supabase } from '../supabase'
import styles from './AuthPage.module.css'

function LogoDisc() {
  return (
    <svg viewBox="0 0 64 64" className={styles.logoDisc} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="var(--vinyl-black)" />
      <circle cx="32" cy="32" r="22" fill="none" stroke="var(--purple-800)" strokeWidth="0.5" />
      <circle cx="32" cy="32" r="13" fill="var(--purple-700)" />
      <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
    </svg>
  )
}

function VinylArt() {
  const grooves = Array.from({ length: 14 }, (_, i) => 44 + i * 4)
  return (
    <svg viewBox="0 0 200 200" className={styles.vinylArt} aria-hidden="true">
      <circle cx="100" cy="100" r="99" fill="var(--vinyl-black)" />
      {grooves.map(r => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.8" />
      ))}
      <circle cx="100" cy="100" r="36" fill="var(--purple-700)" />
      <circle cx="100" cy="100" r="24" fill="var(--purple-800)" />
      <circle cx="100" cy="100" r="8"  fill="var(--gold-500)" />
      <circle cx="100" cy="100" r="3"  fill="var(--vinyl-black)" />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" width="18" height="18" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LoginForm({ onForgotClick, onSuccess }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const user = await login(email, password)
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="login-email">כתובת אימייל</label>
        <input
          id="login-email"
          type="email"
          className={styles.input}
          placeholder="you@example.com"
          dir="ltr"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <div className={styles.labelRow}>
          <label className={styles.label} htmlFor="login-password">סיסמה</label>
          <button type="button" className={styles.forgotLink} onClick={onForgotClick}>
            שכחת סיסמה?
          </button>
        </div>
        <div className={styles.pwdWrap}>
        <input
          id="login-password"
          type={showPwd ? 'text' : 'password'}
          className={styles.input}
          placeholder="••••••••"
          dir="ltr"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className={styles.eyeBtn}
          onClick={() => setShowPwd(v => !v)}
          aria-label={showPwd ? 'הסתר סיסמה' : 'הצג סיסמה'}
        >
          <EyeIcon open={showPwd} />
        </button>
        </div>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <button type="submit" className={styles.btnPrimary}>התחבר לחשבון</button>
    </form>
  )
}

function RegisterForm({ onSuccess }) {
  const [name,      setName]      = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [password2, setPassword2] = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!name.trim())              { setError('נא להזין שם מלא'); return }
    if (password.length < 6)       { setError('הסיסמה חייבת להכיל לפחות 6 תווים'); return }
    if (password !== password2)    { setError('הסיסמאות אינן תואמות'); return }
    try {
      const user = await register(name.trim(), email, password)
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-name">שם מלא</label>
        <input
          id="reg-name"
          type="text"
          className={styles.input}
          placeholder="ישראל ישראלי"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="reg-email">כתובת אימייל</label>
        <input
          id="reg-email"
          type="email"
          className={styles.input}
          placeholder="you@example.com"
          dir="ltr"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.twoCol}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-pass">סיסמה</label>
          <div className={styles.pwdWrap}>
            <input
              id="reg-pass"
              type={showPwd ? 'text' : 'password'}
              className={styles.input}
              placeholder="לפחות 6 תווים"
              dir="ltr"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPwd(v => !v)}
              aria-label={showPwd ? 'הסתר סיסמה' : 'הצג סיסמה'}
            >
              <EyeIcon open={showPwd} />
            </button>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="reg-pass2">אימות סיסמה</label>
          <div className={styles.pwdWrap}>
            <input
              id="reg-pass2"
              type={showPwd ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••••••"
              dir="ltr"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {error && <p className={styles.formError}>{error}</p>}

      <button type="submit" className={styles.btnGold}>יצירת חשבון חינמי</button>

      <p className={styles.terms}>
        בהרשמה אתה מסכים ל<a href="#">תנאי השימוש</a> ול<a href="#">מדיניות הפרטיות</a>
      </p>
    </form>
  )
}

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('')
  const [sent,  setSent]  = useState(false)
  const [error, setError] = useState('')

  if (sent) {
    return (
      <div className={styles.successBlock}>
        <div className={styles.successIcon} aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="24" fill="var(--purple-100)" />
            <path d="M8 16l16 11L40 16" stroke="var(--purple-700)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="8" y="14" width="32" height="22" rx="3" stroke="var(--purple-700)" strokeWidth="2" />
          </svg>
        </div>
        <h2 className={styles.successTitle}>הקישור נשלח!</h2>
        <p className={styles.successBody}>
          שלחנו לך קישור לאיפוס הסיסמה. בדוק את תיבת הדואר הנכנס שלך (ואולי גם את ספאם).
        </p>
        <button type="button" className={styles.btnPrimary} onClick={onBack}>
          חזרה להתחברות
        </button>
      </div>
    )
  }

  return (
    <>
      <button type="button" className={styles.backBtn} onClick={onBack}>
        <svg viewBox="0 0 20 20" fill="none" width="16" height="16" aria-hidden="true">
          <path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        חזרה לכניסה
      </button>

      <div className={styles.headingBlock}>
        <h1 className={styles.heading}>שכחת סיסמה?</h1>
        <p className={styles.subheading}>
          הכנס את כתובת האימייל שלך ונשלח לך קישור לאיפוס
        </p>
      </div>

      <form className={styles.form} onSubmit={async e => {
        e.preventDefault()
        setError('')
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim())
        if (err) { setError(err.message); return }
        setSent(true)
      }}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="forgot-email">כתובת אימייל</label>
          <input
            id="forgot-email"
            type="email"
            className={styles.input}
            placeholder="you@example.com"
            dir="ltr"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.formError}>{error}</p>}
        <button type="submit" className={styles.btnPrimary}>שלח קישור לאיפוס</button>
      </form>
    </>
  )
}

export default function AuthPage({ onNavigate, onLogin }) {
  const [view, setView] = useState('login')

  const isForgot = view === 'forgot'

  return (
    <Layout activePage="" onNavigate={onNavigate}>
      <div className={styles.page}>

        {/* Form panel — in RTL grid this renders on the RIGHT */}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>

            <button type="button" className={styles.logoLink} onClick={() => onNavigate('home')}>
              <LogoDisc />
              <span className={styles.logoText}>VinilSeeker</span>
            </button>

            {!isForgot && (
              <div className={styles.tabs} role="tablist">
                <button
                  role="tab"
                  type="button"
                  aria-selected={view === 'login'}
                  className={`${styles.tab} ${view === 'login' ? styles.tabActive : ''}`}
                  onClick={() => setView('login')}
                >
                  התחברות
                </button>
                <button
                  role="tab"
                  type="button"
                  aria-selected={view === 'register'}
                  className={`${styles.tab} ${view === 'register' ? styles.tabActive : ''}`}
                  onClick={() => setView('register')}
                >
                  הרשמה
                </button>
              </div>
            )}

            {!isForgot && (
              <div className={styles.headingBlock}>
                <h1 className={styles.heading}>
                  {view === 'login' ? 'ברוך השב!' : 'הצטרפות ל‑VinilSeeker'}
                </h1>
                <p className={styles.subheading}>
                  {view === 'login'
                    ? 'התחבר כדי לחפש, לשמור ולקנות תקליטים'
                    : 'פתח חשבון חינמי ותתחיל לחפור בוינייל'}
                </p>
              </div>
            )}

            {view === 'login' && (
              <LoginForm onForgotClick={() => setView('forgot')} onSuccess={onLogin} />
            )}
            {view === 'register' && (
              <RegisterForm onSuccess={onLogin} />
            )}
            {view === 'forgot' && (
              <ForgotPasswordForm onBack={() => setView('login')} />
            )}

            {!isForgot && (
              <p className={styles.switchPrompt}>
                {view === 'login' ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
                <button
                  type="button"
                  className={styles.switchLink}
                  onClick={() => setView(view === 'login' ? 'register' : 'login')}
                >
                  {view === 'login' ? 'הרשמה חינמית' : 'התחברות'}
                </button>
              </p>
            )}

          </div>
        </div>

        {/* Art panel — in RTL grid this renders on the LEFT */}
        <div className={styles.artPanel}>
          <VinylArt />
          <div className={styles.artContent}>
            <p className={styles.artEyebrow}>השוק הישראלי לתקליטי ויניל</p>
            <h2 className={styles.artTitle}>כל התקליטים שחיפשת — במקום אחד.</h2>
            <p className={styles.artBody}>
              הצטרף לקהילת אספנים, מוכרים וחנויות שבנו את ה‑marketplace הכי חם בארץ.
            </p>
            <div className={styles.artStats}>
              <div className={styles.artStat}>
                <span className={styles.artStatNum}>12,400+</span>
                <span className={styles.artStatLabel}>תקליטים</span>
              </div>
              <div className={styles.artStat}>
                <span className={styles.artStatNum}>850+</span>
                <span className={styles.artStatLabel}>מוכרים</span>
              </div>
              <div className={styles.artStat}>
                <span className={styles.artStatNum}>60+</span>
                <span className={styles.artStatLabel}>חנויות</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
