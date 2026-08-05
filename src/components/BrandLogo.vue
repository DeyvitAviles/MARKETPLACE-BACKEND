<template>
  <RouterLink :to="to" class="brand-lockup" :class="{ 'brand-lockup--light': light }">
    <span class="brand-mark" aria-hidden="true">
      <span class="brand-mark__bubble"></span>
      <span class="brand-mark__spark"></span>
    </span>
    <span v-if="!compact" class="brand-copy">
      <strong>MarketChat</strong>
      <small>{{ subtitle }}</small>
    </span>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  to: { type: String, default: '/marketplace' },
  subtitle: { type: String, default: 'Compra, vende y conecta' },
  light: { type: Boolean, default: false },
  compact: { type: Boolean, default: false },
});
</script>
