import { defineStore } from 'pinia'

const STORAGE_KEY = 'cartItems'

function loadFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveToLocalStorage(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
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
      // Using getter context via this to access other getters
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
      saveToLocalStorage(this.cartItems)
    },
    removeFromCart(index) {
      if (index < 0 || index >= this.cartItems.length) return
      this.cartItems.splice(index, 1)
      saveToLocalStorage(this.cartItems)
    },
    updateQuantity(itemId, newQuantity) {
      const idx = this.cartItems.findIndex((i) => i.id === itemId)
      if (idx === -1) return
      if (newQuantity <= 0) {
        this.removeFromCart(idx)
        return
      }
      this.cartItems[idx].quantity = newQuantity
      saveToLocalStorage(this.cartItems)
    },
    clearCart() {
      this.cartItems = []
      saveToLocalStorage(this.cartItems)
    },
  },
})
