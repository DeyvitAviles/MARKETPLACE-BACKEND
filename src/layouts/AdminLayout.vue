<template>
  <div class="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[260px_1fr]">
    <aside class="border-b border-slate-800 bg-slate-950 text-white lg:min-h-screen lg:border-b-0 lg:border-r">
      <div class="flex items-center justify-between p-5 lg:block">
        <RouterLink to="/admin/dashboard" class="flex items-center gap-3">
          <img
  src="/logotipoo.png"
  alt="Logo de MarketChat"
  class="h-11 w-11 rounded-xl object-contain"
/>
          <div><strong class="block">MarketChat</strong><span class="text-xs text-slate-400">{{ etiquetaRol }}</span></div>
        </RouterLink>
        <button class="text-sm text-slate-300 lg:hidden" @click="menuAbierto = !menuAbierto">Menú</button>
      </div>
      <nav :class="['space-y-1 px-4 pb-5 lg:block', menuAbierto ? 'block' : 'hidden']">
        <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="admin-nav">{{ item.texto }}</RouterLink>
        <RouterLink to="/marketplace" class="admin-nav mt-4 border border-slate-700">Volver al marketplace</RouterLink>
        <button class="admin-nav mt-2 w-full text-left text-red-300" @click="salir">Cerrar sesión</button>
      </nav>
    </aside>
    <section class="min-w-0">
      <header class="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
        <div><h1 class="text-xl font-bold text-slate-900">{{ titulo }}</h1><p class="text-sm text-slate-500">Control administrativo del marketplace</p></div>
        <div class="text-right"><strong class="block text-sm text-slate-800">{{ usuario?.nombre }}</strong><span class="text-xs text-slate-500">{{ etiquetaRol }}</span></div>
      </header>
      <main class="p-4 lg:p-8"><RouterView /></main>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import authService from '../services/authService.js';
const route = useRoute(); const router = useRouter(); const menuAbierto = ref(false);
const usuario = computed(() => authService.obtenerUsuario());
const etiquetaRol = computed(() => usuario.value?.rol === 'superadministrador' ? 'Superadministrador' : 'Administrador');
const titulos = { 'admin-dashboard':'Dashboard', 'admin-usuarios':'Usuarios', 'admin-productos':'Productos', 'admin-categorias':'Categorías', 'admin-conversaciones':'Conversaciones' };
const titulo = computed(() => titulos[route.name] || 'Administración');
const menu = [
  { to:'/admin/dashboard', texto:'Dashboard' },
  { to:'/admin/usuarios', texto:'Usuarios' },
  { to:'/admin/productos', texto:'Productos' },
  { to:'/admin/categorias', texto:'Categorías' },
  { to:'/admin/conversaciones', texto:'Conversaciones' },
];
function salir(){ authService.cerrarSesion(); router.push('/login'); }
</script>
