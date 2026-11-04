<div align="center">

<img src="public/favicon.svg" width="96" alt="DIYAverse diya logo" />

# DIYAverse

### The Living Festival of Lights

**One Light. One Wish. One Connected World.**

*An interactive Diwali experience where every visitor lights a diya, shares a wish, and becomes a point of light in one shared, growing mandala.*

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firestore-optional-ffca28?logo=firebase&logoColor=black)
![Gemini](https://img.shields.io/badge/Gemini-optional-8e75b2?logo=googlegemini&logoColor=white)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)
![Runs offline](https://img.shields.io/badge/Works%20with-zero%20setup-success)

[Quick start](#-quick-start) · [Features](#-features-in-detail) · [Architecture](#-architecture) · [Deploy](#-deployment-free) · [Developer notes](#-developer-notes) · [Pitch & demo](#-pitch--demo-kit)

</div>

---

## 📖 Table of contents

1. [What is DIYAverse?](#-what-is-diyaverse)
2. [The 30-second tour](#-the-30-second-tour)
3. [What makes it different](#-what-makes-it-different)
4. [Features in detail](#-features-in-detail)
5. [Architecture](#-architecture)
6. [Technology stack](#-technology-stack)
7. [Project structure](#-project-structure)
8. [Quick start](#-quick-start)
9. [Environment variables](#-environment-variables)
10. [Firebase setup (optional)](#-firebase-setup-optional)
11. [Gemini setup (optional)](#-gemini-ai-setup-optional)
12. [Deployment (free)](#-deployment-free)
13. [Security & privacy](#-security--privacy)
14. [Accessibility](#-accessibility)
15. [Performance](#-performance)
16. [Testing & quality](#-testing--quality)
17. [Developer notes](#-developer-notes)
18. [Customisation cookbook](#-customisation-cookbook)
19. [Troubleshooting](#-troubleshooting)
20. [Known limitations](#-known-limitations)
21. [Roadmap](#-roadmap)
22. [Pitch & demo kit](#-pitch--demo-kit)
23. [Screenshots](#-screenshots)
24. [Credits & licences](#-credits--licences)

---

## 🪔 What is DIYAverse?

Most festival websites are greetings you *look at*. **DIYAverse is one you take part in.**

A visitor can light a personal digital diya with a wish, write a heartfelt Diwali greeting in **English, Hindi or Bengali**, draw a **symmetrical rangoli**, learn the **five days of Diwali**, and add their light to a **community wall**. Every light on that wall becomes a glowing point in **the Infinity of Light**, a zoomable spiral mandala that grows as more people join.

| | |
|---|---|
| **Product name** | DIYAverse |
| **Tagline** | One Light. One Wish. One Connected World. |
| **Built for** | *Diwali Digital Diya 2026*, organised by GDG on Campus JIS University with the AWS Student Builder Group |
| **Type** | Single-page web app (React SPA) + one optional serverless function |
| **Needs a backend?** | **No.** Firebase and Gemini are optional add-ons. |
| **Cost to run** | Free-tier services only (see [deployment](#-deployment-free) for the caveats) |

> ⚠️ **Affiliation:** DIYAverse is an independent student project. It is **not affiliated with, sponsored by or endorsed by** Google, AWS or GDG.

---

## ⚡ The 30-second tour

```text
Home ──► Light a Diya ──► Wish Studio ──► Rangoli ──► World of Lights ──► Infinity of Light
 │           │                 │             │              │                    │
 │      pick a design,    greeting in     draw with      add your wish      your light joins
 │      write a wish,     3 languages,    live 4–16      to the shared      a mandala you can
 │      watch it ignite   PNG card        fold symmetry  (or local) wall    zoom and explore
 │
 └──► Discover Diwali (countdown, 5-day timeline, traditions, quiz, checklist)
 └──► Festival Night  (fireworks, lanterns, synthesised music, full screen)
 └──► Impact          (real counts only, never invented)
```

---

## 🌟 What makes it different

1. **The Infinity of Light.** A signature visual: each real diya takes a stable seat in a golden-angle spiral, so the mandala *grows without rearranging*. Hover, tap, zoom, pinch, or navigate by keyboard.
2. **Radical honesty.** No fake statistics, no fake community, no fake "AI". Every state is labelled for what it is (see [the honesty rules](#-the-honesty-rules)).
3. **Zero-setup by design.** The whole product works offline in the browser. Cloud services *enhance* it; they never gate it.
4. **Culturally grounded.** Hindi and Bengali are first-class (formal/informal address, correct scripts and fonts), and the Discover page covers regional traditions beyond one narrative.
5. **Polished like a product.** Cinematic intro, hanging festival lights, falling marigold petals, 3D-tilt cards, scroll reveals, synthesised sound, and a one-click switch to turn all decoration off.

---

## 🎨 Features in detail

### 🏠 Home (`/`)
- Skippable cinematic intro (once per session; skipped automatically for reduced-motion users; `Esc`/`Enter`/`Space` also skips).
- Animated hero: hanging **string lights**, falling **marigold petals**, ambient ember particles, pulse rings, a tappable diya that bursts sparks, and a shimmering gold title.
- **Live countdown** to Lakshmi Puja (see [Discover](#-discover-diwali-discover)); during the festival it switches to "Day X of 5".
- **Live numbers strip** (animated count-up): lights on the wall, diyas lit on this device, greetings written here, languages (3). All real.
- **Wish marquee** of latest real wishes, shown only when the wall has at least 3 entries, labelled *shared* or *from this browser only*.
- Teaser of the Infinity of Light (illustrative example, clearly labelled, when the wall is empty).

### 🔥 Light Your Diya (`/light`) — signature interaction
1. Choose a **design**: Clay, Lotus, Brass, Peacock.
2. Enter a **name or nickname** (anonymous is fine).
3. Write a **wish** (3–140 characters).
4. Optionally add a **city/region** (shown in the dashboard only if you share it).
5. Choose a **flame colour**: Golden, Ember, Rose, Teal, Violet.
6. Press **Light My Diya**: the flame ignites with a scale-and-flicker animation and a burst of particles; an optional soft chime plays (sound is **off by default**).

Then: download a **1080×1350 PNG share card**, **share** it (Web Share API with the image attached when the browser allows; clipboard fallback), **add it to the wall**, or **light another**. Your personal collection (up to 100 diyas) is stored on your device and can be revisited or removed.

### ✉️ Wish Studio (`/wishes`)
Generate a personal greeting from:

| Input | Options |
|---|---|
| Sender / recipient name | free text (cleaned, max 40 chars) |
| Relationship | Family, Friend, Partner, Colleague, Teacher/Mentor, Client/Boss |
| Language | English, हिन्दी, বাংলা |
| Tone | Emotional, Heartwarming, Professional, Friendly, Inspirational, Traditional |
| Length | Short, Medium, Long |

- **Two engines, honestly labelled.** If *Try Gemini AI first* is ticked, the app calls `/api/wish`. If that is unavailable (no key, quota, timeout, any error) it silently falls back to the **offline template generator**. The result always carries a badge: **"Written by Gemini"** or **"Written by offline generator (no AI)"**. It never pretends.
- **Grammar-aware offline generator.** 3 languages × 6 tones × 6 relationships × 3 lengths. Colleague/Mentor/Client use formal address (आप / আপনি / "Dear"), others informal (तुम / তুমি). Verb endings, imperatives and possessives change with formality (e.g. *बचा कर रखिएगा* vs *बचा कर रखना*, *রাখবেন* vs *রেখো*).
- **Regenerate** gives a different greeting for identical inputs (seeded PRNG + variation counter), yet is **deterministic per click**.
- **Editable output**: tweak the text and the card preview updates live (debounced).
- **3 card themes** (Midnight Gold, Plum Rose, Lagoon Night), **PNG download** (Hindi/Bengali rendered with proper fonts), **Web Share / clipboard**, **Copy**.

### 🎨 Rangoli Studio (`/rangoli`)
A real drawing tool, not a mock-up.

- **Live rotational symmetry**: 4, 6, 8, 12 or 16-fold, plus optional **mirror** per section.
- **Freehand brush** (2–40 px, any colour, custom colour picker) and **6 motif stamps**: Dot, Petal, Leaf, Star, Diya, Lotus (rotated to point outward).
- **4 designed templates**: Lotus Bloom, Star Mandala, Ring of Diyas, Peacock Fan. Draw on top of them.
- **Undo / Redo** (`Ctrl/⌘+Z`, `Ctrl+Y` / `Ctrl+Shift+Z`), 80-step history, **Clear**.
- **Guides** toggle, **PNG export** (guides excluded; empty canvas is refused with a friendly message).
- **Touch and stylus support** via Pointer Events with pointer capture (`touch-action: none`).
- Fast: committed strokes live on an **offscreen layer**; only the in-progress segment is drawn incrementally.

### 🌍 World of Lights (`/world`)
The community wall.

- Add a light: name, wish, region (optional), diya design, flame colour.
- **Search** (name, wish, region), **colour filter**, **sort** (newest/oldest), **"Show more"** pagination (24 at a time).
- Loading skeletons, empty states, error banners, friendly messages.
- A **Local only** badge on any entry that is not in the shared cloud wall.
- **Anti-abuse**: length limits, link blocking, a profanity blocklist (English + common Hinglish), **20-second cooldown** between submissions.

### ♾️ The Infinity of Light (`/infinity`) — signature visual
A Canvas mandala where **every real diya is a light**.

- **Golden-angle (phyllotaxis) spiral**: light *i* sits at radius `24·√(i+½)` and angle `i·137.5°`, ordered by creation time, so new lights appear without moving old ones.
- **Interactions**: hover tooltip (mouse), click/tap to open a story panel (name, wish, light number, time, region), wheel zoom toward the cursor, drag to pan, **two-finger pinch** zoom, zoom buttons, reset.
- **Keyboard**: focus the canvas, then `←` `→` move between lights (and pan to them), `+` `−` zoom, `0` reset, `Esc` deselect.
- **Colour filter** with real per-colour counts; non-matching lights dim.
- **Honest empty state**: with zero real lights it shows 72 *illustrative* lights with dashed outlines and a visible label "Illustrative example · not real people".

### 🎆 Festival Night (`/night`)
Full-screen night sky: tap anywhere to launch a firework, **Celebrate** button for a 14-rocket show, **Auto show**, floating **lanterns**, stars, and **full-screen mode**.
Audio is **synthesised in the browser** (Web Audio API) so there are no licensing concerns: a pentatonic *music* loop with a tanpura-style drone, a wind-and-bells *ambience*, and firework *effects*. All **off by default**, each independently toggleable.

### 📊 Impact (`/impact`)
Counts computed from real data only: lights on the wall, wishes shared, additions in the last 24 hours / 7 days, breakdown by flame colour, diya design and region (only regions people volunteered). A separate **On this device** section shows your private counters. With no data it shows zeros and an empty state, never invented numbers. The heading changes between *"Community wall (shared, live)"* and *"Wall in this browser (local demo)"*.

### 📚 Discover Diwali (`/discover`)
- **Live countdown** to the start of Lakshmi Puja day (local time) with animated digits.
- **Five-day interactive timeline** (accessible tabs): Dhanteras, Naraka Chaturdashi, Lakshmi Puja, Govardhan Puja, Bhai Dooj, each with date, status chip ("Today / Tomorrow / In N days"), meaning and customs. Today's day is preselected during the festival.
- **7 regional tradition flip-cards**: Return of Rama (Ayodhya), Kali Puja (Bengal/Odisha/Assam), Chopda Pujan (Gujarat), Deepavali at dawn (South India), Bandi Chhor Divas (Sikh), Jain Diwali, Tihar (Nepal). They turn on hover, keyboard focus and tap.
- **8-question quiz** with per-answer explanations, progress bar, score verdict and a **best score** saved on-device.
- **Preparation checklist** (9 items) with animated progress, saved on-device.
- **"Celebrate with care"**: 6 practical tips (clay diyas, natural rangoli, LEDs, firecracker impact, lamp safety, pets).

> **2026 festival dates used:** Dhanteras **6 Nov**, Naraka Chaturdashi **7 Nov**, Lakshmi Puja **8 Nov**, Govardhan Puja **9 Nov**, Bhai Dooj **10 Nov**. These follow commonly published calendars; exact days and timings vary by region and panchang, and the UI says so.

### ✨ Motion & polish (everywhere)
Hanging string lights · falling petals · mouse sparkle trail · 3D tilt cards with a moving highlight · scroll-reveal · animated counters · shimmer sweep on primary buttons · lift-on-hover cards · shimmering title · page-transition fades · pulse rings · flip cards.
A **header sparkle button** turns all *decorative* effects off (remembered). With the OS **reduce motion** setting on, effects are off automatically and the button is disabled.

### 🧭 Other pages
- **About** (`/about`): how it works, the technology and *why* each piece was chosen, the honesty principles, competition acknowledgement.
- **404** (`*`): a themed "This diya isn't lit yet" page with links back.

---

## 🧱 Architecture

### System overview

```mermaid
flowchart LR
  subgraph Browser["Browser (React SPA, static files)"]
    UI["Pages & components"]
    CTX["DiyaContext (single data layer)"]
    LS[("localStorage / sessionStorage")]
    CV["Canvas engines: mandala, rangoli, fireworks, particles, cards"]
    AU["Web Audio synth"]
    OFF["Offline greeting generator"]
  end
  subgraph Google["Google (optional)"]
    FS[("Firestore: diyas")]
    GM["Gemini API"]
  end
  subgraph Vercel["Vercel"]
    ST["Static hosting"]
    FN["/api/wish function"]
  end

  UI --> CTX
  CTX --> LS
  CTX -. "only if VITE_FIREBASE_* set" .-> FS
  UI --> CV
  UI --> AU
  UI -- "POST /api/wish" --> FN
  FN -- "GEMINI_API_KEY (server only)" --> GM
  FN -. "503 if no key" .-> UI
  UI -- "any failure" --> OFF
  ST --> Browser
```

### Data layer and the honest status machine

All shared data flows through one React context, `src/lib/DiyaContext.tsx`.

```mermaid
stateDiagram-v2
  [*] --> local: Firebase not configured
  [*] --> connecting: Firebase configured
  connecting --> connected: first SERVER snapshot (not cache)
  connecting --> error: SDK load fails / 10 s timeout / listener error
  connected --> error: listener error
  local --> local: wall = localStorage only
  error --> error: wall falls back to local
```

| Status | Badge text | Wall source | Meaning |
|---|---|---|---|
| `local` | Local demo mode | `localStorage` | Firebase env vars absent |
| `connecting` | Connecting… | skeletons | SDK loading / waiting for server |
| `connected` | Firestore connected | Firestore (latest 300) | **Only after a real server snapshot** (`!snap.metadata.fromCache`) |
| `error` | Cloud unreachable · local demo | `localStorage` | Timeout, bad rules, SDK failure |

### Submit flow

```mermaid
sequenceDiagram
  participant U as User
  participant C as DiyaContext
  participant S as sanitize.ts
  participant F as Firestore
  participant L as localStorage
  U->>C: submitToWall(name, wish, region…)
  C->>S: cleanText + validateEntry
  S-->>C: ok / first error
  C->>C: 20 s cooldown check
  alt status = connected
    C->>F: addDoc(diyas, {…, createdAt: serverTimestamp()})
    F-->>C: onSnapshot pushes new list
  else any other status
    C->>L: save to local wall (source: "local")
  end
  C-->>U: "Added to shared wall" or "Added in local demo mode"
```

### Wish Studio pipeline

```mermaid
flowchart TD
  A[Generate pressed] --> B{Try Gemini ticked?}
  B -- no --> G[Offline generator]
  B -- yes --> C[POST /api/wish, 12 s timeout]
  C -- 200 + source=gemini + text >= 10 chars --> D[Show text, badge: Written by Gemini]
  C -- 503 / 429 / 502 / timeout / bad shape --> E[Note: Gemini unavailable]
  E --> G
  G --> H[Seeded template build]
  H --> I[Badge: Written by offline generator, no AI]
  D --> J[Editable textarea + card canvas]
  I --> J
```

### Infinity of Light rendering

```mermaid
flowchart LR
  P[points sorted by createdAt] --> S["seat(i): r = 24·√(i+½), θ = i·137.5°"]
  S --> V[Viewport culling]
  V --> D["drawImage(prebuilt glow sprite per colour)"]
  D --> R[requestAnimationFrame loop]
  R -->|tab hidden| X[pause]
  R -->|reduced motion| Y[repaint only when dirty]
```

---

## 🛠 Technology stack

| Layer | Choice | Why |
|---|---|---|
| UI | **React 19** + **TypeScript 6** (strict) | Typed, component-based, lazy routes |
| Build | **Vite 8** | Fast dev server, manual chunking, tiny config |
| Styling | **Tailwind CSS 4** (`@theme` tokens) + hand-written CSS for motion | Consistent design system, accessible focus rings |
| Animation | **Framer Motion 14** (UI) + raw **Canvas 2D** (heavy visuals) | Declarative UI motion; canvas for 60 fps particle/mandala work |
| Icons | **Lucide React** | Consistent, tree-shaken SVG icons |
| Routing | **React Router 7** | Lazy-loaded route chunks, SPA fallback |
| Audio | **Web Audio API** (no files) | Original, licence-free sound |
| Cloud (optional) | **Firebase Firestore** | Real-time listeners suit a live wall; lazy-loaded |
| AI (optional) | **Gemini API** via Vercel Function | Key stays server-side |
| Hosting | **Vercel** | Free Hobby tier, serverless function, SPA rewrites |
| Lint | **ESLint 10** + typescript-eslint + react-hooks | Rules-of-hooks enforced |

**Why not AWS?** One well-built, honest integration beats two decorative ones. Firestore's real-time listeners fit a live wall, and Gemini fits the generator. The data layer is isolated behind `src/lib/firebase.ts` / `DiyaContext`, so a Lambda + DynamoDB adapter would be a contained future change. **Nothing in this project claims AWS integration.**

---

## 🗂 Project structure

```text
diyaverse/
├── api/
│   └── wish.ts                 Vercel Function: POST /api/wish → Gemini (server-side key)
├── public/
│   ├── favicon.svg             Brand diya icon
│   └── og-image.svg            Open Graph / social preview art (1200×630)
├── src/
│   ├── main.tsx                Providers: Router → Effects → Toast → Diya
│   ├── App.tsx                 Lazy routes + Suspense loading screen
│   ├── components/
│   │   ├── Layout.tsx          Sticky nav, mobile menu, effects toggle, footer, page transition
│   │   ├── Diya.tsx            Renders the SVG diya (fixed palette only)
│   │   ├── InfinityCanvas.tsx  The mandala engine (zoom/pan/pinch/hover/keyboard)
│   │   ├── ParticleField.tsx   Ambient embers + burst API (imperative handle)
│   │   ├── motion.tsx          Reveal, CountUp, TiltCard, StringLights, Petals, SparkleTrail
│   │   ├── Countdown.tsx       Live countdown + festival-day mode
│   │   ├── CloudBadge.tsx      Truthful storage-status indicator
│   │   ├── Toast.tsx           Accessible toast queue (aria-live)
│   │   └── Logo.tsx            Wordmark + mark
│   ├── pages/                  Home · Discover · LightDiya · WishStudio · RangoliStudio
│   │                           World · Infinity · FestivalNight · Impact · About · NotFound
│   ├── lib/
│   │   ├── DiyaContext.tsx     ★ Single data layer + status machine + cooldown + validation
│   │   ├── EffectsContext.tsx  Decorative-effects preference (respects reduced motion)
│   │   ├── firebase.ts         Lazy Firestore adapter (`loadCloud`) + `isFirebaseConfigured`
│   │   ├── wishes.ts           Offline greeting engine (en/hi/bn), seeded variation
│   │   ├── rangoli.ts          Symmetry drawing engine, motifs, templates
│   │   ├── cards.ts            Canvas share-card renderers (diya card, greeting card)
│   │   ├── diyaSvg.ts          Procedural SVG diya (4 designs × 5 flames, lit/unlit)
│   │   ├── audio.ts            Web Audio synth: chime, boom, music, ambience
│   │   ├── sanitize.ts         cleanText, validateEntry, blocklist, limits
│   │   ├── share.ts            PNG download, Web Share with clipboard fallback
│   │   ├── storage.ts          Safe localStorage wrappers + storage keys
│   │   ├── time.ts             "x min ago" formatter
│   │   └── types.ts            Shared types
│   ├── data/
│   │   ├── diwali.ts           ★ Festival days, traditions, quiz, tips, checklist, date helpers
│   │   ├── palette.ts          Flame colours, diya designs, rangoli colours
│   │   └── sample.ts           Clearly-labelled illustrative lights
│   ├── hooks/useReducedMotion.ts
│   └── styles/index.css        Design tokens (@theme) + motion/hover CSS
├── firestore.rules             Create-only, schema-validated rules
├── firebase.json               Points the Firebase CLI at the rules
├── vercel.json                 SPA rewrite (keeps /api/*) + security headers
├── .env.example                All variables, no secrets
├── DEPLOYMENT.md  FIREBASE_SETUP.md  TESTING.md  PROJECT_PITCH.md
└── README.md                   (you are here)
```

**Size:** about **5,400 lines** of TypeScript/TSX across 40+ source files.

### Routes

| Path | Page | Lazy chunk |
|---|---|---|
| `/` | Home | no (entry) |
| `/discover` | Discover Diwali | yes |
| `/light` | Light Your Diya | yes |
| `/wishes` | Wish Studio | yes |
| `/rangoli` | Rangoli Studio | yes |
| `/world` | World of Lights | yes |
| `/infinity` | Infinity of Light | yes |
| `/night` | Festival Night (nav/footer hidden) | yes |
| `/impact` | Light Impact dashboard | yes |
| `/about` | About | yes |
| `*` | Custom 404 | yes |

---

## 🚀 Quick start

**Requirements:** Node.js **20+** (developed on Node 22) and npm.

```bash
# 1. get the code, then inside the project folder:
npm install          # install dependencies
npm run dev          # start the dev server → http://localhost:5173
```

That's it. No keys, no accounts, nothing else. The app starts in **Local demo mode**.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with hot reload (does **not** serve `/api/wish`) |
| `npm run typecheck` | `tsc -b --noEmit`, strict TypeScript check |
| `npm run lint` | ESLint over the project |
| `npm run build` | Type-check then production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npx vercel dev` | Run the app **and** `/api/wish` together (needs a Vercel login) |

### Windows PowerShell

```powershell
node -v                      # should print v20 or newer
npm install                  # install libraries
npm run dev                  # open the printed http://localhost:5173
npm run typecheck ; npm run lint ; npm run build   # run before every push
```

---

## 🔐 Environment variables

Copy `.env.example` to `.env.local` (never commit it). **Everything is optional.**

| Variable | Where it runs | Required? | Purpose |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | Browser | for shared wall | Firebase web config |
| `VITE_FIREBASE_AUTH_DOMAIN` | Browser | for shared wall | Firebase web config |
| `VITE_FIREBASE_PROJECT_ID` | Browser | for shared wall | Firebase web config |
| `VITE_FIREBASE_STORAGE_BUCKET` | Browser | for shared wall | Firebase web config |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Browser | for shared wall | Firebase web config |
| `VITE_FIREBASE_APP_ID` | Browser | for shared wall | Firebase web config |
| `GEMINI_API_KEY` | **Server only** (Vercel Function) | for AI greetings | Gemini access |
| `GEMINI_MODEL` | Server only | no | Overrides the default `gemini-3.5-flash-lite` |

> 🔑 **Firebase `VITE_*` values are public identifiers by design**: they are bundled into the site. Your data is protected by `firestore.rules`, not by hiding these.
> 🚫 **`GEMINI_API_KEY` must never be prefixed with `VITE_`**, or it would be compiled into public JavaScript. `VITE_*` variables are read at **build time**: change one and you must rebuild/redeploy.

`isFirebaseConfigured` is true only when `API_KEY`, `PROJECT_ID` **and** `APP_ID` are all present.

---

## 🔥 Firebase setup (optional)

Skip this and the app works in local demo mode. Do it for a **real shared wall**.

> **Cost note:** The no-cost Spark plan has a **daily** Firestore quota (Firebase's pricing-plans page cites 50,000 reads and 20,000 writes/day as an example; confirm current numbers at <https://firebase.google.com/pricing>). Exceeding a Spark quota can shut that product off until it resets. **Do not link a billing account** unless you intend to pay: doing so upgrades the project to Blaze. Plans change, so always re-check.

1. <https://console.firebase.google.com> → **Add project** (analytics can be off).
2. **Build → Firestore Database → Create database** → pick a nearby region → **production mode**.
3. **Project settings → Your apps → Web (`</>`)** → register an app → copy the config values.
4. Put them in `.env.local` as `VITE_FIREBASE_*`.
5. **Publish the rules**: Firestore → **Rules** → paste `firestore.rules` → **Publish**.
   *(CLI alternative: `npm i -g firebase-tools`, `firebase login`, `firebase use <project-id>`, `firebase deploy --only firestore:rules`.)*
6. Run `npm run dev`, open **World of Lights**: the badge turns **"Firestore connected"** after a real server response. Add a light and confirm a document appears under `diyas`.
7. On Vercel, add the same six variables and **redeploy**.

### Firestore data model

Collection **`diyas`**, one document per light:

| Field | Type | Rules |
|---|---|---|
| `name` | string | 1–24 chars |
| `wish` | string | 3–140 chars |
| `design` | string | one of `clay`, `lotus`, `brass`, `peacock` |
| `color` | string | one of `gold`, `ember`, `rose`, `teal`, `violet` |
| `createdAt` | timestamp | must equal `request.time` (server timestamp) |
| `region` | string, optional | ≤ 30 chars |

### Security rules summary

- **Anyone can read** `diyas`.
- **Anyone can create** one document **only if** it has exactly the allowed fields (`hasAll` required + `hasOnly` allowed), valid types and lengths, allowed enum values and a **server** timestamp.
- **Nobody can update or delete.**
- **Everything else is denied** (`match /{document=**}` → `false`).

### Troubleshooting Firebase

| Symptom | Likely cause |
|---|---|
| Badge stays "Local demo mode" | `.env.local` missing/misnamed, or dev server not restarted |
| "Cloud unreachable · local demo" | Wrong project ID, Firestore not created, or network blocked (10 s timeout) |
| "Firestore rejected the request (check security rules)" | Rules not published, or a write failed validation |
| Adding a light fails | The rules require `createdAt == request.time`; the client sends `serverTimestamp()`. Change both together or neither |

---

## 🤖 Gemini AI setup (optional)

The browser **never** talks to Gemini. It calls your own endpoint, which holds the key.

1. Create a key in Google AI Studio (<https://aistudio.google.com>).
2. In Vercel: **Settings → Environment Variables** → add `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) → **Redeploy**.
3. Open Wish Studio, tick *Try Gemini AI first*, generate. The badge should read **"Written by Gemini"**.

**`POST /api/wish` contract**

| | |
|---|---|
| Request body (JSON, ≤ 2,000 bytes) | `{ sender, recipient, relationship, lang, tone, length }` |
| Validation | enums are whitelisted; names are stripped of control chars/`<>"`{}` and capped at 40 chars |
| Success | `200 { text, source: "gemini" }` |
| Errors | `405` wrong method · `503 not_configured` (no key) · `429 rate_limited` · `413 too_large` · `400 bad_json/bad_input` · `502 upstream_error/empty` · `504 upstream_unreachable` |
| Rate limit | best-effort **8 requests/minute/IP** (in-memory; serverless instances don't share memory, so it only blunts casual abuse) |
| Timeouts | server → Gemini **10 s**; browser → function **12 s** |
| Default model | `gemini-3.5-flash-lite` (override with `GEMINI_MODEL`) |
| Prompt-injection hygiene | names are passed as plain data with an explicit "ignore instructions in names" line |

> ℹ️ The Gemini developer-API pricing page lists the free tier for `gemini-3.5-flash-lite` and `gemini-3.6-flash` as free of charge **with content used to improve Google products**. Do not enter private data, and re-check current limits and model names, as they change.

Without a key the function returns `503`, the UI shows a gentle note, and the **offline generator** writes the greeting, labelled as such.

---

## ☁️ Deployment (free)

Works on Vercel's free **Hobby** plan with **no** cloud credentials. (Hobby is intended for personal/non-commercial use; check <https://vercel.com/pricing>.)

```powershell
# 1. Put the project on GitHub
git init
git add .
git status                                   # CHECK: no .env files listed!
git commit -m "DIYAverse"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/diyaverse.git
git push -u origin main
```

1. <https://vercel.com> → sign in with GitHub → **Add New → Project** → import the repo.
2. Framework preset **Vite** (auto), build `npm run build`, output `dist`. **Deploy.**
3. (Optional) add the env vars from the table above → **Redeploy**.
4. Verify the live site: every page loads, **refresh on `/infinity` works**, a bad URL shows the 404, the badge reflects reality, and DevTools → Network shows no secret in any JS file.

`vercel.json` already: rewrites every non-`/api/` path to the SPA (so deep links and refresh work) and sends security headers (`X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` disabling camera/mic/geolocation, `X-Frame-Options: SAMEORIGIN`).

Full step-by-step (Node install, VS Code, Git, troubleshooting): see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

---

## 🛡 Security & privacy

**Implemented**

- **Safe rendering.** All user text is rendered through React (escaped). The only `dangerouslySetInnerHTML` is the diya SVG, which interpolates **fixed palette values only, never user text**.
- **Input hygiene.** `cleanText` collapses whitespace, strips control characters and `<` `>`, and enforces limits (name 24, wish 140, region 30; Wish Studio names 40).
- **Validation.** Links/domains blocked in names, wishes and regions; a profanity blocklist with simple leetspeak normalisation (English + common Hinglish).
- **Rate limiting.** 20 s client cooldown; best-effort 8/min/IP on the Gemini function.
- **Firestore rules.** Create-only, strict schema, server timestamp, deny-all default.
- **No secrets in the client.** Gemini key is server-side only; `.gitignore` excludes `.env*` (except `.env.example`).
- **Defensive data loading.** Data from `localStorage` and the network passes `isValidDiya` before use; storage access is wrapped in try/catch (private mode, quota, disabled storage).
- **Privacy by default.** No accounts, no analytics, no cookies. Names can be nicknames. Region is optional. Your collection, stats, checklist and quiz score live only in your browser.

**Honest caveats (please read)**

- The blocklist is a **courtesy filter, not real moderation**. Rules can enforce *shape and size* but not *content*. For a public launch add a review/report flow.
- Public create-only writes **can be spammed**. The client cooldown is bypassable. **Firebase App Check** or a moderated function is the proper next step.
- Free-tier Gemini content may be used by Google to improve its products.
- The in-memory function rate limit is per instance, not global.

### 🧾 The honesty rules

These are enforced in code, not just in copy:

| Claim the UI could make | What actually happens |
|---|---|
| "Connected to the cloud" | Shown **only** after a Firestore **server** snapshot (not cache) |
| "Community" numbers | Counted from real documents; zero is shown as zero |
| Sample lights in the mandala | Dashed outlines + "Illustrative example · not real people" label |
| "AI-written greeting" | Badge says Gemini **only** if the endpoint actually answered `source: "gemini"` |
| Local entries | Marked **Local only**; never described as globally visible |
| Festival dates | Shown with a regional-variation disclaimer |
| Affiliation | Explicit non-affiliation notice in footer and About |

---

## ♿ Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), a **skip-to-content** link, one `h1` per page.
- Visible **focus rings** (`:focus-visible`), keyboard-operable everything, including the mandala (`←/→/+/−/0/Esc`) and rangoli undo/redo shortcuts.
- ARIA: `aria-pressed` on toggles, `aria-live` for toasts/results/quiz feedback, `role="tablist"` timeline, `role="timer"` countdown, `role="progressbar"` checklist, labelled canvases, `aria-invalid` + described errors on forms.
- **Reduced motion**: respects `prefers-reduced-motion` (intro skipped, particles/petals/lights/tilt/trail disabled, durations clamped, Infinity canvas repaints only on change, gentler fireworks).
- **User override**: header **Effects** toggle for anyone who finds decoration distracting.
- Sound is **opt-in** and never autoplays.
- Colour is never the only signal (labels accompany every colour filter and status).
- No horizontal overflow at 390 px phone width (checked on every route).

> Formal screen-reader and Lighthouse audits have **not** been run yet. See [Testing](#-testing--quality).

---

## ⚙️ Performance

Production build (gzip sizes from the last build):

| Chunk | Raw | Gzip | Loaded |
|---|---|---|---|
| App entry (React, router, home) | 316 kB | **103 kB** | always |
| Framer Motion | 145 kB | **49 kB** | always |
| Firebase SDK | 610 kB | 182 kB | **only if Firebase is configured** (dynamic import) |
| Wish Studio (incl. 3-language templates) | 29.6 kB | 9.5 kB | on visit |
| Discover | 15.3 kB | 5.1 kB | on visit |
| Rangoli | 12.8 kB | 4.9 kB | on visit |
| Other pages | 1–11 kB each | 0.5–4 kB | on visit |
| CSS | 50.8 kB | 9.9 kB | always |

**Techniques:** route-level code splitting, Firebase lazy import, manual vendor chunks, **pre-rendered glow sprites** (one per colour) instead of per-frame gradients, **viewport culling**, DPR capped at 2, loops **pause when the tab is hidden**, the sparkle-trail loop **sleeps when there are no sparks**, offscreen layer for the rangoli, memoised SVG diya, no image assets (all art is SVG/Canvas/CSS).

---

## ✅ Testing & quality

**Automated checks (all passing at the last run)**

```bash
npm run typecheck     # strict TypeScript, no errors
npm run lint          # ESLint, no errors/warnings
npm run build         # production build succeeds
```

**Browser smoke test (headless Chromium via Playwright, desktop 1280 px + phone 390 px)**

- No uncaught page errors on any of the 11 routes.
- No horizontal overflow on any route at either width.
- End-to-end flows completed: light a diya → add to wall (marked *Local only*) → generate a greeting (labelled *offline generator*) → load a rangoli template → run the 8-question quiz → tick the checklist (progress updates) → toggle effects off.
- The only console noise in the sandbox was Google Fonts being blocked and `/api/wish` returning 404 on the plain preview server (the expected fallback path).

**Not yet covered (do these before submitting)**

- Automated unit/integration tests (none are written).
- Real-device touch testing (iOS Safari, Android Chrome).
- A real Firestore connection and a real Gemini call (no credentials were available during development).
- Screen-reader walkthrough and Lighthouse scores.
- Native-speaker review of the Hindi and Bengali templates.

Full manual checklist: **[TESTING.md](TESTING.md)**.

---

## 👩‍💻 Developer notes

### Design system

Defined as Tailwind v4 `@theme` tokens in `src/styles/index.css`:

| Token | Value | Use |
|---|---|---|
| `night-950 / 900 / 800 / 700` | `#070618 / #0b0a24 / #14123a / #1f1b52` | Backgrounds, panels |
| `plum-600` | `#4a2a8a` | Accent gradients |
| `gold-300 / 400 / 500` | `#ffe08a / #ffc95c / #f7a928` | Primary accent, CTAs |
| `amber-600`, `ember` | `#e07b12`, `#ff6a3d` | Warm accents |
| `rose-diya`, `teal-diya` | `#ff4d8d`, `#3fd6c4` | Flame/rangoli colours |
| `ink-100 / 300 / 400` | `#fff6e2 / #d6cdf0 / #b4aad6` | Text hierarchy |

Fonts: **Cormorant Garamond** (display), **Plus Jakarta Sans** (UI), **Hind** (Devanagari), **Noto Sans Bengali**, loaded from Google Fonts with a system-serif fallback. Reusable classes: `.panel`, `.btn-gold`, `.btn-ghost`, `.field`, `.lbl`, `.gold-text`, `.shimmer-text`, `.tilt`, `.panel-hover`, `.flip`, `.marquee`.

### Key engineering decisions

1. **One data context.** UI never touches Firestore or `localStorage` directly. `DiyaContext` decides *where* data lives and *what to tell the user*. Swapping the backend (e.g. to AWS) means changing one adapter.
2. **Status is derived from evidence, not configuration.** "Configured" ≠ "connected". The `connecting → connected` transition waits for a **server** snapshot; a 10 s timer flips to `error` so the UI never hangs.
3. **Cloud data never shows in local mode and vice-versa.** `community = cloudLive ? cloudItems : localWall`, avoiding mixed or misleading lists.
4. **Stable seating for the mandala.** Using creation order for the phyllotaxis index means new lights never move existing ones, so the visual *grows* rather than *reshuffles*.
5. **Canvas outside React's render loop.** Engines keep mutable state in refs and a single rAF loop, with React only supplying props, avoiding per-frame re-renders.
6. **Fonts before export.** Card renderers `await document.fonts.load(...)` so PNG cards use the right Devanagari/Bengali faces instead of a fallback.
7. **Procedural diya SVG.** One function builds 4 designs × 5 flames × lit/unlit with unique gradient IDs per instance (avoids ID collisions when many diyas are on one page) and doubles as the source for PNG cards via `Blob` → `Image`.
8. **Template-based multilingual generation with agreement.** Rather than concatenating fragments, each tone's lines are functions of formality (`f`), so verb forms and pronouns agree.
9. **Reduced motion is a first-class path**, not an afterthought: both the CSS media query and the `EffectsContext` honour it, and the canvas loops adapt.

### Storage keys (browser)

| Key | Storage | Contents |
|---|---|---|
| `diyaverse.mine.v1` | local | Your diya collection (≤ 100) |
| `diyaverse.localWall.v1` | local | Local-demo wall (≤ 200) |
| `diyaverse.stats.v1` | local | `{diyasLit, wishesGenerated, rangoliSaved}` |
| `diyaverse.lastSubmit.v1` | local | Timestamp for the 20 s cooldown |
| `diyaverse.effects.v1` | local | Decorative effects on/off |
| `diyaverse.checklist.v1` | local | Ticked checklist item ids |
| `diyaverse.quizBest.v1` | local | Best quiz score |
| `diyaverse.introSeen` | session | Intro already shown this session |

### Lessons learned / gotchas

- **TypeScript 6 deprecates `baseUrl`.** Use `"paths": { "@/*": ["./src/*"] }` without `baseUrl`.
- **Vercel Functions** use the Web-standard `export default { fetch(request) {…} }` shape for TypeScript files in `/api` (verified in Vercel's docs). `npm run dev` doesn't run them: use `npx vercel dev`.
- **Gemini REST** uses `x-goog-api-key` (header) against `.../v1beta/models/{model}:generateContent`. Model names change; keep `GEMINI_MODEL` configurable.
- **Shadowing `Infinity`.** A component named `Infinity` shadows the JS global and breaks lint, so the page is imported as `InfinityPage`.
- **SVG animation transform origin** needs `transform-box: fill-box` for the flame to flicker from its base.
- **`.lbl` on `<legend>`.** Labels styled as `label.lbl` miss `<legend>` elements; the selector is `.lbl`.
- **Don't `pkill -f` a pattern that matches your own shell** in scripted tests.
- **Flip cards** are `<button>`s so they're keyboard- and touch-accessible; the back text is also in `aria-label`.

---

## 🧰 Customisation cookbook

| I want to… | Do this |
|---|---|
| **Update festival dates for next year** | Edit `DIWALI_DAYS[*].date` in `src/data/diwali.ts`. The countdown targets `DIWALI_DAYS[2]` (Lakshmi Puja) |
| **Add a quiz question** | Append to `QUIZ` in `src/data/diwali.ts` `{q, options[4], answer (index), why}` |
| **Add a regional tradition** | Append to `TRADITIONS` (shown automatically as a flip card) |
| **Add a checklist item** | Append to `CHECKLIST` with a unique `id` |
| **Add a flame colour** | Add to `FlameColor` in `types.ts`, `FLAMES` in `palette.ts`, **and** the `color in [...]` list in `firestore.rules` |
| **Add a diya design** | Add to `DiyaDesign`, `DESIGNS`, a `case` in `bowl()` in `diyaSvg.ts`, **and** `design in [...]` in `firestore.rules` |
| **Add a greeting language** | Add to `Lang` and `LANGS`, create a `Pack` in `wishes.ts`, extend `LANGS` in `api/wish.ts`, and add a heading + font in `cards.ts` |
| **Add a tone / relationship** | Extend the types, every `Pack.body`/`closing`, `TONES`/`RELATIONSHIPS`, and the whitelists in `api/wish.ts` |
| **Add a rangoli template** | Push `{key,label,build}` to `TEMPLATES` in `rangoli.ts` using `free()`, `stamp()`, `petal()`, `arc()` |
| **Add a rangoli motif** | Add to `Motif`, `MOTIFS`, and a `case` in `motifPath()` |
| **Change limits** | `LIMITS` in `sanitize.ts` **and** the size checks in `firestore.rules` (keep them in sync) |
| **Change the cooldown** | `COOLDOWN_MS` in `DiyaContext.tsx` |
| **Tune the mandala density** | `SPACING` in `InfinityCanvas.tsx` |
| **Change the Firestore wall size** | `fs.limit(300)` in `firebase.ts` |
| **Use a different Gemini model** | Set `GEMINI_MODEL` in Vercel and redeploy |
| **Add a page** | Create `src/pages/X.tsx`, lazy-import it and add a `<Route>` in `App.tsx`, add it to `NAV` and `TITLES` in `Layout.tsx` |

---

## 🩺 Troubleshooting

| Problem | Fix |
|---|---|
| `npm` / `node` not recognised (Windows) | Reopen PowerShell after installing Node LTS |
| Blank page after deploy | Run `npm run build` locally and fix any error; check the Vercel build log |
| 404 on refresh at `/world` | `vercel.json` must be committed (SPA rewrite) |
| Env var change has no effect | `VITE_*` are build-time: **redeploy** |
| Gemini always falls back | Missing/invalid key, quota hit, model renamed, or you're on `npm run dev` (no `/api`); use `npx vercel dev` or check function logs |
| Hindi/Bengali looks wrong in PNG | Web fonts didn't load (offline/blocked); reload on a normal connection |
| Sound doesn't play | Browsers require a user gesture; toggle sound/music on, then interact |
| No sparkles/petals | Effects toggle is off, or your OS has *reduce motion* enabled (by design) |
| Firestore permission error | Publish `firestore.rules` (see Firebase troubleshooting) |
| Wall empty after clearing site data | Local demo data lives in `localStorage` and is gone when cleared |

---

## 🚧 Known limitations

- **Moderation** is client-side and basic; Firestore rules can't judge content. Public writes can be spammed (App Check recommended).
- **Hindi/Bengali offline greetings** are carefully templated for agreement and formality but should be **reviewed by native speakers**.
- **Festival dates/timings** vary by region and panchang; the app uses commonly published 2026 dates and says so.
- **Local demo wall** is per-browser: it is explicitly **not** a community.
- **Scale:** the wall loads the latest **300** lights; the mandala is tuned for a few thousand points at most. Beyond that, aggregate or tile.
- **Free quotas are finite and daily** (Firestore, Gemini). Heavy traffic can exhaust them.
- **PNG cards** need web fonts; offline they use system fonts.
- **Web Share with files** isn't supported everywhere; the fallback copies text to the clipboard.
- **No automated tests, no formal accessibility audit, no real-device matrix yet.**
- **Rate limit on `/api/wish`** is per serverless instance, not global.

---

## 🗺 Roadmap

- [ ] Moderation queue + report button; Firebase **App Check**
- [ ] Shareable deep link to a single light (`/infinity?light=ID`)
- [ ] Region map (opt-in) on the Impact page
- [ ] PWA: installable, offline-first shell
- [ ] Native-speaker-reviewed language packs; add Tamil, Gujarati, Marathi, Punjabi
- [ ] Unit tests (sanitiser, wish generator agreement, rangoli maths) + Playwright E2E in CI
- [ ] Lighthouse + axe accessibility pass; screen-reader walkthrough
- [ ] Optional AWS adapter (Lambda + DynamoDB) behind the existing data-layer interface
- [ ] Download the whole mandala as a high-resolution poster
- [ ] Time-lapse replay of the mandala growing

---

## 🎤 Pitch & demo kit

Full kit (30-second intro, 60-second demo, 2-minute technical talk, **10 judge Q&As**, submission checklist): **[PROJECT_PITCH.md](PROJECT_PITCH.md)**.

**30-second intro:** *"Most Diwali websites are greetings you look at. DIYAverse is one you take part in. You light a diya with your own wish, craft a greeting in English, Hindi or Bengali, draw a rangoli, and your light joins a shared mandala, the Infinity of Light. It runs with zero setup, uses Google Firestore and Gemini when configured, and never fakes what it can't do."*

**60-second demo path**

| Time | Step |
|---|---|
| 0:00 | **Home**: tap the diya, point at the countdown |
| 0:12 | **Light a diya**: Peacock + Teal, write a wish, ignite |
| 0:24 | **Wish Studio**: Hindi, Heartwarming → show the honest "Written by…" badge and card |
| 0:36 | **Rangoli**: load *Lotus Bloom*, draw one stroke to show live symmetry |
| 0:44 | **World**: add to the wall, badge says *Firestore connected* |
| 0:50 | **Infinity of Light**: your light appears, hover and zoom |
| 0:58 | **Close**: "Every number and label here is real, and it still works offline." |

---

## 🖼 Screenshots

Add images to `docs/screenshots/` and they will render below (suggested set):

| File | Capture |
|---|---|
| `docs/screenshots/01-home.png` | Home hero with string lights and countdown |
| `docs/screenshots/02-light.png` | A lit diya with its share card |
| `docs/screenshots/03-wishes.png` | Wish Studio with a Hindi greeting card |
| `docs/screenshots/04-rangoli.png` | Rangoli Studio with *Lotus Bloom* |
| `docs/screenshots/05-infinity.png` | The mandala with several lights and a story open |
| `docs/screenshots/06-discover.png` | Five-day timeline |
| `docs/screenshots/07-night.png` | Festival Night fireworks |

```markdown
![Home](docs/screenshots/01-home.png)
![Rangoli Studio](docs/screenshots/04-rangoli.png)
![Infinity of Light](docs/screenshots/05-infinity.png)
```

---

## 🙏 Credits & licences

- **Code:** original work for this project. Add a `LICENSE` file before publishing (MIT is a common choice for competition projects).
- **Fonts:** Cormorant Garamond, Plus Jakarta Sans, Hind, Noto Sans Bengali (SIL Open Font License, via Google Fonts).
- **Icons:** [Lucide](https://lucide.dev) (ISC).
- **Libraries:** React, Vite, Tailwind CSS, Framer Motion, React Router, Firebase JS SDK (see `package.json` for each licence).
- **Artwork & audio:** all original. Illustrations are generated SVG/Canvas/CSS; all sound is synthesised in the browser. **No third-party images or audio are bundled.**
- **Cultural content:** summarised from widely published sources about Diwali; regional customs vary and this app doesn't claim to be authoritative. Corrections are welcome.

**Docs index:** [DEPLOYMENT.md](DEPLOYMENT.md) · [FIREBASE_SETUP.md](FIREBASE_SETUP.md) · [TESTING.md](TESTING.md) · [PROJECT_PITCH.md](PROJECT_PITCH.md) · [.env.example](.env.example)

---

<div align="center">

**🪔 Happy Diwali! Light one, and let it join the rest. 🪔**

*DIYAverse · Built for Diwali Digital Diya 2026 · An independent student project*

</div>
