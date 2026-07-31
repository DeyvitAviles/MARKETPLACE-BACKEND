import {
  createRouter,
  createWebHistory,
} from 'vue-router';

import LoginView from '../views/LoginView.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import DashboardView from '../views/DashboardView.vue';
import UsuariosView from '../views/UsuariosView.vue';
import ProductosView from '../views/ProductosView.vue';
import CategoriasView from '../views/CategoriasView.vue';
import ConversacionesView from '../views/ConversacionesView.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: DashboardView,
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: UsuariosView,
      },
      {
        path: 'productos',
        name: 'productos',
        component: ProductosView,
      },
      {
        path: 'categorias',
        name: 'categorias',
        component: CategoriasView,
      },
      {
        path: 'conversaciones',
        name: 'conversaciones',
        component: ConversacionesView,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const usuarioGuardado =
    localStorage.getItem('usuario');

  let usuario = null;

  try {
    usuario = usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  } catch {
    localStorage.removeItem('usuario');
  }

  const esAdministrador =
    usuario?.rol === 'administrador';

  if (
    to.name !== 'login' &&
    !esAdministrador
  ) {
    return {
      name: 'login',
    };
  }

  if (
    to.name === 'login' &&
    esAdministrador
  ) {
    return {
      name: 'dashboard',
    };
  }

  return true;
});

export default router;