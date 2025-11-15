import { db } from 'boot/firebase'
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

const celularesCollection = () => collection(db, 'celulares')

export const celularesService = {
  async getCelulares() {
    try {
      const querySnapshot = await getDocs(celularesCollection())
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error obteniendo celulares:', error)
      throw error
    }
  },

  async initializeProductos() {
    try {
      // Verificar si ya hay productos
      const querySnapshot = await getDocs(celularesCollection())
      if (querySnapshot.docs.length > 0) {
        return // Ya hay productos, no inicializar
      }

      // Agregar los productos iniciales
      const productos = [
        {
          estado: 'nuevo',
          marca: 'Samsung',
          modelo: 'Galaxy S24 Ultra',
          pantalla: '6.8 pulgadas',
          sistemaOperativo: 'Android',
          rom: '256 GB',
          ram: '12 GB',
          tituloAnuncio: 'Samsung Galaxy S24 Ultra - Nuevo',
          nombreVendedor: 'TechStore Premium',
          telefono: '+503 7890-1234',
          descripcion:
            'El buque insignia de Samsung, conocido por su potente procesador, su cámara de alta resolución con zoom avanzado y la integración del S Pen.',
          precio: 1299,
          imagen:
            'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'usado',
          marca: 'Apple',
          modelo: 'iPhone 15 Pro Max',
          pantalla: '6.7 pulgadas',
          sistemaOperativo: 'iOS',
          rom: '256 GB',
          ram: '8 GB',
          tituloAnuncio: 'iPhone 15 Pro Max - Excelente Estado',
          nombreVendedor: 'MobileHub',
          telefono: '+503 7123-4567',
          descripcion:
            'El modelo más avanzado de Apple, con un chasis de titanio, el chip A17 Pro para un rendimiento superior en juegos y una cámara teleobjetivo mejorada.',
          precio: 950,
          imagen:
            'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'nuevo',
          marca: 'Xiaomi',
          modelo: '14 Pro',
          pantalla: '6.73 pulgadas',
          sistemaOperativo: 'Android',
          rom: '512 GB',
          ram: '12 GB',
          tituloAnuncio: 'Xiaomi 14 Pro - Nuevo con Garantía',
          nombreVendedor: 'Xiaomi Store',
          telefono: '+503 7456-7890',
          descripcion:
            'Un teléfono de gama alta de Xiaomi que destaca por su colaboración con Leica en las cámaras, ofreciendo una gran calidad fotográfica y una carga ultrarrápida.',
          precio: 1050,
          imagen:
            'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'usado',
          marca: 'Google',
          modelo: 'Pixel 8 Pro',
          pantalla: '6.7 pulgadas',
          sistemaOperativo: 'Android',
          rom: '128 GB',
          ram: '12 GB',
          tituloAnuncio: 'Google Pixel 8 Pro - Como Nuevo',
          nombreVendedor: 'Google Certified',
          telefono: '+503 7987-6543',
          descripcion:
            'El teléfono de Google, famoso por su experiencia de Android puro y sus capacidades de fotografía computacional, con funciones exclusivas de IA para editar fotos.',
          precio: 680,
          imagen:
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'nuevo',
          marca: 'Honor',
          modelo: 'Magic6 Pro',
          pantalla: '6.8 pulgadas',
          sistemaOperativo: 'Android',
          rom: '512 GB',
          ram: '12 GB',
          tituloAnuncio: 'Honor Magic6 Pro - Nuevo',
          nombreVendedor: 'Honor Store',
          telefono: '+503 7234-5678',
          descripcion:
            'Un competidor fuerte en la gama alta, con un diseño distintivo, una batería de gran duración y un sistema de cámaras muy versátil y potente.',
          precio: 1190,
          imagen:
            'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'usado',
          marca: 'OnePlus',
          modelo: '12',
          pantalla: '6.82 pulgadas',
          sistemaOperativo: 'Android',
          rom: '256 GB',
          ram: '12 GB',
          tituloAnuncio: 'OnePlus 12 - Excelente Condición',
          nombreVendedor: 'OnePlus Premium',
          telefono: '+503 7567-8901',
          descripcion:
            'Conocido por su rendimiento fluido (gracias a OxygenOS) y su carga increíblemente rápida. Ofrece especificaciones de primer nivel a un precio competitivo.',
          precio: 700,
          imagen:
            'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&h=400&fit=crop&crop=center',
        },
        {
          estado: 'nuevo',
          marca: 'Motorola',
          modelo: 'Edge 50 Ultra',
          pantalla: '6.7 pulgadas',
          sistemaOperativo: 'Android',
          rom: '512 GB',
          ram: '12 GB',
          tituloAnuncio: 'Motorola Edge 50 Ultra - Nuevo',
          nombreVendedor: 'Motorola Store',
          telefono: '+503 7890-1122',
          descripcion:
            'El modelo premium de Motorola, que a menudo sorprende con acabados de materiales únicos (como madera o cuero vegano) y una pantalla de alta tasa de refresco.',
          precio: 999,
          imagen:
            'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=400&fit=crop&crop=center',
        },
      ]

      const addPromises = productos.map((producto) => addDoc(celularesCollection(), producto))
      await Promise.all(addPromises)

      console.log('Productos iniciales agregados a Firebase')
    } catch (error) {
      console.error('Error inicializando productos:', error)
      throw error
    }
  },

  async addCelular(celular) {
    try {
      const docRef = await addDoc(celularesCollection(), celular)
      return docRef.id
    } catch (error) {
      console.error('Error agregando celular:', error)
      throw error
    }
  },

  async getCelularById(id) {
    try {
      const docRef = doc(db, 'celulares', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        }
      } else {
        throw new Error('Celular no encontrado')
      }
    } catch (error) {
      console.error('Error obteniendo celular por ID:', error)
      throw error
    }
  },

  async updateCelular(id, data) {
    try {
      const docRef = doc(db, 'celulares', id)
      await updateDoc(docRef, data)
      return true
    } catch (error) {
      console.error('Error actualizando celular:', error)
      throw error
    }
  },

  async deleteCelular(id) {
    try {
      const docRef = doc(db, 'celulares', id)
      await deleteDoc(docRef)
      return true
    } catch (error) {
      console.error('Error eliminando celular:', error)
      throw error
    }
  },
}
