// Firebase Configuration & REST Services (Lightweight, Zero-Dependency)
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 5 &&
  firebaseConfig.projectId
);

// Firebase REST API helpers
export const firebaseRest = {
  async signInWithPassword(email, password) {
    if (!isFirebaseConfigured) return null;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Error al autenticar en Firebase");
    }
    return await res.json();
  },

  async getFirestoreDocuments(collectionName) {
    if (!isFirebaseConfigured) return null;
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}`;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      return (data.documents || []).map((doc) => {
        const id = doc.name.split("/").pop();
        const fields = {};
        for (const [k, v] of Object.entries(doc.fields || {})) {
          fields[k] = v.stringValue ?? v.integerValue ?? v.doubleValue ?? v.booleanValue ?? v;
        }
        return { id, ...fields };
      });
    } catch {
      return null;
    }
  }
};

