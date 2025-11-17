<template>
  <q-page class="flex flex-center">
    <div v-if="loading">Cargando productos...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="celulares.length > 0">
      <q-list bordered separator>
        <q-item v-for="celular in celulares" :key="celular.id">
          <q-item-section avatar>
            <q-img :src="celular.imagen" style="width: 80px; height: 80px; object-fit: cover" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ celular.marca }} {{ celular.modelo }}</q-item-label>
            <q-item-label caption>{{ celular.tituloAnuncio }}</q-item-label>
            <q-item-label caption>Precio: ${{ celular.precio }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div v-else>No hay productos disponibles.</div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { celularesService } from 'src/services/celularesService'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const celulares = ref([])
    const loading = ref(true)
    const error = ref(null)

    onMounted(async () => {
      try {
        celulares.value = await celularesService.getCelulares()
      } catch (err) {
        error.value = 'Error al cargar los productos: ' + err.message
        console.error(err)
      } finally {
        loading.value = false
      }
    })

    return {
      celulares,
      loading,
      error,
    }
  },
})
</script>
