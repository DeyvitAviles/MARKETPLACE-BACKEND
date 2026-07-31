<template>
  <main class="login-page">
    <section class="login-card">
      <h1>MarketChat Admin</h1>

      <p>Ingresa tus credenciales.</p>

      <form @submit.prevent="iniciarSesion">
        <div class="campo">
          <label for="correo">Correo</label>

          <input
            id="correo"
            v-model.trim="correo"
            type="email"
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div class="campo">
          <label for="password">Contraseña</label>

          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Contraseña"
          />
        </div>

        <p
          v-if="mensajeError"
          class="error"
        >
          {{ mensajeError }}
        </p>

        <button
          type="submit"
          :disabled="cargando"
        >
          {{ cargando ? 'Ingresando...' : 'Iniciar sesión' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import authService from '../services/authService.js';

const router = useRouter();

const correo = ref('');
const password = ref('');
const cargando = ref(false);
const mensajeError = ref('');

async function iniciarSesion() {
  mensajeError.value = '';

  if (!correo.value || !password.value) {
    mensajeError.value =
      'Completa el correo y la contraseña.';

    return;
  }

  cargando.value = true;

  try {
    const respuesta =
      await authService.iniciarSesion(
        correo.value,
        password.value,
      );

    console.log(
      'Respuesta del servidor:',
      respuesta,
    );

    const usuario =
      respuesta.usuario ||
      respuesta.datos ||
      respuesta;

    if (
      usuario.rol !== 'administrador'
    ) {
      mensajeError.value =
        'No tienes permisos para ingresar al panel administrativo.';

      return;
    }

    if (
      Number(usuario.activo) !== 1 ||
      usuario.estado !== 'activo'
    ) {
      mensajeError.value =
        'Tu cuenta administrativa no está activa.';

      return;
    }

    authService.guardarUsuario(usuario);

    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );

    await router.push('/dashboard');
  } catch (error) {
    console.error(
      'Error al iniciar sesión:',
      error,
    );

    mensajeError.value =
      error.response?.data?.mensaje ||
      error.response?.data?.error ||
      'No se pudo iniciar sesión.';
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
  background: #f1f5f9;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.12);
}

h1 {
  margin-top: 0;
  color: #0f172a;
}

p {
  color: #64748b;
}

form {
  display: grid;
  gap: 18px;
  margin-top: 24px;
}

.campo {
  display: grid;
  gap: 8px;
}

label {
  font-weight: 700;
  color: #334155;
}

input {
  height: 48px;
  padding: 0 14px;
  font-size: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  outline: none;
}

input:focus {
  border-color: #2563eb;
}

button {
  height: 50px;
  color: white;
  font-weight: 700;
  background: #2563eb;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  margin: 0;
  padding: 12px;
  color: #b91c1c;
  background: #fef2f2;
  border-radius: 10px;
}
</style>