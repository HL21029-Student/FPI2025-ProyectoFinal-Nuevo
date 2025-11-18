import { defineStore } from 'pinia'

const STORAGE_KEY = 'cartItems'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const save = (items) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

export const useCartStore = defineStore('cart', {
  state: () => ({ cartItems: load() }),
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
      save(this.cartItems)
    },
    removeFromCart(index) {
      if (index < 0 || index >= this.cartItems.length) return
      this.cartItems.splice(index, 1)
      save(this.cartItems)
    },
    updateQuantity(itemId, qty) {
      const idx = this.cartItems.findIndex((i) => i.id === itemId)
      if (idx === -1) return
      if (qty <= 0) {
        this.removeFromCart(idx)
        return
      }
      this.cartItems[idx].quantity = qty
      save(this.cartItems)
    },
    clearCart() {
      this.cartItems = []
      save(this.cartItems)
    },
  },
})
