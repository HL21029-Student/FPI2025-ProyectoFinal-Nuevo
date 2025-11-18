import { defineStore } from 'pinia'

// Clave para guardar y cargar el carrito desde el LocalStorage del navegador.
const STORAGE_KEY = 'cartItems'

function loadFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    cartItems: loadFromLocalStorage(),
  }),
  getters: {
    subtotal(state) {
      return state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    },
    envio() {
      return this.subtotal > 500 ? 0 : 25
    },
    total() {
      return this.subtotal + this.envio
    },
    totalItems(state) {
      return state.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
  },
  actions: {
    addToCart(product) {
      if (!product || !product.id) return
      const existing = this.cartItems.find((i) => i.id === product.id)
      if (existing) {
        existing.quantity += 1
      } else {
        this.cartItems.push({ ...product, quantity: 1 })
      }
    },
    removeFromCart(index) {
      if (index < 0 || index >= this.cartItems.length) return
      this.cartItems.splice(index, 1)
    },
    updateQuantity(itemId, newQuantity) {
      const idx = this.cartItems.findIndex((i) => i.id === itemId)
      if (idx === -1) return
      if (newQuantity <= 0) {
        this.removeFromCart(idx)
        return
      }
      this.cartItems[idx].quantity = newQuantity
    },
    clearCart() {
      this.cartItems = []
    },
  },
})
