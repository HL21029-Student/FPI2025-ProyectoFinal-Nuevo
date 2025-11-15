<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header / Navbar -->
    <q-header elevated class="bg-primary text-white">
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
          placeholder="search"
          class="q-mx-md"
          style="width: 300px"
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
        />

        <q-btn flat round dense @click="goToCart">
          <q-icon name="shopping_cart" size="md" />
          <q-badge color="red" floating>{{ totalItems }}</q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Contenido principal -->
    <q-page-container>
      <q-page class="page-gradient q-pa-lg">
        <!-- Grid de gráficos 2x2 -->
        <div class="row q-col-gutter-lg">
          <!-- Gráfico 1: Top izquierda - Barras horizontales -->
          <div class="col-12 col-md-6">
            <q-card class="chart-card">
              <q-card-section class="q-pa-md">
                <div class="text-h6 text-weight-bold text-primary q-mb-md">
                  <q-icon name="leaderboard" class="q-mr-sm" />
                  Productos por Marca
                </div>
                <div class="chart-container">
                  <canvas ref="barrasHorizontalesChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico 2: Top derecha - Barras verticales -->
          <div class="col-12 col-md-6">
            <q-card class="chart-card">
              <q-card-section class="q-pa-md">
                <div class="text-h6 text-weight-bold text-positive q-mb-md">
                  <q-icon name="attach_money" class="q-mr-sm" />
                  Rangos de Precios
                </div>
                <div class="chart-container">
                  <canvas ref="barrasVerticalesChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico 3: Bottom izquierda - Línea -->
          <div class="col-12 col-md-6">
            <q-card class="chart-card">
              <q-card-section class="q-pa-md">
                <div class="text-h6 text-weight-bold text-orange q-mb-md">
                  <q-icon name="trending_up" class="q-mr-sm" />
                  Tendencia de Ventas
                </div>
                <div class="chart-container">
                  <canvas ref="lineaChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Gráfico 4: Bottom derecha - Pie/Dona -->
          <div class="col-12 col-md-6">
            <q-card class="chart-card">
              <q-card-section class="q-pa-md">
                <div class="text-h6 text-weight-bold text-purple q-mb-md">
                  <q-icon name="pie_chart" class="q-mr-sm" />
                  Distribución de Inventario
                </div>
                <div class="chart-container">
                  <canvas ref="pieChart"></canvas>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
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
import CrearProductoDialog from '../components/CrearProductoDialog.vue'
import Chart from 'chart.js/auto'

export default {
  name: 'EstadisticasPage',

  components: {
    CrearProductoDialog,
  },

  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const { totalItems } = useCart()
    const searchQuery = ref('')
    const showCrearProductoDialog = ref(false)

    // Referencias a los canvas
    const barrasHorizontalesChart = ref(null)
    const barrasVerticalesChart = ref(null)
    const lineaChart = ref(null)
    const pieChart = ref(null)

    // Datos de Firebase
    const productos = ref([])
    const loading = ref(true)

    // Cargar datos de Firebase
    const cargarProductos = async () => {
      try {
        loading.value = true
        const { celularesService } = await import('../services/celularesService')
        const data = await celularesService.getCelulares()
        productos.value = data.map((p) => ({
          id: p.id,
          name: p.tituloAnuncio || p.nombre || 'Sin título',
          brand: p.marca,
          price: p.precio,
          stock: p.stock || 0,
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

    const goToHome = () => {
      router.push('/')
    }

    const goToStats = () => {
      // Ya estamos en estadísticas, no es necesario hacer nada.
    }

    const crearProducto = () => {
      showCrearProductoDialog.value = true
    }

    const goToCart = () => {
      router.push('/carrito')
    }

    const crearGraficos = () => {
      // Preparar datos de marcas
      const marcaData = {}
      productos.value.forEach((p) => {
        marcaData[p.brand] = (marcaData[p.brand] || 0) + 1
      })

      const marcas = Object.keys(marcaData)
      const cantidadesMarcas = Object.values(marcaData)

      // Preparar datos de rangos de precios
      const rangos = {
        '0-500': 0,
        '501-1000': 0,
        '1001-1500': 0,
        '1501+': 0,
      }

      productos.value.forEach((p) => {
        if (p.price <= 500) rangos['0-500']++
        else if (p.price <= 1000) rangos['501-1000']++
        else if (p.price <= 1500) rangos['1001-1500']++
        else rangos['1501+']++
      })

      // Datos simulados para gráfico de línea (ventas por mes)
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
      const ventas = [12, 19, 15, 25, 22, 30]

      // 1. Gráfico de barras horizontales - Stock por marca
      new Chart(barrasHorizontalesChart.value, {
        type: 'bar',
        data: {
          labels: marcas,
          datasets: [
            {
              label: 'Productos por marca',
              data: cantidadesMarcas,
              backgroundColor: ['#1976D2', '#E91E63', '#FF9800', '#4CAF50', '#9C27B0'],
              borderRadius: 8,
              borderWidth: 0,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0,0,0,0.05)',
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            y: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
              },
            },
          },
        },
      })

      // 2. Gráfico de barras verticales - Rangos de precios
      new Chart(barrasVerticalesChart.value, {
        type: 'bar',
        data: {
          labels: Object.keys(rangos),
          datasets: [
            {
              label: 'Productos por rango',
              data: Object.values(rangos),
              backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
              borderRadius: 8,
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0,0,0,0.05)',
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
              },
            },
          },
        },
      })

      // 3. Gráfico de línea - Tendencia de ventas
      new Chart(lineaChart.value, {
        type: 'line',
        data: {
          labels: meses,
          datasets: [
            {
              label: 'Ventas mensuales',
              data: ventas,
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#FF9800',
              pointBorderColor: '#fff',
              pointBorderWidth: 3,
              pointRadius: 6,
              pointHoverRadius: 8,
              borderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              borderColor: '#fff',
              borderWidth: 1,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: true,
                color: 'rgba(0,0,0,0.05)',
              },
              ticks: {
                font: {
                  size: 12,
                },
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                font: {
                  size: 12,
                  weight: 'bold',
                },
              },
            },
          },
        },
      })

      // 4. Gráfico de pie - Distribución por marca
      new Chart(pieChart.value, {
        type: 'doughnut',
        data: {
          labels: marcas,
          datasets: [
            {
              data: cantidadesMarcas,
              backgroundColor: ['#9C27B0', '#E91E63', '#FF9800', '#4CAF50', '#2196F3'],
              borderColor: '#fff',
              borderWidth: 3,
              hoverOffset: 10,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                font: {
                  size: 13,
                  weight: 'bold',
                },
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: 12,
              titleFont: {
                size: 14,
              },
              bodyFont: {
                size: 13,
              },
              borderColor: '#fff',
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  const label = context.label || ''
                  const value = context.parsed || 0
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${label}: ${value} (${percentage}%)`
                },
              },
            },
          },
          cutout: '60%',
        },
      })
    }

    onMounted(async () => {
      await cargarProductos()
      crearGraficos()
    })

    return {
      searchQuery,
      totalItems,
      showCrearProductoDialog,
      barrasHorizontalesChart,
      barrasVerticalesChart,
      lineaChart,
      pieChart,
      goToHome,
      goToStats,
      crearProducto,
      goToCart,
      cargarProductos,
    }
  },
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-gradient {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.chart-container {
  height: 320px;
  position: relative;
}

.cursor-pointer {
  cursor: pointer;
}

.chart-card {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  background: white;
}

.chart-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.cart-btn {
  position: relative;
}

.pulse-badge {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.search-input {
  border-radius: 20px;
}
</style>
