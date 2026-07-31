
<template>
  <section class="min-h-screen bg-slate-50 p-4 sm:p-6">

    <!-- ========================================== -->
    <!-- ENCABEZADO -->
    <!-- ========================================== -->

    <div
      class="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
    >

      <div class="flex items-center gap-4">

        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600"
        >
          <FolderOpen :size="25" />
        </div>

        <div>

          <h2 class="text-xl font-bold text-slate-800 sm:text-2xl">
            Gestión de categorías
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Organiza y administra las categorías de tu Marketplace.
          </p>

        </div>

      </div>


      <!-- NUEVA CATEGORÍA -->

      <button
        type="button"
        @click="abrirNuevaCategoria"
        class="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 hover:shadow-md"
      >

        <Plus :size="19" />

        Nueva categoría

      </button>

    </div>


    <!-- ========================================== -->
    <!-- BUSCADOR -->
    <!-- ========================================== -->

    <div
      class="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
    >

      <div class="relative">

        <Search
          :size="20"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          v-model="busqueda"
          type="search"
          placeholder="Buscar categoría..."
          class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
        />

      </div>

    </div>


    <!-- ========================================== -->
    <!-- CARGANDO -->
    <!-- ========================================== -->

    <div
      v-if="cargando"
      class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
    >

      <Loader2
        :size="35"
        class="animate-spin text-purple-600"
      />

      <p class="mt-4 text-sm text-slate-500">
        Cargando categorías...
      </p>

    </div>


    <!-- ========================================== -->
    <!-- ERROR -->
    <!-- ========================================== -->

    <div
      v-else-if="error"
      class="flex min-h-[250px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-red-200"
    >

      <div
        class="flex h-14 w-14 items-center justify-center rounded-xl bg-red-100 text-red-600"
      >
        <CircleAlert :size="28" />
      </div>

      <h3 class="mt-4 font-bold text-slate-700">
        No se pudieron cargar las categorías
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        {{ error }}
      </p>

      <button
        type="button"
        @click="cargarCategorias"
        class="mt-5 flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
      >

        <RefreshCw :size="18" />

        Reintentar

      </button>

    </div>


    <!-- ========================================== -->
    <!-- CATEGORÍAS -->
    <!-- ========================================== -->

    <div
      v-else-if="categoriasFiltradas.length > 0"
      class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >

      <article
        v-for="categoria in categoriasFiltradas"
        :key="categoria.id"
        class="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >

        <!-- ICONO Y ACCIONES -->

        <div class="flex items-start justify-between">

          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white"
          >
            <Folder :size="23" />
          </div>


          <div class="flex gap-1">

            <button
              type="button"
              title="Editar categoría"
              @click="editarCategoria(categoria)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
            >

              <Pencil :size="17" />

            </button>


            <button
              type="button"
              title="Eliminar categoría"
              @click="eliminarCategoria(categoria)"
              class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            >

              <Trash2 :size="17" />

            </button>

          </div>

        </div>


        <!-- INFORMACIÓN -->

        <div class="mt-5">

          <h3 class="font-bold text-slate-800">
            {{ categoria.nombre }}
          </h3>

          <p class="mt-2 min-h-[40px] text-sm leading-5 text-slate-500">
            {{ categoria.descripcion }}
          </p>

        </div>


        <!-- PRODUCTOS -->

        <div
          class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4"
        >

          <span class="text-xs font-medium text-slate-400">
            Productos
          </span>

          <span
            class="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600"
          >
            {{ categoria.productos || 0 }}
          </span>

        </div>

      </article>

    </div>


    <!-- ========================================== -->
    <!-- SIN CATEGORÍAS -->
    <!-- ========================================== -->

    <div
      v-else
      class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"
    >

      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-500"
      >

        <FolderOpen :size="32" />

      </div>

      <h3 class="mt-5 font-bold text-slate-700">
        No hay categorías registradas
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        Crea tu primera categoría para comenzar a organizar tus productos.
      </p>

      <button
        type="button"
        @click="abrirNuevaCategoria"
        class="mt-5 flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
      >

        <Plus :size="18" />

        Crear primera categoría

      </button>

    </div>


    <!-- ========================================== -->
    <!-- CONTADOR -->
    <!-- ========================================== -->

    <div class="mt-6 flex justify-end text-sm text-slate-500">

      Categorías registradas:

      <strong class="ml-1 text-slate-800">
        {{ categorias.length }}
      </strong>

    </div>


    <!-- ========================================== -->
    <!-- MODAL -->
    <!-- ========================================== -->

    <div
      v-if="mostrarFormulario"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      @click.self="cerrarFormulario"
    >

      <section
        class="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
      >

        <!-- HEADER -->

        <header
          class="flex items-center justify-between border-b border-slate-200 px-6 py-5"
        >

          <div class="flex items-center gap-3">

            <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600"
            >

              <FolderPlus :size="20" />

            </div>

            <div>

              <h3 class="font-bold text-slate-800">

                {{
                  modoEdicion
                    ? 'Editar categoría'
                    : 'Nueva categoría'
                }}

              </h3>

              <p class="mt-1 text-xs text-slate-500">
                Completa la información de la categoría.
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
          @submit.prevent="guardarCategoria"
        >

          <!-- NOMBRE -->

          <div>

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nombre de categoría
            </label>

            <div class="relative">

              <Folder
                :size="18"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                v-model.trim="formulario.nombre"
                type="text"
                placeholder="Ejemplo: Tecnología"
                class="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                required
              />

            </div>

          </div>


          <!-- DESCRIPCIÓN -->

          <div>

            <label
              class="mb-2 block text-sm font-semibold text-slate-700"
            >
              Descripción
            </label>

            <textarea
              v-model.trim="formulario.descripcion"
              rows="4"
              placeholder="Describe esta categoría..."
              class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
              required
            />

          </div>


          <!-- ERROR FORMULARIO -->

          <div
            v-if="mensajeError"
            class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >

            <CircleAlert :size="20" />

            {{ mensajeError }}

          </div>


          <!-- FOOTER -->

          <footer
            class="flex justify-end gap-3 border-t border-slate-100 pt-5"
          >

            <button
              type="button"
              @click="cerrarFormulario"
              class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancelar
            </button>


            <button
              type="submit"
              :disabled="guardando"
              class="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <Loader2
                v-if="guardando"
                :size="18"
                class="animate-spin"
              />

              <Save
                v-else
                :size="18"
              />

              {{
                guardando
                  ? 'Guardando...'
                  : modoEdicion
                    ? 'Actualizar'
                    : 'Crear categoría'
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
  ref
} from 'vue';

import {
  FolderOpen,
  Folder,
  FolderPlus,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  CircleAlert,
  RefreshCw
} from 'lucide-vue-next';

import {
  obtenerCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria as eliminarCategoriaAPI
} from '../services/categoriaService';


// =====================================================
// ESTADOS
// =====================================================

const categorias = ref([]);

const busqueda = ref('');

const cargando = ref(false);

const guardando = ref(false);

const error = ref('');

const mensajeError = ref('');

const mostrarFormulario = ref(false);

const modoEdicion = ref(false);

const categoriaSeleccionadaId = ref(null);


// =====================================================
// FORMULARIO
// =====================================================

const formulario = reactive({

  nombre: '',

  descripcion: ''

});


// =====================================================
// CATEGORÍAS FILTRADAS
// =====================================================

const categoriasFiltradas = computed(() => {

  const texto =
    busqueda.value
      .toLowerCase()
      .trim();


  if (!texto) {

    return categorias.value;

  }


  return categorias.value.filter(
    (categoria) => {

      return (

        categoria.nombre
          ?.toLowerCase()
          .includes(texto)

        ||

        categoria.descripcion
          ?.toLowerCase()
          .includes(texto)

      );

    }
  );

});


// =====================================================
// CARGAR CATEGORÍAS
// =====================================================

const cargarCategorias = async () => {

  try {

    cargando.value = true;

    error.value = '';


    const datos =
      await obtenerCategorias();


    categorias.value =
      Array.isArray(datos)
        ? datos
        : [];

  } catch (err) {

    console.error(
      'Error al cargar categorías:',
      err
    );

    error.value =
      err.response?.data?.mensaje ||
      'No se pudieron cargar las categorías.';

  } finally {

    cargando.value = false;

  }

};


// =====================================================
// ABRIR NUEVA CATEGORÍA
// =====================================================

const abrirNuevaCategoria = () => {

  limpiarFormulario();

  modoEdicion.value = false;

  mensajeError.value = '';

  mostrarFormulario.value = true;

};


// =====================================================
// EDITAR CATEGORÍA
// =====================================================

const editarCategoria = (categoria) => {

  formulario.nombre =
    categoria.nombre || '';

  formulario.descripcion =
    categoria.descripcion || '';

  categoriaSeleccionadaId.value =
    categoria.id;

  modoEdicion.value = true;

  mensajeError.value = '';

  mostrarFormulario.value = true;

};


// =====================================================
// GUARDAR CATEGORÍA
// =====================================================

const guardarCategoria = async () => {

  try {

    guardando.value = true;

    mensajeError.value = '';


    const datos = {

      nombre:
        formulario.nombre,

      descripcion:
        formulario.descripcion

    };


    if (modoEdicion.value) {

      await actualizarCategoria(

        categoriaSeleccionadaId.value,

        datos

      );

    } else {

      await crearCategoria(datos);

    }


    cerrarFormulario();

    await cargarCategorias();


  } catch (err) {

    console.error(
      'Error al guardar categoría:',
      err
    );

    mensajeError.value =
      err.response?.data?.mensaje ||
      'No se pudo guardar la categoría.';

  } finally {

    guardando.value = false;

  }

};


// =====================================================
// ELIMINAR CATEGORÍA
// =====================================================

const eliminarCategoria = async (categoria) => {

  const confirmado =
    window.confirm(

      `¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`

    );


  if (!confirmado) {

    return;

  }


  try {

    await eliminarCategoriaAPI(
      categoria.id
    );


    await cargarCategorias();


  } catch (err) {

    console.error(
      'Error al eliminar categoría:',
      err
    );


    window.alert(

      err.response?.data?.mensaje ||

      'No se pudo eliminar la categoría.'

    );

  }

};


// =====================================================
// CERRAR FORMULARIO
// =====================================================

const cerrarFormulario = () => {

  mostrarFormulario.value = false;

  limpiarFormulario();

};


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================

const limpiarFormulario = () => {

  formulario.nombre = '';

  formulario.descripcion = '';

  categoriaSeleccionadaId.value = null;

  modoEdicion.value = false;

  mensajeError.value = '';

};


// =====================================================
// CARGAR AL INICIAR
// =====================================================

onMounted(() => {

  cargarCategorias();

});

</script>
  