<template>
  <q-list padding>
    <q-item-label header class="text-weight-bold text-grey-8">
      <q-icon name="tv" class="q-mr-xs" />
      Pantalla
    </q-item-label>
    <q-item tag="label" v-for="screen in screenSizes" :key="screen" class="filter-item">
      <q-item-section side>
        <q-checkbox v-model="selectedScreens" :val="screen" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ screen }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'ScreenSizeFilter',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    screenSizes: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedScreens = ref(props.modelValue)

    watch(selectedScreens, (newVal) => {
      emit('update:modelValue', newVal)
    })

    watch(
      () => props.modelValue,
      (newVal) => {
        selectedScreens.value = newVal
      },
    )

    return {
      selectedScreens,
    }
  },
})
</script>

<style scoped>
.filter-item {
  transition: background-color 0.2s ease;
  border-radius: 8px;
  margin: 4px 8px;
}

.filter-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
