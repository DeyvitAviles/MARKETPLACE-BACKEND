<template>
  <article class="card overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
    <RouterLink :to="`/producto/${producto.id}`">
      <img v-if="producto.imagen" :src="apiAsset(producto.imagen)" class="product-image" :alt="producto.nombre" />
      <div v-else class="grid aspect-[4/3] place-items-center bg-slate-200 text-sm text-slate-500">Sin imagen</div>
    </RouterLink>
    <div class="p-4">
      <div class="flex items-start justify-between gap-3">
        <div><span class="badge badge-blue">{{ producto.categoria_nombre || 'Sin categoría' }}</span><h3 class="mt-2 line-clamp-1 font-black text-slate-900">{{ producto.nombre }}</h3></div>
        <strong class="whitespace-nowrap text-lg text-blue-700">S/ {{ Number(producto.precio || 0).toFixed(2) }}</strong>
      </div>
      <p class="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">{{ producto.descripcion }}</p>
      <div class="mt-4 flex items-center justify-between text-xs text-slate-500"><span>{{ producto.ubicacion }}</span><span>Stock: {{ producto.stock }}</span></div>
      <RouterLink :to="`/producto/${producto.id}`" class="btn btn-primary mt-4 w-full">Ver producto</RouterLink>
    </div>
  </article>
</template>
<script setup>
import { RouterLink } from 'vue-router';
import { apiAsset } from '../services/api.js';
defineProps({ producto: { type: Object, required: true } });
</script>
