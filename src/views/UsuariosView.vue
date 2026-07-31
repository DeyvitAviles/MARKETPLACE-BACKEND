
<template>
  <section class="min-h-screen bg-slate-50 p-4 sm:p-6">

    <!-- ================================================= -->
    <!-- ENCABEZADO -->
    <!-- ================================================= -->

    <div
      class="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
    >

      <div class="flex items-center gap-4">

        <!-- ICONO -->

        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
        >
          <Users :size="25" />
        </div>


        <!-- TÍTULO -->

        <div>

          <h2 class="text-xl font-bold text-slate-800 sm:text-2xl">
            Gestión de usuarios
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Administra los usuarios registrados en MarketChat.
          </p>

        </div>

      </div>


      <!-- BOTONES -->

      <div class="flex flex-col gap-2 sm:flex-row">

        <!-- RECARGAR -->

        <button
          type="button"
          :disabled="cargando"
          @click="cargarUsuarios"
          class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >

          <RefreshCw
            :size="18"
            :class="{
              'animate-spin': cargando
            }"
          />

          {{ cargando ? 'Cargando...' : 'Recargar' }}

        </button>


        <!-- NUEVO USUARIO -->

        <button
          type="button"
          @click="abrirNuevoUsuario"
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
        >

          <UserPlus :size="18" />

          Nuevo usuario

        </button>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- BUSCADOR -->
    <!-- ================================================= -->

    <div
      class="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >

      <div class="relative">

        <Search
          :size="20"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          v-model.trim="busqueda"
          type="search"
          placeholder="Buscar por nombre, correo, teléfono o ubicación..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
        />

      </div>

    </div>


    <!-- ================================================= -->
    <!-- CARGANDO -->
    <!-- ================================================= -->

    <div
      v-if="cargando"
      class="flex min-h-[280px] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
    >

      <LoaderCircle
        :size="40"
        class="animate-spin text-blue-600"
      />

      <p class="mt-4 text-sm font-medium text-slate-500">
        Cargando usuarios...
      </p>

    </div>


    <!-- ================================================= -->
    <!-- ERROR -->
    <!-- ================================================= -->

    <div
      v-else-if="mensajeError"
      class="rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
    >

      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600"
      >
        <AlertCircle :size="25" />
      </div>

      <h3 class="mt-4 font-bold text-red-800">
        No se pudieron cargar los usuarios
      </h3>

      <p class="mt-2 text-sm text-red-600">
        {{ mensajeError }}
      </p>

      <button
        type="button"
        @click="cargarUsuarios"
        class="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Intentar nuevamente
      </button>

    </div>


    <!-- ================================================= -->
    <!-- SIN USUARIOS -->
    <!-- ================================================= -->

    <div
      v-else-if="usuariosFiltrados.length === 0"
      class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"
    >

      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
      >
        <Users :size="32" />
      </div>

      <h3 class="mt-5 font-bold text-slate-700">
        No se encontraron usuarios
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        Intenta cambiar el término de búsqueda.
      </p>

    </div>


    <!-- ================================================= -->
    <!-- TABLA -->
    <!-- ================================================= -->

    <div
      v-else
      class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
    >

      <!-- CABECERA -->

      <div
        class="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >

        <div>

          <h3 class="font-bold text-slate-800">
            Usuarios registrados
          </h3>

          <p class="text-sm text-slate-500">
            {{ usuariosFiltrados.length }} usuarios encontrados
          </p>

        </div>

      </div>


      <!-- TABLA -->

      <div class="overflow-x-auto">

        <table class="w-full min-w-[950px]">

          <thead class="bg-slate-50">

            <tr>

              <th
                class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                ID
              </th>

              <th
                class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Usuario
              </th>

              <th
                class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Correo
              </th>

              <th
                class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Teléfono
              </th>

              <th
                class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Ubicación
              </th>

              <th
                class="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Acciones
              </th>

            </tr>

          </thead>


          <tbody class="divide-y divide-slate-100">

            <tr
              v-for="usuario in usuariosFiltrados"
              :key="usuario.id"
              class="transition hover:bg-slate-50"
            >

              <!-- ID -->

              <td class="px-5 py-4">

                <span
                  class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                >
                  #{{ usuario.id }}
                </span>

              </td>


              <!-- USUARIO -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-3">

                  <!-- AVATAR -->

                  <div
                    class="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100"
                  >

                    <img
                      v-if="obtenerImagen(usuario)"
                      :src="obtenerImagen(usuario)"
                      :alt="usuario.nombre"
                      class="h-full w-full object-cover"
                      @error="ocultarImagen"
                    />

                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center bg-blue-100 font-bold text-blue-600"
                    >
                      {{ obtenerInicial(usuario.nombre) }}
                    </div>

                  </div>


                  <div>

                    <p class="font-semibold text-slate-800">
                      {{ usuario.nombre || 'Sin nombre' }}
                    </p>

                    <p class="mt-0.5 text-xs text-slate-400">
                      Usuario #{{ usuario.id }}
                    </p>

                  </div>

                </div>

              </td>


              <!-- CORREO -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-2 text-sm text-slate-600">

                  <Mail
                    :size="16"
                    class="text-slate-400"
                  />

                  {{ usuario.correo || '—' }}

                </div>

              </td>


              <!-- TELÉFONO -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-2 text-sm text-slate-600">

                  <Phone
                    :size="16"
                    class="text-slate-400"
                  />

                  {{ usuario.telefono || '—' }}

                </div>

              </td>


              <!-- UBICACIÓN -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-2 text-sm text-slate-600">

                  <MapPin
                    :size="16"
                    class="text-slate-400"
                  />

                  {{ usuario.ubicacion || '—' }}

                </div>

              </td>


              <!-- ACCIONES -->

              <td class="px-5 py-4">

                <div class="flex justify-end">

                  <button
                    type="button"
                    title="Editar usuario"
                    @click="abrirEditarUsuario(usuario)"
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                  >

                    <Pencil :size="17" />

                  </button>

                </div>

              </td>

            </tr>

          </tbody>

        </table>

      </div>


      <!-- RESUMEN -->

      <div
        class="border-t border-slate-200 px-5 py-4 text-right text-sm text-slate-500"
      >

        Usuarios registrados:

        <strong class="ml-1 text-slate-800">
          {{ usuarios.length }}
        </strong>

      </div>

    </div>


    <!-- ================================================= -->
    <!-- MODAL NUEVO / EDITAR USUARIO -->
    <!-- ================================================= -->

    <div
      v-if="mostrarFormulario"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      @click.self="cerrarFormulario"
    >

      <section
        class="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >

        <!-- HEADER MODAL -->

        <header
          class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5"
        >

          <div class="flex items-center gap-3">

            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
            >

              <UserPlus
                v-if="!modoEdicion"
                :size="20"
              />

              <Pencil
                v-else
                :size="20"
              />

            </div>

            <div>

              <h3 class="text-lg font-bold text-slate-800">
                {{
                  modoEdicion
                    ? 'Editar usuario'
                    : 'Nuevo usuario'
                }}
              </h3>

              <p class="mt-1 text-sm text-slate-500">
                {{
                  modoEdicion
                    ? 'Actualiza la información del usuario.'
                    : 'Registra un nuevo usuario en MarketChat.'
                }}
              </p>

            </div>

          </div>


          <button
            type="button"
            @click="cerrarFormulario"
            class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >

            <X :size="20" />

          </button>

        </header>


        <!-- FORMULARIO -->

        <form
          class="space-y-5 p-6"
          @submit.prevent="guardarUsuario"
        >

          <!-- NOMBRE -->

          <div>

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nombre completo
            </label>

            <div class="relative">

              <User
                :size="18"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model.trim="formulario.nombre"
                type="text"
                placeholder="Ejemplo: Juan Pérez"
                class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>


          <!-- CORREO -->

          <div>

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Correo electrónico
            </label>

            <div class="relative">

              <Mail
                :size="18"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model.trim="formulario.correo"
                type="email"
                placeholder="correo@ejemplo.com"
                class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>


          <!-- CONTRASEÑA -->

          <div v-if="!modoEdicion">

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Contraseña
            </label>

            <input
              v-model="formulario.password"
              type="password"
              placeholder="Contraseña segura"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>


          <!-- TELÉFONO / UBICACIÓN -->

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <label
                class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Teléfono
              </label>

              <div class="relative">

                <Phone
                  :size="18"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  v-model.trim="formulario.telefono"
                  type="text"
                  placeholder="999 999 999"
                  class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>


            <div>

              <label
                class="mb-2 block text-sm font-semibold text-slate-700"
              >
                Ubicación
              </label>

              <div class="relative">

                <MapPin
                  :size="18"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  v-model.trim="formulario.ubicacion"
                  type="text"
                  placeholder="Ciudad o distrito"
                  class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

          </div>


          <!-- IMAGEN -->

          <div>

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              URL de imagen de perfil
            </label>

            <div class="relative">

              <ImageIcon
                :size="18"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model.trim="formulario.imagen_perfil"
                type="text"
                placeholder="/uploads/perfil.jpg"
                class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>


          <!-- ERROR -->

          <div
            v-if="errorFormulario"
            class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >

            <AlertCircle :size="20" />

            {{ errorFormulario }}

          </div>


          <!-- ÉXITO -->

          <div
            v-if="mensajeFormulario"
            class="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
          >

            <CheckCircle2 :size="20" />

            {{ mensajeFormulario }}

          </div>


          <!-- BOTONES -->

          <footer
            class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"
          >

            <button
              type="button"
              :disabled="guardando"
              @click="cerrarFormulario"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>


            <button
              type="submit"
              :disabled="guardando"
              class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <LoaderCircle
                v-if="guardando"
                :size="18"
                class="animate-spin"
              />

              {{
                guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Actualizar usuario'
                    : 'Crear usuario'
              }}

            </button>

          </footer>

        </form>

      </section>

    </div>

  </section>
</template>
    

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue';

import usuarioService
  from '../services/usuarioService.js';

import {
  Plus,
  RefreshCw,
  Search,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  X,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Image as ImageIcon,
  UserPlus,
} from 'lucide-vue-next';

const usuarios = ref([]);
const cargando = ref(false);
const guardando = ref(false);

const busqueda = ref('');
const mensajeError = ref('');
const errorFormulario = ref('');
const mensajeFormulario = ref('');

const mostrarFormulario = ref(false);
const modoEdicion = ref(false);
const usuarioSeleccionadoId = ref(null);

const formulario = reactive({
  nombre: '',
  correo: '',
  password: '',
  telefono: '',
  ubicacion: '',
  imagen_perfil: '',
});

const usuariosFiltrados = computed(() => {
  const texto = busqueda.value
    .toLowerCase()
    .trim();

  if (!texto) {
    return usuarios.value;
  }

  return usuarios.value.filter((usuario) => {
    return [
      usuario.nombre,
      usuario.correo,
      usuario.telefono,
      usuario.ubicacion,
    ].some((valor) =>
      String(valor || '')
        .toLowerCase()
        .includes(texto),
    );
  });
});

async function cargarUsuarios() {
  cargando.value = true;
  mensajeError.value = '';

  try {
    const respuesta =
      await usuarioService.obtenerUsuarios();

    if (!Array.isArray(respuesta)) {
      throw new Error(
        'El servidor no devolvió una lista de usuarios.',
      );
    }

    usuarios.value = respuesta;
  } catch (error) {
    console.error(
      'Error cargando usuarios:',
      error,
    );

    usuarios.value = [];
    mensajeError.value =
      obtenerMensajeError(error);
  } finally {
    cargando.value = false;
  }
}

function abrirNuevoUsuario() {
  limpiarFormulario();

  modoEdicion.value = false;
  mostrarFormulario.value = true;
}

function abrirEditarUsuario(usuario) {
  limpiarFormulario();

  modoEdicion.value = true;
  usuarioSeleccionadoId.value = usuario.id;

  formulario.nombre = usuario.nombre || '';
  formulario.correo = usuario.correo || '';
  formulario.telefono = usuario.telefono || '';
  formulario.ubicacion = usuario.ubicacion || '';
  formulario.imagen_perfil =
    usuario.imagen_perfil || '';

  mostrarFormulario.value = true;
}

async function guardarUsuario() {
  errorFormulario.value = '';
  mensajeFormulario.value = '';

  if (!formulario.nombre) {
    errorFormulario.value =
      'El nombre es obligatorio.';

    return;
  }

  if (!formulario.correo) {
    errorFormulario.value =
      'El correo es obligatorio.';

    return;
  }

  if (
    !modoEdicion.value &&
    !formulario.password
  ) {
    errorFormulario.value =
      'La contraseña es obligatoria.';

    return;
  }

  guardando.value = true;

  try {
    if (modoEdicion.value) {
      await usuarioService.actualizarUsuario(
        usuarioSeleccionadoId.value,
        {
          nombre: formulario.nombre,
          correo: formulario.correo,
          telefono: formulario.telefono,
          ubicacion: formulario.ubicacion,
          imagen_perfil:
            formulario.imagen_perfil,
        },
      );

      mensajeFormulario.value =
        'Usuario actualizado correctamente.';
    } else {
      await usuarioService.crearUsuario({
        nombre: formulario.nombre,
        correo: formulario.correo,
        password: formulario.password,
        telefono: formulario.telefono,
        ubicacion: formulario.ubicacion,
        imagen_perfil:
          formulario.imagen_perfil,
      });

      mensajeFormulario.value =
        'Usuario creado correctamente.';
    }

    await cargarUsuarios();

    setTimeout(() => {
      cerrarFormulario();
    }, 700);
  } catch (error) {
    console.error(
      'Error guardando usuario:',
      error,
    );

    errorFormulario.value =
      obtenerMensajeError(error);
  } finally {
    guardando.value = false;
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  limpiarFormulario();
}

function limpiarFormulario() {
  formulario.nombre = '';
  formulario.correo = '';
  formulario.password = '';
  formulario.telefono = '';
  formulario.ubicacion = '';
  formulario.imagen_perfil = '';

  usuarioSeleccionadoId.value = null;
  errorFormulario.value = '';
  mensajeFormulario.value = '';
}

function obtenerInicial(nombre) {
  return String(nombre || 'U')
    .charAt(0)
    .toUpperCase();
}

function obtenerImagen(usuario) {
  const imagen = usuario.imagen_perfil;

  if (!imagen) {
    return '';
  }

  if (
    imagen.startsWith('http://') ||
    imagen.startsWith('https://')
  ) {
    return imagen;
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    'http://54.157.69.153:3000';

  const ruta =
    imagen.startsWith('/')
      ? imagen
      : `/${imagen}`;

  return `${baseUrl}${ruta}`;
}

function ocultarImagen(evento) {
  evento.target.style.display = 'none';
}

function obtenerMensajeError(error) {
  return (
    error.response?.data?.mensaje ||
    error.response?.data?.error ||
    error.message ||
    'Error al conectar con el servidor.'
  );
}

onMounted(cargarUsuarios);
</script>
