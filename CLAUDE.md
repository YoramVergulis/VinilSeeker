# VinilSeeker — Project Guide for Claude

This file tells Claude everything it needs to know about this project so every session starts with full context. Read this before doing anything.

---

## What is this project?

**VinilSeeker / ויניל סיקר** — A Hebrew-first Israeli marketplace for vinyl records. Collectors find rare albums; sellers reach passionate listeners. This is a student course project (2nd year, 2nd semester) built step-by-step following professor instructions.

**Tone of the product:** Late-night listening room. Crate-digger sophistication. Warm Israeli hospitality.

---

## Tech Stack

| Tool | Version / Detail |
|---|---|
| Framework | Vite + React (JavaScript, not TypeScript) |
| Package manager | npm |
| Dev server | `npm run dev` → http://localhost:5173 |
| Node | v22.12.0 |

---

## Folder Structure

```
PROJACT/
├── _reference/                 ← Original design files — DO NOT delete
│   ├── Homepage Hi-Fi.html     ← Full hi-fidelity homepage (the visual spec)
│   ├── VinylSeeker Wireframes.html
│   ├── DESIGN.md               ← Full design system documentation
│   ├── colors_and_type.css     ← Original design tokens CSS
│   ├── SKILL.md
│   ├── README.md
│   ├── tweaks-panel.jsx        ← Prototype tweaks panel (not for production)
│   ├── design-canvas.jsx       ← Prototype canvas tool (not for production)
│   ├── preview/                ← 14 design system preview cards (01-14)
│   └── uploads/                ← Screenshot uploads from design sessions
│
├── public/                     ← Static assets served as-is
├── src/
│   ├── components/             ← Shared & reusable React components
│   ├── pages/                  ← Page-level components
│   ├── styles/
│   │   └── globals.css         ← ALL design tokens — import this first
│   ├── App.jsx                 ← Root component
│   └── main.jsx                ← Entry point (imports globals.css here)
│
├── index.html                  ← lang="he" dir="rtl"
├── CLAUDE.md                   ← This file
└── package.json
```

---

## Design System

### Colors

```css
/* Primary brand */
--purple-700: #3B1F5C   /* PRIMARY — deep aubergine, never tech-purple */
--purple-900: #1A0C2B   /* Headlines on cream */
--purple-600: #432575   /* Button hover */

/* Surfaces — NEVER pure white */
--cream:       #F5EFE6  /* PAGE BACKGROUND — aged liner notes */
--paper:       #FAF6EE  /* Card background — slightly warmer */
--cream-deep:  #ECE3D2  /* Sunken sections */

/* Vinyl */
--vinyl-black: #0F0814  /* The disc itself; footer background */
--ink:         #1A1126  /* Primary text */
--ink-2:       #4A3D5C  /* Secondary text */
--ink-3:       #7A6E8A  /* Muted/captions */
--rule:        #D9D2C4  /* Dividers/borders */

/* Accent — use SPARINGLY (prices, hot CTAs only) */
--gold-500:    #D9A441  /* 45rpm center — hot CTA, prices */
--gold-300:    #E8C076  /* Hover gold */
--gold-700:    #A67622  /* Dark gold */
--burgundy:    #7A2540  /* Vintage/limited tags */

/* Semantic (muted, not neon) */
--success:     #2E7D5B
--warning:     #B8801A
--danger:      #A8324A
```

### Typography

```css
--font-display: 'Frank Ruhl Libre', Georgia, serif    /* Headlines, wordmark */
--font-body:    'Assistant', system-ui, sans-serif    /* All UI text */
--font-mono:    'JetBrains Mono', monospace

/* Type scale */
--t-display: 56px   /* Hero / brand */
--t-h1:      40px
--t-h2:      32px
--t-h3:      24px
--t-h4:      20px
--t-body-lg: 18px
--t-body:    16px
--t-body-sm: 14px
--t-caption: 12px
--t-micro:   11px

/* Line heights */
--lh-tight:   1.15
--lh-snug:    1.35
--lh-normal:  1.55
--lh-relaxed: 1.7
```

### Spacing (4px base)

```css
--s-1: 4px  | --s-2: 8px   | --s-3: 12px | --s-4: 16px
--s-5: 20px | --s-6: 24px  | --s-8: 32px | --s-10: 40px
--s-12: 48px| --s-16: 64px | --s-20: 80px| --s-24: 96px
```

### Radii

```css
--r-none: 0      /* no rounding */
--r-xs:   4px
--r-sm:   8px
--r-md:   12px   /* DEFAULT — cards, inputs */
--r-lg:   16px
--r-xl:   24px
--r-full: 9999px /* pills, badges, vinyl discs, avatars */
```

### Shadows (purple-tinted, not grey)

```css
--shadow-xs:    0 1px 2px rgba(26,12,43,.06)
--shadow-sm:    0 2px 6px rgba(26,12,43,.08), 0 1px 2px rgba(26,12,43,.04)
--shadow-md:    0 6px 16px rgba(26,12,43,.10), 0 2px 4px rgba(26,12,43,.05)
--shadow-lg:    0 16px 36px rgba(26,12,43,.14), 0 4px 8px rgba(26,12,43,.06)
--shadow-xl:    0 28px 64px rgba(26,12,43,.20)
--shadow-vinyl: 0 8px 24px rgba(15,8,20,.45)   /* record on wood */
```

---

## Component Conventions (from the design)

### Buttons (always pill-shaped: `--r-full`)
| Class | Style |
|---|---|
| Primary | `--purple-700` fill, white text |
| Gold (hot CTA) | `--gold-500` fill, `--purple-900` text — "קנה עכשיו" only |
| Secondary | transparent + `--purple-700` border |
| Ghost | no fill, no border |
| Danger | `--danger` fill |

### Cards (vinyl listings)
- 12px radius (`--r-md`)
- `--paper` background, 1px `--rule` border, `--shadow-sm`
- Hover: `translateY(-4px)`, `--shadow-md`, `--purple-300` border
- Cover area: square, vinyl-black bg, vinyl "peek" disc slides in from right on hover
- Corner badge: pill (gold = rare, burgundy = vintage/limited, dark = new)
- Save button: top-left, frosted circle

### Inputs
- 12px radius, `--paper` background, 1.5px `--rule` border
- Focus ring: 3px `--purple-100`
- Search: pill-shaped, embedded action button

### Badges
- Pill-shaped (`--r-full`)
- Genre badges: `--purple-100` soft fill
- State badges: soft tinted bg

---

## Content Rules

- **Hebrew first, RTL layout.** English only for album/artist names and prices.
- Prices: `₪320` (no decimals, no space before ₪)
- Years: always 4-digit (`1979`, not `'79`)
- Tone: warm, knowledgeable, casual — like a record-store clerk
- Address user: `תן` / `תני` (informal), not formal passive
- **Never** use emoji in production UI — SVG icons only
- **Never** pure white background — always `--cream` or `--paper`
- **Never** hardcode hex values — always use CSS variables

---

## Homepage Component Map

This is the breakdown from `_reference/Homepage Hi-Fi.html`:

### Shared components (appear on all pages)
- `Navbar` — sticky, frosted glass; logo + nav links + login/post buttons
- `Footer` — vinyl-black bg; brand + 3 link columns + bottom bar

### Reusable components (repeated elements)
- `VinylCard` — listing card: cover image, vinyl peek, corner badge, save button, title, artist/year/format, price, city
- `GenreChip` — vinyl disc icon + genre name + count; used in the genre grid
- `SectionHeader` — eyebrow text (gold uppercase) + h2 heading + optional "see all →" link
- `HowStep` — numbered step card: large gold number, title, description

### Section components (self-contained page blocks)
- `HeroSection` — full-width purple→black gradient; animated spinning disc, tilted album cover, search bar, quick-tags
- `StatsBar` — 4-column strip: number + label (totals for vinyl, stores, sellers, rating)
- `FeaturedSection` — "פיק השבוע" — SectionHeader + 3-column grid of VinylCards
- `FeatureBand` — dark editorial band: text side + visual side (disc + album cover)
- `GenreSection` — "גלה לפי סגנון" — SectionHeader + 6-column grid of GenreChips
- `NewArrivalsSection` — "הוספו השבוע" — SectionHeader + 3-column grid of VinylCards
- `HowItWorksSection` — "איך זה עובד" — SectionHeader + 3-column grid of HowSteps

### Logo SVG (use this exact markup)
```jsx
<svg viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="31" fill="var(--vinyl-black)" />
  <circle cx="32" cy="32" r="22" fill="none" stroke="var(--purple-800)" strokeWidth="0.5" />
  <circle cx="32" cy="32" r="13" fill="var(--purple-700)" />
  <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
</svg>
```

---

## Session History

### Session 1 — 2026-05-08
**Goal:** Project setup (Step 1 of professor instructions)

**What was done:**
1. Read all reference files: `README.md`, `colors_and_type.css`, `Homepage Hi-Fi.html`, `SKILL.md`, `tweaks-panel.jsx`, `design-canvas.jsx`, preview HTML files
2. Moved original files to `_reference/` folder for safe keeping
3. Initialized Vite + React project (`npm create vite@latest . --overwrite`)  
   ⚠️ **The `--overwrite` flag deleted `_reference/` and `assets/`** — user restored files manually
4. Ran `npm install`
5. Created `src/styles/globals.css` with every design token from `colors_and_type.css`
6. Created folder structure: `src/components/`, `src/pages/`, `src/styles/`
7. Updated `main.jsx` to import `./styles/globals.css` (replaced `./index.css`)
8. Updated `index.html`: `lang="he" dir="rtl"`, correct title
9. Replaced boilerplate `App.jsx` with a clean VinilSeeker placeholder using design tokens
10. Verified dev server runs at `http://localhost:5173`

**What the student needs to restore:**  
The PNG album covers that were in `assets/covers/` are permanently lost (6 files: ffdp-f8.png, ffdp-way-of-fist.png, ffdp-wrong-side.png, hollywood-undead-notes.png, hollywood-undead-v.png, motionless-in-white.png). The student needs to re-source these if they want them back.

**Status at end of session:** Vite + React running, design tokens ready, folder structure set up.

### Session 2 — 2026-05-10
**Goal:** Build the Login / Register / Forgot Password auth flow

**Files created:**
- `src/pages/AuthPage.jsx` — full auth page with three views: login, register, forgot password
- `src/pages/AuthPage.module.css` — all styles for the auth page

**Files updated:**
- `src/App.jsx` — added `page` state (`'home'` | `'auth'`); renders `LandingPage` or `AuthPage` accordingly
- `src/components/Layout.jsx` — replaced `onAuthClick` prop with general `onNavigate` prop
- `src/components/Navbar.jsx` — replaced `onAuthClick` with `onNavigate`; logo and "בית" now navigate via `onNavigate('home')`; "התחברות" calls `onNavigate('auth')`; logo changed from `<a>` to `<button>`; "בית" link changed from `<a>` to `<button>`; button CSS resets added to Navbar.module.css

**AuthPage architecture:**
- Single `view` state: `'login'` | `'register'` | `'forgot'`
- Two-column CSS Grid layout: form panel (480px, RIGHT in RTL) + art panel (1fr, LEFT in RTL)
- Page uses `height: calc(100vh - 68px)` (fixed, not min-height) to prevent layout jumping when switching tabs
- Form panel uses `flex-direction: column` + `margin: auto` on the card for vertical centering that collapses gracefully when content overflows
- Art panel: dark purple→black gradient, centered decorative vinyl SVG (opacity 0.15), tagline + 3 stats
- Tabs (login/register): pill switcher hidden when in forgot view
- Logo always visible; clicking it calls `onNavigate('home')`

**Forgot password flow:**
- Triggered by "שכחת סיסמה?" button in the login form
- Shows: back button (right-pointing arrow › for RTL) + email field + "שלח קישור לאיפוס" button
- After submit: success state with envelope SVG, "הקישור נשלח!" title, explanation text, "חזרה להתחברות" button
- Back button returns to login view

**Bugs fixed during session:**
1. Tab switching caused layout jump → fixed by using `height` instead of `min-height` on `.page`
2. Register form clipped at top → `align-items: center` on flex container clips overflow upward; fixed with `flex-direction: column` + `margin-top/bottom: auto` on `.formCard`
3. Back button rendered inline next to logo → `logoLink` was `inline-flex`; changed to `display: flex` (block-level)
4. Back arrow pointed wrong way for RTL → changed SVG path from left-pointing to right-pointing

**Navigation wiring:**
- `App.jsx` owns the `page` state and passes `onNavigate={setPage}` to Layout
- Layout passes it to Navbar
- AuthPage receives `onNavigate` from App and passes it straight to Layout
- All future pages should follow the same pattern: receive `onNavigate`, pass to Layout

**Status at end of session:** Auth flow fully working — login, register, forgot password, success state, navbar navigation wired on all pages.

### Session 3 — 2026-05-10
**Goal:** Search page + Product/listing page; make all VinylCards clickable from all pages

**Files created:**
- `src/data/vinyl.js` — shared ALL_VINYL mock data (18 records, all genres); imported by SearchPage and ProductPage to avoid duplication
- `src/pages/SearchPage.jsx` + `SearchPage.module.css` — full search page
- `src/pages/ProductPage.jsx` + `ProductPage.module.css` — product/listing detail page

**Files updated:**
- `src/App.jsx` — added `searchQuery` + `selectedProduct` states; `navigate()` helper replaces raw `setPage`; `window.scrollTo(0,0)` on every navigate; added `SearchPage` and `ProductPage` renders
- `src/pages/LandingPage.jsx` — now accepts `onNavigate`; passes it to both `FeaturedSection` calls; added `id` + `genre` fields to all card data
- `src/pages/SearchPage.jsx` — now imports ALL_VINYL from `src/data/vinyl.js`; passes `onNavigate` to each VinylCard
- `src/components/FeaturedSection.jsx` — accepts `onNavigate`, passes to VinylCard
- `src/components/VinylCard.jsx` — accepts `onNavigate` + `id` + `genre` props; click calls `onNavigate('product', { product: {...} })`; replaced emoji 📍 pin with SVG icon

**Search page features:**
- Compact pill search bar (cream-deep header strip)
- Horizontal filter bar: genre pills (8 options) + format pills (5 options) separated by a divider
- Sort dropdown: relevance / newest / price asc / price desc
- Live result count: "נמצאו X תקליטים עבור ‟query‟"
- Clear (×) button inside search bar
- Empty state: vinyl disc SVG + "נקה פילטרים" button
- Search updates live when filters change, submits on button click or Enter
- Syncs with `initialQuery` via `useEffect` when navigated to from another page

**Product page layout (based on wireframe Screen 4):**
- Breadcrumb: חיפוש › Artist › Album — artist is clickable (searches for artist)
- Two-column grid: details RIGHT (1fr), cover LEFT (380px sticky) in RTL
- Cover: large square, vinyl-black bg, disc peeks from left on hover, cover scales in on hover
- Tags below cover: format · genre · year · condition
- Details: badge pill → h1 title → artist/year/format → meta chips (genre, condition, city)
- Price: crossed-out original price + discount % badge + large gold current price
- CTAs: "קנה עכשיו" (gold, full width) + "שמור למועדפים" (outline, toggles to filled when saved)
- Seller card: avatar initial, name, city, verified SVG badge, star rating, "צור קשר" button
- Description section: genre-specific mock text
- "תקליטים דומים" section at bottom (cream-deep bg): 3 VinylCards of same genre

**navigate() helper pattern (established for all future pages):**
```js
function navigate(pageName, opts = {}) {
  if (opts.query   !== undefined) setSearchQuery(opts.query)
  if (opts.product !== undefined) setSelectedProduct(opts.product)
  setPage(pageName)
  window.scrollTo(0, 0)
}
```
Every new page should: (1) receive `onNavigate` prop, (2) pass it to `<Layout>`, (3) pass it down to any VinylCard or interactive element that needs navigation.

**Status at end of session:** Three pages live (Home, Search, Product). All VinylCards on all pages are clickable and navigate to the product page. Similar records shown at bottom of product page. Navbar "חיפוש" wired.

### Session 4 — 2026-05-10
**Goal:** Upload/post listing page ("מכור תקליט")

**Files created:**
- `src/pages/UploadPage.jsx` — full listing creation form
- `src/pages/UploadPage.module.css` — all styles

**Files updated:**
- `src/App.jsx` — added `UploadPage` import; added `if (page === 'upload')` render branch
- `src/components/Navbar.jsx` — changed "פרסם תקליט +" from `<a href="#">` to `<button>` calling `onNavigate('upload')`

**UploadPage architecture:**
- Title bar (cream-deep bg): "מכור תקליט" + subtitle
- 5 numbered step sections with gold step numbers:
  1. **תמונה** — dropzone `<button>` triggers hidden `<input type="file" ref={fileInputRef}>` via `.click()`; FileReader reads to base64 data URL → `setPreview`; preview shows 180×180px `<img>` with remove button (X) top-left
  2. **פרטי התקליט** — artist (text, required), album (text, required), format (select: LP/2LP/7"/12", required), year (number, required, 1900–current), genre (select, optional)
  3. **מצב התקליט** — 5 pill buttons: New / VG+ / VG / Good / Fair; selected pill turns `--purple-700`; hint text appears below showing the selected condition description
  4. **מחיר ומיקום** — price input with `₪` symbol absolutely positioned on the right side (`priceWrap` + `priceShekel`); city select (9 Israeli cities)
  5. **תיאור (אופציונלי)** — `<textarea>` with `maxLength={300}` and live `desc.length / 300` char counter
- **Validation** (`validate()` function): returns an errors object; `setErrors(errs)` shows inline red messages under each field; `document.querySelector('[data-error]')` scrolls first error into view
- **Success state** (`submitted === true`): `<SuccessScreen>` component with purple checkmark SVG circle, "המכירה שלך פעילה!" h2, body text, "צפה במכירה" button (→ `onNavigate('search')`) and "פרסם עוד תקליט" button (→ `resetForm()`)
- **`resetForm()`** clears all state fields back to initial values and sets `submitted = false`

**Component structure:**
- `StepHeader({ num, title })` — renders gold number + bold label with bottom border
- `SuccessScreen({ onViewListing, onReset })` — self-contained success view
- Main `UploadPage({ onNavigate })` — owns all form state

**State shape:**
```js
preview, artist, album, format, year, genre, condition, price, city, desc, errors, submitted
```

**Status at end of session:** All 5 pages live (Home, Auth, Search, Product, Upload). Navbar "פרסם תקליט +" button wired to upload page.

### Session 5 — 2026-05-10
**Goal:** Two UX enhancements to UploadPage — paste-to-upload image and multi-genre selection

---

#### Feature 1: Paste image (Ctrl+V)

**Files updated:** `src/pages/UploadPage.jsx`

**What changed:**
- Added `useEffect` to the import line (alongside `useState`, `useRef`)
- Extracted a shared `readImageFile(file)` helper (previously the FileReader logic was inline inside `handleFile`); both the file-picker path and the paste path now call it
- Added a `useEffect` that registers a `paste` listener on `document` when the component mounts and removes it on unmount:
  ```js
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
  ```
- Updated the dropzone hint text: `JPG או PNG · עד 5MB · או הדבק תמונה (Ctrl+V)`
- Paste works from anywhere on the page — no need to focus the dropzone

---

#### Feature 2: Multi-genre selection (up to 3)

**Files updated:** `src/pages/UploadPage.jsx`, `src/pages/UploadPage.module.css`

**What changed in JSX:**
- `genre` state changed from `useState('')` (string) to `useState([])` (array)
- `resetForm()` updated: `setGenre([])` instead of `setGenre('')`
- Replaced the `<select id="u-genre">` dropdown entirely with a pill-button group (same visual pattern as the condition picker, reusing `.conditionGroup`, `.conditionPill`, `.conditionActive`)
- Label changed to: `ז׳אנר <span className={styles.labelHint}>(עד 3)</span>`
- Per-pill toggle logic:
  ```js
  const selected = genre.includes(g)
  const maxed    = !selected && genre.length >= 3
  // click handler:
  if (selected) setGenre(prev => prev.filter(x => x !== g))
  else if (!maxed) setGenre(prev => [...prev, g])
  ```
- Pills at the limit (not selected, array already has 3) get class `.pillDisabled`
- When 3 are selected, a hint renders: `<p className={styles.conditionHint}>בחרת 3 ז׳אנרים — המקסימום</p>`

**What changed in CSS:**
- Added `.labelHint` — lighter weight, `--ink-3` color, for the "(עד 3)" text inline with the label
- Added `.pillDisabled` — `opacity: 0.38; cursor: not-allowed;` for pills that can't be selected because the max is reached

**Genre field is still optional** — no validation rule was added for it.

**Status at end of session:** UploadPage supports paste-to-upload images and multi-genre selection (1–3 genres via pills). All other pages unchanged.

### Session 6 — 2026-05-10
**Goal:** Auth system (real login/register), Profile page, upload guard

**New files created:**
- `src/auth.js` — thin auth service: `login`, `register`, `logout`, `getCurrentUser`, `updateUser`. All localStorage access isolated here. To migrate to DB: replace function bodies with fetch() calls. Stores session in `vs_session`, users list in `vs_users`. Passwords stored plain-text (demo/student project — no real backend).
- `src/pages/ProfilePage.jsx` + `ProfilePage.module.css` — profile page

**Files updated:**
- `src/App.jsx` — added `currentUser` state (initialized from `getCurrentUser`), `handleLogin`, `handleLogout`, `handleUpdateUser`, `addVinyl` (unchanged); navigate() guards 'upload' and 'profile': redirects to 'auth' if not logged in; passes `shared` props (`currentUser`, `onLogout`, `onNavigate`) to all pages
- `src/components/Layout.jsx` — accepts `currentUser` + `onLogout`, passes to Navbar
- `src/components/Navbar.jsx` — conditional UI: logged-out shows "התחברות"; logged-in shows avatar button (→ profile) + name + "יציאה"
- `src/components/Navbar.module.css` — added `.avatarBtn`, `.avatarCircle`, `.avatarName` styles
- `src/pages/AuthPage.jsx` — LoginForm and RegisterForm are now functional: controlled inputs, call `login()`/`register()` from auth.js, show `.formError` on failure, call `onLogin(user)` on success; accepts `onLogin` prop
- `src/pages/AuthPage.module.css` — added `.formError` style
- `src/pages/UploadPage.jsx` — accepts `currentUser` + `onLogout`; adds `uploaderId: currentUser?.id` to new records; passes currentUser/onLogout to Layout
- `src/pages/SearchPage.jsx` — accepts + forwards `currentUser`/`onLogout` to Layout
- `src/pages/ProductPage.jsx` — accepts + forwards `currentUser`/`onLogout` to Layout (both Layout calls)

**Auth architecture:**
- `App.jsx` owns `currentUser` state — single source of truth
- `auth.js` handles persistence (localStorage) — all other files are unaware of localStorage
- After login/register → `onLogin(user)` → `setCurrentUser(user)` + navigate to 'home'
- After logout → `logout()` + `setCurrentUser(null)` + navigate to 'home'
- navigate() guard: `!currentUser && (page === 'upload' || page === 'profile')` → redirects to 'auth'
- Session survives page refresh: `useState(getCurrentUser)` reads from localStorage on init

**ProfilePage features:**
- Dark purple gradient header: avatar circle (initial), name, email, city chip, joined date
- "ערוך פרופיל" toggle: reveals inline edit card with name + city fields; saves via `onUpdateUser`
- "יציאה" button in header (calls `onLogout`)
- "המכירות שלי" grid: filters `vinylList` by `uploaderId === currentUser.id`; empty state with "פרסם תקליט ראשון +" CTA
- Navbar also shows "יציאה" when logged in

**prop-threading pattern (all pages):**
```js
// App.jsx:
const shared = { currentUser, onLogout: handleLogout, onNavigate: navigate }
// Each page receives + passes to Layout:
<Layout activePage="..." onNavigate={onNavigate} currentUser={currentUser} onLogout={onLogout}>
```

**Status at end of session:** Real auth working (register/login/logout persist via localStorage). Profile page with edit + my listings. Upload/profile pages gated — redirect to login if not logged in. All navbar states correct.

### Session 7 — 2026-05-17
**Goal:** Build all remaining wireframe pages (Screens 6, 9, 10) and wire them into the site

**Files created:**
- `src/pages/ChatPage.jsx` + `ChatPage.module.css` — Screen 9: Chat with seller
- `src/pages/AdminPage.jsx` + `AdminPage.module.css` — Screen 10: Admin panel

**Files updated:**
- `src/auth.js` — added `checkIsAdmin(user)`, `getAlerts()`, `addAlert()`, `removeAlert()`, `updateAlertPrice()`; `register()` now sets `isAdmin: true` for `admin@vinilseeker.co.il`; added `ALERTS_KEY` constant
- `src/pages/SavedPage.jsx` — upgraded to match wireframe: two tabs (שמורים + התראות מחיר), row-based saved items list with remove button, price-alerts tab with inline price editing and empty state
- `src/pages/SavedPage.module.css` — full rewrite to support tabs + rows + alert rows
- `src/App.jsx` — imported ChatPage + AdminPage + checkIsAdmin; added `chatConvId` state; wired 'chat' and 'admin' page branches; added guards ('chat' requires login, 'admin' requires isAdmin)
- `src/components/Navbar.jsx` — added chat icon button (→ chat page); added admin "ניהול" button (visible only to admins); imported checkIsAdmin from auth
- `src/pages/ProductPage.jsx` — `OfferCard` and `OffersSection` now accept `onNavigate`; "צור קשר" button navigates to `chat`

**ChatPage architecture (Screen 9):**
- Two-column shell: `300px sidebar | 1fr conversation` in RTL (sidebar on right)
- Height: `calc(100vh - 68px)` — fills viewport below navbar, no page scroll
- Sidebar: search input + scrollable conversation list (avatar, name, listing, preview, unread badge)
- Conversation panel: header (seller avatar + name + last-seen + rating + "צפה בפרופיל") + listing reference strip (album thumb + title/year + chips + "צפה במכירה") + scrollable messages area + composer bar
- Messages: RTL-aware bubbles — sender messages are purple (right), their messages are paper (left)
- Composer: attach button + textarea (Enter to send, Shift+Enter for newline) + send button
- Mock data: 4 conversations with full message history; all messages are in-state (no persistence)
- Guard: requires login (redirects to auth if logged out)

**AdminPage architecture (Screen 10):**
- Dark vinyl-black header with admin title + logged-in email
- 4-column stats strip: total users, active listings, open reports, revenue
- 4 tabs: מכירות | משתמשים | דיווחים | חנויות
- Listings tab: search bar + CSS-grid table + checkboxes + bulk action bar + pagination
- Users tab: similar table with user management actions; blocked users highlighted
- Reports tab: card-based list with priority color-coding and action buttons
- Stores tab: 2-column grid of store cards with edit/sync actions
- Guard: `checkIsAdmin(currentUser)` — non-admins see a 403 "גישה נדחתה" screen; non-logged-in users redirect to home
- Admin account: register with `admin@vinilseeker.co.il` to get admin access

**SavedPage upgrade:**
- Tab 1 "פריטים שמורים": rows with album thumb + title/artist/chips + price + "צפה" button + "×" remove
- Tab 2 "התראות מחיר": price alert rows with inline ₪ input + "פעיל" badge + "×" remove; backed by `getAlerts()` / `removeAlert()` / `updateAlertPrice()` in auth.js
- Both tabs have proper empty states with CTAs
- Remove saved: calls `toggleSaved(id)` → refreshes `savedIds` state from `getSaved()`

**Navigation:**
- Navbar chat icon → `navigate('chat')` (requires login)
- Navbar admin "ניהול" button → visible only to `checkIsAdmin(currentUser)` users
- ProductPage "צור קשר" → `navigate('chat')`

**Status at end of session:** All 10 wireframe screens now have corresponding pages in the site. Complete page list: Home, Auth (login/register/forgot), Search, Product, Upload, Profile, Saved (wishlist), Categories, Stores, Chat, Admin.

### Session 8 — 2026-05-17
**Goal:** Build all 10 footer-linked pages and wire Footer navigation

**Files created:**
- `src/pages/RarePage.jsx` + `RarePage.module.css` — rare/collectible vinyl grid with filter pills and rarity stars
- `src/pages/HowPage.jsx` + `HowPage.module.css` — "How it works" dedicated page with buyer/seller step cards, callout, trust list, CTA row
- `src/pages/SellerGuidePage.jsx` + `SellerGuidePage.module.css` — article with 4 numbered sections: photography tips, Goldmine grading table, pricing link, communication stat callout
- `src/pages/PricingPage.jsx` + `PricingPage.module.css` — price calculator form (artist/album/year/condition/format/edition) → 3-tier result display (מכירה מהירה / ערך שוק / תמחור גבוה) + factors grid
- `src/pages/BlogPage.jsx` + `BlogPage.module.css` — category pills + featured article (large 2-column card) + 6-card grid + pagination
- `src/pages/ContactPage.jsx` + `ContactPage.module.css` — contact form with success state + 4 info cards (email, hours, partnerships, address)
- `src/pages/TermsPage.jsx` — sticky TOC (220px left col) + 10 legal sections
- `src/pages/PrivacyPage.jsx` — same layout as Terms, privacy-specific content
- `src/pages/LegalPage.module.css` — shared CSS for both TermsPage and PrivacyPage

**Files updated:**
- `src/components/Footer.jsx` — converted all static `<a href="#">` links to `<button>` elements calling `onNavigate?.(page)`; brand logo is a button → `onNavigate?.('home')`
- `src/components/Footer.module.css` — added `.brandBtn` and `.footerLink` unset-button styles
- `src/components/Layout.jsx` — passes `onNavigate` down to `<Footer>`
- `src/App.jsx` — imported all 8 new pages; added render branches for 'rare', 'how', 'seller', 'pricing', 'blog', 'contact', 'terms', 'privacy'

**Page routes wired in App.jsx:**
```
'rare'    → RarePage    (receives vinylList)
'how'     → HowPage
'seller'  → SellerGuidePage
'pricing' → PricingPage  (SellerGuidePage links here via onNavigate)
'blog'    → BlogPage
'contact' → ContactPage
'terms'   → TermsPage
'privacy' → PrivacyPage
```

**RarePage features:**
- Filter pills: הכל / First Press / חתום / מהדורה מוגבלת / Colored Vinyl / ★★★★★ בלבד
- Filters live vinyl list via `RARITY_KEYS` functions (badge/signed/colored/rarity fields)
- `rarity` computed from badge field (rare→5, limited→4, default→3)
- 3-column grid with `RarityStars` component (★☆ pattern) below each VinylCard

**PricingPage calculator logic:**
- `calcPrices(condition, edition)` — multiplies a base of ₪200 by condition and edition multipliers
- Returns `{ fast, market, high }` rounded to nearest ₪10
- Result shown only after form submit

**BlogPage:**
- 7 mock articles across 5 categories
- Featured article (id 1) shown only in "הכל" filter, as a 2-column card at the top
- Pagination: 6 articles per page

**ContactPage:**
- Success state shows submitted email address
- 4 info cards use inline SVG icons (no emoji)

**Legal pages (Terms + Privacy):**
- Shared `LegalPage.module.css`; TOC uses anchor links (`href="#s1"`) + `scroll-margin-top: 90px` on sections for sticky-navbar offset
- Terms: 10 sections (הגדרות → סמכות שיפוט)
- Privacy: 10 sections (מידע שנאסף → צור קשר), includes callout box in section 2

**Status at end of session:** All footer links are now functional. Complete page count: Home, Auth, Search, Product, Upload, Profile, Saved, Categories, Stores, Chat, Admin, Rare, How, SellerGuide, Pricing, Blog, Contact, Terms, Privacy (19 pages total).

### Session 9 — 2026-06-03
**Goal:** Connect Supabase — migrate auth, vinyl listings, and saved items from localStorage to real database

**Files created:**
- `src/supabase.js` — Supabase client (`createClient` using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars)
- `.env` — holds the two Supabase env vars (added to `.gitignore`)

**Files updated:**
- `src/auth.js` — full migration: `register`, `login`, `logout`, `updateUser` use Supabase Auth; `getListings`, `addListing`, `updateListing` use Supabase `listing` table; `getSaved`, `toggleSaved`, `isSaved` use Supabase `user_wishlist` table
- `src/App.jsx` — added `useEffect` for `onAuthStateChange` (auth) + `getListings()` (listings); made `addVinyl` and `editVinyl` async; removed synchronous `getCurrentUser` init
- `src/pages/AuthPage.jsx` — `LoginForm` and `RegisterForm` `handleSubmit` made async; forgot password wired to real `supabase.auth.resetPasswordForEmail()`
- `src/pages/SavedPage.jsx` — added `useEffect` to load saved IDs from Supabase on mount; `handleRemoveSaved` refreshes via async `getSaved()`

**Supabase tables used:**
- `auth.users` — Supabase built-in auth (email + password); extra fields (name, city, isAdmin) stored in `user_metadata`
- `listing` — user-uploaded vinyl records; columns: id (uuid), title, format, condition, price, description, cover_image_url, is_available, user_id, artist_id, label_id, release_year, city, created_at, updated_at
- `artist` — normalized artist records; `addListing` finds or creates by name (ilike)
- `genre` — normalized genre records; `addListing` finds or creates by name
- `listing_genres` — junction table (listing_id, genre_id); deleted and re-inserted on `updateListing`
- `user_wishlist` — saved items per user (user_id, listing_id, added_at)

**RLS policies set up (via SQL Editor):**
- `listing`: public select, owner insert/update
- `artist`, `genre`: public select, authenticated insert
- `listing_genres`: public select, authenticated insert
- `user_wishlist`: owner select/insert/delete

**Auth architecture (updated):**
- `formatUser(supabaseUser)` — converts Supabase user object to app's `{ id, email, name, city, isAdmin, joinedAt }` shape; exported from `auth.js`, imported by `App.jsx`
- `App.jsx` uses `supabase.auth.onAuthStateChange` to keep `currentUser` in sync; session persists across refresh via Supabase's own localStorage token (keys starting with `sb-`)
- Email confirmation disabled in Supabase dashboard (Authentication → Settings) for student project

**Listing migration strategy:**
- `ALL_VINYL` mock data stays in `src/data/vinyl.js` (static, no DB needed)
- Only user-uploaded listings go to Supabase `listing` table
- `App.jsx` merges both: `[...supabaseListings, ...ALL_VINYL]` on load

**Saved items strategy:**
- `isSaved(id)` — synchronous, reads localStorage (used by VinylCard + ProductPage for instant UI)
- `toggleSaved(id)` — synchronous return value (updates localStorage immediately), fire-and-forget Supabase sync for UUID ids
- `getSaved()` — async, merges localStorage + Supabase `user_wishlist`, used by SavedPage on mount
- Mock data items (non-UUID ids) stay localStorage-only; real listings (UUID ids) sync to Supabase

**Supabase note — email confirmation:**
Must be OFF in dashboard: Authentication → Settings → "Enable email confirmations" → toggle off. Otherwise `register()` throws "נשלח אימייל אישור" instead of logging in.

**Status at end of session:** Full Supabase integration for auth, listings, and saved items. Mock data still loads from vinyl.js. All 19 pages working unchanged.

### Session 10 — 2026-06-14
**Goal:** Integrate Discogs API — search, vinyl info, and upload auto-fill

**Files created:**
- `src/discogs.js` — Discogs API service: `searchDiscogs`, `getDiscogsRelease`, `normalizeResult`, `normalizeTracklist`. Uses `VITE_DISCOGS_TOKEN` from `.env`. Auth header: `Discogs token=...`. All API calls isolated here.

**Files updated:**
- `src/components/VinylCard.jsx` — handle `price=null` gracefully: price row hidden when null, city hidden when null (Discogs results have neither)
- `src/pages/SearchPage.jsx` — Discogs search fires on every query submit via `useEffect([query])`; results appear below local results in a `--cream-deep` section with "נמצא גם ב-Discogs" divider; loading spinner, result count, "עוד תוצאות מ-Discogs" pagination button; Discogs cards get `badge: { label: 'Discogs', variant: 'dark' }`
- `src/pages/SearchPage.module.css` — added `.discogsSection`, `.discogsDivider`, `.discogsDividerLabel`, `.discogsLoading`, `.discogsSpinner` (CSS spin animation), `.discogsError`, `.discogsCount`, `.loadMoreWrap`, `.loadMoreBtn`
- `src/pages/ProductPage.jsx` — added `useEffect` on `product.discogsId`: fetches full release from Discogs, uses `release.notes` for description, `normalizeTracklist(release.tracklist)` for tracklist, primary image for cover; all fall back to local data if fetch fails
- `src/pages/UploadPage.jsx` — added Discogs auto-fill widget in Step 2; widget is a `<div>` (NOT a `<form>` — nested forms break submission); Enter key + button both trigger lookup; `applyDiscogs(item)` fills artist, album, year, format, genres, cover image, then async-fetches full release for notes → fills תיאור field; `discogsId` saved in listing so ProductPage can enrich it later
- `src/pages/UploadPage.module.css` — added `.discogsWrap`, `.discogsHint`, `.discogsBar`, `.discogsIcon`, `.discogsInput`, `.discogsBtn`, `.discogsDrop`, `.discogsDropMsg`, `.discogsOption`, `.discogsThumb`, `.discogsThumbEmpty`, `.discogsOptionInfo`, `.discogsOptionArtist`, `.discogsOptionTitle`, `.discogsOptionMeta`, `.discogsDismiss`

**`src/discogs.js` API surface:**
```js
searchDiscogs(query, { page })        // search releases, returns { results, total, pages }
getDiscogsRelease(id)                 // full release: tracklist, notes, images
normalizeResult(item)                 // Discogs search hit → app vinyl shape
normalizeTracklist(discogsTracks)     // Discogs tracklist → [{ side, title, duration }]
```

**Discogs → app field mapping (normalizeResult):**
- `item.title` split on ` - ` → `{ artist, title }`
- `item.format[]` → picks first of `['2LP','LP','12"','7"','EP']`
- `item.genre[]` → mapped to `'rock'|'metal'|'jazz'|'pop'|'classical'|'electronic'|'israeli'`
- `price: null`, `city: null`, `badge: { label: 'Discogs', variant: 'dark' }`, `source: 'discogs'`

**UploadPage Discogs auto-fill flow:**
1. User types in the Discogs search bar → clicks "חפש" or presses Enter
2. `searchDiscogs(query)` → 12 results shown in a dropdown (cover thumb + artist + title + year + format)
3. User clicks a result → `applyDiscogs(item)`:
   - Immediately: artist, album, year, format, genre pills, cover image filled
   - Background: `getDiscogsRelease(id)` → strips Discogs markup (`[a=...]`, `[url=...]`, etc.) → fills תיאור textarea (max 300 chars)
   - `discogsId` stored in form state → saved in the listing
4. ProductPage auto-shows tracklist + "על האלבום" from Discogs when viewing the listing

**Bug fixed:**
- Nested `<form>` inside the upload `<form>` caused page redirect on submit. Fixed by using `<div>` + `type="button"` + `onKeyDown` Enter handler instead.

**Discogs token:**
- Stored in `.env` as `VITE_DISCOGS_TOKEN` (already present from this session)
- Authenticated: 60 requests/minute

**Status at end of session:** Full Discogs integration. SearchPage shows live Discogs results below local listings. UploadPage auto-fills all fields from Discogs. ProductPage shows real tracklist and album notes for Discogs-sourced listings.

### Session 11 — 2026-06-14
**Goal:** Replace all mock chat data with real Supabase chat — real conversations, real messages, real user names

**Files created:**
- `src/chat.js` — Supabase chat service: `getOrCreateConversation`, `getConversations`, `getMessages`, `sendMessage`, `markAsRead`, `subscribeToMessages`, `getProfile`

**Files updated:**
- `src/pages/ChatPage.jsx` — full rewrite: removed all `MOCK_CONVERSATIONS`; loads real conversations from Supabase; loads messages per conversation; realtime subscription via `subscribeToMessages`; auto-first message with listing details on new conversation; city shown as subtitle in sidebar; scroll fixed to use `messagesBoxRef` (container scroll, not page scroll)
- `src/pages/ChatPage.module.css` — added `.convCity`, `.chatErrorBox`, `.loadingState`, `.spinner`
- `src/pages/ProductPage.jsx` — "צור קשר" now passes `{ listingId, sellerId, sellerName, sellerCity, listingTitle, listingPrice, listingCondition }` as `chatContext`; button disabled with tooltip for mock/demo listings (no `uploaderId`)
- `src/pages/ProductPage.module.css` — added `.contactBtn:disabled` style
- `src/App.jsx` — `chatConvId` state renamed to `chatContext`; navigate() updated to use `opts.chatContext`
- `src/auth.js` — `register()` upserts to `profiles` table after signup; `updateUser()` upserts to `profiles` on profile edit

**Supabase setup required (SQL run by user):**
- `profiles` table: mirrors `auth.users` name+city; trigger `on_auth_user_created` auto-populates on register; backfill SQL for existing users; RLS: authenticated users can read all profiles, update own
- `conversation` table: added columns `listing_id`, `buyer_id`, `seller_id`, `buyer_name`, `seller_name`, `updated_at`; RLS disabled for student project; UNIQUE constraint on `(listing_id, buyer_id, seller_id)` to prevent duplicate conversations
- `message` table: columns `conversation_id`, `sender_id`, `content`, `is_read`; RLS disabled

**Chat architecture:**
- `getOrCreateConversation({ listingId, sellerId, sellerName, buyerName })` — uses `.limit(1)` (not `.maybeSingle()`) to find existing; tries INSERT with name columns, falls back without if columns missing; returns `{ id, isNew }`
- `getConversations()` — batch-fetches profiles for all other participants to get real names; joins listing for title/city/format/condition/price; falls back gracefully if `buyer_name`/`seller_name` columns missing
- Auto-first message: when `isNew === true`, sends formatted message: `listingTitle\nמצב: X | מחיר: ₪Y | City\nהאם עדיין זמין?`
- Sidebar shows: real registered name (from profiles) + city (from listing) + listing title
- Realtime: `subscribeToMessages` uses `supabase.channel().on('postgres_changes', INSERT)` — unsubscribes on conversation change/unmount
- Scroll: `messagesBoxRef` on the `.messages` container; `el.scrollTop = el.scrollHeight` on message change (no page scroll)
- Error feedback: red `chatErrorBox` shown when conversation creation fails

**Key bugs fixed during session:**
1. Duplicate conversations — `maybeSingle()` throws when >1 row exists → switched to `.limit(1)`; added UNIQUE DB constraint
2. Page scrolling on send — `scrollIntoView` was scrolling the page; replaced with direct container `scrollTop`
3. RLS blocking inserts — disabled RLS on conversation + message tables
4. Schema cache errors (`buyer_name` column not found) — code falls back to INSERT without name columns
5. "מוכר מרמת גן" fake names — real names now fetched from `profiles` table via `getProfile()`

**Status at end of session:** Chat fully real — no mock data. Conversations created in Supabase when "צור קשר" is clicked. Messages persist. Real user names shown. Auto-first message sent. Realtime updates work.

---

## Rules for Claude in This Project

1. **Never use `--overwrite` with create-vite** — it permanently deletes all files in the directory. Scaffold manually instead.
2. **Never hardcode hex colors** — always use CSS variables from `globals.css`.
3. **Never use pure white** — `--cream` for page bg, `--paper` for cards.
4. **Always RTL** — `direction: rtl` on page; Hebrew copy first.
5. **No emoji in UI** — SVG only.
6. **Keep the student's pace** — they're learning basics and follow professor steps. Don't get ahead of what they asked for.
7. Always reference `_reference/Homepage Hi-Fi.html` when building UI — it's the visual truth.
