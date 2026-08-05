<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <RouterLink to="/marketplace" class="flex items-center gap-3">
          <div class="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-xl font-black text-white">M</div>
          <div><strong class="block text-slate-900">MarketChat</strong><span class="text-xs text-slate-500">Marketplace web</span></div>
        </RouterLink>

        <nav class="hidden items-center gap-1 lg:flex">
          <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="nav-link">{{ item.texto }}</RouterLink>
          <RouterLink v-if="esAdmin" to="/admin/dashboard" class="nav-link admin-link">Administración</RouterLink>
        </nav>

        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block"><strong class="block text-sm text-slate-800">{{ usuario?.nombre }}</strong><span class="text-xs capitalize text-slate-500">{{ usuario?.rol }}</span></div>
          <button class="btn btn-danger btn-sm" @click="salir">Salir</button>
        </div>
      </div>
      <nav class="flex gap-2 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="nav-link whitespace-nowrap">{{ item.texto }}</RouterLink>
        <RouterLink v-if="esAdmin" to="/admin/dashboard" class="nav-link whitespace-nowrap">Admin</RouterLink>
      </nav>
    </header>
    <main class="mx-auto max-w-7xl p-4 lg:p-6"><RouterView /></main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRouter } from 'vue-router';
import authService from '../services/authService.js';
const router = useRouter();
const usuario = computed(() => authService.obtenerUsuario());
const esAdmin = computed(() => ['administrador', 'superadministrador'].includes(usuario.value?.rol));
const menu = [
  { to: '/marketplace', texto: 'Explorar' },
  { to: '/mis-productos', texto: 'Mis productos' },
  { to: '/favoritos', texto: 'Favoritos' },
  { to: '/conversaciones', texto: 'Mensajes' },
  { to: '/perfil', texto: 'Perfil' },
];
function salir() { authService.cerrarSesion(); router.push('/login'); }
</script>
