# VinilSeeker — ויניל סיקר 🎵

> The Hebrew-first Israeli marketplace for vinyl records, CDs, and physical music — where collectors find rare pressings and passionate sellers reach the right ears.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://vinilseeker.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue)](https://github.com/yoramvergulis/vinilseeker)
[![Built with React](https://img.shields.io/badge/React-Vite-61dafb)](https://vitejs.dev)
[![Supabase](https://img.shields.io/badge/Backend-Supabase-3ecf8e)](https://supabase.com)

---

## 📌 Overview

VinilSeeker is a full-stack Israeli marketplace for buying and selling physical music — vinyl records, CDs, and discs of all kinds — built with a collector's attention to detail. Vinyl is at the heart of the platform, but the catalog spans every format: LPs, 7" singles, 12" maxis, CDs, and more. Sellers upload their items in seconds using Discogs auto-fill, buyers discover rare pressings through smart filters and live Discogs search, and the two sides connect through real-time in-app messaging — all in Hebrew, RTL, and built for the Israeli market.

---

## 🧩 The Problem

Israel's physical music market is fragmented across WhatsApp groups, Facebook Marketplace, and Yad2 — none of which are built for collectors. There's no way to filter by format (LP vs. CD vs. 7"), condition (VG+ vs. Fair), or genre. Sellers don't know how to price their items. Buyers waste hours hunting across platforms with no standardized grading, no format-specific fields, and no trust signals.

The result: rare Israeli pressings are undersold, international classics are overpriced, and serious collectors of vinyl, CDs, and discs — a growing community in Israel — have no real home.

---

## 🎯 Target Audience

**Buyers:** Israeli music collectors aged 16–55 who hunt record stores and secondhand shops for vinyl records, CDs, and rare discs. They want format-specific filters, Goldmine condition grades, and seller trust signals — not a generic classifieds board.

**Sellers:** Anyone from a seasoned collector thinning their vinyl or CD collection, to someone who inherited a crate of records and discs and has no idea what they're worth. They need a tool that tells them the market price, fills in the details automatically, and gets their listing live in under two minutes.

---

## ⚔️ Competitors & Differentiation

| Solution | Limitation |
|---|---|
| Facebook Marketplace | No condition grading, no format filtering, not built for physical music, no Hebrew-first UX |
| Yad2 | Generic classifieds — no format-specific fields (pressing, condition, LP vs. CD vs. 7") |
| Discogs Global | English-only, covers vinyl and CDs but international pricing doesn't reflect the Israeli market, no local chat |
| WhatsApp Groups | Unstructured, no search, no trust signals, messages disappear, can't browse by format |

**Our edge:** VinilSeeker is the only platform purpose-built for the Israeli physical music community — Hebrew-first, RTL, covering vinyl records, CDs, and all disc formats, with Discogs-powered auto-fill for sellers, real Goldmine condition grading, live Discogs search integration, in-app real-time chat, and a price calculator calibrated for the local market.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite, CSS Modules, custom design system |
| Backend / DB | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password) |
| Real-time | Supabase Realtime (postgres_changes) |
| External API | Discogs REST API |
| Deployment | Vercel (SPA rewrite via `vercel.json`) |
| Routing | History API (`pushState` / `popstate`) — no React Router |

---

## 🔗 External Services & Integrations

| Service | Type | Purpose |
|---|---|---|
| Supabase Auth | Authentication | Email/password registration, session persistence, JWT |
| Supabase DB | Database | Listings, artists, genres, wishlists, profiles |
| Supabase Realtime | WebSocket | Live chat message delivery without polling |
| Discogs API | Third-party REST API | Search vinyl catalog, auto-fill listing fields, fetch tracklist & album notes |
| Vercel | Hosting / CDN | SPA deployment with `vercel.json` rewrite rule for direct URL access |

---

## 🗄️ Database Schema

**Tables:**

| Table | Purpose |
|---|---|
| `auth.users` | Supabase built-in auth — email, password, metadata (name, city, isAdmin) |
| `profiles` | Public user profiles — name, city; synced via trigger on register |
| `listing` | Music listings — title, format, condition, price, city, cover image, release year (vinyl, CD, disc) |
| `artist` | Normalized artist records — found-or-created on listing insert |
| `genre` | Normalized genre records — found-or-created on listing insert |
| `listing_genres` | Junction table — many-to-many between listings and genres |
| `user_wishlist` | Saved/favorited listings per user |
| `conversation` | Chat threads — buyer_id, seller_id, listing_id, UNIQUE constraint |
| `message` | Individual chat messages — conversation_id, sender_id, content, is_read |

> Generate the visual ERD via: Supabase Dashboard → Database → Schema Visualizer

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js >= 18
- npm
- Supabase project (free tier works)
- Discogs developer account (free personal token)

### Installation

```bash
git clone https://github.com/yoramvergulis/vinilseeker.git
cd vinilseeker
npm install
```

### Environment Variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DISCOGS_TOKEN=your_discogs_personal_token
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

### Supabase Setup Notes

- **Email confirmation** must be **OFF**: Supabase Dashboard → Authentication → Settings → "Enable email confirmations" → toggle off.
- Run the RLS policies via the SQL Editor to enable per-user security on `conversation` and `message` tables.
- Admin access: register with `admin@vinilseeker.com` to get admin panel access.

---


## 📄 Page Inventory (19 pages)

| Page | Route | Description |
|---|---|---|
| Home | `/` | Landing page — hero, stats, featured listings, genre grid |
| Auth | `/auth` | Login / Register / Forgot Password (3 views in one page) |
| Search | `/search` | Full search with live Discogs integration and filters |
| Product | `/product` | Listing detail page — tracklist, seller card, similar records (vinyl, CD, disc) |
| Upload | `/upload` | Create a listing in 5 steps with Discogs auto-fill (supports all formats) |
| Profile | `/profile` | User profile + my listings + edit |
| Saved | `/saved` | Wishlist + price alerts |
| Chat | `/chat` | Real-time buyer/seller messaging |
| Admin | `/admin` | Admin panel — listings, users, reports, stores (gated) |
| Rare | `/rare` | Rare and collectible vinyl, CDs, and discs grid with rarity stars |
| How It Works | `/how` | Buyer and seller step-by-step guide |
| Seller Guide | `/seller` | Photography tips, Goldmine grading table (applies to vinyl and CDs) |
| Pricing | `/pricing` | Market price calculator — 3-tier output |
| Blog | `/blog` | Category-filtered articles with pagination |
| Contact | `/contact` | Contact form with email validation |
| Terms | `/terms` | Terms of service with sticky TOC |
| Privacy | `/privacy` | Privacy policy |
| Categories | `/categories` | Browse by genre |
| Stores | `/stores` | Physical record stores directory |

---

## 🏗️ How AI Was Used in Development

Claude (Anthropic) served as the primary development partner across 15 documented sessions:

- **Architecture** — Designed the prop-threading navigation pattern, History API integration for browser back/forward support, Supabase schema, and RLS policy structure for per-user data isolation.
- **Full builds** — All 19 pages and every shared component (Navbar, Footer, VinylCard, HeroSection, etc.) were built following the hi-fidelity visual spec.
- **API integrations** — Discogs result normalization, Supabase real-time chat subscriptions, UploadPage auto-fill widget, and the found-or-create artist/genre pattern on listing insert.
- **Code review** — Session 15 was a dedicated full-codebase audit: 24 issues fixed across bugs (`useMemo` placements, stale state, blog filter edge case), security (email validation), and cleanliness (dead code removal, extracted constants).
- **Design enforcement** — No hardcoded hex values, no pure white backgrounds, SVG-only icons, full RTL layout — enforced consistently across every file.

Development was conversational and iterative. Each session had a goal, Claude proposed a plan, the student reviewed it, and implementation happened step by step. Full session history with exact file changes is documented in `CLAUDE.md`.

---

## 🎨 Design System

VinilSeeker uses a bespoke design system built around the aesthetic of **late-night listening rooms, aged liner notes, and the warm glow of a physical music collection**:

- **Colors:** Deep aubergine purple `#3B1F5C`, aged cream `#F5EFE6`, vinyl black `#0F0814`, 45rpm gold `#D9A441`
- **Typography:** Frank Ruhl Libre (Hebrew display/headlines) + Assistant (all UI body text)
- **Shape language:** Pill-shaped buttons (`border-radius: 9999px`), 12px default card radius, frosted glass navbar
- **Shadows:** Purple-tinted (not grey) to preserve the warm brand character
- **RTL-first:** `dir="rtl"` on `<html>`, Hebrew copy throughout, all layouts flow right-to-left

All tokens live in `src/styles/globals.css` and are referenced exclusively via CSS variables — no hardcoded hex values anywhere in the codebase.

---

## 📄 License

MIT — free to use, fork, and learn from.

---

*Built as a second-year semester project at [University Name]. Every design decision, architecture choice, and line of code has a documented reason in `CLAUDE.md` at the project root.*
