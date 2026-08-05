<template>
  <div class="loading-state">
    <span class="spinner"></span>
    <div>
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Cargando información' },
  description: { type: String, default: 'Estamos preparando todo para ti.' },
});
</script>
