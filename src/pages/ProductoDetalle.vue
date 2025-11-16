<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER SIMPLIFICADO MÓVIL -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat round dense icon="arrow_back" @click="$router.back()" />
        <q-toolbar-title class="text-center text-weight-bold">
          Detalle del Producto
        </q-toolbar-title>
        <q-btn flat round dense icon="shopping_cart" @click="goToCart">
          <q-badge v-if="totalItems > 0" color="red" floating>{{ totalItems }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="producto-detalle-mobile">
        <!-- CARRUSEL DE IMÁGENES -->
        <q-carousel
          v-model="slide"
          swipeable
          animated
          control-color="primary"
          navigation
          padding
          arrows
          height="300px"
          class="bg-grey-2"
        >
          <q-carousel-slide
            v-for="(image, index) in product.images"
            :key="index"
            :name="index + 1"
            class="flex flex-center"
          >
            <q-img :src="image" fit="contain" class="full-height" />
          </q-carousel-slide>
        </q-carousel>

        <!-- INFORMACIÓN PRINCIPAL -->
        <div class="q-pa-md">
          <div class="text-h5 text-weight-bold q-mb-xs">{{ product.name }}</div>
          <div class="text-h4 text-primary text-weight-bold q-mb-md">${{ product.price }}</div>

          <!-- CHIPS INFORMATIVOS -->
          <div class="row q-gutter-xs q-mb-md">
            <q-chip
              :color="product.condition === 'Nuevo' ? 'green' : 'blue'"
              text-color="white"
              dense
            >
              {{ product.condition }}
            </q-chip>
            <q-chip color="grey-7" text-color="white" dense icon="business">
              {{ product.brand }}
            </q-chip>
          </div>
        </div>

        <!-- ACORDEONES PARA ORGANIZAR INFORMACIÓN -->
        <div class="q-px-md">
          <!-- ESPECIFICACIONES TÉCNICAS -->
          <q-expansion-item
            group="detalles"
            label="Especificaciones Técnicas"
            default-opened
            class="q-mb-sm"
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="row q-col-gutter-y-md">
                  <div class="col-6"><strong>Marca:</strong></div>
                  <div class="col-6">{{ product.brand }}</div>

                  <div class="col-6"><strong>Modelo:</strong></div>
                  <div class="col-6">{{ product.model }}</div>

                  <div class="col-6"><strong>Pantalla:</strong></div>
                  <div class="col-6">{{ product.screen }}</div>

                  <div class="col-6"><strong>Sistema:</strong></div>
                  <div class="col-6">{{ product.os }}</div>

                  <div class="col-6"><strong>Almacenamiento:</strong></div>
                  <div class="col-6">{{ product.storage }}</div>

                  <div class="col-6"><strong>RAM:</strong></div>
                  <div class="col-6">{{ product.ram }}</div>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- INFORMACIÓN DEL VENDEDOR -->
          <q-expansion-item
            group="detalles"
            label="Información del Vendedor"
            class="q-mb-sm"
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="row items-center q-mb-sm">
                  <q-icon name="person" class="q-mr-sm" color="primary" />
                  <span class="text-weight-medium">{{ product.nombreVendedor }}</span>
                </div>
                <div class="row items-center">
                  <q-icon name="phone" class="q-mr-sm" color="primary" />
                  <span>{{ product.telefono }}</span>
                  <q-btn
                    flat
                    dense
                    color="primary"
                    icon="content_copy"
                    size="sm"
                    class="q-ml-sm"
                    @click="copyPhone"
                  >
                    <q-tooltip>Copiar número</q-tooltip>
                  </q-btn>
                </div>
                <q-btn
                  outline
                  color="primary"
                  label="Contactar Vendedor"
                  icon="chat"
                  class="full-width q-mt-md"
                />
              </q-card-section>
            </q-card>
          </q-expansion-item>

          <!-- DESCRIPCIÓN -->
          <q-expansion-item
            group="detalles"
            label="Descripción"
            class="q-mb-sm"
            header-class="text-weight-bold"
          >
            <q-card>
              <q-card-section>
                <div class="text-body1" style="line-height: 1.6; text-align: justify">
                  {{ product.description }}
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>

        <!-- ESPACIADOR PARA BOTÓN FIJO -->
        <div style="height: 80px"></div>
      </q-page>
    </q-page-container>

    <!-- BOTÓN DE COMPRA FIJO EN INFERIOR -->
    <q-footer elevated class="bg-white text-primary">
      <q-toolbar>
        <q-btn
          unelevated
          color="primary"
          label="Comprar"
          icon="shopping_cart"
          class="full-width"
          size="lg"
          @click="addToCart"
        />
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCart } from '../composables/useCart'

export default {
  name: 'ProductoDetalle',

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { addToCart: addToCartComposable, totalItems } = useCart()

    const slide = ref(1)
    const product = ref({})
    const loading = ref(true)

    const cargarProducto = async () => {
      try {
        loading.value = true
        const route = router.currentRoute.value
        const productId = route.params.id

        if (!productId) {
          router.push('/')
          return
        }

        const { celularesService } = await import('../services/celularesService')
        const data = await celularesService.getCelularById(productId)

        product.value = {
          id: data.id,
          name: data.tituloAnuncio || 'Sin título',
          brand: data.marca,
          model: data.modelo,
          screen: data.pantalla,
          storage: data.rom,
          ram: data.ram,
          condition: data.estado === 'nuevo' ? 'Nuevo' : 'Usado',
          os: data.sistemaOperativo,
          price: data.precio,
          nombreVendedor: data.nombreVendedor,
          telefono: data.telefono,
          images: data.imagen ? [data.imagen] : [],
          description: data.descripcion || 'Sin descripción disponible.',
        }
      } catch (error) {
        console.error('Error cargando producto:', error)
        $q.notify({
          message: 'Error al cargar el producto',
          color: 'negative',
          position: 'top',
        })
        router.push('/')
      } finally {
        loading.value = false
      }
    }

    onMounted(cargarProducto)

    const goToCart = () => {
      router.push('/carrito')
    }

    const addToCart = () => {
      if (product.value) {
        const cartProduct = {
          id: product.value.id,
          name: product.value.name,
          price: product.value.price,
          image: product.value.images[0],
          brand: product.value.brand,
          screen: product.value.screen,
          memory: product.value.storage,
        }
        addToCartComposable(cartProduct)
        $q.notify({
          message: 'Producto agregado al carrito',
          color: 'positive',
          position: 'top',
          icon: 'shopping_cart',
        })
      }
    }

    const copyPhone = () => {
      if (product.value.telefono) {
        navigator.clipboard.writeText(product.value.telefono)
        $q.notify({
          message: 'Número copiado al portapapeles',
          color: 'info',
          icon: 'content_copy',
          position: 'top',
          timeout: 1500,
        })
      }
    }

    return {
      slide,
      product,
      loading,
      totalItems,
      goToCart,
      addToCart,
      copyPhone,
    }
  },
}
</script>

<style scoped>
.producto-detalle-mobile {
  padding-bottom: 80px;
}

/* Mejoras para el acordeón */
:deep(.q-expansion-item__content) {
  background-color: #fafafa;
}

:deep(.q-expansion-item__toggle-icon) {
  color: #1976d2;
}
</style>
