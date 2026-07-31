
<template>
  <section class="min-h-screen bg-slate-50 p-4 sm:p-6">

    <!-- ===================================================== -->
    <!-- ENCABEZADO -->
    <!-- ===================================================== -->

    <div
      class="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-4">

        <div
          class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
        >
          <Package :size="25" />
        </div>

        <div>
          <h2 class="text-xl font-bold text-slate-800 sm:text-2xl">
            Gestión de productos
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            Administra los productos publicados en MarketChat.
          </p>
        </div>

      </div>


      <!-- BOTONES -->

      <div class="flex flex-col gap-2 sm:flex-row">

        <button
          type="button"
          :disabled="cargando"
          @click="cargarProductos"
          class="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            :size="18"
            :class="{ 'animate-spin': cargando }"
          />

          {{ cargando ? 'Cargando...' : 'Recargar' }}
        </button>


        <button
          type="button"
          @click="abrirFormularioNuevo"
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
        >
          <Plus :size="19" />

          Nuevo producto
        </button>

      </div>

    </div>


    <!-- ===================================================== -->
    <!-- ESTADO DE CARGA -->
    <!-- ===================================================== -->

    <div
      v-if="cargando"
      class="flex min-h-[250px] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
    >
      <LoaderCircle
        :size="38"
        class="animate-spin text-blue-600"
      />

      <p class="mt-4 text-sm font-medium text-slate-500">
        Cargando productos...
      </p>
    </div>


    <!-- ===================================================== -->
    <!-- ERROR -->
    <!-- ===================================================== -->

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
        No se pudieron cargar los productos
      </h3>

      <p class="mt-2 text-sm text-red-600">
        {{ mensajeError }}
      </p>

      <button
        type="button"
        @click="cargarProductos"
        class="mt-5 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        Intentar nuevamente
      </button>

    </div>


    <!-- ===================================================== -->
    <!-- SIN PRODUCTOS -->
    <!-- ===================================================== -->

    <div
      v-else-if="productos.length === 0"
      class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"
    >

      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"
      >
        <Package :size="32" />
      </div>

      <h3 class="mt-5 font-bold text-slate-700">
        No hay productos registrados
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        Comienza agregando el primer producto a tu Marketplace.
      </p>

      <button
        type="button"
        @click="abrirFormularioNuevo"
        class="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus :size="18" />

        Agregar producto
      </button>

    </div>


    <!-- ===================================================== -->
    <!-- TABLA -->
    <!-- ===================================================== -->

    <div
      v-else
      class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
    >

      <!-- CABECERA TABLA -->

      <div
        class="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="font-bold text-slate-800">
            Productos registrados
          </h3>

          <p class="text-sm text-slate-500">
            {{ productos.length }} productos encontrados
          </p>
        </div>
      </div>


      <!-- SCROLL TABLA -->

      <div class="overflow-x-auto">

        <table class="w-full min-w-[950px]">

          <thead class="bg-slate-50">

            <tr>

              <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Producto
              </th>

              <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Categoría
              </th>

              <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Precio
              </th>

              <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Stock
              </th>

              <th class="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                Usuario
              </th>

              <th class="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Acciones
              </th>

            </tr>

          </thead>


          <tbody class="divide-y divide-slate-100">

            <tr
              v-for="producto in productos"
              :key="obtenerId(producto)"
              class="transition hover:bg-slate-50"
            >

              <!-- PRODUCTO -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-4">

                  <div
                    class="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
                  >

                    <img
                      v-if="obtenerImagen(producto)"
                      :src="obtenerImagen(producto)"
                      :alt="producto.nombre"
                      class="h-full w-full object-cover"
                      @error="ocultarImagen"
                    />

                    <div
                      v-else
                      class="flex h-full w-full items-center justify-center text-slate-400"
                    >
                      <ImageIcon :size="22" />
                    </div>

                  </div>


                  <div class="max-w-[280px]">

                    <p class="font-semibold text-slate-800">
                      {{ producto.nombre || 'Sin nombre' }}
                    </p>

                    <p class="mt-1 truncate text-xs text-slate-500">
                      {{
                        resumirDescripcion(
                          producto.descripcion
                        )
                      }}
                    </p>

                  </div>

                </div>

              </td>


              <!-- CATEGORÍA -->

              <td class="px-5 py-4">

                <span
                  class="inline-flex items-center gap-2 rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700"
                >
                  <FolderOpen :size="14" />

                  {{
                    producto.categoria_nombre ||
                    producto.categoria ||
                    'Sin categoría'
                  }}
                </span>

              </td>


              <!-- PRECIO -->

              <td class="px-5 py-4">

                <span class="font-bold text-slate-800">
                  {{
                    formatearPrecio(
                      producto.precio
                    )
                  }}
                </span>

              </td>


              <!-- STOCK -->

              <td class="px-5 py-4">

                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-bold"
                  :class="
                    Number(producto.stock) <= 0
                      ? 'bg-red-100 text-red-700'
                      : Number(producto.stock) <= 5
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  "
                >
                  {{
                    Number(producto.stock) <= 0
                      ? 'Agotado'
                      : `${producto.stock} disponibles`
                  }}
                </span>

              </td>


              <!-- USUARIO -->

              <td class="px-5 py-4">

                <div class="flex items-center gap-2 text-sm text-slate-600">

                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                  >
                    <User :size="16" />
                  </div>

                  <span>
                    {{
                      producto.usuario_nombre ||
                      producto.nombre_usuario ||
                      producto.usuario_id ||
                      '—'
                    }}
                  </span>

                </div>

              </td>


              <!-- ACCIONES -->

              <td class="px-5 py-4">

                <div class="flex justify-end gap-2">

                  <button
                    type="button"
                    @click="editarProducto(producto)"
                    title="Editar producto"
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                  >
                    <Pencil :size="17" />
                  </button>


                  <button
                    type="button"
                    @click="prepararEliminacion(producto)"
                    title="Eliminar producto"
                    class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 :size="17" />
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
        Total de productos:

        <strong class="ml-1 text-slate-800">
          {{ productos.length }}
        </strong>
      </div>

    </div>


    <!-- ===================================================== -->
    <!-- MODAL -->
    <!-- ===================================================== -->

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

          <div>

            <h3 class="text-lg font-bold text-slate-800">
              {{
                modoEdicion
                  ? 'Editar producto'
                  : 'Nuevo producto'
              }}
            </h3>

            <p class="mt-1 text-sm text-slate-500">
              Completa los datos del producto.
            </p>

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
          @submit.prevent="guardarProducto"
        >

          <!-- NOMBRE -->

          <div>

            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Nombre del producto
            </label>

            <input
              v-model.trim="formulario.nombre"
              type="text"
              placeholder="Ejemplo: Laptop Lenovo"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>


          <!-- DESCRIPCIÓN -->

          <div>

            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Descripción
            </label>

            <textarea
              v-model.trim="formulario.descripcion"
              rows="4"
              placeholder="Describe las características del producto..."
              class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>

          <!-- UBICACIÓN -->

<div>

  <label class="mb-2 block text-sm font-semibold text-slate-700">
    Ubicación
  </label>

  <input
    v-model.trim="formulario.ubicacion"
    type="text"
    placeholder="Ejemplo: Lima, Perú"
    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  />

</div>


          <!-- PRECIO / STOCK -->

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>

              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Precio
              </label>

              <input
                v-model="formulario.precio"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            <div>

              <label class="mb-2 block text-sm font-semibold text-slate-700">
                Stock
              </label>

              <input
                v-model="formulario.stock"
                type="number"
                min="0"
                step="1"
                placeholder="0"
                class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>


          <!-- CATEGORÍA -->

          <div>

            <label class="mb-2 block text-sm font-semibold text-slate-700">
              Categoría
            </label>

            <select
              v-model="formulario.categoria_id"
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >

              <option value="">
                Selecciona una categoría
              </option>

              <option
                v-for="categoria in categorias"
                :key="categoria.id"
                :value="categoria.id"
              >
                {{ categoria.nombre }}
              </option>

            </select>

          </div>


          <!-- USUARIO -->

          <div v-if="!modoEdicion">

            <label class="mb-2 block text-sm font-semibold text-slate-700">
              ID del usuario propietario
            </label>

            <input
              v-model="formulario.usuario_id"
              type="number"
              min="1"
              placeholder="ID del usuario"
              class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

          </div>


          <!-- IMAGEN -->

          <div>

            <label class="mb-2 block text-sm font-semibold text-slate-700">
              {{ modoEdicion ? 'Cambiar imagen del producto' : 'Imagen del producto' }}
            </label>

            <div
              v-if="modoEdicion && formulario.imagen && !vistaPreviaImagen"
              class="mb-4"
            >
              <p class="mb-2 text-xs font-semibold text-slate-500">
                Imagen actual
              </p>

              <img
                :src="obtenerImagen({ imagen: formulario.imagen })"
                alt="Imagen actual"
                class="h-40 w-full rounded-xl border border-slate-200 object-cover"
                @error="ocultarImagen"
              />
            </div>

            <div
              v-if="vistaPreviaImagen"
              class="mb-4"
            >
              <p class="mb-2 text-xs font-semibold text-slate-500">
                Nueva imagen seleccionada
              </p>

              <img
                :src="vistaPreviaImagen"
                alt="Vista previa de la nueva imagen"
                class="h-40 w-full rounded-xl border border-blue-200 object-cover"
              />
            </div>

            <label
              class="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-blue-400 hover:bg-blue-50"
            >

              <Upload
                :size="28"
                class="text-slate-400"
              />

              <span class="mt-2 text-sm font-semibold text-slate-600">
                {{ modoEdicion ? 'Seleccionar nueva imagen' : 'Seleccionar imagen' }}
              </span>

              <span class="mt-1 text-xs text-slate-400">
                PNG, JPG, JPEG o WEBP · máximo 5 MB
              </span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="seleccionarImagen"
                class="hidden"
              />

            </label>

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


          <!-- BOTONES MODAL -->

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
                    ? 'Actualizar producto'
                    : 'Crear producto'
              }}

            </button>

          </footer>

        </form>

      </section>

    </div>

  </section>
</template>


<script setup>

import { onMounted, reactive, ref } from 'vue';

import productoService from '../services/productoService.js';

import categoriaService from '../services/categoriaService.js';

import {
  Plus,
  RefreshCw,
  Package,
  Image as ImageIcon,
  Pencil,
  Trash2,
  X,
  User,
  FolderOpen,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  Upload
} from 'lucide-vue-next';


// =====================================================
// VARIABLES
// =====================================================

const productos = ref([]);

const categorias = ref([]);

const cargando = ref(false);

const guardando = ref(false);

const mensajeError = ref('');

const errorFormulario = ref('');

const mensajeFormulario = ref('');

const mostrarFormulario = ref(false);

const modoEdicion = ref(false);

const productoSeleccionadoId = ref(null);

const imagenSeleccionada = ref(null);

const vistaPreviaImagen = ref('');


// =====================================================
// FORMULARIO
// =====================================================

const formulario = reactive({

  nombre: '',

  descripcion: '',

  ubicacion: '',

  precio: '',

  stock: '',

  categoria_id: '',

  imagen: '',

  usuario_id: '',

});


// =====================================================
// OBTENER ID DEL PRODUCTO
// =====================================================

function obtenerId(producto) {

  return (

    producto.id ||

    producto.producto_id ||

    null

  );

}


// =====================================================
// CARGAR PRODUCTOS
// =====================================================

async function cargarProductos() {

  cargando.value = true;

  mensajeError.value = '';

  try {

    const respuesta =

      await productoService.obtenerProductos();


    const datos =

      respuesta?.data ??

      respuesta;


    productos.value =

      datos?.productos ??

      datos?.datos ??

      (

        Array.isArray(datos)

          ? datos

          : []

      );

  }

  catch (error) {

    console.error(

      'Error al cargar productos:',

      error,

    );


    mensajeError.value =

      error.response?.data?.mensaje ||

      error.message ||

      'No se pudieron cargar los productos.';

  }

  finally {

    cargando.value = false;

  }

}


// =====================================================
// CARGAR CATEGORÍAS
// =====================================================

async function cargarCategorias() {

  try {

    const respuesta =

      await categoriaService.obtenerCategorias();


    const datos =

      respuesta?.data ??

      respuesta;


    categorias.value =

      Array.isArray(datos)

        ? datos

        : datos?.categorias ??

          [];

  }

  catch (error) {

    console.error(

      'Error al cargar categorías:',

      error,

    );

  }

}


// =====================================================
// ABRIR FORMULARIO NUEVO
// =====================================================

function abrirFormularioNuevo() {

  limpiarFormulario();

  modoEdicion.value = false;

  mostrarFormulario.value = true;

}


// =====================================================
// EDITAR PRODUCTO
// =====================================================

function editarProducto(producto) {

  limpiarFormulario();


  productoSeleccionadoId.value =

    obtenerId(producto);


  formulario.nombre =

    producto.nombre ?? '';


  formulario.descripcion =

    producto.descripcion ?? '';


  formulario.ubicacion =

    producto.ubicacion ?? '';


  formulario.precio =

    producto.precio ?? '';


  formulario.stock =

    producto.stock ?? '';


  formulario.categoria_id =

    producto.categoria_id ?? '';

  formulario.imagen =

    producto.imagen?? '';


  formulario.usuario_id =

    producto.usuario_id ?? '';


  modoEdicion.value = true;

  mostrarFormulario.value = true;

}


// =====================================================
// CERRAR FORMULARIO
// =====================================================

function cerrarFormulario() {

  if (guardando.value) {

    return;

  }


  mostrarFormulario.value = false;

  limpiarFormulario();

}


// =====================================================
// LIMPIAR FORMULARIO
// =====================================================

function limpiarFormulario() {

  formulario.nombre = '';

  formulario.descripcion = '';

  formulario.ubicacion = '';

  formulario.precio = '';

  formulario.stock = '';

  formulario.categoria_id = '';

  formulario.usuario_id = '';

  formulario.imagen = '';


  productoSeleccionadoId.value = null;

  imagenSeleccionada.value = null;

  if (vistaPreviaImagen.value) {
    URL.revokeObjectURL(vistaPreviaImagen.value);
  }

  vistaPreviaImagen.value = '';


  errorFormulario.value = '';

  mensajeFormulario.value = '';

}


// =====================================================
// SELECCIONAR IMAGEN
// =====================================================

function seleccionarImagen(evento) {

  const archivo = evento.target.files?.[0];

  if (!archivo) {
    imagenSeleccionada.value = null;

    if (vistaPreviaImagen.value) {
      URL.revokeObjectURL(vistaPreviaImagen.value);
    }

    vistaPreviaImagen.value = '';
    return;
  }

  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!tiposPermitidos.includes(archivo.type)) {
    errorFormulario.value =
      'Selecciona una imagen JPG, PNG o WEBP.';

    evento.target.value = '';
    imagenSeleccionada.value = null;
    return;
  }

  const limite = 5 * 1024 * 1024;

  if (archivo.size > limite) {
    errorFormulario.value =
      'La imagen no puede superar los 5 MB.';

    evento.target.value = '';
    imagenSeleccionada.value = null;
    return;
  }

  errorFormulario.value = '';
  imagenSeleccionada.value = archivo;

  if (vistaPreviaImagen.value) {
    URL.revokeObjectURL(vistaPreviaImagen.value);
  }

  vistaPreviaImagen.value =
    URL.createObjectURL(archivo);
}



// =====================================================
// VALIDAR FORMULARIO
// =====================================================

function validarFormulario() {

  if (!formulario.nombre) {

    return 'Escribe el nombre del producto.';

  }


  if (

    formulario.precio === '' ||

    Number(formulario.precio) < 0

  ) {

    return 'Introduce un precio válido.';

  }


  if (

    formulario.stock === '' ||

    Number(formulario.stock) < 0

  ) {

    return 'Introduce un stock válido.';

  }


  if (!formulario.categoria_id) {

    return 'Selecciona una categoría.';

  }


  if (

    !modoEdicion.value &&

    (

      !formulario.usuario_id ||

      Number(formulario.usuario_id) < 1

    )

  ) {

    return 'Introduce el ID del usuario propietario.';

  }


  return '';

}


// =====================================================
// GUARDAR PRODUCTO
// =====================================================

async function guardarProducto() {

  errorFormulario.value = '';

  mensajeFormulario.value = '';


  const errorValidacion =

    validarFormulario();


  if (errorValidacion) {

    errorFormulario.value =

      errorValidacion;

    return;

  }


  guardando.value = true;


  try {

    const nombre =

      String(

        formulario.nombre ?? '',

      ).trim();


    const descripcion =

      String(

        formulario.descripcion ?? '',

      ).trim();


      const ubicacion =
    String(
        formulario.ubicacion ?? '',
    ).trim();


    const precio =

      Number(

        formulario.precio

      );


    const stock =

      Number(

        formulario.stock

      );


    const usuarioId =

      Number(

        formulario.usuario_id

      );


    console.log(

  'FORMULARIO ANTES DE ENVIAR:',

  {

    nombre,

    descripcion,

    ubicacion,

    precio,

    stock,

    categoria_id:
      formulario.categoria_id,

    usuario_id:
      usuarioId,

  },

);


    // =================================================
    // ACTUALIZAR
    // =================================================

    if (modoEdicion.value) {

      const datos = new FormData();

      datos.append('nombre', nombre);
      datos.append('descripcion', descripcion);
      datos.append('ubicacion', ubicacion);
      datos.append('precio', String(precio));
      datos.append('stock', String(stock));
      datos.append(
        'categoria_id',
        String(formulario.categoria_id),
      );

      datos.append(
        'usuario_id',
        String(usuarioId),
      );

      if (imagenSeleccionada.value instanceof File) {
        datos.append(
          'imagen',
          imagenSeleccionada.value,
        );
      }

      await productoService.actualizarProducto(
        productoSeleccionadoId.value,
        datos,
      );

      mensajeFormulario.value =
        imagenSeleccionada.value instanceof File
          ? 'Producto e imagen actualizados correctamente.'
          : 'Producto actualizado correctamente.';
    }



    // =================================================
    // CREAR
    // =================================================

    else {

      const datos =

        new FormData();


      datos.append(

        'nombre',

        nombre,

      );


      datos.append(

        'descripcion',

        descripcion,

      );


    datos.append(
    'ubicacion',
    ubicacion,
);


      datos.append(

        'precio',

        String(

          precio

        ),

      );


      datos.append(

        'stock',

        String(

          stock

        ),

      );


      datos.append(

        'categoria_id',

        String(

          formulario.categoria_id

        ),

      );


      datos.append(

        'usuario_id',

        String(

          usuarioId

        ),

      );


      if (

        imagenSeleccionada.value

        instanceof File

      ) {

        datos.append(

          'imagen',

          imagenSeleccionada.value,

        );

      }


      console.log(

        '¿DATOS ES FORMDATA?',

        datos instanceof FormData,

      );


      console.log(

        '¿IMAGEN ES FILE?',

        imagenSeleccionada.value instanceof File,

      );


      for (

        const [

          clave,

          valor

        ]

        of datos.entries()

      ) {

        console.log(

          'FORMDATA:',

          clave,

          valor,

        );

      }


      await productoService.crearProducto(

        datos,

      );


      mensajeFormulario.value =

        'Producto creado correctamente.';

    }


    await cargarProductos();


    cerrarFormulario();

  }

  catch (error) {

    console.error(

      'Error guardando producto:',

      error,

    );


    errorFormulario.value =

      error.response?.data?.mensaje ||

      error.response?.data?.error ||

      error.message ||

      'No se pudo guardar el producto.';

  }

  finally {

    guardando.value = false;

  }

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

async function prepararEliminacion(producto) {

  const id =

    obtenerId(producto);


  if (!id) {

    window.alert(

      'No se encontró el ID del producto.',

    );

    return;

  }


  const nombre =

    producto.nombre ||

    'este producto';


  const confirmado =

    window.confirm(

      `¿Seguro que deseas eliminar "${nombre}"?`,

    );


  if (!confirmado) {

    return;

  }


  try {

    await productoService.eliminarProducto(

      id,

    );


    productos.value =

      productos.value.filter(

        (item) =>

          obtenerId(item) !== id,

      );

  }

  catch (error) {

    console.error(

      'Error al eliminar producto:',

      error,

    );


    window.alert(

      error.response?.data?.mensaje ||

      error.response?.data?.error ||

      'No se pudo eliminar el producto.',

    );

  }

}


// =====================================================
// OBTENER IMAGEN
// =====================================================

function obtenerImagen(producto) {

  const imagen =

    producto.imagen ||

    producto.imagen_url ||

    producto.foto;


  if (!imagen) {

    return '';

  }


  if (

    imagen.startsWith('http://') ||

    imagen.startsWith('https://')

  ) {

    return imagen;

  }


  const rutaLimpia =

    imagen.replaceAll(

      '\\',

      '/'

    );


  const ruta =

    rutaLimpia.startsWith('/')

      ? rutaLimpia

      : `/${rutaLimpia}`;


  return `http://localhost:3000${ruta}`;

}


// =====================================================
// OCULTAR IMAGEN QUE FALLÓ
// =====================================================

function ocultarImagen(evento) {

  evento.target.style.display =

    'none';

}


// =====================================================
// RESUMIR DESCRIPCIÓN
// =====================================================

function resumirDescripcion(descripcion) {

  if (!descripcion) {

    return 'Sin descripción';

  }


  const texto =

    String(

      descripcion

    );


  if (

    texto.length <= 70

  ) {

    return texto;

  }


  return `${texto.slice(

    0,

    70

  )}...`;

}


// =====================================================
// FORMATEAR PRECIO
// =====================================================

function formatearPrecio(precio) {

  const valor =

    Number(

      precio

    );


  if (

    Number.isNaN(valor)

  ) {

    return 'S/ 0.00';

  }


  return new Intl.NumberFormat(

    'es-PE',

    {

      style:

        'currency',

      currency:

        'PEN',

    },

  ).format(

    valor

  );

}


// =====================================================
// CARGAR AL ENTRAR EN LA VISTA
// =====================================================

onMounted(() => {

  cargarProductos();

  cargarCategorias();

});

</script>
    