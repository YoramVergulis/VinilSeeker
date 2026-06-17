# VinilSeeker Design System

A Hebrew-first design system for **VinilSeeker / ויניל סיקר** — an Israeli marketplace for vinyl records, where collectors find rare albums and sellers reach passionate listeners.

The system is grounded in three feelings: **late-night listening**, **crate-digger sophistication**, and **warm Israeli hospitality**.

---

## 🎨 Visual Foundations

### Color
- **Primary**: Deep aubergine purple (`--purple-700` `#3B1F5C`). Jewel-toned, not "tech-purple". Think dim listening room, velvet-lined sleeve, late-evening sky.
- **Surface**: Cream parchment (`--cream` `#F5EFE6`) — the page background, like aged liner notes. Never pure white.
- **Vinyl black**: `#0F0814` — for the disc itself, footer, vinyl-mark backgrounds. Deeper than ink.
- **Accent gold**: `--gold-500` `#D9A441` — the 45rpm center. Used **sparingly** for prices, primary CTAs ("buy now"), and "rare/featured" tags.
- **Burgundy**: `#7A2540` — vintage/limited tags, secondary editorial accents.
- **Semantic**: muted, not neon (`success #2E7D5B`, `warning #B8801A`, `danger #A8324A`).

### Type
- **Display**: **Frank Ruhl Libre** (700/500/400/900) — a Hebrew serif with classical Latin support. Used for the wordmark, hero, h1/h2, and editorial pull-quotes.
- **Body**: **Assistant** (300–800) — clean Hebrew sans, also covers Latin. All UI labels, buttons, body copy, captions.
- Pair rationale: This is the canonical "modern Israeli editorial" pair — distinctive without being trendy, and avoids the overused Heebo/Inter combo. Both faces ship full Hebrew + Latin so we never font-switch mid-sentence.

### Spacing, radii, shadows
- 4px base spacing scale (`--s-1` … `--s-24`).
- Default radius **12px** (`--r-md`) for cards/inputs; **9999px** (full) for pills, badges, vinyl discs and avatars; **8px** for nested elements.
- Shadows are **purple-tinted** (`rgba(26,12,43,…)`) instead of neutral grey — keeps elevation on-brand. A special `--shadow-vinyl` for record-on-wood depth.

### Backgrounds & textures
- Surfaces sit on cream — **never pure white**. Cards use `--paper` (slightly warmer).
- Hero / category headers can use a deep purple → vinyl-black gradient (`linear-gradient(135deg, #3B1F5C, #0F0814)`).
- Optional grain overlay (3–5% noise) on hero areas for the "old liner notes" feel.

### Iconography
- **Vinyl record motif** is the brand mark (concentric circles + gold center).
- Outline icons preferred (1.5px stroke). No emoji in production UI — substitute with custom SVG glyphs.
- Genre tags use word-pills, not icons.

---

## ✏️ Content Fundamentals

- **Hebrew first**, RTL layout. English/Latin appears only for album/artist names and prices.
- Tone: **warm, knowledgeable, casual**. Like a record-store clerk who actually loves the records.
- Copy is short and concrete. Prefer "פרסם תקליט" over "צור הצעת מכירה חדשה".
- Address the user with תני / תן (informal direct), not the formal passive voice.
- Prices: `₪320` — no decimals.
- Years for albums: `1979`, `1959` — always 4-digit.
- Avoid: corporate/bank-app phrasing, marketing-speak ("חוויה מהפכנית"), and emoji as decoration.

---

## 📐 Component Conventions

- **Buttons**: pill-shaped (`--r-full`). Primary = purple-700 fill. Hot CTA = gold fill on purple text. Secondary = purple outline. Ghost = no fill.
- **Inputs**: 12px radius, paper background, 1.5px rule border. Focus ring = 3px `--purple-100`. Search bar uses pill shape with embedded action button.
- **Cards (vinyl listings)**: 12px radius, paper bg, 1px rule border, `--shadow-sm`. Hover lifts to `--shadow-md` with purple-300 border. Image area = 160px gradient with vinyl mark + corner badge.
- **Badges**: pill-shaped. Category badges use solid purple/gold/vinyl; state badges use soft tinted backgrounds; genre badges use `--purple-100` soft fill.

---

## 📁 Index

| File | Purpose |
|---|---|
| `colors_and_type.css` | All design tokens — import this first |
| `preview/*.html` | The 14 design-system cards rendered in the Design System tab |
| `VinylSeeker Wireframes.html` | Original wireframes (cream paper aesthetic, separate file) |
| `SKILL.md` | Agent skill manifest (for cross-project use) |

---

## 🚧 Caveats

- **Fonts loaded from Google Fonts CDN** — if you need offline use, download Frank Ruhl Libre + Assistant `.woff2` files into `fonts/` and replace the `@import` in `colors_and_type.css`.
- **No real product photography yet** — the listing cards use gradient + vinyl-mark placeholders. Bring real album-cover thumbs once the platform has uploads.
- **Logo** is the first pass — vinyl-mark + Frank Ruhl Libre wordmark. Could be refined further (e.g. groove-line texture in the disc, or a more distinctive "V" lockup).
- **No full UI kit yet** — only foundations + atomic components. The wireframes show the screen-level structure; converting them to high-fidelity is the next step.

---

## 🙋 What I need from you

1. **Logo direction**: keep the vinyl-record mark, or try alternatives? (e.g. a stylized "V" cut from a record, or a needle/tonearm motif?)
2. **Photography**: do you have any real album-cover images we can use to ground the listing cards?
3. **Apply to wireframes**: ready for me to take the existing wireframes and re-render Screen 1 (homepage) in this hi-fidelity system as a first proof-of-concept?
