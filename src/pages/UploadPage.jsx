import { useState, useRef, useEffect } from 'react'
import Layout from '../components/Layout'
import { searchDiscogs, getDiscogsRelease } from '../discogs'
import styles from './UploadPage.module.css'

const FORMATS   = ['LP', '2LP', '7"', '12"']
const GENRES    = ['רוק', 'מטאל', "ג'אז", 'ישראלי', 'פופ', 'קלאסי', 'אלקטרוני']
const CITIES    = ['תל אביב', 'חיפה', 'ירושלים', 'ראשל"צ', 'פ"ת', 'נתניה', 'ב"ש', 'רמת גן', 'אחר']

const GENRE_VALUE_MAP = {
  'רוק': 'rock', 'מטאל': 'metal', "ג'אז": 'jazz',
  'ישראלי': 'israeli', 'פופ': 'pop', 'קלאסי': 'classical', 'אלקטרוני': 'electronic',
}

const REVERSE_GENRE_MAP = {
  rock: 'רוק', metal: 'מטאל', jazz: "ג'אז",
  israeli: 'ישראלי', pop: 'פופ', classical: 'קלאסי', electronic: 'אלקטרוני',
}

const CONDITIONS = [
  { value: 'new',  label: 'חדש',  hint: 'אריזה מקורית, לא הופעל'              },
  { value: 'vgp',  label: 'VG+',  hint: 'שימוש מועט, מנגן מושלם'              },
  { value: 'vg',   label: 'VG',   hint: 'שריטות קלות, מנגן טוב'               },
  { value: 'good', label: 'Good', hint: 'שריטות ניכרות, עדיין מנגן'            },
  { value: 'fair', label: 'Fair', hint: 'בלאי משמעותי, להאזנה קלה בלבד'       },
]

function StepHeader({ num, title }) {
  return (
    <div className={styles.stepHeader}>
      <span className={styles.stepNum}>{num}</span>
      <span className={styles.stepTitle}>{title}</span>
    </div>
  )
}

function SuccessScreen({ onViewListing, onReset }) {
  return (
    <div className={styles.success}>
      <div className={styles.successCircle} aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
          <circle cx="32" cy="32" r="31" fill="var(--purple-700)" />
          <path d="M20 32l9 9 16-16" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className={styles.successTitle}>המכירה שלך פעילה!</h2>
      <p className={styles.successBody}>
        מעולה! התקליט שלך מחכה לקונה הנכון. נוכל להודיע לך ברגע שמישהו יתעניין.
      </p>
      <div className={styles.successActions}>
        <button type="button" className={styles.btnPrimary} onClick={onViewListing}>
          צפה במכירה
        </button>
        <button type="button" className={styles.btnGhost} onClick={onReset}>
          פרסם עוד תקליט
        </button>
      </div>
    </div>
  )
}

export default function UploadPage({ onNavigate, onAddVinyl, currentUser, onLogout, initialListing = null, onEditVinyl }) {
  const isEdit = Boolean(initialListing)
  const fileInputRef = useRef(null)

  // When in edit mode, initialise every field from the existing listing
  const [preview,    setPreview]   = useState(initialListing?.img || null)
  const [artist,     setArtist]    = useState(initialListing?.artist || '')
  const [album,      setAlbum]     = useState(initialListing?.title  || '')
  const [format,     setFormat]    = useState(initialListing?.format || '')
  const [year,       setYear]      = useState(initialListing?.year ? String(initialListing.year) : '')
  const [genre,      setGenre]     = useState(() => {
    if (!initialListing) return []
    const stored = initialListing.genres?.length
      ? initialListing.genres
      : initialListing.genre ? [initialListing.genre] : []
    return stored.map(g => REVERSE_GENRE_MAP[g]).filter(Boolean)
  })
  const [condition,  setCondition] = useState(initialListing?.condition || '')
  const [price,      setPrice]     = useState(initialListing?.price ? String(initialListing.price) : '')
  const [city,       setCity]      = useState(initialListing?.city  || '')
  const [desc,       setDesc]      = useState(initialListing?.desc  || '')
  const [discogsId,  setDiscogsId] = useState(initialListing?.discogsId || null)
  const [errors,     setErrors]    = useState({})
  const [submitted,  setSubmitted] = useState(false)

  /* Discogs auto-fill */
  const [dq,       setDq]      = useState('')
  const [dOptions, setDOptions] = useState([])
  const [dLoading, setDLoading] = useState(false)
  const [dOpen,    setDOpen]    = useState(false)

  function readImageFile(file) {
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    readImageFile(file)
  }

  useEffect(() => {
    function handlePaste(e) {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) readImageFile(file)
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  function validate() {
    const e = {}
    if (!artist.trim())   e.artist    = 'שדה חובה'
    if (!album.trim())    e.album     = 'שדה חובה'
    if (!format)          e.format    = 'בחר פורמט'
    if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear())
                          e.year      = 'שנה לא תקינה'
    if (!condition)       e.condition = 'בחר מצב'
    if (!price || isNaN(price) || Number(price) <= 0)
                          e.price     = 'מחיר לא תקין'
    if (!city)            e.city      = 'בחר עיר'
    if (!preview && !discogsId) e.img = 'יש להוסיף תמונה, או לבחור אלבום מ-Discogs'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const firstError = document.querySelector('[data-error]')
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    const mappedGenres = genre.map(g => GENRE_VALUE_MAP[g]).filter(Boolean)
    const fields = {
      title:      album,
      artist,
      year:       Number(year),
      format,
      genre:      mappedGenres[0] || '',
      genres:     mappedGenres,
      price:      Number(price),
      city,
      desc,
      condition,
      img:        preview || null,
      discogsId:  discogsId || null,
      sellerName: currentUser?.name || null,
      sellerCity: currentUser?.city || null,
      type: 'private',
    }
    if (isEdit) {
      onEditVinyl(initialListing.id, fields)
      onNavigate('profile')
    } else {
      onAddVinyl({ ...fields, id: Date.now(), uploaderId: currentUser?.id })
      setSubmitted(true)
    }
  }

  function resetForm() {
    setPreview(null); setArtist(''); setAlbum(''); setFormat(''); setYear('')
    setGenre([]); setCondition(''); setPrice(''); setCity(''); setDesc('')
    setDiscogsId(null); setErrors({}); setSubmitted(false)
  }

  async function lookupDiscogs() {
    if (!dq.trim()) return
    setDLoading(true)
    setDOpen(true)
    setDOptions([])
    try {
      const { results } = await searchDiscogs(dq.trim())
      setDOptions(results)
    } catch {
      setDOptions([])
    } finally {
      setDLoading(false)
    }
  }

  async function applyDiscogs(item) {
    setArtist(item.artist || '')
    setAlbum(item.title   || '')
    if (item.year)                                    setYear(String(item.year))
    if (item.format && FORMATS.includes(item.format)) setFormat(item.format)
    const hebrewGenres = (item.genres || [])
      .map(g => REVERSE_GENRE_MAP[g])
      .filter(Boolean)
      .slice(0, 3)
    if (hebrewGenres.length) setGenre(hebrewGenres)
    if (item.img) setPreview(item.img)
    setDiscogsId(item.discogsId || null)
    setDOpen(false)
    setDq('')
    setErrors({})

    // Fetch full release to get notes → fill description field
    if (item.discogsId) {
      try {
        const release = await getDiscogsRelease(item.discogsId)
        if (release.notes) {
          const cleaned = release.notes
            .replace(/\[url=[^\]]*\]([^[]*)\[\/url\]/g, '$1')
            .replace(/\[[a-z]=[^\]]*\]/g, '')
            .replace(/\[\/?\w+\]/g, '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 300)
          if (cleaned) setDesc(cleaned)
        }
      } catch {
        // fail silently — description stays empty
      }
    }
  }

  const conditionHint = CONDITIONS.find(c => c.value === condition)?.hint ?? ''

  return (
    <Layout activePage="" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* ── Page title bar ── */}
      <div className={styles.titleBar}>
        <h1 className={styles.pageTitle}>{isEdit ? 'ערוך מכירה' : 'מכור תקליט'}</h1>
        <p className={styles.pageSubtitle}>
          {isEdit ? 'עדכן את פרטי המכירה ושמור שינויים' : 'פרסם את התקליט שלך ותגיע לאלפי אספנים'}
        </p>
      </div>

      <div className={styles.formWrap}>
        {submitted ? (
          <SuccessScreen
            onViewListing={() => onNavigate('search')}
            onReset={resetForm}
          />
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>

            {/* ── 1. תמונה ── */}
            <StepHeader num="1" title="תמונה" />

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={fileInputRef}
              className={styles.hiddenInput}
              onChange={handleFile}
            />

            {preview ? (
              <div className={styles.previewWrap}>
                <img src={preview} alt="תצוגה מקדימה" className={styles.previewImg} />
                <button
                  type="button"
                  className={styles.removeImg}
                  onClick={() => { setPreview(null); fileInputRef.current.value = '' }}
                  aria-label="הסר תמונה"
                >
                  <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.dropzone}
                onClick={() => fileInputRef.current.click()}
              >
                <svg viewBox="0 0 48 48" fill="none" width="40" height="40" className={styles.dropzoneIcon} aria-hidden="true">
                  <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 34l10-10 8 8 6-6 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M32 8v-4M32 4l-3 4M32 4l3 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className={styles.dropzoneLabel}>לחץ להעלאת תמונה</span>
                <span className={styles.dropzoneHint}>JPG או PNG · עד 5MB · או הדבק תמונה (Ctrl+V)</span>
              </button>
            )}

            {errors.img && (
              <p className={styles.errorMsg} data-error>{errors.img}</p>
            )}

            {/* ── 2. פרטי התקליט ── */}
            <StepHeader num="2" title="פרטי התקליט" />

            {/* Discogs auto-fill */}
            <div className={styles.discogsWrap}>
              <p className={styles.discogsHint}>מצא פרטים אוטומטית ב-Discogs</p>
              <div className={styles.discogsBar}>
                <svg viewBox="0 0 20 20" fill="none" className={styles.discogsIcon} aria-hidden="true">
                  <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  className={styles.discogsInput}
                  value={dq}
                  onChange={e => setDq(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); lookupDiscogs() } }}
                  placeholder="שם אמן, אלבום, שנה…"
                />
                <button type="button" className={styles.discogsBtn} disabled={dLoading} onClick={lookupDiscogs}>
                  {dLoading ? '…' : 'חפש'}
                </button>
              </div>

              {dOpen && (
                <div className={styles.discogsDrop}>
                  {dLoading && <p className={styles.discogsDropMsg}>מחפש ב-Discogs…</p>}
                  {!dLoading && dOptions.length === 0 && (
                    <p className={styles.discogsDropMsg}>לא נמצאו תוצאות</p>
                  )}
                  {dOptions.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.discogsOption}
                      onClick={() => applyDiscogs(item)}
                    >
                      {item.img
                        ? <img src={item.img} alt="" className={styles.discogsThumb} />
                        : <div className={styles.discogsThumbEmpty} />
                      }
                      <div className={styles.discogsOptionInfo}>
                        <span className={styles.discogsOptionArtist}>{item.artist}</span>
                        <span className={styles.discogsOptionTitle}>{item.title}</span>
                        <span className={styles.discogsOptionMeta}>{item.year} · {item.format}</span>
                      </div>
                    </button>
                  ))}
                  {!dLoading && (
                    <button type="button" className={styles.discogsDismiss} onClick={() => setDOpen(false)}>
                      סגור
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className={styles.field} data-error={errors.artist || undefined}>
              <label className={styles.label} htmlFor="u-artist">שם האמן</label>
              <input id="u-artist" type="text" className={`${styles.input} ${errors.artist ? styles.inputError : ''}`}
                placeholder="לדוגמה: Pink Floyd" value={artist} onChange={e => { setArtist(e.target.value); setErrors(p => ({ ...p, artist: '' })) }} />
              {errors.artist && <span className={styles.errorMsg}>{errors.artist}</span>}
            </div>

            <div className={styles.field} data-error={errors.album || undefined}>
              <label className={styles.label} htmlFor="u-album">שם האלבום</label>
              <input id="u-album" type="text" className={`${styles.input} ${errors.album ? styles.inputError : ''}`}
                placeholder='לדוגמה: The Dark Side of the Moon' value={album} onChange={e => { setAlbum(e.target.value); setErrors(p => ({ ...p, album: '' })) }} />
              {errors.album && <span className={styles.errorMsg}>{errors.album}</span>}
            </div>

            <div className={styles.twoCol}>
              <div className={styles.field} data-error={errors.format || undefined}>
                <label className={styles.label} htmlFor="u-format">פורמט</label>
                <select id="u-format" className={`${styles.input} ${errors.format ? styles.inputError : ''}`}
                  value={format} onChange={e => { setFormat(e.target.value); setErrors(p => ({ ...p, format: '' })) }}>
                  <option value="">בחר פורמט…</option>
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.format && <span className={styles.errorMsg}>{errors.format}</span>}
              </div>

              <div className={styles.field} data-error={errors.year || undefined}>
                <label className={styles.label} htmlFor="u-year">שנת הוצאה</label>
                <input id="u-year" type="number" className={`${styles.input} ${errors.year ? styles.inputError : ''}`}
                  placeholder="1973" min="1900" max={new Date().getFullYear()} value={year}
                  onChange={e => { setYear(e.target.value); setErrors(p => ({ ...p, year: '' })) }} dir="ltr" />
                {errors.year && <span className={styles.errorMsg}>{errors.year}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>ז׳אנר <span className={styles.labelHint}>(עד 3)</span></label>
              <div className={styles.conditionGroup}>
                {GENRES.map(g => {
                  const selected = genre.includes(g)
                  const maxed    = !selected && genre.length >= 3
                  return (
                    <button
                      key={g}
                      type="button"
                      className={`${styles.conditionPill} ${selected ? styles.conditionActive : ''} ${maxed ? styles.pillDisabled : ''}`}
                      onClick={() => {
                        if (selected) setGenre(prev => prev.filter(x => x !== g))
                        else if (!maxed) setGenre(prev => [...prev, g])
                      }}
                    >
                      {g}
                    </button>
                  )
                })}
              </div>
              {genre.length === 3 && <p className={styles.conditionHint}>בחרת 3 ז׳אנרים — המקסימום</p>}
            </div>

            {/* ── 3. מצב ── */}
            <StepHeader num="3" title="מצב התקליט" />

            <div className={styles.conditionGroup} data-error={errors.condition || undefined}>
              {CONDITIONS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  className={`${styles.conditionPill} ${condition === c.value ? styles.conditionActive : ''}`}
                  onClick={() => { setCondition(c.value); setErrors(p => ({ ...p, condition: '' })) }}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {conditionHint && <p className={styles.conditionHint}>{conditionHint}</p>}
            {errors.condition && <span className={styles.errorMsg}>{errors.condition}</span>}

            {/* ── 4. מחיר ומיקום ── */}
            <StepHeader num="4" title="מחיר ומיקום" />

            <div className={styles.twoCol}>
              <div className={styles.field} data-error={errors.price || undefined}>
                <label className={styles.label} htmlFor="u-price">מחיר מבוקש</label>
                <div className={styles.priceWrap}>
                  <span className={styles.priceShekel}>₪</span>
                  <input id="u-price" type="number" className={`${styles.input} ${styles.priceInput} ${errors.price ? styles.inputError : ''}`}
                    placeholder="0" min="1" value={price}
                    onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })) }} dir="ltr" />
                </div>
                {errors.price && <span className={styles.errorMsg}>{errors.price}</span>}
              </div>

              <div className={styles.field} data-error={errors.city || undefined}>
                <label className={styles.label} htmlFor="u-city">עיר לאיסוף</label>
                <select id="u-city" className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                  value={city} onChange={e => { setCity(e.target.value); setErrors(p => ({ ...p, city: '' })) }}>
                  <option value="">בחר עיר…</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
              </div>
            </div>

            {/* ── 5. תיאור ── */}
            <StepHeader num="5" title='תיאור (אופציונלי)' />

            <div className={styles.field}>
              <textarea
                className={styles.textarea}
                placeholder="הערות על מצב התקליט, מהדורה, היסטוריה, ולכל מה שחשוב לדעת…"
                maxLength={300}
                rows={4}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
              <span className={styles.charCount}>{desc.length} / 300</span>
            </div>

            {/* ── Actions ── */}
            <div className={styles.actions}>
              <button type="submit" className={styles.btnPrimary}>
                {isEdit ? 'שמור שינויים' : 'פרסם מכירה'}
              </button>
              <button type="button" className={styles.btnCancel} onClick={() => onNavigate(isEdit ? 'profile' : 'home')}>
                ביטול
              </button>
            </div>

          </form>
        )}
      </div>
    </Layout>
  )
}
