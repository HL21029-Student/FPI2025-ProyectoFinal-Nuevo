<template>
  <q-list padding>
    <q-item-label header class="text-weight-bold text-grey-8">
      <q-icon name="business" class="q-mr-xs" />
      Marca
    </q-item-label>
    <q-item tag="label" v-for="brand in brands" :key="brand" class="filter-item">
      <q-item-section side>
        <q-checkbox v-model="selectedBrands" :val="brand" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ brand }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'BrandFilter',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    brands: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedBrands = ref(props.modelValue)

    watch(selectedBrands, (newVal) => {
      emit('update:modelValue', newVal)
    })

    watch(
      () => props.modelValue,
      (newVal) => {
        selectedBrands.value = newVal
      },
    )

    return {
      selectedBrands,
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
