<template>
  <q-list padding>
    <q-item-label header class="text-weight-bold text-grey-8">
      <q-icon name="phone_android" class="q-mr-xs" />
      Sistema
    </q-item-label>
    <q-item tag="label" v-for="os in operatingSystems" :key="os" class="filter-item">
      <q-item-section side>
        <q-checkbox v-model="selectedOS" :val="os" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ os }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'OSFilter',
  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },
    operatingSystems: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const selectedOS = ref(props.modelValue)

    watch(selectedOS, (newVal) => {
      emit('update:modelValue', newVal)
    })

    watch(
      () => props.modelValue,
      (newVal) => {
        selectedOS.value = newVal
      },
    )

    return {
      selectedOS,
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
