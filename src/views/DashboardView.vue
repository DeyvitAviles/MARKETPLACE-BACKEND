  vue
<template>
  <section class="p-6">

    <!-- TÍTULO -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-800">
        Panel Administrativo
      </h1>

      <p class="mt-1 text-sm text-slate-500">
        Resumen general de tu Marketplace
      </p>
    </div>


    <!-- TARJETAS -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

      <!-- USUARIOS -->
      <article
        class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm font-medium text-slate-500">
              Usuarios
            </p>

            <strong class="mt-2 block text-3xl font-bold text-slate-800">
              0
            </strong>
          </div>

          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600"
          >
            <Users :size="24" />
          </div>

        </div>
      </article>


      <!-- PRODUCTOS -->
      <article
        class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm font-medium text-slate-500">
              Productos
            </p>

            <strong class="mt-2 block text-3xl font-bold text-slate-800">
              0
            </strong>
          </div>

          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600"
          >
            <ShoppingBag :size="24" />
          </div>

        </div>
      </article>


      <!-- CATEGORÍAS -->
      <article
        class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm font-medium text-slate-500">
              Categorías
            </p>

            <strong class="mt-2 block text-3xl font-bold text-slate-800">
              0
            </strong>
          </div>

          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600"
          >
            <FolderOpen :size="24" />
          </div>

        </div>
      </article>


      <!-- CONVERSACIONES -->
      <article
        class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex items-center justify-between">

          <div>
            <p class="text-sm font-medium text-slate-500">
              Conversaciones
            </p>

            <strong class="mt-2 block text-3xl font-bold text-slate-800">
              0
            </strong>
          </div>

          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600"
          >
            <MessageCircle :size="24" />
          </div>

        </div>
      </article>

    </div>

  </section>
</template>


<script setup>
import {
  Users,
  ShoppingBag,
  FolderOpen,
  MessageCircle
} from 'lucide-vue-next'
</script>
  