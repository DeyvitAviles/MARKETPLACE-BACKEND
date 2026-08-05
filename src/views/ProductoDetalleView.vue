<template>
  <section>
    <RouterLink to="/marketplace" class="mb-4 inline-flex font-bold text-blue-600">← Volver al marketplace</RouterLink>
    <div v-if="cargando" class="card p-10 text-center">Cargando...</div>
    <div v-else-if="producto" class="grid gap-6 lg:grid-cols-2">
      <div class="card overflow-hidden"><img v-if="producto.imagen" :src="apiAsset(producto.imagen)" class="h-full max-h-[600px] w-full object-cover" /><div v-else class="grid min-h-96 place-items-center bg-slate-200 text-slate-500">Sin imagen</div></div>
      <div class="card p-6 lg:p-8">
        <span class="badge badge-blue">{{ producto.categoria_nombre || 'Sin categoría' }}</span>
        <h1 class="mt-4 text-3xl font-black text-slate-900">{{ producto.nombre }}</h1>
        <p class="mt-3 text-3xl font-black text-blue-700">S/ {{ Number(producto.precio).toFixed(2) }}</p>
        <p class="mt-5 whitespace-pre-line leading-7 text-slate-600">{{ producto.descripcion }}</p>
        <dl class="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-sm"><div><dt class="text-slate-500">Vendedor</dt><dd class="font-bold">{{ producto.vendedor }}</dd></div><div><dt class="text-slate-500">Ubicación</dt><dd class="font-bold">{{ producto.ubicacion }}</dd></div><div><dt class="text-slate-500">Stock</dt><dd class="font-bold">{{ producto.stock }}</dd></div><div><dt class="text-slate-500">Favoritos</dt><dd class="font-bold">{{ producto.cantidad_favoritos || 0 }}</dd></div></dl>
        <p v-if="mensaje" :class="mensajeError?'alert-error':'alert-success'" class="mt-4">{{ mensaje }}</p>
        <div v-if="!esPropio" class="mt-6 grid gap-3 sm:grid-cols-2"><button class="btn btn-secondary" @click="alternarFavorito">{{ favorito?'Quitar de favoritos':'Agregar a favoritos' }}</button><button class="btn btn-primary" @click="conversar">Contactar vendedor</button></div>
        <RouterLink v-else to="/mis-productos" class="btn btn-primary mt-6 w-full">Administrar mi publicación</RouterLink>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { apiAsset } from '../services/api.js';
import authService from '../services/authService.js'; import productoService from '../services/productoService.js'; import favoritoService from '../services/favoritoService.js'; import chatService from '../services/chatService.js';
const route=useRoute(),router=useRouter(),usuario=authService.obtenerUsuario(); const producto=ref(null),cargando=ref(true),favorito=ref(false),mensaje=ref(''),mensajeError=ref(false);
const esPropio=computed(()=>Number(producto.value?.usuario_id)===Number(usuario.id));
async function cargar(){try{producto.value=await productoService.obtenerProducto(route.params.id); if(!esPropio.value) favorito.value=(await favoritoService.verificar(usuario.id,route.params.id)).favorito;}catch(e){mensaje.value=e.response?.data?.mensaje||'No se pudo cargar';mensajeError.value=true;}finally{cargando.value=false;}}
async function alternarFavorito(){try{if(favorito.value)await favoritoService.eliminar(usuario.id,producto.value.id);else await favoritoService.agregar(usuario.id,producto.value.id);favorito.value=!favorito.value;mensaje.value=favorito.value?'Agregado a favoritos':'Eliminado de favoritos';mensajeError.value=false;}catch(e){mensaje.value=e.response?.data?.mensaje||'No se pudo actualizar';mensajeError.value=true;}}
async function conversar(){try{const r=await chatService.crear(usuario.id,producto.value.usuario_id,producto.value.id);router.push({path:'/conversaciones',query:{id:r.conversacion.id}});}catch(e){mensaje.value=e.response?.data?.mensaje||'No se pudo abrir la conversación';mensajeError.value=true;}}
onMounted(cargar);
</script>
