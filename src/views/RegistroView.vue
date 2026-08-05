<template>
  <main class="grid min-h-screen place-items-center bg-slate-100 p-4">
    <section class="w-full max-w-xl rounded-3xl bg-white p-7 shadow-xl sm:p-9">
      <h1 class="text-2xl font-black text-slate-900">Crear cuenta</h1>
      <p class="mt-2 text-sm text-slate-500">Regístrate para publicar, guardar favoritos y conversar.</p>
      <form class="mt-7 grid gap-4 sm:grid-cols-2" @submit.prevent="registrar">
        <div class="sm:col-span-2"><label class="label">Nombre completo</label><input v-model.trim="form.nombre" class="input" required /></div>
        <div class="sm:col-span-2"><label class="label">Correo</label><input v-model.trim="form.correo" class="input" type="email" required /></div>
        <div><label class="label">Teléfono</label><input v-model.trim="form.telefono" class="input" /></div>
        <div><label class="label">Ubicación</label><input v-model.trim="form.ubicacion" class="input" /></div>
        <div class="sm:col-span-2"><label class="label">Contraseña</label><input v-model="form.password" class="input" type="password" minlength="6" required /></div>
        <p v-if="error" class="alert-error sm:col-span-2">{{ error }}</p>
        <p v-if="exito" class="alert-success sm:col-span-2">{{ exito }}</p>
        <div class="flex gap-3 sm:col-span-2"><RouterLink to="/login" class="btn btn-secondary flex-1">Volver</RouterLink><button class="btn btn-primary flex-1" :disabled="cargando">{{ cargando?'Creando...':'Crear cuenta' }}</button></div>
      </form>
    </section>
  </main>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import authService from '../services/authService.js';
const router=useRouter(); const cargando=ref(false); const error=ref(''); const exito=ref('');
const form=reactive({nombre:'',correo:'',telefono:'',ubicacion:'',password:''});
async function registrar(){ error.value=''; exito.value=''; cargando.value=true; try{ const r=await authService.registrar(form); exito.value=r.mensaje; setTimeout(()=>router.push('/login'),700); }catch(e){error.value=e.response?.data?.mensaje||'No se pudo registrar';}finally{cargando.value=false;} }
</script>
