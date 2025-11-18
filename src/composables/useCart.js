import { useQuasar } from 'quasar'
import { useCartStore } from 'src/stores/cartStore'

// Composable del carrito (adaptador sobre Pinia)
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
    const existed = store.cartItems.find((i) => i.id === product.id)
    store.addToCart(product)
    $q.notify({
      message: existed ? `Cantidad de ${product.name} aumentada` : `${product.name} agregado al carrito`,
      color: 'positive',
      icon: 'shopping_cart',
      position: 'top',
      timeout: 2000,
    })
  }

  const removeFromCart = (index) => {
    const name = store.cartItems[index]?.name
    store.removeFromCart(index)
    if (name) {
      $q.notify({
        message: `${name} removido del carrito`,
        color: 'info',
        icon: 'remove_shopping_cart',
        position: 'top',
        timeout: 2000,
      })
    }
  }

  const updateQuantity = (itemId, qty) => store.updateQuantity(itemId, qty)

  const clearCart = () => {
    store.clearCart()
    $q.notify({ message: 'Carrito vaciado', color: 'info', icon: 'delete_sweep', position: 'top' })
  }

  return {
    cartItems: store.cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal: store.subtotal,
    envio: store.envio,
    total: store.total,
    totalItems: store.totalItems,
  }
}
