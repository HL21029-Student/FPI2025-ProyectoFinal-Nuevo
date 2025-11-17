<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER MÓVIL SIMPLIFICADO -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Botón de volver en móvil -->
        <q-btn
          v-if="$q.screen.lt.md"
          flat
          dense
          round
          icon="arrow_back"
          @click="goToHome"
          class="q-mr-sm"
        />

        <q-icon name="campaign" size="md" class="q-mr-sm" />
        <q-toolbar-title class="text-h6 text-weight-bold cursor-pointer" @click="goToHome">
          Tienda CellPhone
        </q-toolbar-title>

        <!-- Botones solo en desktop -->
        <div v-if="$q.screen.gt.sm">
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
        </div>
      </q-toolbar>
    </q-header>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="page-gradient q-pa-md">
        <!-- Título con animación -->
        <div class="row items-center q-mb-lg">
          <q-icon
            name="shopping_cart"
            :size="$q.screen.lt.md ? '2rem' : '3rem'"
            color="primary"
            class="q-mr-md"
          />
          <div
            :class="$q.screen.lt.md ? 'text-h4' : 'text-h3'"
            class="text-weight-bold text-primary"
          >
            Carrito de Compras
          </div>
          <q-space />
          <q-chip
            v-if="cartItems.length > 0"
            color="primary"
            text-color="white"
            icon="inventory"
            :class="$q.screen.lt.md ? 'text-subtitle1' : 'text-h6'"
          >
            {{ totalItems }} {{ totalItems === 1 ? 'producto' : 'productos' }}
          </q-chip>
        </div>

        <!-- Carrito vacío -->
        <div v-if="cartItems.length === 0" class="empty-cart-mobile">
          <div class="text-center q-pa-xl">
            <q-icon name="shopping_cart" size="6rem" color="grey-4" class="q-mb-lg" />
            <div class="text-h5 text-weight-bold text-grey-7 q-mb-md">Tu carrito está vacío</div>
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
              class="explore-btn-mobile"
            />
          </div>
        </div>

        <!-- Items del carrito -->
        <div v-else>
          <div class="row" :class="$q.screen.lt.md ? 'flex-column' : 'q-col-gutter-lg'">
            <!-- Lista de productos -->
            <div :class="$q.screen.lt.md ? 'col-12 q-mb-lg' : 'col-12 col-lg-8'">
              <transition-group name="cart-item" tag="div">
                <q-card
                  v-for="(item, index) in cartItems"
                  :key="item.id || index"
                  class="base-card cart-item-card q-mb-md"
                >
                  <q-card-section class="row items-center q-pa-sm">
                    <div class="col-auto q-mr-sm">
                      <q-img
                        :src="item.image"
                        :style="
                          $q.screen.lt.md
                            ? 'width: 80px; height: 80px'
                            : 'width: 100px; height: 100px'
                        "
                        class="rounded-borders product-thumb"
                      >
                        <div v-if="item.isNew" class="absolute-top-left q-ma-xs">
                          <q-badge color="green" label="NUEVO" class="text-caption" />
                        </div>
                      </q-img>
                    </div>

                    <!-- Información del producto -->
                    <div class="col">
                      <div
                        :class="$q.screen.lt.md ? 'text-subtitle1' : 'text-h6'"
                        class="text-weight-bold q-mb-xs"
                      >
                        {{ item.name }}
                      </div>
                      <div class="product-details">
                        <q-chip size="sm" color="purple" text-color="white" icon="business">
                          {{ item.brand }}
                        </q-chip>
                        <q-chip
                          v-if="!$q.screen.lt.md"
                          size="sm"
                          color="primary"
                          text-color="white"
                          icon="phone_iphone"
                        >
                          {{ item.screen }}
                        </q-chip>
                        <q-chip
                          v-if="!$q.screen.lt.md"
                          size="sm"
                          color="orange"
                          text-color="white"
                          icon="storage"
                        >
                          {{ item.memory || 'N/A' }}
                        </q-chip>
                      </div>
                    </div>

                    <div class="col-auto text-right">
                      <div
                        :class="$q.screen.lt.md ? 'text-h6' : 'text-h5'"
                        class="text-primary text-weight-bold q-mb-sm"
                      >
                        ${{ item.price.toFixed(2) }}
                      </div>
                    </div>

                    <!-- Botón eliminar -->
                    <div class="col-auto">
                      <q-btn
                        round
                        flat
                        color="negative"
                        icon="delete"
                        :size="$q.screen.lt.md ? 'sm' : 'md'"
                        @click="removeFromCart(index)"
                        class="remove-btn-mobile"
                      >
                        <q-tooltip>Eliminar</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </transition-group>

            <!-- Botón seguir comprando -->
            <q-btn
              outline
              color="primary"
              label="Seguir Comprando"
              icon="arrow_back"
              @click="goToHome"
              class="full-width q-mt-md"
            />
          </div>

            <!-- Resumen del pedido -->
            <div :class="$q.screen.lt.md ? 'col-12' : 'col-12 col-lg-4'">
              <q-card class="base-card summary-card" :class="$q.screen.lt.md ? '' : 'sticky-top'">
                <q-card-section class="bg-primary text-white">
                  <div class="text-h6 text-weight-bold">
                    <q-icon name="receipt" class="q-mr-sm" />
                    Resumen del Pedido
                  </div>
                  <div class="text-h6 text-weight-medium">${{ subtotal.toFixed(2) }}</div>
                </div>

                <div class="resumen-row q-mb-md">
                  <div class="text-body1">Envío</div>
                  <div class="text-h6 text-weight-medium">
                    <span v-if="envio === 0" class="text-positive">
                      <q-icon name="local_shipping" />
                      Gratis
                    </span>
                    <span v-else>${{ envio.toFixed(2) }}</span>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <div class="resumen-row total-row">
                  <div class="text-h6 text-weight-bold">Total</div>
                  <div class="text-h5 text-primary text-weight-bold">${{ total.toFixed(2) }}</div>
                </div>

                <q-btn
                  color="primary"
                  label="Proceder al Pago"
                  class="full-width q-mt-lg checkout-btn-mobile"
                  unelevated
                  size="lg"
                  icon="payment"
                  @click="procederPago"
                />

                <q-btn
                  outline
                  color="negative"
                  label="Vaciar Carrito"
                  class="full-width q-mt-sm"
                  icon="delete_sweep"
                  @click="vaciarCarrito"
                />
              </q-card-section>

              <!-- Información adicional -->
              <q-card-section class="bg-grey-2">
                <div class="text-caption text-grey-7">
                  <div class="row items-center q-mb-xs">
                    <q-icon name="verified_user" color="positive" size="sm" class="q-mr-xs" />
                    <span>Compra 100% segura</span>
                  </div>
                  <div class="row items-center q-mb-xs">
                    <q-icon name="local_shipping" color="primary" size="sm" class="q-mr-xs" />
                    <span>Envío gratis en compras mayores a $500</span>
                  </div>
                  <div class="row items-center">
                    <q-icon name="assignment_return" color="orange" size="sm" class="q-mr-xs" />
                    <span>30 días para devoluciones</span>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
//import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCart } from '../composables/useCart'

export default {
  name: 'CarritoPage',

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { cartItems, removeFromCart, clearCart, subtotal, envio, total, totalItems } = useCart()

    const goToHome = () => {
      router.push('/')
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
        message: '🎉 Redirigiendo al pago...',
        caption: 'Funcionalidad de pago en desarrollo',
        color: 'warning',
        icon: 'payment',
        position: 'top',
        timeout: 3000,
      })

      // Simular redirección a pasarela de pago
      setTimeout(() => {
        $q.notify({
          message: 'Pedido procesado exitosamente',
          color: 'positive',
          icon: 'check_circle',
          position: 'top',
          timeout: 4000,
        })
        clearCart()
      }, 2000)
    }

    return {
      cartItems,
      subtotal,
      envio,
      total,
      totalItems,
      goToHome,
      removeFromCart,
      vaciarCarrito,
      procederPago,
    }
  },
}
</script>

<style scoped>
.carrito-mobile {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.empty-cart-mobile {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 20px;
}

.explore-btn-mobile {
  font-size: 16px;
  padding: 12px 40px;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.explore-btn-mobile:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.carrito-contenido {
  padding-bottom: 320px; /* Espacio para el resumen fijo */
}

.productos-lista {
  background: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-item-mobile {
  border-radius: 12px;
  border-left: 4px solid #1976d2;
  transition: all 0.3s ease;
}

.cart-item-mobile:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-thumb-mobile {
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.cart-item-mobile:hover .product-thumb-mobile {
  border-color: #1976d2;
}

.remove-btn-mobile {
  transition: all 0.3s ease;
}

.remove-btn-mobile:hover {
  transform: scale(1.1);
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

/* RESUMEN FIJO EN PARTE INFERIOR */
.resumen-fijo {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.resumen-card-mobile {
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  max-height: 60vh;
  overflow-y: auto;
}

.resumen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-row {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(33, 150, 243, 0.1));
  padding: 16px;
  border-radius: 12px;
  margin: 8px -8px;
}

.checkout-btn-mobile {
  font-size: 16px;
  font-weight: bold;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.checkout-btn-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-gradient {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.base-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.base-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Animaciones para items del carrito */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .summary-card {
    margin-top: 20px;
  }

  .product-details {
    justify-content: flex-start;
  }
}
</style>
