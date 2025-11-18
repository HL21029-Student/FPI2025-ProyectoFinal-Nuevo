import { boot } from 'quasar/wrappers'
import { createPinia } from 'pinia'
import { useCartStore } from 'src/stores/cartStore'

// --- INICIO: Lógica para optimizar la escritura en localStorage ---

// Función para guardar el estado del carrito en el LocalStorage.
function saveCartToLocalStorage(state) {
  localStorage.setItem('cartItems', JSON.stringify(state.cartItems))
}

// Función "debounce". Retrasa la ejecución de una función hasta que haya pasado
// un tiempo determinado sin que se vuelva a llamar.
function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

// Creamos una versión "debounced" de nuestra función de guardado.
// Solo se ejecutará 300ms después del último cambio en el carrito.
const debouncedSave = debounce((state) => saveCartToLocalStorage(state))

// --- FIN: Lógica de optimización ---

export default boot(({ app }) => {
  const pinia = createPinia()
  app.use(pinia)

  // Obtenemos la instancia del store del carrito.
  const cartStore = useCartStore(pinia)

  // Usamos $watch para observar cambios en el estado del store.
  // Cada vez que `cartItems` cambie, llamaremos a nuestra función optimizada.
  cartStore.$subscribe((mutation, state) => {
    // `mutation.storeId` nos asegura que solo reaccionamos a cambios en el store 'cart'.
    if (mutation.storeId === 'cart') {
      debouncedSave(state)
    }
  })
})
