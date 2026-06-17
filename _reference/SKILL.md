---
name: vinilseeker-design
description: Use this skill to generate well-branded interfaces and assets for VinilSeeker — a Hebrew-first Israeli vinyl-record marketplace. Contains color palette (deep aubergine purple + cream + gold), Hebrew/Latin font pair (Frank Ruhl Libre + Assistant), spacing/radius/shadow tokens, the vinyl-record logo, and core UI components (buttons, inputs, cards, badges).
user-invocable: true
---

Read the README.md file in this skill, then explore `colors_and_type.css` (all tokens) and `preview/*.html` (rendered design-system cards).

Brand summary:
- **Hebrew-first**, RTL layout
- **Deep aubergine purple** (`#3B1F5C`) primary on **cream** (`#F5EFE6`) surface — never pure white
- **Gold** (`#D9A441`) sparingly for prices and hot CTAs (it's the 45rpm center of a record)
- **Frank Ruhl Libre** for display/headlines, **Assistant** for body/UI — both ship Hebrew + Latin
- 12px default radius; pill-shaped buttons and badges; purple-tinted shadows
- Vinyl-record mark (concentric circles, gold center) is the brand motif

When invoked without other guidance, ask the user what they want to build (landing page, listing card, full screen, deck, etc), then design with HTML using these tokens. Always import `colors_and_type.css` and use the CSS custom properties — never hard-code hex values. Default to RTL Hebrew copy unless the user requests English.

Avoid: pure-white backgrounds, neon/electric purples, emoji in production UI, corporate marketing tone, the Heebo/Inter combo.
