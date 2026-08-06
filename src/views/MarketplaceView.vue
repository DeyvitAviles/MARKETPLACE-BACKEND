<template>
  <section>
    <div class="card mb-6 overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white lg:p-9">
      <div class="max-w-2xl"><span class="text-sm font-bold text-blue-100">MARKETCHAT</span><h1 class="mt-2 text-3xl font-black lg:text-4xl">Compra, vende y conversa desde cualquier dispositivo</h1><p class="mt-3 text-blue-100">La aplicacion web y administrativa.</p></div>
    </div>
    <div class="mb-6 grid gap-3 md:grid-cols-[1fr_260px_auto]">
      <input v-model.trim="busqueda" class="input" placeholder="Buscar productos, ubicación o vendedor..." />
      <select v-model="categoria" class="input"><option value="">Todas las categorías</option><option v-for="c in categorias" :key="c.id" :value="String(c.id)">{{ c.nombre }}</option></select>
      <button class="btn btn-secondary" @click="cargar">Actualizar</button>
    </div>
    <p v-if="error" class="alert-error mb-4">{{ error }}</p>
    <div v-if="cargando" class="card p-10 text-center text-slate-500">Cargando productos...</div>
    <div v-else-if="filtrados.length" class="grid gap-5 sm:grid-cols-4 4"><ProductCard v-for="p in filtrados" :key="p.id" :producto="p" /></div>
    <div v-else class="card p-10 text-center text-slate-500">No se encontraron productos.</div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import productoService from '../services/productoService.js';
import categoriaService from '../services/categoriaService.js';
const productos=ref([]), categorias=ref([]), busqueda=ref(''), categoria=ref(''), cargando=ref(true), error=ref('');
const filtrados=computed(()=>productos.value.filter(p=>{const q=busqueda.value.toLowerCase(); const coincide=!q||[p.nombre,p.descripcion,p.ubicacion,p.vendedor].some(v=>String(v||'').toLowerCase().includes(q)); const cat=!categoria.value||String(p.categoria_id)===categoria.value; return coincide&&cat;}));
async function cargar(){cargando.value=true;error.value='';try{[productos.value,categorias.value]=await Promise.all([productoService.obtenerProductos(),categoriaService.obtenerCategorias()]);}catch(e){error.value=e.response?.data?.mensaje||'No se pudieron cargar los productos';}finally{cargando.value=false;}}
onMounted(cargar);
</script>
