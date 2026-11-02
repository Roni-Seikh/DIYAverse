# DIYAverse — Pitch & Demo Kit

## 30-second introduction
"Most Diwali websites are greetings you look at. DIYAverse is one you take part in. You light a diya with your own wish, craft a greeting in English, Hindi or Bengali, draw a rangoli, and your light joins a shared mandala, the Infinity of Light. It runs with zero setup, uses Google Firestore and Gemini when configured, and never fakes what it can't do."

## 60-second demo (practice it; keep Firestore connected for step 5)
1. **0:00 Home**: "One light begins." Tap the diya. (5 s)
2. **0:05 Light**: Name, wish, pick Peacock + Teal → *Light My Diya*. Flame ignites, card appears. (12 s)
3. **0:17 Wish Studio**: Hindi, Heartwarming → Generate. Point at the honest "Written by …" badge. Show the card. (12 s)
4. **0:29 Rangoli**: Load *Lotus Bloom*, draw one stroke to show live symmetry. (10 s)
5. **0:39 World**: *Add to World of Lights*; the badge says Firestore connected. (7 s)
6. **0:46 Infinity**: Your light appears. Hover it, zoom. (10 s)
7. **0:56 Close**: "Every number and label here is real, and it still works offline." (4 s)

## 2-minute technical explanation
- **Front end**: React + TypeScript + Vite, lazy-loaded routes, Tailwind design tokens, Framer Motion for UI, raw Canvas for the heavy visuals.
- **Infinity of Light**: golden-angle (phyllotaxis) spiral gives each diya a stable seat, so the mandala grows without rearranging. Glows are pre-rendered sprites, drawing is culled to the viewport, the loop pauses when the tab is hidden, and it supports wheel, drag and pinch plus keyboard.
- **Data layer**: one context. localStorage always; Firestore if configured (lazy-loaded SDK). "Connected" appears only on a server snapshot, never from cache.
- **Security**: strict Firestore rules (create-only, field allow-list, length limits, server timestamp), safe rendering, client validation and cooldown. Honest caveat: public writes need App Check/moderation at scale.
- **AI**: a Vercel function holds the Gemini key; the browser never sees it. On any failure the offline generator is used and labelled.
- **Accessibility/perf**: semantic HTML, focus styles, ARIA, reduced-motion support; route-level code splitting.

## Why it's different
Participation over presentation, a signature visual that grows with real people, and integrity: sample data, local data, AI and cloud are always labelled for what they are.

## Ten likely judge questions
1. **Is the AI real?** Only when a Gemini key is configured server-side; the badge tells you which generator wrote the text.
2. **Is the community real?** Only when Firestore is connected. Otherwise it's labelled local demo and the mandala shows a labelled illustrative example.
3. **Where is the API key?** Server-side environment variable on Vercel; never in the bundle.
4. **Why Firebase, not AWS?** One solid integration over two decorative ones; real-time listeners suit the wall. The data layer is isolated so an AWS adapter is feasible.
5. **How do you stop abuse?** Rules enforce shape/size and forbid edits; client cooldown, link/profanity checks. Honestly, true moderation and App Check are next steps.
6. **What does it cost?** Free-tier services only, with daily quotas; no billing account is linked. Quotas can run out under heavy traffic.
7. **How does the mandala scale?** Sprites, viewport culling, and a 300-light query. Beyond several thousand you'd aggregate or tile.
8. **Accessibility?** Keyboard, ARIA labels, focus rings, reduced motion. A formal screen-reader audit is still to do.
9. **Privacy?** No accounts; nicknames allowed; region optional; personal collection stays in the browser.
10. **What would you build next?** Moderation queue, App Check, shareable light links, native-speaker-reviewed languages, PWA.

## Final submission checklist
- [ ] Live Vercel URL opens on phone and laptop
- [ ] Firestore rules published; badge says connected on the live site
- [ ] Gemini key set (or accept the labelled fallback)
- [ ] No secrets in the GitHub repo (`git log -p | findstr /i "AIza"` is empty)
- [ ] README screenshots added
- [ ] Hindi/Bengali greetings reviewed by a native speaker
- [ ] LICENSE file added
- [ ] 60-second demo rehearsed with a backup screen recording
