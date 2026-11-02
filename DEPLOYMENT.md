# Deployment guide (Windows PowerShell, free tier)

The site works on Vercel's free Hobby plan with **no** cloud credentials. Firebase and Gemini are add-ons. Check Vercel's current plan terms at https://vercel.com/pricing (Hobby is intended for non-commercial/personal use).

## 1. Install Node.js
Download the **LTS** installer from https://nodejs.org and run it. Then open a *new* PowerShell:
```powershell
node -v    # prints your Node version (needs 20+)
npm -v     # prints npm's version
```
## 2. Open the project in VS Code
```powershell
cd path\to\diyaverse     # move into the project folder
code .                   # open it in VS Code
```
## 3. Install dependencies
```powershell
npm install              # downloads the libraries listed in package.json
```
## 4. Run locally
```powershell
npm run dev              # starts the dev server; open the printed http://localhost:5173
```
## 5. Test locally
Follow [TESTING.md](TESTING.md). Before pushing, always run:
```powershell
npm run typecheck ; npm run lint ; npm run build
```
## 6. Create a GitHub repository
Install Git (https://git-scm.com), then on https://github.com click **New repository**, name it `diyaverse`, leave it empty (no README), and create it.
## 7. Push to GitHub
```powershell
git init                                   # start tracking this folder
git add .                                  # stage files (.env.local is ignored by .gitignore)
git status                                 # CHECK no .env files are listed
git commit -m "DIYAverse"                  # save a snapshot
git branch -M main                         # name the branch main
git remote add origin https://github.com/YOUR-USERNAME/diyaverse.git
git push -u origin main                    # upload
```
## 8. Deploy on Vercel
1. Go to https://vercel.com, **Sign up with GitHub**.
2. **Add New → Project** → import `diyaverse`.
3. Framework preset: **Vite** (auto-detected). Build: `npm run build`. Output: `dist`.
4. **Deploy**. You get a `https://…vercel.app` URL that stays up without your computer.

`vercel.json` already rewrites unknown paths to the SPA (so refreshing `/world` works) and keeps `/api/*` for the function.
## 9. Environment variables (optional)
Vercel project → **Settings → Environment Variables**:
- `VITE_FIREBASE_*` (six values) for the shared wall, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md).
- `GEMINI_API_KEY` for AI greetings. Create a key in Google AI Studio (https://aistudio.google.com). **Never** prefix it with `VITE_`. Optionally set `GEMINI_MODEL`.

Then **Deployments → ⋯ → Redeploy**. Variables only apply to new deployments.
## 10. Verify the live site
- Every nav page loads; refresh on `/infinity` works; a bad URL shows the custom 404.
- Badge: "Local demo mode" without Firebase, "Firestore connected" with it.
- Wish Studio label: "Written by Gemini" only if the key works, else "offline generator".
- Open DevTools → Network and confirm no `GEMINI` key appears in any JS file.
## 11. Troubleshooting
| Problem | Fix |
|---|---|
| `npm` not recognised | Reopen PowerShell after installing Node |
| Build fails on Vercel | Run `npm run build` locally and fix the error shown |
| 404 on refresh | Make sure `vercel.json` was committed |
| Env var change has no effect | Redeploy |
| Gemini always falls back | Key missing/invalid, free quota hit, or model name changed; see Vercel function logs |
| Firestore permission error | Publish `firestore.rules` |
