import { createRouter, createWebHistory } from 'vue-router';
import authService from '../services/authService.js';

import LoginView from '../views/LoginView.vue';
import RegistroView from '../views/RegistroView.vue';
import UserLayout from '../layouts/UserLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

const routes = [
  { path: '/', redirect: '/marketplace' },
  { path: '/login', name: 'login', component: LoginView, meta: { public: true } },
  { path: '/registro', name: 'registro', component: RegistroView, meta: { public: true } },
  {
    path: '/',
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'marketplace', name: 'marketplace', component: () => import('../views/MarketplaceView.vue') },
      { path: 'producto/:id', name: 'producto-detalle', component: () => import('../views/ProductoDetalleView.vue') },
      { path: 'mis-productos', name: 'mis-productos', component: () => import('../views/MisProductosView.vue') },
      { path: 'favoritos', name: 'favoritos', component: () => import('../views/FavoritosView.vue') },
      { path: 'conversaciones', name: 'mis-conversaciones', component: () => import('../views/MisConversacionesView.vue') },
      { path: 'perfil', name: 'perfil', component: () => import('../views/PerfilView.vue') },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['administrador', 'superadministrador'] },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/DashboardView.vue') },
      { path: 'usuarios', name: 'admin-usuarios', component: () => import('../views/UsuariosView.vue') },
      { path: 'productos', name: 'admin-productos', component: () => import('../views/ProductosView.vue') },
      { path: 'categorias', name: 'admin-categorias', component: () => import('../views/CategoriasView.vue') },
      { path: 'conversaciones', name: 'admin-conversaciones', component: () => import('../views/ConversacionesView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/marketplace' },
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to) => {
  const usuario = authService.obtenerUsuario();
  const autenticado = authService.estaAutenticado();
  if (to.meta.requiresAuth && !autenticado) return { name: 'login', query: { redirect: to.fullPath } };
  if (to.meta.roles && !to.meta.roles.includes(usuario?.rol)) return { name: 'marketplace' };
  if ((to.name === 'login' || to.name === 'registro') && autenticado) return { name: 'marketplace' };
  return true;
});

export default router;
