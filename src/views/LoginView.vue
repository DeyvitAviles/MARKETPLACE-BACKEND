<template>
  <main class="grid min-h-screen place-items-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
    <section class="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
      <div class="mb-7 text-center">
        <img
  src="/logotipoo.png"
  alt="Logo de MarketChat"
  class="mx-auto h-20 w-20 object-contain"
/>
        <h1 class="mt-4 text-2xl font-black text-slate-900">Bienvenido a MarketChat</h1>
        <p class="mt-2 text-sm text-slate-500">La misma experiencia de la app, ahora también en la web.</p>
      </div>
      <form class="space-y-4" @submit.prevent="iniciar">
        <div><label class="label">Correo</label><input v-model.trim="correo" class="input" type="email" required placeholder="correo@ejemplo.com" /></div>
        <div><label class="label">Contraseña</label><input v-model="password" class="input" type="password" required placeholder="Tu contraseña" /></div>
        <p v-if="error" class="alert-error">{{ error }}</p>
        <button class="btn btn-primary w-full" :disabled="cargando">{{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}</button>
      </form>
      <p class="mt-6 text-center text-sm text-slate-500">¿No tienes cuenta? <RouterLink to="/registro" class="font-bold text-blue-600">Regístrate</RouterLink></p>
    </section>
  </main>
</template>
<script setup>
import { ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import authService from '../services/authService.js';
const correo=ref(''); const password=ref(''); const cargando=ref(false); const error=ref('');
const router=useRouter(); const route=useRoute();
async function iniciar(){
  error.value=''; cargando.value=true;
  try { const { usuario } = await authService.iniciarSesion(correo.value,password.value); const destino=route.query.redirect || (['administrador','superadministrador'].includes(usuario.rol)?'/admin/dashboard':'/marketplace'); await router.push(destino); }
  catch(e){ error.value=e.response?.data?.mensaje || 'No se pudo iniciar sesión'; }
  finally{ cargando.value=false; }
}
</script>
