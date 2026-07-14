import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// Lazy singleton so a missing service account fails at call time (caught by the
// data layer) rather than at import time (which would break the whole build).
let cached: Firestore | null = null;

export function getDb(): Firestore {
  if (cached) return cached;

  const app: App = getApps()[0] ?? initializeApp({ credential: cert(serviceAccount()) });
  cached = getFirestore(app);
  return cached;
}

function serviceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Private key is stored with escaped newlines in .env; restore real newlines.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase service-account env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (see .env.example).",
    );
  }
  return { projectId, clientEmail, privateKey };
}
