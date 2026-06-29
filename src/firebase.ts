import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, onSnapshot, query } from 'firebase/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAGSnUV-Y_4QXE1iQCTz2YWcf2ehSu7UpI",
  authDomain: "naqra-96669.firebaseapp.com",
  projectId: "naqra-96669",
  storageBucket: "naqra-96669.firebasestorage.app",
  messagingSenderId: "237025376866",
  appId: "1:237025376866:web:da85958bb4cd5a29676f3b",
  measurementId: "G-KWJ9WDYVQ8"
});

const db = getFirestore(app);

// Simple wrappers that never throw
export async function fbSave(col: string, id: string, data: any) {
  try {
    const clean = JSON.parse(JSON.stringify(data));
    if (clean.visits?.length > 500) clean.visits = clean.visits.slice(-500);
    await setDoc(doc(db, col, id), clean);
    console.log(`✅ Saved ${col}/${id}`);
  } catch (e) {
    console.error(`❌ Save failed ${col}/${id}:`, e);
  }
}

export async function fbDelete(col: string, id: string) {
  try {
    await deleteDoc(doc(db, col, id));
  } catch (e) {
    console.error('❌ Delete failed:', e);
  }
}

export function fbListen(col: string, onData: (data: any[]) => void, onError: () => void) {
  try {
    return onSnapshot(
      query(collection(db, col)),
      (snap) => {
        const data = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        onData(data);
      },
      (err) => {
        console.error(`❌ Listen failed ${col}:`, err);
        onError();
      }
    );
  } catch (e) {
    console.error('❌ Listen setup failed:', e);
    onError();
    return () => {};
  }
}

// Test connection by trying to read
export async function fbTest(): Promise<boolean> {
  try {
    await getDocs(collection(db, 'sites'));
    console.log('✅ Firebase connected');
    return true;
  } catch (e) {
    console.error('❌ Firebase connection failed:', e);
    return false;
  }
}
