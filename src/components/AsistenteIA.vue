<template>
  <div class="fixed bottom-4 right-4 z-[60] sm:bottom-6 sm:right-6">
    <section
      v-if="abierto"
      class="mb-3 flex h-[min(580px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      aria-label="Asistente de compras"
    >
      <header class="flex items-center justify-between bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-white">
        <div class="flex items-center gap-3">
          <div class="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl">🤖</div>
          <div>
            <h2 class="font-black">Asistente MarketChat</h2>
            <p class="text-xs text-blue-100">Busca y compara productos reales</p>
          </div>
        </div>
        <button
          type="button"
          class="grid h-9 w-9 place-items-center rounded-lg text-xl hover:bg-white/15"
          aria-label="Cerrar asistente"
          @click="abierto = false"
        >
          ×
        </button>
      </header>

      <div ref="contenedorMensajes" class="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        <div
          v-for="(item, indice) in mensajes"
          :key="`${indice}-${item.fecha || ''}`"
          class="flex"
          :class="item.rol === 'usuario' ? 'justify-end' : 'justify-start'"
        >
          <div class="max-w-[88%]">
            <div
              class="whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              :class="item.rol === 'usuario'
                ? 'rounded-br-md bg-blue-600 text-white'
                : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'"
            >
              {{ item.texto }}
            </div>

            <div v-if="item.productos?.length" class="mt-2 space-y-2">
              <RouterLink
                v-for="producto in item.productos.slice(0, 4)"
                :key="producto.id"
                :to="`/producto/${producto.id}`"
                class="flex gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-blue-300 hover:shadow"
                @click="abierto = false"
              >
                <img
                  v-if="producto.imagen"
                  :src="apiAsset(producto.imagen)"
                  :alt="producto.nombre"
                  class="h-14 w-16 shrink-0 rounded-lg object-cover"
                />
                <div v-else class="grid h-14 w-16 shrink-0 place-items-center rounded-lg bg-slate-200 text-[10px] text-slate-500">
                  Sin imagen
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-bold text-slate-900">{{ producto.nombre }}</p>
                  <p class="text-sm font-black text-blue-700">S/ {{ formatoPrecio(producto.precio) }}</p>
                  <p class="truncate text-xs text-slate-500">{{ producto.ubicacion }}</p>
                </div>
              </RouterLink>
            </div>
          </div>
        </div>

        <div v-if="cargando" class="flex justify-start">
          <div class="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            <span class="h-2 w-2 animate-bounce rounded-full bg-blue-500"></span>
            <span class="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:120ms]"></span>
            <span class="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:240ms]"></span>
          </div>
        </div>
      </div>

      <div v-if="mensajes.length <= 1" class="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white px-3 py-2">
        <button
          v-for="sugerencia in sugerencias"
          :key="sugerencia"
          type="button"
          class="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          @click="enviar(sugerencia)"
        >
          {{ sugerencia }}
        </button>
      </div>

      <form class="border-t border-slate-200 bg-white p-3" @submit.prevent="enviar()">
        <div class="flex items-end gap-2">
          <textarea
            v-model="texto"
            rows="1"
            maxlength="500"
            class="max-h-28 min-h-11 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Ej.: una laptop por menos de S/ 2000"
            :disabled="cargando"
            @keydown.enter.exact.prevent="enviar()"
          ></textarea>
          <button
            type="submit"
            class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-600 font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="cargando || !texto.trim()"
            aria-label="Enviar consulta"
          >
            ➤
          </button>
        </div>
        <div class="mt-1 flex items-center justify-between text-[11px] text-slate-400">
          <span>Las recomendaciones son orientativas.</span>
          <span>{{ texto.length }}/500</span>
        </div>
      </form>
    </section>

    <button
      type="button"
      class="ml-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl text-white shadow-xl ring-4 ring-white transition hover:scale-105"
      :aria-label="abierto ? 'Cerrar asistente de compras' : 'Abrir asistente de compras'"
      @click="alternar"
    >
      {{ abierto ? '×' : '🤖' }}
    </button>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import iaService from '../services/iaService.js';
import authService from '../services/authService.js';
import { apiAsset } from '../services/api.js';

const abierto = ref(false);
const texto = ref('');
const cargando = ref(false);
const mensajes = ref([]);
const contenedorMensajes = ref(null);

const sugerencias = [
  'Productos económicos',
  'Recomiéndame una laptop',
  '¿Qué productos hay disponibles?',
];

const usuarioId = authService.obtenerUsuario()?.id || 'invitado';
const claveHistorial = `marketchat_ia_historial_${usuarioId}`;
const mensajeInicial = {
  rol: 'ia',
  texto: 'Hola. Puedo ayudarte a buscar, comparar y elegir productos publicados en MarketChat.',
  fecha: Date.now(),
};

function cargarHistorial() {
  try {
    const guardado = JSON.parse(localStorage.getItem(claveHistorial));
    mensajes.value = Array.isArray(guardado) && guardado.length ? guardado.slice(-30) : [mensajeInicial];
  } catch {
    mensajes.value = [mensajeInicial];
  }
}

function guardarHistorial() {
  localStorage.setItem(claveHistorial, JSON.stringify(mensajes.value.slice(-30)));
}

async function desplazarAlFinal() {
  await nextTick();
  if (contenedorMensajes.value) {
    contenedorMensajes.value.scrollTop = contenedorMensajes.value.scrollHeight;
  }
}

function historialParaApi() {
  return mensajes.value
    .filter((item) => item.texto && item !== mensajeInicial)
    .slice(-8)
    .map((item) => ({ rol: item.rol, texto: item.texto }));
}

async function enviar(sugerencia = '') {
  const consulta = String(sugerencia || texto.value).trim();
  if (!consulta || cargando.value) return;

  const historial = historialParaApi();
  mensajes.value.push({ rol: 'usuario', texto: consulta, fecha: Date.now() });
  texto.value = '';
  cargando.value = true;
  guardarHistorial();
  await desplazarAlFinal();

  try {
    const data = await iaService.consultar(consulta, historial);
    mensajes.value.push({
      rol: 'ia',
      texto: data.respuesta,
      productos: Array.isArray(data.productos) ? data.productos : [],
      fecha: Date.now(),
    });
  } catch (error) {
    mensajes.value.push({
      rol: 'ia',
      texto: error.response?.data?.mensaje || 'No pude responder en este momento. Intenta nuevamente.',
      fecha: Date.now(),
    });
  } finally {
    cargando.value = false;
    guardarHistorial();
    await desplazarAlFinal();
  }
}

function alternar() {
  abierto.value = !abierto.value;
  if (abierto.value) desplazarAlFinal();
}

function formatoPrecio(precio) {
  return Number(precio || 0).toFixed(2);
}

watch(mensajes, guardarHistorial, { deep: true });
onMounted(cargarHistorial);
</script>
