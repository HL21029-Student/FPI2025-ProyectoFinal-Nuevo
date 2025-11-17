<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  // La inicialización de BD se maneja en celularesService
})
</script>
