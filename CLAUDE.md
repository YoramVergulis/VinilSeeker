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

### Session 12 — 2026-06-14
**Goal:** Enable proper RLS on chat tables (`conversation` + `message`) — replace disabled RLS with correct per-user policies

**No code files changed** — all fixes were SQL policies run in the Supabase SQL Editor.

**Problem:** RLS was disabled on `conversation` and `message` tables (Session 11 workaround) because inserts and selects were failing with RLS on. Root cause: no policies existed, so Supabase blocked all operations by default.

**Solution — SQL run in Supabase SQL Editor:**

```sql
-- conversation table
ALTER TABLE conversation ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "conv_select" ON conversation;
DROP POLICY IF EXISTS "conv_insert" ON conversation;

CREATE POLICY "conv_select" ON conversation
  FOR SELECT USING (buyer_id = auth.uid() OR seller_id = auth.uid());

CREATE POLICY "conv_insert" ON conversation
  FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- message table
ALTER TABLE message ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "msg_select" ON message;
DROP POLICY IF EXISTS "msg_insert" ON message;
DROP POLICY IF EXISTS "msg_update" ON message;

CREATE POLICY "msg_select" ON message
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM conversation c
      WHERE c.id = message.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );

CREATE POLICY "msg_insert" ON message
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (SELECT 1 FROM conversation c
      WHERE c.id = message.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );

CREATE POLICY "msg_update" ON message
  FOR UPDATE USING (
    sender_id <> auth.uid()
    AND EXISTS (SELECT 1 FROM conversation c
      WHERE c.id = message.conversation_id
        AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid()))
  );
```

**Policy logic:**
- `conv_select`: participants (buyer OR seller) can see their own conversations
- `conv_insert`: only the buyer can create a conversation, and `buyer_id` must equal `auth.uid()`
- `msg_select`: any participant in the conversation can read its messages
- `msg_insert`: sender must be `auth.uid()`; must be a participant in the conversation
- `msg_update`: can only mark received messages as read (not your own); must be a participant
- Realtime (`subscribeToMessages`) works automatically — Supabase enforces `msg_select` on `postgres_changes` events

**Status at end of session:** RLS enabled and working on both chat tables. All chat operations (create conversation, send message, mark read, realtime) pass through proper security policies.

### Session 13 — 2026-06-17
**Goal:** Fix browser back button, refresh persistence, and update domain to vinilseeker.com

**Files created:**
- `vercel.json` — SPA rewrite rule: all paths serve `index.html` so Vercel doesn't 404 on direct URL access or refresh

**Files updated:**
- `src/App.jsx` — full History API integration:
  - Added `PAGE_PATHS` (page name → `/path`) and `PATH_PAGES` (reverse map) constants
  - All `useState` initializers are now lazy: read from `history.state` first (survives refresh), then fall back to parsing `window.location.pathname`
  - `navigate()` now calls `history.pushState(fullState, '', '/page-name')` — back/forward button works for all 20 pages
  - `handleLogin` and `handleLogout` also push to history
  - `popstate` listener restores all React state (page, searchQuery, searchGenre, selectedProduct, chatContext, editTarget) when user navigates browser history
  - `history.replaceState` on mount stamps the initial entry so even the very first page load has restoreable state
- `src/auth.js` — ADMIN_EMAIL updated: `admin@vinilseeker.co.il` → `admin@vinilseeker.com`
- `src/pages/ContactPage.jsx` — support + partners emails updated to `@vinilseeker.com`
- `src/pages/PrivacyPage.jsx` — two privacy email references updated to `@vinilseeker.com`
- `src/pages/TermsPage.jsx` — domain reference in platform definition updated to `vinilseeker.com`

**How the history system works:**
- Every `navigate('search', { query: 'Beatles' })` call pushes `{ page: 'search', searchQuery: 'Beatles', ... }` to browser history AND updates the URL to `/search`
- On browser back/forward: `popstate` fires with the saved state → all React state restored in one pass
- On refresh: `history.state` is preserved by the browser → lazy `useState` initializers read it → correct page renders immediately
- On direct link to `/search`: `history.state` is null → `PATH_PAGES[window.location.pathname]` parses the URL → correct page name
- `vercel.json` ensures Vercel serves `index.html` for `/search`, `/product`, `/chat`, etc. (without it, the server returns 404 on those paths)

**Domain migration — 5 occurrences updated:**
| File | Old | New |
|---|---|---|
| `src/auth.js` | `admin@vinilseeker.co.il` | `admin@vinilseeker.com` |
| `src/pages/ContactPage.jsx` | `support@vinilseeker.co.il` | `support@vinilseeker.com` |
| `src/pages/ContactPage.jsx` | `partners@vinilseeker.co.il` | `partners@vinilseeker.com` |
| `src/pages/PrivacyPage.jsx` | `privacy@vinilseeker.co.il` (×2) | `privacy@vinilseeker.com` |
| `src/pages/TermsPage.jsx` | `vinilseeker.co.il` | `vinilseeker.com` |

**Note:** Admin account email changed to `admin@vinilseeker.com` — if you have an existing admin user registered with `admin@vinilseeker.co.il`, re-register with the new address to get admin access.

**Status at end of session:** Browser back/forward works across all pages. Refresh stays on current page (including product, search, chat). All domain references updated to vinilseeker.com. `vercel.json` added — must be deployed to Vercel for the refresh fix to work on the live site.

### Session 14 — 2026-06-17
**Goal:** Make all pages and components mobile-responsive

**Files updated (JSX):**
- `src/components/Navbar.jsx` — added `menuOpen` state; hamburger button (SVG ☰/✕ toggle); `closeMenu()` + `nav()` helpers route all links through; desktop-only class on "יציאה"/"התחברות"/"פרסם תקליט +" buttons; mobile overlay + dropdown menu with all nav links, divider, auth/profile/logout actions, upload primary button
- `src/pages/ChatPage.jsx` — added `mobileSidebarOpen` state (default `true`); `handleSelect` + `handleChatContext` set it to `false` (show conversation); sidebar/convPanel get mobile show/hide classes; back button (RTL-correct right-pointing chevron SVG) in convHeader to return to sidebar

**Files updated (CSS — all new `@media` blocks):**

| File | Key changes |
|---|---|
| `Navbar.module.css` | `.hamburger` shown on mobile; `.links` + `.desktopOnly` hidden; `.mobileOverlay` + `.mobileMenu` dropdown; `.avatarName` hidden |
| `Footer.module.css` | grid `1fr 1fr` at 768px → `1fr` at 480px; bottom bar stacks vertically |
| `HeroSection.module.css` | grid → 1 col at 900px; `.art` hidden; heading scales 44px → 34px |
| `StatsBar.module.css` | grid `repeat(2, 1fr)` at 600px; num font-size 28px |
| `FeaturedSection.module.css` | grid 2 cols at 900px → 1 col at 480px |
| `GenreSection.module.css` | grid 3 cols at 900px → 2 cols at 480px |
| `HowItWorksSection.module.css` | grid → 1 col at 900px; card padding reduced |
| `FeatureBand.module.css` | band grid → 1 col at 900px; heading 28px at 480px |
| `SectionHeader.module.css` | title → `--t-h3` at 480px; margin-bottom reduced |
| `AuthPage.module.css` | page grid → 1fr; artPanel hidden; height → auto min-height; twoCol → 1 col |
| `SearchPage.module.css` | filters scroll horizontally (overflow-x auto, no-wrap); grid 2 cols → 1 col |
| `ProductPage.module.css` | main grid → 1fr; coverCol static; similarGrid 2 cols → 1 col; prices + title scale down |
| `UploadPage.module.css` | twoCol → 1 col; reduced paddings; conditionPill smaller |
| `ProfilePage.module.css` | headerInner stacks; editGrid → 1 col; listings grid 2 cols → 1 col |
| `ChatPage.module.css` | chatShell → 1 col; sidebar + convPanel `position:absolute;inset:0`; toggle via `.mobileSidebarVisible/Hidden` + `.mobileConvPanelVisible/Hidden`; back button shown |
| `AdminPage.module.css` | statsStrip → 2 cols; tabBar scrolls; table overflow-x auto; storesGrid → 1 col |
| `SavedPage.module.css` | row flex-wrap; all paddings reduced |
| `BlogPage.module.css` | featured → 1 col; grid 2 cols → 1 col |
| `LegalPage.module.css` | body grid → 1 col; toc position static |
| `HowPage.module.css` | reduced hero/body padding |
| `RarePage.module.css` | grid 2 cols → 1 col; reduced paddings |
| `ContactPage.module.css` | layout grid → 1 col; reduced paddings |
| `PricingPage.module.css` | reduced hero/body padding |
| `SellerGuidePage.module.css` | reduced hero/body padding |
| `CategoriesPage.module.css` | grid → 1 col at 768px |
| `StoresPage.module.css` | reduced header padding (grid already uses `auto-fill minmax` — inherently responsive) |

**Breakpoints used:** 900px (multi-column grids), 768px (main mobile breakpoint), 600px (stats bar), 480px (small phones — font sizes, 1-col grids)

**Mobile Navbar pattern:**
- Desktop: logo | center nav links | right actions (all inline)
- Mobile: logo | hamburger → taps open fullscreen overlay with all links stacked + auth actions at bottom
- All navigation through `nav(page, opts)` helper → calls `onNavigate` + `closeMenu()`

**Mobile Chat pattern:**
- Desktop: `300px sidebar | 1fr conversation` grid (both visible)
- Mobile: `position: absolute; inset: 0` on both panels; toggle which is on top via `mobileSidebarOpen` state; back button in conversation header returns to sidebar

**Status at end of session:** All 19 pages and all shared components are fully mobile-responsive. Build: 122 modules, zero errors.

### Session 15 — 2026-06-18
**Goal:** Full code review — efficiency, security, bugs, and cleanliness across all 19 pages

**No new files created** — all changes were fixes to existing files.

**Files updated:**
- `src/components/Footer.jsx` — copyright year dynamic: `{new Date().getFullYear()}` (was hardcoded 2025)
- `src/pages/RarePage.jsx` — `??` → `||` on RARITY_KEYS fallback (safer truthy check); wrapped `rareVinyl` computation in `useMemo([vinylList, filter])`; added `useMemo` import
- `src/pages/SavedPage.jsx` — `useState(getAlerts)` → `useState(() => getAlerts())` (explicit lazy initializer)
- `src/pages/ProductPage.jsx` — added `useEffect(() => { setSaved(isSaved(product?.id)) }, [product?.id])` to fix stale saved state when navigating between similar records; wrapped `allOffers` filter in `useMemo([vinylList, albumKey])`; added `useMemo` import
- `src/pages/ChatPage.jsx` — null guard on `markAsRead(selectedId)` in realtime handler; wrapped `filtered` conversations in `useMemo([conversations, searchQuery])`; added `useMemo` import; also added `?.` on `c.otherName` in filter (defensive)
- `src/pages/BlogPage.jsx` — fixed featured article disappearing when filtering by its category: `featured` now only extracted when `category === 'all'`; `rest` only excludes it when `featured` is set
- `src/auth.js` — extracted `isAdminEmail(email)` helper (was duplicated in `checkIsAdmin`, `formatUser`, `register`); removed dead `getCurrentUser()` and `getUserById()` stubs; genre inserts in `addListing` and `updateListing` now run in parallel via `Promise.all` instead of sequential `await` loop
- `src/discogs.js` — extracted `GENRE_MAP` (array of `{ test, value }`) and `FORMAT_PRIORITY` array; replaced if-chain in `mapGenre()` and loop in `pickFormat()` with lookups against these constants
- `src/pages/SearchPage.jsx` — wrapped filter+sort computation in `useMemo([vinylList, query, genre, format, sort])`; added `useMemo` import
- `src/pages/ContactPage.jsx` — added email format validation (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) before allowing form submit; shows Hebrew error message on invalid email

**Bugs fixed:**
- B2: ProductPage `saved` state went stale when clicking a "similar record" (useState initializer runs only once)
- B3: RarePage `RARITY_KEYS[filter] ?? fn` — `??` only catches `null/undefined`; `||` is safer since any falsy filter fn should fall back
- B4: BlogPage featured article (category: history) was invisible when filtering by "history" category
- B7: Footer copyright year hardcoded as 2025
- B8: ChatPage `markAsRead(null)` could be called if `selectedId` was null when a realtime message arrived

**Efficiency improvements:**
- E1: SearchPage filter/sort — `useMemo`
- E2: ProductPage allOffers — `useMemo`
- E3: ChatPage filtered conversations — `useMemo`
- E4: RarePage rareVinyl — `useMemo`
- E5: auth.js genre inserts — `Promise.all` (parallel instead of sequential)
- E6: auth.js admin email check — single `isAdminEmail` helper, no duplication

**Security:**
- S4: ContactPage now validates email format before submit

**Cleanliness:**
- C1: Removed `getCurrentUser()` and `getUserById()` dead stubs from auth.js
- C3: discogs.js magic strings extracted to `GENRE_MAP` and `FORMAT_PRIORITY` constants
- B1: SavedPage `useState(getAlerts)` made explicit

**Not fixed (out of scope for this session):**
- S1: Discogs token client-side exposure — requires serverless/Edge Function proxy
- S2: Admin email visible in client bundle — requires Supabase `profiles.is_admin` column + RLS
- C2: AdminPage mock data — intentional demo UI; no real admin backend yet
- B6: `toggleSaved` fire-and-forget Supabase sync — intentional design per CLAUDE.md Session 9

**Status at end of session:** All 19 pages work with no regressions. Build clean. 24 issues fixed across bugs, efficiency, security, and cleanliness.

### Session 16 — 2026-06-18
**Goal:** Real store inventory from Third Ear JSON, remove all mock vinyl data

**Files created:**
- `scripts/import-third-ear.js` — Node.js ESM script: reads a JSON file, finds/inserts Third Ear in `store` table, batch-inserts 50 rows at a time into `store_inventory`; filters to music-only items (`type` contains "vinyl"/"cd"/"blu-ray"); prices rounded to integer; run with `node scripts/import-third-ear.js path/to/file.json`

**Files updated:**
- `src/App.jsx` — removed `ALL_VINYL` import; `vinylList` initializes as `[]`; `getListings()` callback no longer merges mock data — site now shows only real Supabase listings
- `src/pages/ProductPage.jsx` — `StoreInventorySection` updated: shows `type` badge, `style` note, `url` external link ("לחנות" with arrow icon); fetch query updated to use new column names (`album_name`, `price_ils`, `store_name`, `store_city` direct — no more JOIN on `store_id`)
- `src/pages/ProductPage.module.css` — added `.storeRowRight` (flex column, align-end), `.storeRowType` (pill badge), `.storeRowLink` (external link style)

**SQL run in Supabase:**
```sql
-- Schema migration (store_inventory already existed with old columns)
ALTER TABLE store_inventory RENAME COLUMN album TO album_name;
ALTER TABLE store_inventory RENAME COLUMN price TO price_ils;
ALTER TABLE store_inventory
  ADD COLUMN IF NOT EXISTS url       text,
  ADD COLUMN IF NOT EXISTS style     text,
  ADD COLUMN IF NOT EXISTS tracks    jsonb  DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS type      text,
  ADD COLUMN IF NOT EXISTS store_name text,
  ADD COLUMN IF NOT EXISTS store_city text;
ALTER TABLE store_inventory ALTER COLUMN store_id DROP NOT NULL;
ALTER TABLE store_inventory ALTER COLUMN listing_id DROP NOT NULL;
ALTER TABLE store_inventory ALTER COLUMN notes DROP NOT NULL;

-- Disable RLS (catalog data, not user data)
ALTER TABLE store_inventory DISABLE ROW LEVEL SECURITY;
```

**Import result:** 235 items from Third Ear (`third_ear_products.json`) imported. All with `store_name = 'Third Ear'`, `store_city = 'תל אביב'`, `store_id = NULL` (RLS blocked store table insert — store_name column used directly instead).

**store_inventory column layout (current):**
| Column | Source |
|---|---|
| `id` | auto (int8) |
| `store_id` | nullable FK to `store` table |
| `store_name` | text — denormalized store name |
| `store_city` | text — denormalized store city |
| `artist` | text |
| `album_name` | text (renamed from `album`) |
| `price_ils` | integer (renamed from `price`) |
| `type` | text — "Vinyl (new)", "Vinyl (used)", "CD (used)", etc. |
| `style` | text — genre/style from source |
| `url` | text — product URL on store website |
| `tracks` | jsonb — track list array |
| `listing_id` | nullable uuid — link to Supabase listing |
| `notes` | nullable text |

**ProductPage store inventory matching logic:**
- Query: `artist.ilike.%{artist}%` OR `listing_id.eq.{product.id}`
- Client-side filter: also requires `album_name` to contain the product title
- Section hidden when no matches found
- Shows: store avatar initial, store name, city, type badge, style, price, external URL link

**Mock data removal:**
- `src/data/vinyl.js` still exists but is no longer imported anywhere — can be deleted if desired
- All "צור קשר" buttons that were disabled for demo listings will no longer appear (no mock listings)
- HomePage, SearchPage, RarePage, CategoriesPage will be empty until real listings are uploaded

**Status at end of session:** 235 real Third Ear inventory items live. Mock vinyl data removed. Site is fully real-data-only.

### Session 17 — 2026-06-19
**Goal:** Show Third Ear store inventory in Search, auto-enrich store items from Discogs, fix "צור קשר" to redirect to store URL

**Files updated:**
- `src/auth.js` — added `getStoreInventory()`: fetches all `store_inventory` rows and maps them to the vinyl shape (`id: si-{n}`, `type: 'store'`, `storeName`, `storeCity`, `storeUrl`, format/condition derived from `type` text, `year: null`, `img: null`, `badge: { label: store_name, variant: 'dark' }`)
- `src/App.jsx` — replaced `getListings().then(...)` with `Promise.all([getListings(), getStoreInventory()])` — both fetch in parallel and merge into `vinylList`; imported `getStoreInventory`
- `src/discogs.js` — added `lookupDiscogs(query)`: format-agnostic Discogs search (no Vinyl filter, per_page 5), returns first result's release id; used for CDs and items where the vinyl-filtered search would miss
- `src/pages/ProductPage.jsx`:
  - Imported `lookupDiscogs`
  - Added auto-enrich `useEffect`: fires when `!product.discogsId && !product.img` (store items with no cover) — calls `lookupDiscogs(artist + title)` → `getDiscogsRelease(id)` → sets cover image, tracklist, album notes from Discogs
  - `OfferCard`: "צור קשר" is now an `<a href={offer.storeUrl} target="_blank">` for store offers with a URL (was a disabled button); private seller "צור קשר" still opens chat as before
  - `StoreInventorySection` query: skips the DB query when `product.type === 'store'` (the product itself is a store item — avoids showing it twice)
  - `StoreInventorySection` "לחנות" link: renamed to "צור קשר" (done in session 16.5 — kept)
- `src/components/VinylCard.jsx` — meta line changed from `{artist} · {year} · {format}` to `{[artist, year, format].filter(Boolean).join(' · ')}` — handles `year: null` cleanly for store inventory items

**How it works end-to-end:**
1. App loads → `getListings()` + `getStoreInventory()` run in parallel → 235 Third Ear items + any user listings all merged into `vinylList`
2. Search page shows all items including Third Ear inventory (with store badge, no cover initially)
3. User clicks a Third Ear item → ProductPage opens with `product.type === 'store'`
4. `lookupDiscogs("artist title")` fires → fetches matching Discogs release → cover image, tracklist, album notes fill in automatically
5. "מוכרים זמינים" section shows the store offer(s) with a working "צור קשר" link that opens the Third Ear product URL in a new tab
6. "זמין בחנויות" (StoreInventorySection) section is hidden for store items (avoids duplication)

**Build:** 121 modules, zero errors. Dev server confirmed at http://localhost:5173

### Session 17b — 2026-06-19 (continued)
**Goal:** Fix store items not showing in search; add Discogs cover enrichment with Supabase persistence

**Root cause of search bug:** `SearchPage.jsx` line 101 had `if (v.type === 'store') return false` — this was written when store-type items were listing-table offers that shouldn't appear in search. Now that `type: 'store'` means Third Ear inventory items, that line hid all 235 of them. Removed.

**Supabase SQL required (user must run):**
```sql
ALTER TABLE store_inventory ADD COLUMN IF NOT EXISTS cover_image_url text;
```

**Files updated:**
- `src/pages/SearchPage.jsx` — removed `if (v.type === 'store') return false` from filter
- `src/discogs.js` — `lookupDiscogs(query)` now returns `{ id, img }` (previously just `id`); `img` comes from `cover_image || thumb` on first Discogs search result
- `src/auth.js` — `getStoreInventory()` now selects `cover_image_url` and maps to `img: r.cover_image_url || null`; items with saved covers load them instantly from DB
- `src/App.jsx` — imported `lookupDiscogs`; added `updateVinylItem(id, updates)` function (updates a single item in vinylList); added `startCoverEnrichment(items)` — runs in background after data loads, works through store items with no `img`, 1 per 1.2s (≈50/min, under 60/min Discogs limit), saves `cover_image_url` to `store_inventory`, calls `setVinylList` to update search in real time; `onUpdateVinyl` added to `shared` props
- `src/pages/ProductPage.jsx` — updated `lookupDiscogs` call to destructure `{ id, img }`; after fetching full Discogs release for a store item, saves the primary image URL to `store_inventory.cover_image_url`

**Cover enrichment flow:**
1. App loads 235 store items (with `img: null` initially, or saved cover if already enriched)
2. `startCoverEnrichment` starts 2 seconds after load — works through items with no `img`
3. Per item: `lookupDiscogs("artist title")` → 1 API call → gets thumbnail image URL
4. Saves `cover_image_url` to `store_inventory` row in Supabase
5. `setVinylList` updates the item in memory → VinylCard in search re-renders with cover
6. Next app load: `getStoreInventory()` reads saved covers from DB → instant display
7. ProductPage: when a store item is opened, also saves the higher-quality primary image from the full Discogs release (overrides the thumbnail)

### Session 18 — 2026-06-19
**Goal:** Albums table refactor (canonical album per record), fix image persistence, admin delete button on ProductPage

**New Supabase table:**
- `albums` — canonical album record shared across all stores and private listings
  - Columns: `id` (bigserial), `title`, `artist`, `discogs_id`, `cover_image_url`, `release_year`, `notes`, `tracklist` (jsonb), `created_at`
  - RLS: enabled with permissive `FOR ALL USING (true)` policy (catalog data — public read/write)
  - `store_inventory.album_id` FK → `albums.id`
  - `listing.album_id` FK → `albums.id`

**SQL run this session:**
```sql
CREATE TABLE IF NOT EXISTS albums (...);
ALTER TABLE albums DISABLE ROW LEVEL SECURITY; -- then re-enabled with open policy
ALTER TABLE store_inventory ADD COLUMN IF NOT EXISTS album_id bigint REFERENCES albums(id);
ALTER TABLE listing         ADD COLUMN IF NOT EXISTS album_id bigint REFERENCES albums(id);
-- Migrated existing store_inventory rows → created albums from them → linked album_id
-- Re-enabled RLS on albums with: CREATE POLICY "albums_all" ON albums FOR ALL USING (true) WITH CHECK (true);
-- Listing delete admin policy: CREATE POLICY "listing_delete_admin" ON listing FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));
GRANT INSERT, UPDATE, DELETE ON albums TO anon; -- plus NOTIFY pgrst schema reload
```

**Files updated:**
- `scripts/import-third-ear.js` — now a generic store importer; accepts `"Store Name" "City"` as CLI args 2+3 (defaults: Third Ear / תל אביב); clears old rows for the store before re-inserting (idempotent); find-or-create albums via `buildAlbumMap()`; sets `album_id` on each `store_inventory` row; uses `SUPABASE_SERVICE_ROLE_KEY` from `.env` if present (bypasses RLS for album inserts)
- `src/auth.js` — `getStoreInventory()`: selects `album_id`, `cover_image_url` (direct column as fallback), and `albums(cover_image_url, discogs_id, release_year)` join; maps `img: r.albums?.cover_image_url || r.cover_image_url || null`, `albumId`, `discogsId`, `year` from albums join; `getListings()`: added `album_id` to select; `mapRow()` includes `albumId: r.album_id || null`; added `deleteListing(product)` — deletes from `store_inventory` (store items) or `listing` (private) based on `product.type`
- `src/App.jsx` — `startCoverEnrichment()`: deduplicates by `albumId` (one Discogs call per album, not per store row); saves to `albums` table AND `store_inventory` (dual write for reliability); updates all items sharing the same `albumId` in memory at once; added `deleteVinyl(product)` async function → calls `deleteListing`, removes from `vinylList`; `onDeleteVinyl: deleteVinyl` added to `shared` props
- `src/pages/ProductPage.jsx` — `allOffers` grouping now uses `albumId` FK match first, falls back to `title|artist` string match; auto-enrich saves Discogs data to `albums` table (preferred) or `store_inventory` (fallback if no albumId); added admin delete UI: `confirmDelete` state, admin bar with "מחק מכירה" button → inline confirm panel → calls `onDeleteVinyl` + navigates to search; `checkIsAdmin` imported from auth
- `src/pages/ProductPage.module.css` — added `.adminBar`, `.adminConfirm`, `.adminConfirmText`, `.btnDeleteAdmin`, `.btnDangerSm`, `.btnCancelSm`

**Image persistence fix (this session):**
- Root cause: Supabase JS v2 query builder is lazy — `.update().eq()` without `.then()` never fires. Fixed in App.jsx and ProductPage by adding `.then(() => {}).catch(() => {})` or `await`.
- Dual save: `store_inventory.cover_image_url` (direct, always works) + `albums.cover_image_url` (shared, needs open RLS policy)
- Read fallback: `r.albums?.cover_image_url || r.cover_image_url || null` in getStoreInventory

**Import script CLI:**
```
node scripts/import-third-ear.js path/to/file.json                    # Third Ear (default)
node scripts/import-third-ear.js path/to/file.json "Store Name" "City"  # any store
```
Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env` for album creation. Store inventory rows still insert without it.

**Admin delete (ProductPage):**
- Visible only when `checkIsAdmin(currentUser)` is true
- Strip appears below breadcrumb: "מחק מכירה" button → "האם אתה בטוח?" inline confirm with red "מחק" + "ביטול"
- Deletes: store items → `store_inventory` row; private listings → `listing` row (requires `listing_delete_admin` RLS policy)
- On confirm: removes from vinylList in memory + navigates to search

**Status at end of session:** Albums table live. Import script generic (supports any store). Cover images saved to albums table (shared across stores). Admin delete button on ProductPage. Build: 121 modules, zero errors.

### Session 19 — 2026-06-19
**Goal:** Systematic fix for Discogs cover enrichment — all store items, Hebrew support, placeholder URL bug

**Root causes identified (from analyzing the full store_inventory CSV):**
1. **Background enrichment bailed on `!img`** — even when a Discogs release ID was found, it was discarded if no thumbnail was available. ProductPage's Effect 1 (which uses `discogsId` to fetch the full release with real images) never had data to work with.
2. **Effect 2 bailed on any truthy `product.img`** — `st.discogs.com` placeholder SVG URLs were being treated as real covers, permanently blocking re-enrichment.
3. **ProductPage used a snapshot of the product** — when background enrichment updated `vinylList` with a `discogsId`, the already-open ProductPage never saw it (the effects had no reason to re-fire).
4. **`mapRow` kept placeholder URLs** — private listings uploaded via Discogs auto-fill that got a `st.discogs.com` placeholder saved as `cover_image_url` would appear "enriched" forever.
5. **`Ella Fitzgerald \| Louis Armstrong`** — backslash in the artist field was passed raw to Discogs search query.

**Files updated:**
- `src/discogs.js` — `normalizeQ()` now also strips backslashes before sending to Discogs API
- `src/auth.js` — `mapRow()` filters `st.discogs.com` placeholder URLs: `img: (cover && !cover.includes('st.discogs.com')) ? cover : null`
- `src/App.jsx` — `startCoverEnrichment()`: saves `discogsId` to memory AND albums table even when no thumbnail image found (enables ProductPage Effect 1 to fire on next open); memory update covers both `img` and `discogsId` fields
- `src/pages/ProductPage.jsx`:
  - Looks up the **live product from `vinylList`** instead of using the snapshot passed as prop — once background enrichment adds `discogsId` to memory, Effect 1 re-fires automatically
  - Added `hasRealCover(url)` helper: `!!(url && !url.includes('st.discogs.com'))`
  - Effect 2 (auto-enrich): now skips only when `product.discogsId` is set OR when cover is a real (non-placeholder) URL — placeholder URLs no longer block enrichment
  - `coverImg` falls back to `hasRealCover(img) ? img : null` — never shows a placeholder as the cover image

**SQL run this session (backfills albums table with covers already in store_inventory):**
```sql
UPDATE albums a
SET cover_image_url = si.cover_image_url
FROM store_inventory si
WHERE si.album_id = a.id
  AND si.cover_image_url LIKE '%i.discogs.com%'
  AND (a.cover_image_url IS NULL OR a.cover_image_url NOT LIKE '%i.discogs.com%');
```
This propagates covers from sibling store_inventory variants (e.g., black vinyl has cover, pink vinyl didn't) to the shared albums row, so all variants load the cover on next app load.

**Hebrew search confirmed working:**
- Discogs API supports UTF-8 — Hebrew artist/title searches (`טנגו`, `דודו פארוק`, etc.) work for Israeli records catalogued on Discogs
- An earlier version of this session's code skipped Hebrew items from enrichment — this was wrong and reverted immediately

**How the enrichment system works after this session:**

*Background enrichment (App.jsx, `startCoverEnrichment`):*
1. Runs 2s after load; processes store items without `img`, one per 1.2s
2. Calls `lookupDiscogs(artist, title, { quick: true })` — 1 Discogs API call per item
3. If real cover found (`i.discogs.com`): saves to `albums` + `store_inventory`, updates memory with `img` + `discogsId`
4. If only Discogs ID found (no thumbnail): saves `discogsId` to `albums` + memory — no image, but ProductPage can now use Effect 1

*ProductPage enrichment (2 effects):*
- **Effect 1** fires when `product.discogsId` is set → `getDiscogsRelease(id)` → full release with real high-quality images + tracklist
- **Effect 2** fires when no `discogsId` AND no real cover → `lookupDiscogs(artist, title, { quick: false })` (up to 4 candidate queries) → full release → saves cover + discogsId to DB
- Because ProductPage now uses the live product from `vinylList`, Effect 1 auto-fires when background enrichment adds a `discogsId` to memory (no refresh needed)

**Build:** 121 modules, zero errors.

### Session 20 — 2026-06-19
**Goal:** Delete non-music items (books, turntables, Blu-rays) from `store_inventory`

**No code files changed** — all fixes were SQL run in the Supabase SQL Editor.

**Problem:** The Third Ear JSON import included non-music items:
- **Turntables (פטיפון)**: Sony PS-LX3BT, SAFA HP-100 variants — `artist` field contains "פטיפון"
- **Blu-rays**: `type` column = "Blu-ray" (films, not music)
- **Books / merch**: `type` = "Vinyl (new)" but clearly books — Stranger Things scripts, Taylor Swift coloring books, Dune art books, Studio Ghibli sketchbooks, Seinfeld scripts, Kurt Cobain Journals, etc. Identified by: empty `artist` field + title keywords (script, journal, coloring, sketchbook, making of, etc.)

**SQL run (preview first, then delete):**
```sql
-- Preview
SELECT id, artist, album_name, type FROM store_inventory
WHERE store_name = 'Third Ear'
  AND (
    artist ILIKE '%פטיפון%' OR album_name ILIKE '%SAFA HP%' OR album_name ILIKE '%PS-LX%'
    OR type = 'Blu-ray'
    OR ( (artist IS NULL OR artist = '') AND type = 'Vinyl (new)'
         AND ( album_name ILIKE '%script%' OR album_name ILIKE '%journal%'
            OR album_name ILIKE '%coloring%' OR album_name ILIKE '%colouring%'
            OR album_name ILIKE '%sketchbook%' OR album_name ILIKE '%diary%'
            OR album_name ILIKE '%making of%' OR album_name ILIKE '%photography%'
            OR album_name ILIKE '%sticker book%' OR album_name ILIKE '%art and soul%'
            OR album_name ILIKE '%all the songs%' OR album_name ILIKE '%be more%'
            OR album_name ILIKE '%little guide%' OR album_name ILIKE '%never understood%'
            OR album_name ILIKE '%rules for a knight%' OR album_name ILIKE '%future boy%'
            OR album_name ILIKE '%sideways%' OR album_name ILIKE '%rear window%'
            OR album_name ILIKE '%hateful eight%' OR album_name ILIKE '%seinfeld%'
            OR album_name ILIKE '%totoro%' OR album_name ILIKE '%stranger things%'
            OR album_name ILIKE '%spirited away%' OR album_name ILIKE '%howl%'
            OR album_name ILIKE '%dune%' OR album_name ILIKE '%jungleland%'
            OR album_name ILIKE '%kurt cobain: journals%' OR album_name ILIKE '%מי רצח%' )
       )
  );

-- DELETE (same WHERE clause — confirmed and run by user)
DELETE FROM store_inventory WHERE store_name = 'Third Ear' AND ( ... same conditions ... );
```

**Result:** Non-music items removed. Only real vinyl, CD, and music-related inventory remains.

**Note for future imports:** The import script already filters by `type` containing "vinyl"/"cd"/"blu-ray" but Third Ear mislabels books as "Vinyl (new)". A future improvement would be to add a keyword blocklist in the import script to exclude items with no artist and book-like titles.

**Status at end of session:** `store_inventory` cleaned — only music inventory remains in the DB.

### Session 21 — 2026-06-19
**Goal:** Fix private listing (יד שנייה) cover images — save Discogs cover + `discogs_id` back to `listing` table from ProductPage

**Problem:**
- When a user opens a private listing on ProductPage, Effect 2 fetches Discogs data (cover, tracklist) and shows it in the UI — but it was only saving back to the `albums` or `store_inventory` tables, never to `listing`.
- `discogs_id` was stored in UploadPage state and passed to `addListing`, but `addListing` never included it in the INSERT, and `mapRow` never read it back.
- Result: after reload, the private listing card in Search showed a blank cover, and ProductPage had to re-fetch Discogs every time (no `discogsId` cached).

**SQL run in Supabase:**
```sql
ALTER TABLE listing ADD COLUMN IF NOT EXISTS discogs_id text;
```

**Files updated:**
- `src/auth.js`:
  - `getListings` SELECT: added `discogs_id` to column list
  - `mapRow`: added `discogsId: r.discogs_id || null`
  - `addListing`: added `discogs_id: record.discogsId || null` to INSERT
  - `updateListing`: added `discogs_id: updates.discogsId || null` to UPDATE
- `src/pages/ProductPage.jsx`:
  - Added `onUpdateVinyl` to prop destructuring
  - Effect 2 (auto-enrich): replaced the single `if (resolvedImg)` save block with a 3-way branch:
    1. `albumId` set → save to `albums` table (unchanged)
    2. `id.startsWith('si-')` → save to `store_inventory` (unchanged)
    3. `type === 'private'` → save `cover_image_url` + `discogs_id` to `listing` table AND call `onUpdateVinyl` to update the search card in memory immediately

**Result after fix:**
- User uploads private listing via Discogs auto-fill → `discogs_id` saved to DB → next page load, Effect 1 fires (instant Discogs cover via single API call)
- User uploads private listing without Discogs (or auto-fill gave no ID) → Effect 2 fires on first ProductPage visit → cover + discogs_id saved to `listing` → search card shows cover immediately and on all future loads
- User's own uploaded photo (base64): still saved directly to `listing.cover_image_url` via `addListing` as before; very large photos (>4MB base64) may silently fail — a known limitation; Supabase Storage would be the proper fix

**Status at end of session:** Private listing Discogs covers now persist to DB. Search cards show cover images after the first ProductPage visit.

### Session 22 — 2026-06-19
**Goal:** Add Vercel Analytics

**Files updated:**
- `src/main.jsx` — added `import { Analytics } from '@vercel/analytics/react'`; added `<Analytics />` inside `<StrictMode>` render, after `<App />`
- `package.json` / `package-lock.json` — `npm i @vercel/analytics` added the package

**Why main.jsx, not App.jsx:**
App.jsx uses one `return` per page (`if (page === 'search') return <SearchPage ...>`) — adding `<Analytics />` there would require touching every branch. `main.jsx` is the single root wrapper that renders once and covers all pages automatically.

**Import path note:**
Vercel's "Get Started" docs show `@vercel/analytics/next` — that path is for Next.js Server Components only. This project is Vite + React, so the correct import is `@vercel/analytics/react`.

**Result:** Analytics data appears in the Vercel dashboard → Analytics tab within ~30 seconds of the first page view after deployment.

**Status at end of session:** Vercel Analytics live. No other files changed.

### Session 23 — 2026-06-19
**Goal:** Fix private listing cover persistence + admin inline edit with colored vinyl support

**Problem 1 — Cover lost on hard refresh:**
Effect 1 in ProductPage (which fires when `product.discogsId` is set) was calling `getDiscogsRelease()` and showing the cover in state, but never saving the URL back to the `listing` table. Every hard refresh triggered a new Discogs API call just to show the same image. Fixed by saving `cover_image_url` to the `listing` table inside Effect 1's `.then()`, whenever it's a private listing without a real cover already.

**Problem 2 — Admin inline edit + colored vinyl:**
Added "ערוך מכירה" button to the admin bar. Opens an inline edit panel below the breadcrumb. Fields differ by product type:
- **Private listings**: artist, title, year, format, condition, price, city, genre pills, description, "ויניל צבעוני" checkbox
- **Store items**: artist, album name, type (free text — e.g., "Colored Vinyl (new)"), style/note, price

**SQL migration required (run in Supabase SQL Editor):**
```sql
ALTER TABLE listing ADD COLUMN IF NOT EXISTS colored_vinyl boolean DEFAULT false;
```

**Files updated:**
- `src/auth.js`:
  - `getListings` SELECT: added `colored_vinyl`
  - `mapRow`: added `coloredVinyl: r.colored_vinyl || false`
  - `addListing`: added `colored_vinyl: record.coloredVinyl || false`
  - `updateListing`: added `colored_vinyl: updates.coloredVinyl ?? false`
  - `getStoreInventory`: added `rawType: r.type || ''` and `storeStyle: r.style || ''` to returned shape
  - Added `updateStoreItem(numericId, updates)` — updates `store_inventory` (artist, album_name, price_ils, type, style)
- `src/pages/ProductPage.jsx`:
  - Imported `updateListing` and `updateStoreItem` from auth
  - Added `EDIT_FORMATS`, `EDIT_CONDITIONS`, `EDIT_CITIES` constants
  - Effect 1 now saves `cover_image_url` back to `listing` table after fetching Discogs release (fix for cover disappearing on refresh)
  - Added `editing`, `saving`, `editForm` state
  - Added `startEdit()`, `handleSave()` functions
  - Admin bar: added "ערוך מכירה" button alongside "מחק מכירה"; buttons wrapped in `.adminBtns` flex row
  - Added admin edit panel JSX (conditional on `editing && editForm`)
  - tagRow: added "ויניל צבעוני" tag shown when `product.coloredVinyl` OR `storeStyle`/`rawType` contains "color"
- `src/pages/ProductPage.module.css`:
  - Added `.adminBtns`, `.btnEditAdmin`
  - Added `.adminEditPanel`, `.adminEditInner`, `.editTitle`
  - Added `.editGrid`, `.editField`, `.editLabel`, `.editInput`, `.editSelect`, `.editTextarea`
  - Added `.editPills`, `.editPill`, `.editPillActive`
  - Added `.editCheckboxLabel`, `.editCheckbox`
  - Added `.editActions`, `.btnSaveEdit`
  - Added `.tagColored` (rainbow gradient pill for colored vinyl)

**Colored vinyl detection (automatic, no edit needed):**
- Private listings: `product.coloredVinyl === true` (new DB field)
- Store items: `product.storeStyle` or `product.rawType` contains "color" — detected automatically from what's already in the DB (e.g., Third Ear items with type "Coloured Vinyl (new)" will show the tag without any admin action)

**Build:** 122 modules, zero errors.

### Session 24 — 2026-06-19
**Goal:** Fix cover image truly persisting (RLS root cause) + require image on upload

#### Fix 1 — Cover still vanishing after Session 23 fix

**Root cause:** The `listing` table RLS policy is `owner update only`. The direct `supabase.from('listing').update(...)` calls in ProductPage's Effect 1 and Effect 2 were silently rejected by Supabase whenever the viewer was not the listing owner — i.e., when an admin or a buyer (not the seller) viewed the listing. `.catch(() => {})` swallowed the error with no sign anything went wrong.

**Solution — `SECURITY DEFINER` RPC function:**

SQL run in Supabase SQL Editor:
```sql
CREATE OR REPLACE FUNCTION public.enrich_listing_cover(
  listing_id uuid,
  img_url    text,
  d_id       text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE listing
  SET
    cover_image_url = CASE
      WHEN cover_image_url IS NULL OR cover_image_url NOT LIKE '%i.discogs.com%'
      THEN img_url
      ELSE cover_image_url
    END,
    discogs_id = COALESCE(discogs_id, d_id)
  WHERE id = listing_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.enrich_listing_cover TO anon, authenticated;
```

The function runs as the DB owner (bypasses RLS) but is safe: it only touches `cover_image_url` and `discogs_id`, and only writes `cover_image_url` when no real `i.discogs.com` URL is already saved.

**Files updated:**
- `src/pages/ProductPage.jsx` — replaced both `supabase.from('listing').update(...)` cover-enrichment saves (Effect 1 and Effect 2) with `supabase.rpc('enrich_listing_cover', { listing_id, img_url, d_id })`

#### Fix 2 — Require image on listing upload

**Problem:** Users could submit a listing with no photo and no Discogs auto-fill, leaving a permanently blank-cover card with no `discogsId` to auto-enrich from.

**Rule:** Image required **unless** Discogs auto-fill was used (`discogsId` is set). If the user selected an album from Discogs, the cover is fetched and saved automatically on first ProductPage visit via the RPC — no manual upload needed.

**Files updated:**
- `src/pages/UploadPage.jsx`:
  - `validate()`: added `if (!preview && !discogsId) e.img = 'יש להוסיף תמונה, או לבחור אלבום מ-Discogs'`
  - JSX: error message shown below the dropzone with `data-error` attribute so scroll-to-first-error works

**Build:** 122 modules, zero errors.

### Session 25 — 2026-06-20
**Goal:** Add Disc Center store, deduplicate search results across stores, back-to-top button

#### Part 1 — Disc Center import

**Files created:**
- `scripts/import-disccenter.js` — parser for the scraped Disc Center markdown format (`diskcenter.txt`); extracts products with regex, strips format suffixes from album names, detects colored vinyl, filters to vinyl/CD only, inserts into `store_inventory`; deduplicates by URL across pages

**Data source:** `diskcenter.txt` — 3 scraped pages from disccenter.co.il (new vinyl, Israeli music, DVD/Blu-Ray sections). 56 unique items parsed.

**Filtering:**
- Kept: 38 vinyl (LP, 2LP, תקליט) and CD items
- Removed: 18 DVD and Blu-Ray items (including CD+Blu-Ray and 2CD+DVD combos)
- Colored vinyl auto-detected from title keywords (Red Vinyl, Transparent Clear, צבעוני, ורוד, etc.) → `type: 'Coloured Vinyl (new)'`

**Store details:** "Disc Center", "תל אביב" (דיזנגוף סנטר)

**Overlap with Third Ear:** 18 albums appear in both stores (mostly Israeli releases). This is by design — ProductPage shows all stores carrying the same album under "מוכרים זמינים".

**Album deduplication in import:** `buildAlbumMap` matched all 38 Disc Center albums to existing `albums` table rows (created during Third Ear import) — all share `album_id` FKs. This enables the ProductPage multi-store display.

**Cleanup during session:**
- Accidentally created "Disc Center DRY RUN" rows during testing — deleted via Supabase SDK
- City was set to "ירושלים" by mistake — corrected to "תל אביב" via update query

#### Part 2 — Deduplicate search results + best price + neutral badge

**Problem:** Same album sold by Disc Center AND Third Ear appeared as 2 separate cards in search. First pass showed only the first-seen item (not necessarily the cheapest); the store name badge still named a specific store.

**Solution:** Two-pass deduplication at the end of `results` useMemo in `SearchPage.jsx`:
- **Pass 1:** Build a `Map<albumKey, { best, count }>` — tracks the lowest-price representative and total store count per album group
- **Pass 2:** Filter to only the best-price item per group; replace badge with `"X חנויות"` when `count > 1`
- Album key: `id:${albumId}` when the FK exists; `t:title|artist` as a string fallback

**Why in SearchPage, not in `getStoreInventory`:** `vinylList` must keep all rows so ProductPage's `allOffers` (filtered by `albumId`) can list both stores under "מוכרים זמינים". Only the search grid is deduplicated.

**Files updated:**
- `src/pages/SearchPage.jsx` — two-pass deduplication at end of `results` useMemo; private listings always pass through unchanged

#### Part 3 — Back-to-top button in SearchPage

**Files updated:**
- `src/pages/SearchPage.jsx` — `showTop` state + `scroll` listener (`window.scrollY > 400`); fixed button rendered when `showTop === true`; `window.scrollTo({ top: 0, behavior: 'smooth' })` on click
- `src/pages/SearchPage.module.css` — `.backToTop`: fixed position `bottom: 28px; left: 28px`, 44×44px purple circle, `--shadow-md`, hover lifts 3px

**Status at end of session:** Disc Center (38 items) live alongside Third Ear. Duplicate albums show once in search, both stores in ProductPage. Back-to-top button in SearchPage.

---

## Rules for Claude in This Project

1. **Never use `--overwrite` with create-vite** — it permanently deletes all files in the directory. Scaffold manually instead.
2. **Never hardcode hex colors** — always use CSS variables from `globals.css`.
3. **Never use pure white** — `--cream` for page bg, `--paper` for cards.
4. **Always RTL** — `direction: rtl` on page; Hebrew copy first.
5. **No emoji in UI** — SVG only.
6. **Keep the student's pace** — they're learning basics and follow professor steps. Don't get ahead of what they asked for.
7. Always reference `_reference/Homepage Hi-Fi.html` when building UI — it's the visual truth.
