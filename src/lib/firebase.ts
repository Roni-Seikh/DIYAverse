import type { Diya, NewDiya } from './types'

const env = import.meta.env
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
}

/** True only when the three essential values are present. Says nothing about connectivity. */
export const isFirebaseConfigured = Boolean(cfg.apiKey && cfg.projectId && cfg.appId)

export interface Cloud {
  add(d: NewDiya): Promise<void>
  /** `onData` receives `fromServer=true` only for snapshots confirmed by the server. */
  subscribe(onData: (items: Diya[], fromServer: boolean) => void, onError: (e: Error) => void): () => void
}

let cloudPromise: Promise<Cloud | null> | null = null

/** Firebase is code-split and loaded lazily, and only when configured. */
export function loadCloud(): Promise<Cloud | null> {
  if (!isFirebaseConfigured) return Promise.resolve(null)
  if (cloudPromise) return cloudPromise
  cloudPromise = (async () => {
    const [{ initializeApp }, fs] = await Promise.all([import('firebase/app'), import('firebase/firestore')])
    const app = initializeApp(cfg)
    const db = fs.getFirestore(app)
    const col = fs.collection(db, 'diyas')
    const cloud: Cloud = {
      async add(d) {
        const payload: Record<string, unknown> = {
          name: d.name,
          wish: d.wish,
          design: d.design,
          color: d.color,
          createdAt: fs.serverTimestamp(),
        }
        if (d.region) payload.region = d.region
        await fs.addDoc(col, payload)
      },
      subscribe(onData, onError) {
        const q = fs.query(col, fs.orderBy('createdAt', 'desc'), fs.limit(300))
        return fs.onSnapshot(
          q,
          (snap) => {
            const items: Diya[] = []
            snap.forEach((doc) => {
              const x = doc.data({ serverTimestamps: 'estimate' })
              const ts = x.createdAt as { toMillis?: () => number } | undefined
              items.push({
                id: doc.id,
                name: String(x.name ?? ''),
                wish: String(x.wish ?? ''),
                design: x.design,
                color: x.color,
                createdAt: ts?.toMillis ? ts.toMillis() : Date.now(),
                source: 'cloud',
                region: x.region ? String(x.region) : undefined,
              })
            })
            onData(items, !snap.metadata.fromCache)
          },
          (err) => onError(err),
        )
      },
    }
    return cloud
  })().catch((e) => {
    cloudPromise = null
    throw e
  })
  return cloudPromise
}
