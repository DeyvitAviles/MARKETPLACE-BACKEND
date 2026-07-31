<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="marca">
        <div class="logo">M</div>

        <div>
          <h2>MarketChat</h2>
          <span>Administrador</span>
        </div>
      </div>

      <nav class="menu">
        <RouterLink
          to="/dashboard"
          class="menu-link"
        >
          Dashboard
        </RouterLink>

        <RouterLink
          to="/usuarios"
          class="menu-link"
        >
          Usuarios
        </RouterLink>

        <RouterLink
          to="/productos"
          class="menu-link"
        >
          Productos
        </RouterLink>

        <RouterLink
          to="/categorias"
          class="menu-link"
        >
          Categorías
        </RouterLink>

        <RouterLink
          to="/conversaciones"
          class="menu-link"
        >
          Conversaciones
        </RouterLink>
      </nav>

      <button
        class="boton-salir"
        @click="cerrarSesion"
      >
        Cerrar sesión
      </button>
    </aside>

    <section class="contenido">
      <header class="topbar">
        <div>
          <h1>{{ tituloActual }}</h1>

          <p>Panel administrativo de MarketChat</p>
        </div>

        <div class="usuario">
          <div class="avatar">
            {{ inicialUsuario }}
          </div>

          <div>
            <strong>{{ nombreUsuario }}</strong>
            <span>Administrador</span>
          </div>
        </div>
      </header>

      <main class="pagina">
        <RouterView />
      </main>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  RouterLink,
  RouterView,
  useRoute,
  useRouter,
} from 'vue-router';

const route = useRoute();
const router = useRouter();

const usuarioGuardado = computed(() => {
  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    return {};
  }

  try {
    return JSON.parse(usuario);
  } catch {
    return {};
  }
});

const nombreUsuario = computed(() => {
  return (
    usuarioGuardado.value.nombre ||
    usuarioGuardado.value.correo ||
    'Administrador'
  );
});

const inicialUsuario = computed(() => {
  return nombreUsuario.value
    .charAt(0)
    .toUpperCase();
});

const tituloActual = computed(() => {
  const titulos = {
    dashboard: 'Dashboard',
    usuarios: 'Usuarios',
    productos: 'Productos',
    categorias: 'Categorías',
    conversaciones: 'Conversaciones',
  };

  return titulos[route.name] || 'Administración';
});

function cerrarSesion() {
  localStorage.removeItem('usuario');

  router.push('/login');
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
  background: #f1f5f9;
}

.sidebar {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  color: white;
  background: #0f172a;
}

.marca {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 8px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.logo {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 800;
  background: #2563eb;
  border-radius: 14px;
}

.marca h2 {
  margin: 0;
  font-size: 20px;
}

.marca span {
  color: #94a3b8;
  font-size: 13px;
}

.menu {
  display: grid;
  gap: 8px;
  margin-top: 28px;
}

.menu-link {
  padding: 13px 14px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 12px;
  transition: 0.2s;
}

.menu-link:hover {
  color: white;
  background: #1e293b;
}

.menu-link.router-link-active {
  color: white;
  font-weight: 700;
  background: #2563eb;
}

.boton-salir {
  margin-top: auto;
  padding: 13px;
  color: white;
  font-weight: 700;
  background: #dc2626;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.boton-salir:hover {
  background: #b91c1c;
}

.contenido {
  min-width: 0;
}

.topbar {
  min-height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 28px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.topbar h1 {
  margin: 0;
  color: #0f172a;
  font-size: 25px;
}

.topbar p {
  margin: 4px 0 0;
  color: #64748b;
}

.usuario {
  display: flex;
  align-items: center;
  gap: 12px;
}

.usuario div:last-child {
  display: grid;
}

.usuario span {
  color: #64748b;
  font-size: 13px;
}

.avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  color: white;
  font-weight: 800;
  background: #2563eb;
  border-radius: 50%;
}

.pagina {
  padding: 28px;
}

@media (max-width: 850px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: auto;
  }

  .menu {
    grid-template-columns: repeat(2, 1fr);
  }

  .boton-salir {
    margin-top: 24px;
  }

  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>