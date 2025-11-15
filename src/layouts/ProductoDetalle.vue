<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header / Navbar -->
    <q-header elevated class="bg-gradient">
      <q-toolbar>
        <q-toolbar-title class="text-h5 text-weight-bold cursor-pointer" @click="goToHome">
          Tienda CellPhone
        </q-toolbar-title>

        <q-input
          dark
          dense
          standout
          v-model="searchQuery"
          placeholder="Buscar productos..."
          class="q-mx-md"
          style="width: 300px"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn outline label="Inicio" class="q-mx-xs" @click="goToHome" />
        <q-btn outline label="Estadísticas" class="q-mx-xs" @click="goToStats" />

        <q-btn round color="secondary" icon="add" class="q-mx-md" @click="crearProducto" />

        <q-btn flat round dense @click="goToCart">
          <q-icon name="shopping_cart" size="md" />
          <q-badge color="red" floating>{{ totalItems }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page class="q-pa-lg">
        <div class="row q-col-gutter-lg">
          <!-- Loading -->
          <div v-if="loading" class="col-12 text-center q-pa-xl">
            <q-spinner color="primary" size="3rem" />
            <div class="q-mt-md text-grey-7">Cargando producto...</div>
          </div>

          <!-- Producto cargado -->
          <template v-else-if="product">
            <!-- Columna Izquierda - Carrusel de Imágenes -->
            <div class="col-12 col-md-6">
              <q-card v-if="product.images && product.images.length > 0" class="shadow-4">
                <q-carousel
                  v-model="slide"
                  transition-prev="slide-right"
                  transition-next="slide-left"
                  swipeable
                  animated
                  control-color="primary"
                  navigation
                  padding
                  arrows
                  height="500px"
                  class="bg-grey-2"
                >
                  <q-carousel-slide
                    v-for="(image, index) in product.images"
                    :key="index"
                    :name="index + 1"
                    class="column no-wrap flex-center"
                  >
                    <q-img :src="image" fit="contain" style="max-height: 450px" />
                  </q-carousel-slide>

                  <template v-slot:control>
                    <q-carousel-control position="bottom-right" :offset="[18, 18]">
                      <q-btn
                        push
                        round
                        dense
                        color="white"
                        text-color="primary"
                        :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="fullscreen = !fullscreen"
                      />
                    </q-carousel-control>
                  </template>
                </q-carousel>
              </q-card>

              <!-- Miniaturas -->
              <div class="row q-mt-md q-col-gutter-sm">
                <div v-for="(image, index) in product.images" :key="index" class="col-3">
                  <q-img
                    :src="image"
                    ratio="1"
                    class="cursor-pointer rounded-borders"
                    :class="slide === index + 1 ? 'border-primary' : ''"
                    @click="slide = index + 1"
                    style="border: 3px solid transparent"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Columna Derecha - Información del Producto -->
          <div class="col-12 col-md-6">
            <div class="text-h4 text-weight-bold q-mb-md">
              {{ product?.name }}
            </div>

            <div class="row q-mb-sm items-center">
              <q-icon name="smartphone" size="sm" class="q-mr-sm text-grey-7" />
              <span class="text-body1">Pantalla: {{ product?.screen }}</span>
            </div>

            <div class="row q-mb-sm items-center">
              <q-icon name="storage" size="sm" class="q-mr-sm text-grey-7" />
              <span class="text-body1">Almacenamiento: {{ product?.storage }}</span>
            </div>

            <div class="row q-mb-sm items-center">
              <q-icon name="memory" size="sm" class="q-mr-sm text-grey-7" />
              <span class="text-body1">RAM: {{ product?.ram }}</span>
            </div>

            <div class="row q-mb-sm items-center">
              <q-icon name="signal_cellular_alt" size="sm" class="q-mr-sm text-grey-7" />
              <span class="text-body1">Red: {{ product?.network }}</span>
            </div>

            <div class="row q-mb-md items-center">
              <q-icon name="verified" size="sm" class="q-mr-sm text-grey-7" />
              <span class="text-body1">Condición: {{ product?.condition }}</span>
              <q-chip
                :color="product?.condition === 'Nuevo' ? 'green' : 'blue'"
                text-color="white"
                size="sm"
                class="q-ml-sm"
              >
                {{ product?.condition }}
              </q-chip>
            </div>

            <q-separator class="q-my-lg" />

            <!-- Precio y Botón de Compra -->
            <div class="text-h3 text-primary text-weight-bold q-mb-md">
              ${{ product?.price?.toFixed(2) }}
            </div>

            <q-btn
              unelevated
              color="primary"
              size="lg"
              label="Comprar"
              icon="shopping_cart"
              class="full-width q-mb-lg"
              style="padding: 16px"
              @click="addToCart"
            />

            <!-- Información del Vendedor -->
            <q-card class="bg-grey-2">
              <q-card-section>
                <div class="text-h6 text-weight-medium q-mb-sm">
                  <q-icon name="person" class="q-mr-sm" />
                  Información del Vendedor
                </div>
                <q-separator class="q-mb-md" />
                <div class="row q-mb-sm items-center">
                  <q-icon name="account_circle" size="sm" class="q-mr-sm text-grey-7" />
                  <span class="text-body1 text-weight-medium">{{ product?.nombreVendedor }}</span>
                </div>
                <div class="row items-center">
                  <q-icon name="phone" size="sm" class="q-mr-sm text-grey-7" />
                  <span class="text-body1">{{ product?.telefono }}</span>
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
          </div>
        </div>

        <!-- Sección de Descripción -->
        <q-card class="q-mt-xl">
          <q-card-section>
            <div class="text-h5 text-weight-bold q-mb-md">DESCRIPCIÓN</div>
            <q-separator class="q-mb-lg" />

            <div class="row q-col-gutter-lg">
              <!-- Columna 1 - Datos Técnicos -->
              <div class="col-12 col-md-6">
                <div class="text-h6 text-weight-medium q-mb-md text-primary">
                  Especificaciones Técnicas
                </div>

                <q-list bordered separator class="rounded-borders">
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Estado</q-item-label>
                      <q-item-label caption>{{ product?.condition }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Marca</q-item-label>
                      <q-item-label caption>{{ product?.brand }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Modelo</q-item-label>
                      <q-item-label caption>{{ product?.model }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Pantalla</q-item-label>
                      <q-item-label caption>{{ product?.screen }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Sistema Operativo</q-item-label>
                      <q-item-label caption>{{ product?.os }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">ROM (Almacenamiento)</q-item-label>
                      <q-item-label caption>{{ product?.storage }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">RAM (Memoria)</q-item-label>
                      <q-item-label caption>{{ product?.ram }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Cámara Principal</q-item-label>
                      <q-item-label caption>{{ product?.camera }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Batería</q-item-label>
                      <q-item-label caption>{{ product?.battery }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">Color</q-item-label>
                      <q-item-label caption>{{ product?.color }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!-- Columna 2 - Descripción Detallada -->
              <div class="col-12 col-md-6">
                <div class="text-h6 text-weight-medium q-mb-md text-primary">
                  Descripción del Producto
                </div>

                <div class="text-body1" style="line-height: 1.8; text-align: justify">
                  {{ product?.description }}
                </div>

                <div class="q-mt-lg">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">
                    Características Destacadas:
                  </div>
                  <q-list>
                    <q-item v-for="(feature, index) in product?.features" :key="index">
                      <q-item-section avatar>
                        <q-icon color="primary" name="check_circle" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ feature }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>

                <div class="q-mt-lg">
                  <div class="text-subtitle1 text-weight-medium q-mb-sm">Incluye:</div>
                  <q-list>
                    <q-item v-for="(item, index) in product?.includes" :key="index">
                      <q-item-section avatar>
                        <q-icon color="green" name="inventory_2" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Diálogo para crear producto -->
    <CrearProductoDialog v-model="showCrearProductoDialog" />
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCart } from '../composables/useCart'
import CrearProductoDialog from '../components/CrearProductoDialog.vue'

export default {
  name: 'ProductoDetalle',

  components: {
    CrearProductoDialog,
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { addToCart: addToCartComposable, totalItems } = useCart()
    const searchQuery = ref('')
    const slide = ref(1) // Inicializar el slide
    const fullscreen = ref(false)
    const showCrearProductoDialog = ref(false)

    // Datos del producto de Firebase
    const product = ref(null)
    const loading = ref(true)

    // Cargar producto por ID
    const cargarProducto = async () => {
      try {
        loading.value = true
        const route = router.currentRoute.value
        const productId = route.params.id

        if (!productId) {
          $q.notify({
            message: 'ID de producto no encontrado',
            color: 'negative',
            position: 'top',
          })
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
          network: data.network || '5G', // Usar dato si existe, si no, '5G'
          condition: data.estado === 'nuevo' ? 'Nuevo' : 'Usado',
          os: data.sistemaOperativo,
          camera: data.camera || 'No especificado',
          battery: data.battery || 'No especificado',
          color: data.color || 'Varios',
          price: data.precio,
          nombreVendedor: data.nombreVendedor,
          telefono: data.telefono, // Aseguramos que el teléfono se cargue
          images: data.imagen ? [data.imagen] : [], // Usar la imagen principal en un array
          description:
            data.descripcion ||
            `Excelente teléfono ${data.modelo} de ${data.marca}. ${data.pantalla}, ${data.rom} de almacenamiento, ${data.ram} de RAM.`,
          features: [
            `Pantalla ${data.pantalla}`,
            `Sistema Operativo ${data.sistemaOperativo}`,
            `Almacenamiento ${data.rom}`,
            `RAM ${data.ram}`,
            'Conectividad 5G',
            'Garantía incluida',
          ],
          includes: [
            `Teléfono ${data.modelo}`,
            'Cable de carga',
            'Manual de usuario',
            'Garantía oficial',
          ],
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

    // Cargar producto al montar
    cargarProducto()

    const goToHome = () => {
      router.push('/')
    }

    const goToStats = () => {
      router.push('/estadisticas')
    }

    const goToCart = () => {
      router.push('/carrito')
    }

    const addToCart = () => {
      if (product.value) {
        // Mapeamos el producto al formato que espera el carrito
        const cartProduct = {
          id: product.value.id,
          name: product.value.name,
          price: product.value.price,
          image: product.value.images[0], // Usamos la primera imagen
          brand: product.value.brand,
          screen: product.value.screen,
          memory: product.value.storage,
        }
        addToCartComposable(cartProduct)
      } else {
        $q.notify({ type: 'negative', message: 'No hay producto para agregar.' })
      }
    }

    const crearProducto = () => {
      showCrearProductoDialog.value = true
    }

    const copyPhone = () => {
      navigator.clipboard.writeText(product.value.telefono)
      $q.notify({
        message: 'Número copiado al portapapeles',
        color: 'info',
        icon: 'content_copy',
        position: 'top',
        timeout: 1500,
      })
    }

    return {
      searchQuery,
      slide,
      fullscreen,
      product,
      loading,
      totalItems,
      showCrearProductoDialog,
      goToHome,
      goToStats,
      goToCart,
      addToCart,
      crearProducto,
      copyPhone,
    }
  },
}
</script>

<style scoped>
.border-primary {
  border-color: #1976d2 !important;
}

.cursor-pointer {
  cursor: pointer;
}

.rounded-borders {
  border-radius: 8px;
}
</style>
