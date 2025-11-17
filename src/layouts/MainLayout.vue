<template>
  <q-layout view="hHh lpR fFf">
    <!-- HEADER MÓVIL SIMPLIFICADO -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <!-- Botón menú hamburguesa -->
        <q-btn flat round dense icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="text-center text-weight-bold"> Tienda CellPhone </q-toolbar-title>

        <!-- Botones esenciales -->
        <q-btn flat round dense icon="shopping_cart" @click="goToCart" class="q-mr-xs">
          <q-badge v-if="totalItems > 0" color="red" floating>{{ totalItems }}</q-badge>
        </q-btn>

        <q-btn flat round dense icon="add" @click="crearProducto" />
      </q-toolbar>

      <!-- BARRA DE BÚSQUEDA -->
      <q-toolbar class="q-pt-none">
        <q-input
          dense
          standout
          v-model="searchQuery"
          placeholder="Buscar productos..."
          class="full-width"
          bg-color="white"
          color="primary"
        >
          <template v-slot:append>
            <q-icon name="search" color="primary" />
          </template>
        </q-input>

        <!-- BOTÓN FILTROS MÓVIL -->
        <q-btn flat icon="filter_list" @click="toggleRightDrawer" class="q-ml-sm" />
      </q-toolbar>
    </q-header>

    <!-- DRAWER DE NAVEGACIÓN IZQUIERDA -->
    <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered :width="280">
      <q-scroll-area class="fit">
        <q-list padding class="text-primary">
          <q-item-label header class="text-weight-bold text-grey-8"> Navegación </q-item-label>

          <q-item clickable v-close-popup @click="goToHome">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Inicio</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="crearProducto">
            <q-item-section avatar>
              <q-icon name="add" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Nuevo anuncio</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="goToCart">
            <q-item-section avatar>
              <q-icon name="shopping_cart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Carrito</q-item-label>
              <q-badge v-if="totalItems > 0" color="primary" floating>{{ totalItems }}</q-badge>
            </q-item-section>
          </q-item>

          <q-item clickable v-close-popup @click="goToStats">
            <q-item-section avatar>
              <q-icon name="bar_chart" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Estadísticas</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- DRAWER DE FILTROS DERECHA -->
    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered :width="280">
      <q-scroll-area class="fit">
        <div class="q-pa-md">
          <div class="text-h6 text-weight-bold text-primary q-mb-md">
            <q-icon name="filter_list" class="q-mr-sm" />
            Filtros
          </div>

          <!-- Filtro Estado -->
          <q-list padding>
            <q-item-label header class="text-weight-bold text-grey-8">
              <q-icon name="new_releases" class="q-mr-xs" />
              Estado
            </q-item-label>
            <q-item>
              <q-item-section>
                <q-toggle v-model="showNewProducts" label="Solo productos nuevos" color="primary" />
              </q-item-section>
            </q-item>
          </q-list>

          <q-separator class="q-my-md" />

          <!-- Filtro Marca -->
          <BrandFilter v-model="selectedBrands" :brands="brands" />

          <q-separator class="q-my-md" />

          <!-- Filtro Sistema -->
          <OSFilter v-model="selectedOS" :operatingSystems="operatingSystems" />

          <q-separator class="q-my-md" />

          <!-- Filtro Pantalla -->
          <ScreenSizeFilter v-model="selectedScreens" :screenSizes="screenSizes" />

          <q-separator class="q-my-md" />

          <!-- Rango de Precio en Drawer -->
          <div class="q-pa-sm">
            <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">Rango de Precio</div>
            <q-range v-model="priceRange" :min="0" :max="2000" :step="50" label color="primary" />
            <div class="text-caption text-center q-mt-sm text-weight-medium">
              ${{ priceRange.min }} - ${{ priceRange.max }}
            </div>
          </div>
        </div>
      </q-scroll-area>
    </q-drawer>

    <!-- CONTENIDO PRINCIPAL -->
    <q-page-container>
      <q-page class="bg-grey-1">
        <!-- CONTROLES SUPERIORES SOLO EN ESCRITORIO -->
        <div class="controls-bar q-pa-md gt-sm">
          <div class="row q-mb-md items-center">
            <div class="col-auto q-mr-md">
              <q-card flat bordered class="price-range-card q-pa-md">
                <div class="text-subtitle2 text-weight-bold text-primary q-mb-sm">
                  <q-icon name="attach_money" class="q-mr-xs" />
                  Rango de Precio
                </div>
                <q-range
                  v-model="priceRange"
                  :min="0"
                  :max="2000"
                  :step="50"
                  label
                  color="primary"
                  style="width: 300px"
                />
                <div class="text-caption text-weight-bold text-center q-mt-sm">
                  ${{ priceRange.min }} - ${{ priceRange.max }}
                </div>
              </q-card>
            </div>

            <q-space />

            <q-card flat bordered class="sort-card">
              <q-select
                v-model="sortBy"
                :options="sortOptions"
                label="Ordenar por"
                outlined
                dense
                color="primary"
              >
                <template v-slot:prepend>
                  <q-icon name="sort" color="primary" />
                </template>
              </q-select>
            </q-card>
          </div>
        </div>

        <!-- CONTROLES MÓVILES -->
        <div class="row items-center q-pa-md lt-md">
          <q-select
            v-model="sortBy"
            :options="sortOptions"
            label="Ordenar por"
            outlined
            dense
            class="col-8"
            color="primary"
          />
          <q-space />
          <div class="text-caption text-grey">{{ filteredProducts.length }} productos</div>
        </div>

        <!-- PRODUCT GRID -->
        <ProductGrid
          :products="products"
          :loading="loading"
          :searchQuery="searchQuery"
          :showNewProducts="showNewProducts"
          :selectedBrands="selectedBrands"
          :selectedOS="selectedOS"
          :selectedScreens="selectedScreens"
          :priceRange="priceRange"
          :sortBy="sortBy"
        />
      </q-page>
    </q-page-container>

    <!-- Diálogo para crear producto (solo escritorio) -->
    <CrearProductoDialog v-model="showCrearProductoDialog" @productoCreado="cargarProductos" />
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useCart } from '../composables/useCart'
import { celularesService } from '../services/celularesService'
import CrearProductoDialog from '../components/CrearProductoDialog.vue'
import BrandFilter from '../components/filters/BrandFilter.vue'
import OSFilter from '../components/filters/OSFilter.vue'
import ScreenSizeFilter from '../components/filters/ScreenSizeFilter.vue'
import ProductGrid from '../components/product/ProductGrid.vue'

export default {
  name: 'MainLayout',

  components: {
    CrearProductoDialog,
    BrandFilter,
    OSFilter,
    ScreenSizeFilter,
    ProductGrid,
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { totalItems } = useCart()

    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)
    const searchQuery = ref('')
    const showNewProducts = ref(false)

    // Filtros
    const brands = ['Samsung', 'Apple', 'Xiaomi', 'Honor', 'Motorola', 'OnePlus', 'Google']
    const operatingSystems = ['Android', 'iOS']
    const screenSizes = ['6.7"', '6.8"', '6.73"', '6.82"', '6.5"', '6.0"']

    const selectedBrands = ref([])
    const selectedOS = ref([])
    const selectedScreens = ref([])

    const priceRange = ref({ min: 0, max: 2000 })
    const sortBy = ref('Fecha: Más Reciente')
    const sortOptions = [
      'Precio: Menor a Mayor',
      'Precio: Mayor a Menor',
      'Fecha: Más Reciente',
      'Fecha: Más Antiguo',
    ]

    // Productos
    const products = ref([])
    const loading = ref(true)

    const cargarProductos = async () => {
      try {
        loading.value = true
        const data = await celularesService.getCelulares()
        products.value = data.map((p) => ({
          id: p.id,
          name: p.tituloAnuncio || 'Sin título',
          brand: p.marca,
          os: p.sistemaOperativo || 'Android',
          screen: p.pantalla,
          memory: p.rom,
          color: 'Varios',
          price: p.precio,
          image: p.imagen,
          isNew: p.estado === 'nuevo',
        }))
      } catch (error) {
        console.error('Error cargando productos:', error)
        $q.notify({
          message: 'Error al cargar los productos',
          color: 'negative',
          position: 'top',
        })
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      cargarProductos()
    })

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const toggleRightDrawer = () => {
      rightDrawerOpen.value = !rightDrawerOpen.value
    }

    const goToHome = () => {
      router.push('/')
    }

    const goToStats = () => {
      router.push('/estadisticas')
    }

    const goToCart = () => {
      router.push('/carrito')
    }

    const showCrearProductoDialog = ref(false)

    const crearProducto = () => {
      if ($q.platform.is.mobile) {
        router.push('/crear-anuncio')
      } else {
        showCrearProductoDialog.value = true
      }
    }

    const filteredProducts = computed(() => {
      return products.value // Filtrado se hace en ProductGrid
    })

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      searchQuery,
      showNewProducts,
      brands,
      operatingSystems,
      screenSizes,
      selectedBrands,
      selectedOS,
      selectedScreens,
      priceRange,
      sortBy,
      sortOptions,
      products,
      loading,
      totalItems,
      filteredProducts,
      toggleLeftDrawer,
      toggleRightDrawer,
      goToHome,
      goToStats,
      goToCart,
      crearProducto,
      showCrearProductoDialog,
      cargarProductos,
    }
  },
}
</script>

<style scoped>
.controls-bar {
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid #e0e0e0;
}

.price-range-card,
.sort-card {
  border-radius: 12px;
}
</style>
