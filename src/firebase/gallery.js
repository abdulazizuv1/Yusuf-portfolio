import {
  collection, doc,
  getDocs, addDoc, deleteDoc,
  query, orderBy, getCountFromServer, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

// ─── Gallery Photos ────────────────────────────────────────────────────────

export async function getGalleryPhotos() {
  const q = query(collection(db, 'galleryPhotos'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addGalleryPhoto(data) {
  // Get current count to assign sequential order number
  const snap = await getCountFromServer(collection(db, 'galleryPhotos'))
  const count = snap.data().count
  const order = count + 1
  return addDoc(collection(db, 'galleryPhotos'), {
    ...data,
    order,
    createdAt: serverTimestamp(),
  })
}

export async function deleteGalleryPhoto(id) {
  return deleteDoc(doc(db, 'galleryPhotos', id))
}

// Storage path with padded numbering: gallery/001.jpg, gallery/002.jpg …
export async function nextGalleryStoragePath(filename) {
  const snap = await getCountFromServer(collection(db, 'galleryPhotos'))
  const num = String(snap.data().count + 1).padStart(3, '0')
  const ext = filename.split('.').pop().toLowerCase()
  return `gallery/${num}.${ext}`
}

// ─── Quotes ────────────────────────────────────────────────────────────────

export async function getQuotes() {
  const q = query(collection(db, 'quotes'), orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addQuote(data) {
  return addDoc(collection(db, 'quotes'), { ...data, createdAt: serverTimestamp() })
}

export async function deleteQuote(id) {
  return deleteDoc(doc(db, 'quotes', id))
}
