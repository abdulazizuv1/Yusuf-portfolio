import { initializeApp } from 'firebase/app'
import { getFirestore }  from 'firebase/firestore'
import { getStorage }    from 'firebase/storage'
import { getAuth }       from 'firebase/auth'

const firebaseConfig = {
  apiKey:            'AIzaSyCz5RQa9wg8OjhUChTA23YDLIURKjpWSdM',
  authDomain:        'yusuf-ebcf4.firebaseapp.com',
  projectId:         'yusuf-ebcf4',
  storageBucket:     'yusuf-ebcf4.firebasestorage.app',
  messagingSenderId: '467451090654',
  appId:             '1:467451090654:web:bd5a91a0ac974a84c1144f',
  measurementId:     'G-2714RT8MFK',
}

const app = initializeApp(firebaseConfig)

export const db      = getFirestore(app)
export const storage = getStorage(app)
export const auth    = getAuth(app)
