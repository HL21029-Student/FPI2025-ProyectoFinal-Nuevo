<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="row q-col-gutter-md q-pa-md">
      <div class="col-12 text-center q-pa-xl">
        <q-spinner color="primary" size="4rem" :thickness="4" />
        <div class="q-mt-md text-h6 text-grey-7">Cargando productos...</div>
      </div>
    </div>

    <!-- Grid de productos MÓVIL - 2 COLUMNAS -->
    <div v-else class="row q-col-gutter-sm q-pa-sm">
      <div v-for="product in paginatedProducts" :key="product.id" class="col-6">
        <q-card
          class="product-card-mobile cursor-pointer shadow-1"
          @click="goToProduct(product.id)"
        >
          <q-img :src="product.image" ratio="1" class="product-image-mobile">
            <div v-if="product.isNew" class="absolute-top-right q-ma-xs">
              <q-badge color="green" label="NUEVO" class="text-caption new-badge-mobile" />
            </div>
          </q-img>

          <q-card-section class="q-pa-sm">
            <div class="text-subtitle2 text-weight-bold ellipsis-2-lines product-title">
              {{ product.name }}
            </div>
            <div class="text-h6 text-primary text-weight-bold q-mt-xs product-price">
              ${{ product.price }}
            </div>

            <!-- Info compacta móvil -->
            <div class="row items-center q-mt-xs">
              <q-icon name="business" size="xs" color="grey-6" />
              <span class="text-caption text-grey-7 q-ml-xs">{{ product.brand }}</span>
            </div>
          </q-card-section>

          <!-- Botón agregar al carrito -->
          <q-btn
            round
            unelevated
            color="primary"
            icon="add_shopping_cart"
            size="sm"
            class="absolute-bottom-right q-ma-xs add-cart-btn-mobile"
            @click.stop="addToCart(product)"
          />
        </q-card>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center q-pa-xl">
      <q-icon name="search_off" size="4rem" color="grey-4" />
      <div class="text-h6 text-grey-7 q-mt-md">No se encontraron productos</div>
      <div class="text-body2 text-grey-6 q-mt-sm">Intenta ajustar los filtros de búsqueda</div>
    </div>

    <!-- Paginación MÓVIL -->
    <div class="row justify-center q-mt-lg q-mb-xl" v-if="!loading && filteredProducts.length > 0">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        direction-links
        flat
        color="grey"
        active-color="primary"
        :max-pages="6"
        boundary-links
        class="pagination-mobile"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/useCart'

export default defineComponent({
  name: 'ProductGrid',
  props: {
    products: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    searchQuery: {
      type: String,
      default: '',
    },
    showNewProducts: {
      type: Boolean,
      default: false,
    },
    selectedBrands: {
      type: Array,
      default: () => [],
    },
    selectedOS: {
      type: Array,
      default: () => [],
    },
    selectedScreens: {
      type: Array,
      default: () => [],
    },
    priceRange: {
      type: Object,
      default: () => ({ min: 0, max: 2000 }),
    },
    sortBy: {
      type: String,
      default: 'Fecha: Más Reciente',
    },
  },
  setup(props) {
    const router = useRouter()
    const { addToCart } = useCart()

    const currentPage = ref(1)
    const itemsPerPage = 8 // 4 filas de 2 productos = 8 por página

    const filteredProducts = computed(() => {
      let filtered = [...props.products]

      // Filtro de búsqueda
      if (props.searchQuery.trim()) {
        const query = props.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            (p.screen && p.screen.toLowerCase().includes(query)) ||
            (p.memory && p.memory.toLowerCase().includes(query)),
        )
      }

      // Filtro productos nuevos
      if (props.showNewProducts) {
        filtered = filtered.filter((p) => p.isNew)
      }

      // Filtro marcas
      if (props.selectedBrands.length) {
        filtered = filtered.filter((p) => props.selectedBrands.includes(p.brand))
      }

      // Filtro sistema operativo
      if (props.selectedOS.length) {
        filtered = filtered.filter((p) => props.selectedOS.includes(p.os))
      }

      // Filtro pantallas
      if (props.selectedScreens.length) {
        filtered = filtered.filter((p) =>
          props.selectedScreens.some((screen) => p.screen && p.screen.includes(screen)),
        )
      }

      // Filtro precio
      filtered = filtered.filter(
        (p) => p.price >= props.priceRange.min && p.price <= props.priceRange.max,
      )

      // Ordenamiento
      switch (props.sortBy) {
        case 'Precio: Menor a Mayor':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'Precio: Mayor a Menor':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'Fecha: Más Reciente':
          filtered.sort((a, b) => b.id.localeCompare(a.id))
          break
        case 'Fecha: Más Antiguo':
          filtered.sort((a, b) => a.id.localeCompare(b.id))
          break
        default:
          break
      }

      return filtered
    })

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredProducts.value.slice(start, end)
    })

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage)
    })

    const goToProduct = (productId) => {
      router.push(`/producto/${productId}`)
    }

    // Reset current page when filters change
    watch(
      () => [
        props.searchQuery,
        props.showNewProducts,
        props.selectedBrands,
        props.selectedOS,
        props.selectedScreens,
        props.priceRange,
        props.sortBy,
      ],
      () => {
        currentPage.value = 1
      },
    )

    return {
      currentPage,
      paginatedProducts,
      filteredProducts,
      totalPages,
      goToProduct,
      addToCart,
    }
  },
})
</script>

<style scoped>
.product-card-mobile {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.product-card-mobile:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image-mobile {
  border-radius: 12px 12px 0 0;
}

.new-badge-mobile {
  font-size: 10px;
  padding: 4px 8px;
}

.product-title {
  min-height: 2.8em;
  line-height: 1.4;
}

.product-price {
  font-size: 1.1rem;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.add-cart-btn-mobile {
  transform: scale(0.9);
}

.pagination-mobile {
  font-size: 0.9rem;
}

/* Tablets */
@media (min-width: 600px) {
  .product-card-mobile {
    margin-bottom: 16px;
  }
}

/* Escritorio */
@media (min-width: 1024px) {
  .product-card-mobile {
    margin-bottom: 24px;
  }

  .product-title {
    font-size: 1rem;
  }

  .product-price {
    font-size: 1.25rem;
  }
}
</style>
