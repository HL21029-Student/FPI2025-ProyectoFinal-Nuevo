<!-- MainLayout.vue -->
<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header / Navbar -->
    <q-header elevated class="bg-gradient">
      <q-toolbar>
        <q-icon name="campaign" size="md" class="q-mr-sm" />
        <q-toolbar-title class="text-h6 text-weight-bold cursor-pointer" @click="goToHome">
          Tienda CellPhone
        </q-toolbar-title>

        <q-input
          dark
          dense
          standout
          v-model="searchQuery"
          placeholder="Buscar productos..."
          class="q-mx-md search-input"
          style="width: 350px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>

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

        <q-btn flat round dense @click="goToCart" class="cart-btn">
          <q-icon name="shopping_cart" size="md" />
          <q-badge color="red" floating class="pulse-badge">{{ totalItems }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Sidebar izquierdo -->
    <q-drawer v-model="leftDrawerOpen" show-if-above :width="280" bordered class="sidebar-gradient">
      <div class="q-pa-md">
        <div class="text-h6 text-weight-bold text-primary q-mb-md">
          <q-icon name="filter_list" class="q-mr-sm" />
          Filtros
        </div>
      </div>

      <q-list padding>
        <q-item class="filter-item">
          <q-item-section>
            <q-toggle
              v-model="showNewProducts"
              label="Productos Nuevos"
              color="light-green-4"
              class="text-weight-medium"
            />
          </q-item-section>
        </q-item>

        <q-separator class="q-my-md" />

        <!-- Filtro Marca (using new component) -->
        <BrandFilter v-model="selectedBrands" :brands="brands" />

        <q-separator class="q-my-md" />

        <!-- Filtro Sistema (using new component) -->
        <OSFilter v-model="selectedOS" :operatingSystems="operatingSystems" />

        <q-separator class="q-my-md" />

        <!-- Filtro Pantalla (using new component) -->
        <ScreenSizeFilter v-model="selectedScreens" :screenSizes="screenSizes" />
      </q-list>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page class="page-gradient">
        <!-- Controles superiores -->
        <div class="controls-bar q-pa-md">
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
                menu-class="q-menu"
                style="width: 220px"
              >
                <template v-slot:prepend>
                  <q-icon name="sort" color="primary" />
                </template>
              </q-select>
            </q-card>
          </div>
        </div>

        <!-- Product Grid Component -->
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

    <!-- Diálogo para crear producto -->
    <CrearProductoDialog v-model="showCrearProductoDialog" @productoCreado="cargarProductos" />
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue'
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
    const leftDrawerOpen = ref(true)
    const searchQuery = ref('')
    const showNewProducts = ref(false)

    // Filtros
    const brands = ['Samsung', 'Apple', 'Xiaomi', 'Honor', 'Motorola', 'OnePlus', 'Google']
    const operatingSystems = ['Android', 'iOS']
    const screenSizes = [
      '6.7 pulgadas',
      '6.8 pulgadas',
      '6.73 pulgadas',
      '6.82 pulgadas',
      '6.5 pulgadas',
      '6.0 pulgadas',
    ]

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

    // Productos de Firebase
    const products = ref([])
    const loading = ref(true)

    // Cargar productos de Firebase
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
          icon: 'error',
        })
      } finally {
        loading.value = false
      }
    }

    // Cargar productos al montar
    onMounted(() => {
      cargarProductos()
    })

    const goToHome = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      $q.notify({
        message: 'Ya estás en el inicio',
        color: 'info',
        position: 'top',
        timeout: 1500,
        icon: 'home',
      })
    }

    const goToStats = () => {
      router.push('/estadisticas')
    }

    const goToCart = () => {
      router.push('/carrito')
    }

    // Diálogo para crear producto
    const showCrearProductoDialog = ref(false)

    const crearProducto = () => {
      showCrearProductoDialog.value = true
    }

    return {
      leftDrawerOpen,
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
      products, // Pass products to ProductGrid
      loading,
      totalItems,
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
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.price-range-card,
.sort-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.filter-item {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.filter-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.search-input {
  border-radius: 20px;
}
</style>
