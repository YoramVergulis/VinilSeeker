# VinilSeeker Design System

A Hebrew-first design system for **VinilSeeker / ויניל סיקר** — an Israeli marketplace for vinyl records, where collectors find rare albums and sellers reach passionate listeners.

The system is grounded in three feelings: **late-night listening**, **crate-digger sophistication**, and **warm Israeli hospitality**.

---

## Visual Foundations

### Color

| Token | Hex | Usage |
|---|---|---|
| `--purple-700` | `#3B1F5C` | Primary brand — buttons, active states, headings |
| `--purple-900` | `#1A0C2B` | Headlines on cream |
| `--purple-600` | `#432575` | Button hover |
| `--cream` | `#F5EFE6` | Page background — aged liner notes, never pure white |
| `--paper` | `#FAF6EE` | Card background — slightly warmer than cream |
| `--cream-deep` | `#ECE3D2` | Sunken sections (filter bars, step headers) |
| `--vinyl-black` | `#0F0814` | The disc itself; footer background |
| `--ink` | `#1A1126` | Primary text |
| `--ink-2` | `#4A3D5C` | Secondary text |
| `--ink-3` | `#7A6E8A` | Muted / captions |
| `--rule` | `#D9D2C4` | Dividers and borders |
| `--gold-500` | `#D9A441` | 45rpm center — hot CTA ("קנה עכשיו"), prices, rare tags |
| `--gold-300` | `#E8C076` | Gold hover |
| `--gold-700` | `#A67622` | Dark gold |
| `--burgundy` | `#7A2540` | Vintage / limited edition tags |
| `--success` | `#2E7D5B` | Muted green |
| `--warning` | `#B8801A` | Muted amber |
| `--danger` | `#A8324A` | Muted red |

**Rules:**
- Never hardcode hex values — always use CSS variables from `src/styles/globals.css`
- Never use pure white backgrounds — always `--cream` or `--paper`
- Gold is used sparingly — prices and "קנה עכשיו" only

### Type

| Token | Value | Usage |
|---|---|---|
| `--font-display` | Frank Ruhl Libre, Georgia, serif | Wordmark, hero, h1/h2, editorial pull-quotes |
| `--font-body` | Assistant, system-ui, sans-serif | All UI labels, buttons, body copy, captions |
| `--font-mono` | JetBrains Mono, monospace | Code only |

**Type scale:**

| Token | Size | Usage |
|---|---|---|
| `--t-display` | 56px | Hero / brand |
| `--t-h1` | 40px | Page titles |
| `--t-h2` | 32px | Section headers |
| `--t-h3` | 24px | Card titles |
| `--t-h4` | 20px | Sub-section labels |
| `--t-body-lg` | 18px | Lead text |
| `--t-body` | 16px | Default body |
| `--t-body-sm` | 14px | Secondary labels |
| `--t-caption` | 12px | Captions, meta |
| `--t-micro` | 11px | Badges, micro labels |

**Line heights:** `--lh-tight: 1.15` · `--lh-snug: 1.35` · `--lh-normal: 1.55` · `--lh-relaxed: 1.7`

Pair rationale: Frank Ruhl Libre + Assistant is the canonical modern Israeli editorial pair — distinctive, full Hebrew + Latin support, avoids the overused Heebo/Inter combo.

### Spacing

4px base scale: `--s-1: 4px` through `--s-24: 96px`

### Radii

| Token | Value | Usage |
|---|---|---|
| `--r-none` | 0 | No rounding |
| `--r-xs` | 4px | Small nested elements |
| `--r-sm` | 8px | Nested elements |
| `--r-md` | 12px | **Default** — cards, inputs |
| `--r-lg` | 16px | Large cards |
| `--r-xl` | 24px | Large panels |
| `--r-full` | 9999px | Pills, badges, vinyl discs, avatars |

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

## Content Fundamentals

- **Hebrew first**, RTL layout (`dir="rtl"` on `<html>`). English/Latin only for album/artist names and prices.
- Tone: **warm, knowledgeable, casual** — like a record-store clerk who loves the records.
- Copy is short and concrete. Prefer "פרסם תקליט" over "צור הצעת מכירה חדשה".
- Address the user with `תן` / `תני` (informal direct), not formal passive voice.
- Prices: `₪320` — no decimals, no space before ₪.
- Album years: `1979`, `1959` — always 4-digit.
- No emoji in production UI — SVG icons only.
- Avoid corporate phrasing and marketing-speak ("חוויה מהפכנית").

---

## Component Conventions

### Buttons (always `--r-full`)

| Variant | Style | Use |
|---|---|---|
| Primary | `--purple-700` fill, white text | Main actions |
| Gold | `--gold-500` fill, `--purple-900` text | "קנה עכשיו" only |
| Secondary | Transparent + `--purple-700` border | Secondary actions |
| Ghost | No fill, no border | Tertiary / nav |
| Danger | `--danger` fill | Destructive actions |

### Inputs
- 12px radius, `--paper` background, 1.5px `--rule` border
- Focus ring: 3px `--purple-100`
- Search bar: pill-shaped with embedded action button

### Cards (VinylCard)
- 12px radius, `--paper` bg, 1px `--rule` border, `--shadow-sm`
- Hover: `translateY(-4px)`, `--shadow-md`, `--purple-300` border
- Cover area: square, `--vinyl-black` bg, vinyl disc peeks in from right on hover
- Corner badge: pill — gold = rare, burgundy = vintage/limited, dark = new
- Save button: top-left, frosted circle

### Badges
- Pill-shaped (`--r-full`)
- Genre badges: `--purple-100` soft fill
- State badges: soft tinted background matching semantic color

### Logo SVG
```jsx
<svg viewBox="0 0 64 64">
  <circle cx="32" cy="32" r="31" fill="var(--vinyl-black)" />
  <circle cx="32" cy="32" r="22" fill="none" stroke="var(--purple-800)" strokeWidth="0.5" />
  <circle cx="32" cy="32" r="13" fill="var(--purple-700)" />
  <circle cx="32" cy="32" r="2.5" fill="var(--gold-500)" />
</svg>
```

---

## Pages Built

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero, stats, featured listings, genre grid, how-it-works |
| Search | `/search` | Filters, sort, local + Discogs results |
| Product | `/product` | Listing detail, seller card, similar records, Discogs tracklist |
| Upload | `/upload` | 5-step listing form with Discogs auto-fill |
| Auth | `/auth` | Login / Register / Forgot password |
| Profile | `/profile` | User info, edit, my listings |
| Saved | `/saved` | Saved items + price alerts |
| Chat | `/chat` | Real-time messaging with sellers (Supabase) |
| Admin | `/admin` | Listings, users, reports, stores management |
| Categories | `/categories` | Browse by genre |
| Stores | `/stores` | Record store directory |
| Rare | `/rare` | Collectible / first-press vinyl |
| How it Works | `/how` | Buyer + seller guide |
| Seller Guide | `/seller` | Photography tips, grading table, pricing |
| Pricing | `/pricing` | Price calculator |
| Blog | `/blog` | Articles + categories |
| Contact | `/contact` | Contact form + info |
| Terms | `/terms` | Terms of service |
| Privacy | `/privacy` | Privacy policy |

---

## Tech Integration

| System | What it does |
|---|---|
| **Supabase** | Auth (email+password), `listing` table, `user_wishlist`, `conversation`, `message`, `profiles` |
| **Discogs API** | Search releases, auto-fill upload form, enrich product page with tracklist + notes |
| **Vercel** | Hosting at `vinilseeker.com`; `vercel.json` rewrites all paths to `index.html` for SPA routing |

---

## File Index

| File / Folder | Purpose |
|---|---|
| `src/styles/globals.css` | All design tokens — imported once in `main.jsx` |
| `src/components/` | Shared components: Navbar, Footer, Layout, VinylCard, GenreChip, SectionHeader, HowStep |
| `src/pages/` | One file per page (19 pages + matching `.module.css`) |
| `src/data/vinyl.js` | Static mock vinyl data (18 records) |
| `src/auth.js` | Supabase auth + listing + saved-items service |
| `src/chat.js` | Supabase chat service (conversations + messages) |
| `src/discogs.js` | Discogs API service |
| `src/supabase.js` | Supabase client (reads from `.env`) |
| `_reference/Homepage Hi-Fi.html` | Hi-fidelity homepage — visual truth for UI decisions |
| `_reference/VinylSeeker Wireframes.html` | Original wireframes for all screens |
| `_reference/colors_and_type.css` | Original design token source |
| `_reference/preview/*.html` | 14 design-system preview cards |
| `vercel.json` | SPA rewrite rule for Vercel |
| `.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_DISCOGS_TOKEN` — never commit |
