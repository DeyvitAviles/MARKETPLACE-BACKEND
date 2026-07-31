<template>
  <div class="conversaciones">
    <h1>Conversaciones</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const conversaciones = ref([])

onMounted(() => {
  console.log('Vista cargada')
})
</script>

<style scoped>
.conversaciones {
  padding: 24px;
}
</style>