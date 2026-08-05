<template>
  <div class="empty-state">
    <div class="empty-state__icon"><component :is="icon" :size="28" /></div>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <div v-if="$slots.default" class="empty-state__actions"><slot /></div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: [Object, Function], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});
</script>
