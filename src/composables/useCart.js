import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

// Estado global del carrito
const cartItems = ref(JSON.parse(localStorage.getItem('cartItems') || '[]'))

// Función para guardar en localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems.value))
}

// Composable del carrito
export const useCart = () => {
  const $q = useQuasar()

  // Agregar producto al carrito
  const addToCart = (product) => {
    if (!product || !product.id) {
      $q.notify({
        message: 'Producto inválido',
        color: 'negative',
        icon: 'error',
        position: 'top',
        timeout: 2000,
      })
      return
    }

    const existingItem = cartItems.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
      $q.notify({
        message: `Cantidad de ${product.name} aumentada`,
        color: 'positive',
        icon: 'shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    } else {
      cartItems.value.push({
        ...product,
        quantity: 1,
      })
      $q.notify({
        message: `${product.name} agregado al carrito`,
        color: 'positive',
        icon: 'shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    }
    saveToLocalStorage()
  }

  // Remover producto del carrito
  const removeFromCart = (index) => {
    const itemName = cartItems.value[index].name
    cartItems.value.splice(index, 1)
    $q.notify({
      message: `${itemName} removido del carrito`,
      color: 'info',
      icon: 'remove_shopping_cart',
      position: 'top',
      timeout: 2000,
    })
    saveToLocalStorage()
  }

  // Actualizar cantidad
  const updateQuantity = (itemId, newQuantity) => {
    const index = cartItems.value.findIndex((item) => item.id === itemId)
    if (index === -1) return

    if (newQuantity <= 0) {
      removeFromCart(index)
      return
    }
    cartItems.value[index].quantity = newQuantity
    saveToLocalStorage()
  }

  // Vaciar carrito
  const clearCart = () => {
    cartItems.value = []
    saveToLocalStorage()
    $q.notify({
      message: 'Carrito vaciado',
      color: 'info',
      icon: 'delete_sweep',
      position: 'top',
    })
  }

  // Calcular subtotal
  const subtotal = computed(() =>
    cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0),
  )

  // Calcular envío
  const envio = computed(() => (subtotal.value > 500 ? 0 : 25))

  // Calcular total
  const total = computed(() => subtotal.value + envio.value)

  // Cantidad total de items
  const totalItems = computed(() =>
    cartItems.value.reduce((total, item) => total + item.quantity, 0),
  )

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    envio,
    total,
    totalItems,
  }
}
