# Testing

## Automated checks (all passing at time of writing)
```powershell
npm run typecheck
npm run lint
npm run build
```
A headless-browser smoke test also confirmed: no page errors on any route at 1280 px and 390 px, no horizontal overflow, and the diya → wall → greeting → rangoli flows complete. Not yet covered: automated unit tests, real-device touch testing, screen-reader testing, Lighthouse scores. Please run those yourself.

## Manual checklist
**Home** intro appears once per session; *Skip intro* / Esc works; tapping the diya bursts sparks.
**Light** validation errors for empty/short wish and links; light a diya → flame ignites, card appears; Download PNG; Share (clipboard fallback on desktop); Remove from collection; reload and confirm it persists.
**Wish Studio** generate in each language × tone × length; Regenerate changes the text; edit text and card updates; label says "offline generator" without a key; PNG downloads with Hindi/Bengali rendering correctly.
**Rangoli** draw with mouse and touch; change symmetry/colour/size; motif stamps; each template; undo/redo/clear; PNG is empty-guarded.
**World** add a light (marked *Local only* offline); 2nd submit within 20 s is refused; search, colour filter, sort, *Show more*; empty state when cleared.
**Infinity** shows "Illustrative example" with 0 lights and "N real lights" otherwise; hover tooltip; click shows story; wheel/pinch zoom; drag; Tab to canvas then ←/→, +/−, 0, Esc.
**Festival Night** tap sky; Celebrate; toggles; sound off by default; full screen.
**Accessibility** keyboard-only pass; visible focus; enable OS "reduce motion" (intro skipped, calmer effects).
**Firebase** follow FIREBASE_SETUP.md; disconnect network and confirm the badge falls back honestly.
