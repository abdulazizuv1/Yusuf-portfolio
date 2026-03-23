import {
  collection, doc,
  getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'

const COL = 'championships'

export async function getChampionships() {
  const q = query(collection(db, COL), orderBy('year', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getChampionship(id) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function addChampionship(data) {
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() })
}

export async function updateChampionship(id, data) {
  return updateDoc(doc(db, COL, id), data)
}

export async function deleteChampionship(id) {
  return deleteDoc(doc(db, COL, id))
}
