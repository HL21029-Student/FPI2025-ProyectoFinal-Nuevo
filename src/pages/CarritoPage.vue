<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header / Navbar -->
    <q-header elevated class="bg-gradient">
      <q-toolbar>
        <q-icon name="campaign" size="md" class="q-mr-sm" />
        <q-toolbar-title class="text-h6 text-weight-bold cursor-pointer" @click="goToHome">
          Tienda CellPhone
        </q-toolbar-title>

        <q-btn outline label="Inicio" class="q-mx-xs" @click="goToHome" />
        <q-btn outline label="Estadísticas" class="q-mx-xs" @click="goToStats" />

        <q-btn
          round
          color="white"
          text-color="primary"
          icon="add"
          class="q-mx-md"
          @click="crearProducto"
        >
          <q-tooltip>Crear nuevo producto</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page class="page-gradient q-pa-lg">
        <!-- Título con animación -->
        <div class="row items-center q-mb-xl">
          <q-icon name="shopping_cart" size="3rem" color="primary" class="q-mr-md" />
          <div class="text-h3 text-weight-bold text-primary">Carrito de Compras</div>
          <q-space />
          <q-chip
            v-if="cartItems.length > 0"
            color="primary"
            text-color="white"
            icon="inventory"
            class="text-h6"
          >
            {{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}
          </q-chip>
        </div>

        <!-- Carrito vacío -->
        <div v-if="cartItems.length === 0" class="empty-cart">
          <q-card class="empty-cart-card">
            <q-card-section class="text-center q-pa-xl">
              <q-icon name="shopping_cart" size="8rem" color="grey-4" class="q-mb-lg" />
              <div class="text-h4 text-weight-bold text-grey-7 q-mb-md">Tu carrito está vacío</div>
              <div class="text-body1 text-grey-6 q-mb-xl">
                ¡Descubre nuestros productos y comienza a comprar!
              </div>
              <q-btn
                color="primary"
                label="Explorar Productos"
                @click="goToHome"
                unelevated
                size="lg"
                icon="storefront"
                class="explore-btn"
              />
            </q-card-section>
          </q-card>
        </div>

        <!-- Items del carrito -->
        <div v-else>
          <div class="row q-col-gutter-lg">
            <!-- Lista de productos -->
            <div class="col-12 col-lg-8">
              <transition-group name="cart-item" tag="div">
                <q-card
                  v-for="(item, index) in cartItems"
                  :key="item.id || index"
                  class="base-card cart-item-card q-mb-md"
                >
                  <q-card-section class="row items-center q-pa-md">
                    <div class="col-auto q-mr-md">
                      <q-img
                        :src="item.image"
                        style="width: 100px; height: 100px"
                        class="rounded-borders product-thumb"
                      >
                        <div v-if="item.isNew" class="absolute-top-left q-ma-xs">
                          <q-badge color="green" label="NUEVO" class="text-weight-bold" />
                        </div>
                      </q-img>
                    </div>

                    <div class="col">
                      <div class="text-h6 text-weight-bold q-mb-xs">{{ item.name }}</div>
                      <div class="product-details">
                        <q-chip size="sm" color="purple" text-color="white" icon="business">
                          {{ item.brand }}
                        </q-chip>
                        <q-chip size="sm" color="primary" text-color="white" icon="phone_iphone">
                          {{ item.screen }}
                        </q-chip>
                        <q-chip size="sm" color="orange" text-color="white" icon="storage">
                          {{ item.memory || 'N/A' }}
                        </q-chip>
                      </div>
                    </div>

                    <div class="col-auto text-right">
                      <div class="text-h5 text-primary text-weight-bold q-mb-sm">
                        ${{ item.price.toFixed(2) }}
                      </div>
                      <q-btn
                        unelevated
                        round
                        color="negative"
                        icon="delete"
                        size="md"
                        @click="removeFromCart(index)"
                        class="remove-btn"
                      >
                        <q-tooltip>Remover del carrito</q-tooltip>
                      </q-btn>
                    </div>
                  </q-card-section>
                </q-card>
              </transition-group>

              <!-- Botón para seguir comprando -->
              <q-card flat bordered class="continue-shopping-card">
                <q-card-section class="text-center q-pa-md">
                  <q-btn
                    outline
                    color="primary"
                    label="Continuar Comprando"
                    icon="arrow_back"
                    @click="goToHome"
                    size="md"
                  />
                </q-card-section>
              </q-card>
            </div>

            <!-- Resumen del pedido -->
            <div class="col-12 col-lg-4">
              <q-card class="base-card summary-card sticky-top">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="receipt" class="q-mr-sm" />
                    Resumen del Pedido
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-lg">
                  <div class="summary-row">
                    <div class="text-body1">
                      Subtotal ({{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }})
                    </div>
                    <div class="text-h6 text-weight-medium">${{ subtotal.toFixed(2) }}</div>
                  </div>

                  <div class="summary-row">
                    <div class="text-body1">Envío</div>
                    <div class="text-h6 text-weight-medium">
                      <span v-if="envio === 0" class="text-positive">
                        <q-icon name="local_shipping" />
                        Gratis
                      </span>
                      <span v-else>${{ envio.toFixed(2) }}</span>
                    </div>
                  </div>

                  <q-separator class="q-my-lg" />

                  <div class="summary-row total-row">
                    <div class="text-h5 text-weight-bold">Total</div>
                    <div class="text-h4 text-primary text-weight-bold">${{ total.toFixed(2) }}</div>
                  </div>

                  <q-btn
                    color="primary"
                    label="Proceder al Pago"
                    class="full-width q-mt-xl checkout-btn"
                    unelevated
                    size="lg"
                    icon="payment"
                    @click="procederPago"
                  />

                  <q-btn
                    outline
                    color="negative"
                    label="Vaciar Carrito"
                    class="full-width q-mt-md"
                    icon="delete_sweep"
                    @click="vaciarCarrito"
                  />
                </q-card-section>

                <!-- Información adicional -->
                <q-card-section class="bg-grey-1">
                  <div class="text-caption text-grey-7">
                    <div class="q-mb-sm">
                      <q-icon name="verified_user" color="positive" size="sm" />
                      Compra 100% segura
                    </div>
                    <div class="q-mb-sm">
                      <q-icon name="local_shipping" color="primary" size="sm" />
                      Envío gratis en compras mayores a $500
                    </div>
                    <div>
                      <q-icon name="assignment_return" color="orange" size="sm" />
                      30 días para devoluciones
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <!-- Diálogo para crear producto -->
    <CrearProductoDialog v-model="showCrearProductoDialog" @productoCreado="onProductoCreado" />
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCart } from '../composables/useCart'
import CrearProductoDialog from '../components/CrearProductoDialog.vue'

export default {
  name: 'CarritoPage',

  components: {
    CrearProductoDialog,
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { cartItems, removeFromCart, clearCart, subtotal, envio, total, totalItems } = useCart()
    const showCrearProductoDialog = ref(false)

    const goToHome = () => {
      router.push('/')
    }

    const goToStats = () => {
      router.push('/estadisticas')
    }

    const crearProducto = () => {
      showCrearProductoDialog.value = true
    }

    const onProductoCreado = () => {
      $q.notify({
        message: 'Producto creado. La lista principal ha sido actualizada.',
        color: 'info',
        position: 'top',
      })
    }

    const vaciarCarrito = () => {
      $q.dialog({
        title: 'Vaciar Carrito',
        message: '¿Estás seguro de que quieres vaciar tu carrito?',
        cancel: {
          label: 'Cancelar',
          color: 'grey',
          flat: true,
        },
        ok: {
          label: 'Sí, vaciar',
          color: 'negative',
          unelevated: true,
        },
        persistent: true,
      }).onOk(() => {
        clearCart()
        $q.notify({
          message: 'Carrito vaciado exitosamente',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 2000,
        })
      })
    }

    const procederPago = () => {
      $q.notify({
        message: '🎉 Procesando tu pedido...',
        caption: 'Funcionalidad de pago en desarrollo',
        color: 'warning',
        icon: 'payment',
        position: 'top',
        timeout: 3000,
      })
    }

    return {
      cartItems,
      subtotal,
      envio,
      total,
      totalItems,
      showCrearProductoDialog,
      goToHome,
      goToStats,
      crearProducto,
      removeFromCart,
      vaciarCarrito,
      onProductoCreado,
      procederPago,
    }
  },
}
</script>

<style scoped>
.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.empty-cart-card {
  max-width: 600px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: white;
}

.explore-btn {
  font-size: 16px;
  padding: 12px 40px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.explore-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.product-thumb {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.cart-item-card:hover .product-thumb {
  border-color: #667eea;
}

.product-details {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.remove-btn {
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
}

.continue-shopping-card {
  border-radius: 16px;
  border: 2px dashed #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.sticky-top {
  position: sticky;
  top: 80px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.total-row {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  padding: 20px;
  border-radius: 12px;
  margin: 0 -8px;
}

.checkout-btn {
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.checkout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.search-input {
  border-radius: 20px;
}

/* Animaciones de transición para items del carrito */
.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.5s ease;
}

.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.cart-item-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.cart-item-move {
  transition: transform 0.5s ease;
}
</style>
