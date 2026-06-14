import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import VinylCard from '../components/VinylCard'
import { searchDiscogs } from '../discogs'
import styles from './SearchPage.module.css'

const GENRES = [
  { value: 'all',       label: 'הכל'      },
  { value: 'rock',      label: 'רוק'      },
  { value: 'metal',     label: 'מטאל'     },
  { value: 'jazz',      label: "ג'אז"     },
  { value: 'israeli',   label: 'ישראלי'   },
  { value: 'pop',       label: 'פופ'      },
  { value: 'classical', label: 'קלאסי'    },
  { value: 'electronic',label: 'אלקטרוני' },
]

const FORMATS = [
  { value: 'all', label: 'כל הפורמטים' },
  { value: 'LP',  label: 'LP'           },
  { value: '2LP', label: '2LP'          },
  { value: '7"',  label: '7"'           },
  { value: '12"', label: '12"'          },
]

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'הכי רלוונטי'       },
  { value: 'newest',     label: 'שנה: חדש לישן'      },
  { value: 'price-asc',  label: 'מחיר: נמוך לגבוה'  },
  { value: 'price-desc', label: 'מחיר: גבוה לנמוך'  },
]

export default function SearchPage({ query: initialQuery = '', initialGenre = '', onNavigate, vinylList = [], currentUser = null, onLogout }) {
  const [inputVal, setInputVal] = useState(initialQuery)
  const [query,    setQuery]    = useState(initialQuery)
  const [genre,    setGenre]    = useState(initialGenre || 'all')
  const [format,   setFormat]   = useState('all')
  const [sort,     setSort]     = useState('relevance')

  /* Discogs state */
  const [discogsResults,    setDiscogsResults]    = useState([])
  const [discogsLoading,    setDiscogsLoading]    = useState(false)
  const [discogsError,      setDiscogsError]      = useState(null)
  const [discogsPage,       setDiscogsPage]       = useState(1)
  const [discogsTotalPages, setDiscogsTotalPages] = useState(1)
  const [discogsTotal,      setDiscogsTotal]      = useState(0)

  /* sync when user searches from another page */
  useEffect(() => {
    setInputVal(initialQuery)
    setQuery(initialQuery)
  }, [initialQuery])

  /* sync when user navigates from categories page */
  useEffect(() => {
    if (initialGenre) setGenre(initialGenre)
  }, [initialGenre])

  /* search Discogs whenever the submitted query changes */
  useEffect(() => {
    if (!query) {
      setDiscogsResults([])
      setDiscogsTotal(0)
      return
    }
    setDiscogsLoading(true)
    setDiscogsError(null)
    setDiscogsPage(1)
    searchDiscogs(query)
      .then(({ results, total, pages }) => {
        setDiscogsResults(results)
        setDiscogsTotal(total)
        setDiscogsTotalPages(pages)
      })
      .catch(() => setDiscogsError('שגיאה בחיפוש ב-Discogs. נסה שוב.'))
      .finally(() => setDiscogsLoading(false))
  }, [query])

  function handleSearch(e) {
    e.preventDefault()
    setQuery(inputVal.trim())
  }

  async function loadMoreDiscogs() {
    const nextPage = discogsPage + 1
    setDiscogsLoading(true)
    try {
      const { results } = await searchDiscogs(query, { page: nextPage })
      setDiscogsResults(prev => [...prev, ...results])
      setDiscogsPage(nextPage)
    } catch {
      setDiscogsError('שגיאה בטעינת עוד תוצאות')
    } finally {
      setDiscogsLoading(false)
    }
  }

  const results = vinylList
    .filter(v => {
      if (v.type === 'store') return false
      if (query) {
        const q = query.toLowerCase()
        if (!`${v.title} ${v.artist}`.toLowerCase().includes(q)) return false
      }
      if (genre  !== 'all' && v.genre  !== genre)  return false
      if (format !== 'all' && v.format !== format) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'newest')     return b.year  - a.year
      return 0
    })

  return (
    <Layout activePage="חיפוש" onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>

      {/* ── Search header ── */}
      <div className={styles.searchHeader}>
        <div className={styles.searchWrap}>
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="חפש אלבום, אמן, ז׳אנר…"
              aria-label="חיפוש תקליטים"
            />
            {inputVal && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setInputVal(''); setQuery('') }}
                aria-label="נקה חיפוש"
              >
                <svg viewBox="0 0 20 20" fill="none" width="14" height="14">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>חפש</button>
          </form>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className={styles.filtersBar}>
        <div className={styles.filtersWrap}>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>ז׳אנר</span>
            <div className={styles.filterPills}>
              {GENRES.map(g => (
                <button
                  key={g.value}
                  type="button"
                  className={`${styles.pill} ${genre === g.value ? styles.pillActive : ''}`}
                  onClick={() => setGenre(g.value)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterDivider} />

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>פורמט</span>
            <div className={styles.filterPills}>
              {FORMATS.map(f => (
                <button
                  key={f.value}
                  type="button"
                  className={`${styles.pill} ${format === f.value ? styles.pillActive : ''}`}
                  onClick={() => setFormat(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Local Results ── */}
      <div className={styles.resultsWrap}>

        <div className={styles.resultsHeader}>
          <p className={styles.count}>
            {query
              ? <>נמצאו <strong>{results.length}</strong> תקליטים עבור &ldquo;{query}&rdquo;</>
              : <><strong>{results.length}</strong> תקליטים</>
            }
          </p>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="מיון תוצאות"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {results.length > 0 ? (
          <div className={styles.grid}>
            {results.map(v => (
              <VinylCard key={v.id} {...v} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <svg viewBox="0 0 64 64" className={styles.emptyDisc} aria-hidden="true">
              <circle cx="32" cy="32" r="31" fill="var(--cream-deep)" />
              <circle cx="32" cy="32" r="13" fill="var(--rule)"      />
              <circle cx="32" cy="32" r="4"  fill="var(--cream)"     />
            </svg>
            <p className={styles.emptyTitle}>לא נמצאו תקליטים</p>
            <p className={styles.emptyBody}>
              נסה מילות חיפוש אחרות או שנה את הפילטרים
            </p>
            <button
              type="button"
              className={styles.resetBtn}
              onClick={() => { setQuery(''); setInputVal(''); setGenre('all'); setFormat('all') }}
            >
              נקה פילטרים
            </button>
          </div>
        )}

      </div>

      {/* ── Discogs Results ── */}
      {query && (
        <div className={styles.discogsSection}>
          <div className={styles.discogsDivider}>
            <span className={styles.discogsDividerLabel}>נמצא גם ב-Discogs</span>
          </div>

          {discogsLoading && discogsResults.length === 0 && (
            <div className={styles.discogsLoading}>
              <svg className={styles.discogsSpinner} viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="26" fill="none" stroke="var(--purple-700)" strokeWidth="5"
                  strokeDasharray="50 113" strokeLinecap="round" />
              </svg>
              <p>מחפש ב-Discogs…</p>
            </div>
          )}

          {discogsError && <p className={styles.discogsError}>{discogsError}</p>}

          {discogsResults.length > 0 && (
            <div className={styles.resultsWrap}>
              <p className={styles.discogsCount}>
                <strong>{discogsTotal.toLocaleString()}</strong> תוצאות ב-Discogs — לחץ על תקליט לפרטים מלאים
              </p>
              <div className={styles.grid}>
                {discogsResults.map(v => (
                  <VinylCard key={v.id} {...v} onNavigate={onNavigate} />
                ))}
              </div>
              {discogsPage < discogsTotalPages && (
                <div className={styles.loadMoreWrap}>
                  <button
                    type="button"
                    className={styles.loadMoreBtn}
                    onClick={loadMoreDiscogs}
                    disabled={discogsLoading}
                  >
                    {discogsLoading ? 'טוען…' : 'עוד תוצאות מ-Discogs'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </Layout>
  )
}
