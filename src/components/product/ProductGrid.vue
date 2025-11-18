<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="row q-col-gutter-md q-pa-md">
      <div class="col-12 text-center q-pa-xl">
        <q-spinner color="primary" size="4rem" :thickness="4" />
        <div class="q-mt-md text-h6 text-grey-7">Cargando productos...</div>
      </div>
    </div>

    <!-- Grid de productos - 2 columnas en móvil -->
    <div v-else class="row q-col-gutter-lg q-pa-lg">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="col-6 col-sm-6 col-md-4 col-lg-3"
      >
        <q-card class="base-card product-card cursor-pointer" @click="goToProduct(product.id)">
          <q-img :src="product.image" ratio="1" class="bg-grey-3 product-image">
            <div v-if="product.isNew" class="absolute-top-right q-ma-sm">
              <q-badge color="green" label="NUEVO" class="new-badge">
                <q-icon name="star" size="xs" class="q-ml-xs" />
              </q-badge>
            </div>
            <div class="absolute-bottom product-overlay">
              <div class="text-white text-weight-bold">Ver detalles</div>
            </div>
          </q-img>

          <q-card-section class="q-pb-xs">
            <div class="text-subtitle1 text-weight-bold ellipsis-2-lines">{{ product.name }}</div>
            <div class="text-h6 text-primary text-weight-bold q-mt-sm">${{ product.price }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn
              unelevated
              color="primary"
              icon="add_shopping_cart"
              class="full-width"
              @click.stop="addToCart(product)"
              label="Agregar"
              size="sm"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center q-pa-xl">
      <q-icon name="search_off" size="6rem" color="grey-5" />
      <div class="text-h5 text-grey-7 q-mt-md">No se encontraron productos</div>
      <div class="text-body2 text-grey-6 q-mt-sm">Intenta ajustar los filtros de búsqueda</div>
    </div>

    <!-- Paginación -->
    <div
      class="row q-mt-xl q-mb-lg items-center justify-center"
      v-if="!loading && filteredProducts.length > 0"
    >
      <div class="col-auto">
        <q-card flat bordered class="pagination-card">
          <q-card-section class="q-pa-md">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="7"
              direction-links
              boundary-links
              color="primary"
              active-design="unelevated"
              active-color="primary"
              active-text-color="white"
            />
            <div class="text-center q-mt-sm text-grey-7">
              Mostrando {{ paginatedProducts.length }} de {{ filteredProducts.length }} productos
            </div>
          </q-card-section>
        </q-card>
      </div>
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
    const itemsPerPage = 12

    const filteredProducts = computed(() => {
      let filtered = [...props.products]

      if (props.searchQuery.trim()) {
        const query = props.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.screen.toLowerCase().includes(query) ||
            p.memory.toLowerCase().includes(query),
        )
      }

      if (props.showNewProducts) {
        filtered = filtered.filter((p) => p.isNew)
      }

      if (props.selectedBrands.length) {
        filtered = filtered.filter((p) => props.selectedBrands.includes(p.brand))
      }

      if (props.selectedOS.length) {
        filtered = filtered.filter((p) => props.selectedOS.includes(p.os))
      }

      if (props.selectedScreens.length) {
        filtered = filtered.filter((p) => props.selectedScreens.includes(p.screen))
      }

      filtered = filtered.filter(
        (p) => p.price >= props.priceRange.min && p.price <= props.priceRange.max,
      )

      switch (props.sortBy) {
        case 'Precio: Menor a Mayor':
          filtered.sort((a, b) => a.price - b.price)
          break
        case 'Precio: Mayor a Menor':
          filtered.sort((a, b) => b.price - a.price)
          break
        case 'Fecha: Más Reciente':
          // Ordenar por timestamp si existe, si no por id para compatibilidad
          filtered.sort((a, b) => {
            const aTime = typeof a.createdAt === 'number' ? a.createdAt : -Infinity
            const bTime = typeof b.createdAt === 'number' ? b.createdAt : -Infinity
            if (aTime !== bTime) return bTime - aTime
            // Fallback estable por id
            return String(b.id).localeCompare(String(a.id))
          })
          break
        case 'Fecha: Más Antiguo':
          filtered.sort((a, b) => {
            const aTime = typeof a.createdAt === 'number' ? a.createdAt : Infinity
            const bTime = typeof b.createdAt === 'number' ? b.createdAt : Infinity
            if (aTime !== bTime) return aTime - bTime
            return String(a.id).localeCompare(String(b.id))
          })
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
.product-image {
  position: relative;
  overflow: hidden;
}

.product-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 12px;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.new-badge {
  font-weight: bold;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3em;
}

.add-cart-btn {
  transition: all 0.3s ease;
}

.add-cart-btn:hover {
  transform: scale(1.1);
}

.pagination-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.base-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.base-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
