# Wyze Security System Builder

A two-column, data-driven configurator for assembling a home-security system. A
4-step accordion **builder** on the left, a live **review panel** on the right.
Everything renders from a single JSON catalog, quantities are tracked per color
variant, the two sets of steppers stay in sync, and the whole configuration can
be saved to `localStorage` and restored on return.

Built with **React 18 + Vite**. No UI libraries. Real product photos, the
satisfaction badge, delivery icon and Wyze logo come from `src/Assets`; the few
products the design doesn't ship an image for fall back to hand-built inline SVGs.
Everything is bundled locally, so it renders identically from a clean clone with
no network.

---

## Run it

Requires Node 18+.

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # production build to /dist
npm run preview  # serve the production build
```

---

## What's implemented

**Builder (left)**
- 4-step accordion — *Cameras, Plan, Sensors, Extra protection*. Step 1 open on
  load; clicking any header expands it (and collapses the others).
- Each step header shows `STEP X OF 4`, an icon, the title, a live **"N selected"**
  count (distinct products chosen in that step) and an up/down chevron.
- **Product cards**: optional discount badge, illustration, title, description +
  Learn More, variant chips, a quantity stepper, and struck-through compare
  price + active price. Cards with quantity > 0 render in the selected (bordered)
  state. Cards render only the elements the data gives them (no badge, no
  variants, etc.).
- The **Plan** step is a set of selectable plan cards (single-select).
- Each expanded step ends with a **Next: …** button that advances to the next step.

**Variant selector**
- Each variant carries **its own quantity**. Red and Black of the same product
  are counted independently.
- The card's stepper is **bound to the active variant** — selecting a color makes
  it active and the stepper shows/edits *that* color's count. Add 2 White, switch
  to Black, and the stepper reads 0 while the 2 White stay untouched.
- The review panel shows **one line per variant with a count > 0**. When more than
  one color of the same product is active, the color label is shown to
  disambiguate; a single active color shows just the product name (matching the
  seed design).

**Review panel (right)**
- Line items grouped under **Cameras / Sensors / Accessories / Plan**, each with a
  thumbnail, name, its own stepper, and pricing.
- Steppers here are **kept in sync** with the cards — changing quantity in either
  place updates the other and recalculates everything. The required *Sense Hub*
  stepper is intentionally locked.
- Shipping row, satisfaction-guarantee badge, financing line, grand total
  (pre-discount struck through), savings callout, **Checkout** (shows a
  confirmation toast — nothing to submit in a prototype), and **Save my system
  for later**.

**Persistence**
- **Save my system for later** writes the current configuration (per-variant
  quantities, active variants, selected plan) to `localStorage`. On reload / a
  return visit the system is restored exactly. Saved data is merged onto a fresh
  seed on load, so adding catalog entries later never breaks an old save.

**Responsive**
- **≥981px** — the Figma two-column layout: builder + sticky sidebar review.
- **621–980px** — single column; the review panel goes **full width** below the
  builder with an internal two-column layout (line items on the left, guarantee +
  returns copy + totals + checkout on the right), matching the wide Figma frame.
- **≤620px** — everything stacks: cards go vertical, the grid is single-column,
  and a **"Let's get started!"** heading appears (mobile only, per the phone
  mockup).

---

## Data model

Everything is driven by [`src/data/catalog.json`](src/data/catalog.json). No
per-product markup is hardcoded. Each step declares its type (`products` or
`plan`), its review-group label, and its items. Each product carries its price,
optional `compareAt`, `variants` (with swatch + label), a `defaultVariant`, and a
`seed` map (`variantId → quantity`) that produces the initial state shown in the
design.

> **Serving the JSON from a backend was the optional bonus** — this build imports
> the local JSON file directly, which the brief states is completely fine.

---

## Notes & decisions / tradeoffs

- **Pricing reconciliation.** The Figma card prices and the review-panel line
  totals aren't internally consistent for *Wyze Cam Pan v3* (the card shows
  ~$34.98 while the review shows $47.98 for qty 2). I treated the review panel's
  numbers as the source of truth because the prominent hero figures — **total
  $187.89, compare $238.81, savings $50.92, financing $19.19/mo** — only add up
  under that interpretation, and they now reproduce exactly. As a result the Pan
  v3 card shows a per-unit price ($23.99) rather than the mockup's $34.98. All
  discount **badges** are kept as literal strings from the design.
- **Prices are per-unit** in the data; the review line total is `unit × qty`, and
  the compare column uses `compareAt` where present. Shipping is a display-only
  FREE row and is deliberately excluded from the total/savings (including it would
  break the $50.92 figure).
- **Financing** is `total / 9.79` (the divisor that yields the design's
  $19.19/mo at the seed total); it recomputes as quantities change.
- **Product images** use the design's real photos (`src/Assets`). The supplied
  Cam v4 render had a "Save 22%" badge baked into the image, which then showed up
  in the small review thumbnail — I painted that badge out so the badge is drawn
  once, consistently, as a card overlay from the data (`badge` field) like every
  other card. Products with no supplied photo (sensors, hub, and the extra
  accessory/plan options) fall back to inline-SVG illustrations.
- **Plan / Sensors / Accessories steps** were fleshed out with a couple of extra
  plausible options beyond what the (collapsed) design shows, so those steps feel
  complete when expanded. The seeded selections still match the design exactly.
- State lives in one small hook (`useSystemStore`) with `localStorage`
  persistence — no external state library, which felt like overkill for this scope.

## Project structure

```
src/
  data/catalog.json          # single source of truth
  state/useSystemStore.js     # state, actions, derived totals, persistence
  components/
    Step.jsx                  # accordion step (header + collapsible body)
    ProductCard.jsx
    PlanCard.jsx
    VariantSelector.jsx
    QuantityStepper.jsx       # shared by cards and review lines
    ReviewPanel.jsx
    ProductImage.jsx          # inline-SVG product art
    icons.jsx                 # step icons + chevron
  utils/format.js
  App.jsx
  styles.css
```
