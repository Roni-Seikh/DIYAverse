# Firebase setup (optional)

Without this, DIYAverse works in **local demo mode**. Do this only if you want a real shared wall.

**Cost note:** The no-cost Spark plan includes a daily Firestore quota (Firebase's pricing-plans page cites 50,000 reads and 20,000 writes per day as an example; confirm current figures at https://firebase.google.com/pricing). Exceeding a Spark quota can shut that product off until it resets. **Do not link a billing account** unless you intend to pay: linking one upgrades the project to Blaze. Plans change, so check the official page before relying on this.

## Steps
1. Open https://console.firebase.google.com and sign in with a Google account.
2. **Add project** → name it (e.g. `diyaverse`) → you can disable Google Analytics.
3. In the project, **Build → Firestore Database → Create database**. Choose a location near your users. Start in **production mode** (we deploy our own rules next).
4. **Project settings (gear) → General → Your apps → Web (`</>`)** → register an app. Copy the `firebaseConfig` values.
5. Create `.env.local` in the project root (copy `.env.example`) and paste the values:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
6. **Publish rules.** Easiest: Firestore → **Rules** tab → paste the contents of `firestore.rules` → **Publish**.
   (CLI alternative: `npm i -g firebase-tools`, `firebase login`, `firebase use <project-id>`, `firebase deploy --only firestore:rules`.)
7. `npm run dev`, open **World of Lights**. The badge should turn **"Firestore connected"** within a few seconds. Add a light; confirm a document appears in Firestore under `diyas`.
8. For Vercel, add the same six `VITE_FIREBASE_*` variables in the Vercel dashboard, then redeploy (they are baked in at build time).

## Troubleshooting
| Symptom | Cause |
|---|---|
| Badge stays "Local demo mode" | `.env.local` missing/misnamed, or dev server not restarted |
| "Cloud unreachable · local demo" | Wrong project ID, Firestore not created, or network blocked |
| "rejected the request (check security rules)" | Rules not published, or a write failed validation |
| Adding a light fails | Rules require `createdAt == request.time`; the app sends a server timestamp. Don't change one without the other |
