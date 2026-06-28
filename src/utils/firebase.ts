import { initializeApp } from 'firebase/app';
import {
  getFirestore, collection, doc, setDoc, getDocs,
  deleteDoc, query, onSnapshot, Unsubscribe,
} from 'firebase/firestore';
import { ClientSite, User } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyAGSnUV-Y_4QXE1iQCTz2YWcf2ehSu7UpI",
  authDomain: "naqra-96669.firebaseapp.com",
  projectId: "naqra-96669",
  storageBucket: "naqra-96669.firebasestorage.app",
  messagingSenderId: "237025376866",
  appId: "1:237025376866:web:da85958bb4cd5a29676f3b",
  measurementId: "G-KWJ9WDYVQ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const loadSitesFromFirebase = async (): Promise<ClientSite[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'sites'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ClientSite));
  } catch (e) {
    console.warn('فشل تحميل البيانات من Firebase:', e);
    return [];
  }
};

export const saveSiteToFirebase = async (site: ClientSite) => {
  try {
    await setDoc(doc(db, 'sites', site.id), site);
  } catch (e) {
    console.warn('فشل حفظ الموقع في Firebase:', e);
  }
};

export const deleteSiteFromFirebase = async (siteId: string) => {
  try {
    await deleteDoc(doc(db, 'sites', siteId));
  } catch (e) {
    console.warn('فشل حذف الموقع من Firebase:', e);
  }
};

export const saveUserToFirebase = async (user: User) => {
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (e) {
    console.warn('فشل حفظ المستخدم في Firebase:', e);
  }
};

export const loadUsersFromFirebase = async (): Promise<User[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
  } catch (e) {
    console.warn('فشل تحميل المستخدمين من Firebase:', e);
    return [];
  }
};

export const subscribeToSites = (callback: (sites: ClientSite[]) => void): Unsubscribe => {
  const q = query(collection(db, 'sites'));
  return onSnapshot(q, (snapshot) => {
    const sites = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ClientSite));
    callback(sites);
  });
};

export { db };
