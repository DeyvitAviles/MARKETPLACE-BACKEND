<template>
  <section>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-black">Mis productos</h1><p class="text-sm text-slate-500">Publica y administra tus anuncios.</p></div><button class="btn btn-primary" @click="abrirNuevo">+ Publicar producto</button></div>
    <p v-if="mensaje" :class="esError?'alert-error':'alert-success'" class="mb-4">{{ mensaje }}</p>
    <div v-if="cargando" class="card p-10 text-center">Cargando...</div>
    <div v-else-if="productos.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <article v-for="p in productos" :key="p.id" class="card overflow-hidden"><img v-if="p.imagen" :src="apiAsset(p.imagen)" class="product-image" /><div v-else class="grid aspect-[4/3] place-items-center bg-slate-200">Sin imagen</div><div class="p-4"><div class="flex justify-between gap-3"><h3 class="font-black">{{ p.nombre }}</h3><strong class="text-blue-700">S/ {{ Number(p.precio).toFixed(2) }}</strong></div><p class="mt-2 line-clamp-2 text-sm text-slate-500">{{ p.descripcion }}</p><div class="mt-4 flex gap-2"><button class="btn btn-secondary flex-1" @click="abrirEditar(p)">Editar</button><button class="btn btn-danger flex-1" @click="eliminar(p)">Eliminar</button></div></div></article>
    </div>
    <div v-else class="card p-10 text-center text-slate-500">Aún no publicaste productos.</div>

    <div v-if="modal" class="modal-backdrop" @click.self="cerrar">
      <section class="modal">
        <header class="flex items-center justify-between border-b p-5"><div><h2 class="text-xl font-black">{{ editando?'Editar producto':'Nuevo producto' }}</h2><p class="text-sm text-slate-500">Completa la información de tu publicación.</p></div><button class="btn btn-secondary btn-sm" @click="cerrar">Cerrar</button></header>
        <form class="grid gap-4 p-5 sm:grid-cols-2" @submit.prevent="guardar">
          <div class="sm:col-span-2"><label class="label">Nombre</label><input v-model.trim="form.nombre" class="input" required /></div>
          <div class="sm:col-span-2"><label class="label">Descripción</label><textarea v-model.trim="form.descripcion" class="input" rows="4" required /></div>
          <div><label class="label">Precio</label><input v-model="form.precio" class="input" type="number" min="0.01" step="0.01" required /></div>
          <div><label class="label">Stock</label><input v-model="form.stock" class="input" type="number" min="0" required /></div>
          <div><label class="label">Categoría</label><select v-model="form.categoria_id" class="input" required><option value="">Selecciona</option><option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option></select></div>
          <div><label class="label">Ubicación</label><input v-model.trim="form.ubicacion" class="input" required /></div>
          <div class="sm:col-span-2"><label class="label">Imagen {{ editando?'(opcional)':'' }}</label><input class="input" type="file" accept="image/*" @change="seleccionarImagen" /></div>
          <p v-if="errorForm" class="alert-error sm:col-span-2">{{ errorForm }}</p>
          <div class="flex justify-end gap-3 sm:col-span-2"><button type="button" class="btn btn-secondary" @click="cerrar">Cancelar</button><button class="btn btn-primary" :disabled="guardando">{{ guardando?'Guardando...':'Guardar' }}</button></div>
        </form>
      </section>
    </div>
  </section>
</template>
<script setup>
import{onMounted,reactive,ref}from'vue';import authService from'../services/authService.js';import productoService from'../services/productoService.js';import categoriaService from'../services/categoriaService.js';import{apiAsset}from'../services/api.js';
const usuario=authService.obtenerUsuario();const productos=ref([]),categorias=ref([]),cargando=ref(true),modal=ref(false),editando=ref(null),imagen=ref(null),guardando=ref(false),errorForm=ref(''),mensaje=ref(''),esError=ref(false);const form=reactive({nombre:'',descripcion:'',precio:'',stock:'',categoria_id:'',ubicacion:''});
function reset(){Object.assign(form,{nombre:'',descripcion:'',precio:'',stock:'',categoria_id:'',ubicacion:''});imagen.value=null;errorForm.value='';}
async function cargar(){cargando.value=true;try{[productos.value,categorias.value]=await Promise.all([productoService.obtenerPorUsuario(usuario.id),categoriaService.obtenerCategorias()]);}catch(e){mensaje.value=e.response?.data?.mensaje||'No se pudo cargar';esError.value=true;}finally{cargando.value=false;}}
function abrirNuevo(){reset();editando.value=null;modal.value=true;}function abrirEditar(p){reset();editando.value=p;Object.assign(form,{nombre:p.nombre,descripcion:p.descripcion,precio:p.precio,stock:p.stock,categoria_id:p.categoria_id,ubicacion:p.ubicacion});modal.value=true;}function cerrar(){modal.value=false;}function seleccionarImagen(e){imagen.value=e.target.files?.[0]||null;}
function crearFormData(){const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v));fd.append('usuario_id',usuario.id);if(imagen.value)fd.append('imagen',imagen.value);return fd;}
async function guardar(){guardando.value=true;errorForm.value='';try{if(editando.value)await productoService.actualizarProducto(editando.value.id,crearFormData());else await productoService.crearProducto(crearFormData());modal.value=false;mensaje.value=editando.value?'Producto actualizado':'Producto publicado';esError.value=false;await cargar();}catch(e){errorForm.value=e.response?.data?.mensaje||'No se pudo guardar';}finally{guardando.value=false;}}
async function eliminar(p){if(!confirm(`¿Eliminar “${p.nombre}”?`))return;try{await productoService.eliminarProducto(p.id,usuario.id);mensaje.value='Producto eliminado';esError.value=false;await cargar();}catch(e){mensaje.value=e.response?.data?.mensaje||'No se pudo eliminar';esError.value=true;}}
onMounted(cargar);
</script>
