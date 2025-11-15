import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { celularesService } from 'src/services/celularesService'

// configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)

export default boot(({ app }) => {
  app.config.globalProperties.$db = db

  // Inicializa los productos si la base de datos está vacía
  // Lo ejecutamos sin 'await' para no bloquear la carga de la aplicación.
  celularesService.initializeProductos().catch((error) => {
    console.error('Error al inicializar productos en el arranque:', error)
  })
})

export { db }
