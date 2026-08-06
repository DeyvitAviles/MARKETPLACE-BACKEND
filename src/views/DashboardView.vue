<template>
  <section>
    <div class="mb-6"><h2 class="text-2xl font-black text-slate-900">Resumen general</h2><p class="text-sm text-slate-500">Información actualizada de la base de datos compartida.</p></div>
    <p v-if="error" class="alert-error mb-4">{{ error }}</p>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in tarjetas" :key="item.titulo" class="card p-6"><p class="text-sm font-bold text-slate-500">{{ item.titulo }}</p><strong class="mt-2 block text-4xl font-black text-slate-900">{{ item.valor }}</strong><span class="mt-2 block text-xs text-slate-400">{{ item.detalle }}</span></article>
    </div>
    <div class="card mt-6 p-6"><h3 class="font-black text-slate-900">Accesos rápidos</h3><div class="mt-4 flex flex-wrap gap-3"><RouterLink to="/admin/usuarios" class="btn btn-primary">Gestionar usuarios</RouterLink><RouterLink to="/admin/productos" class="btn btn-secondary">Revisar productos</RouterLink><RouterLink to="/admin/conversaciones" class="btn btn-secondary">Ver conversaciones</RouterLink></div></div>
  </section>
</template>
<script setup>
import{computed,onMounted,ref}from'vue';import{RouterLink}from'vue-router';import adminService from'../services/adminService.js';const resumen=ref({}),error=ref('');const tarjetas=computed(()=>[
{titulo:'Usuarios',valor:resumen.value.usuarios||0,detalle:`${resumen.value.usuarios_activos||0} activos`},{titulo:'Productos',valor:resumen.value.productos||0,detalle:'Publicaciones registradas'},{titulo:'Categorías',valor:resumen.value.categorias||0,detalle:'Clasificaciones disponibles'},{titulo:'Conversaciones',valor:resumen.value.conversaciones||0,detalle:'Chats creados'},{titulo:'Mensajes',valor:resumen.value.mensajes||0,detalle:'Mensajes enviados'}]);onMounted(async()=>{try{resumen.value=await adminService.resumen();}catch(e){error.value=e.response?.data?.mensaje||'No se pudo cargar el resumen';}});
</script>
