import { computed } from 'vue'
import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'

export const useCart = () => {
  const $q = useQuasar()

  const store = useCartStore()

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

    const existingItem = store.cartItems.find((item) => item.id === product.id)
    store.addToCart(product)
    if (existingItem) {
      $q.notify({
        message: `Cantidad de ${product.name} aumentada`,
        color: 'positive',
        icon: 'shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    } else {
      $q.notify({
        message: `${product.name} agregado al carrito`,
        color: 'positive',
        icon: 'shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    }
  }

  const removeFromCart = (index) => {
    const itemName = store.cartItems[index]?.name
    store.removeFromCart(index)
    if (itemName) {
      $q.notify({
        message: `${itemName} removido del carrito`,
        color: 'info',
        icon: 'remove_shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    store.updateQuantity(itemId, newQuantity)
  }

  const clearCart = () => {
    store.clearCart()
    $q.notify({
      message: 'Carrito vaciado',
      color: 'info',
      icon: 'delete_sweep',
      position: 'top',
    })
  }

  return {
    cartItems: computed(() => store.cartItems),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal: computed(() => store.subtotal),
    envio: computed(() => store.envio),
    total: computed(() => store.total),
    totalItems: computed(() => store.totalItems),
  }
}
