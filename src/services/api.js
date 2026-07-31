import axios from 'axios';

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000',

  headers: {
    'Content-Type': 'application/json',
  },

  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const usuarioGuardado =
      localStorage.getItem('usuario');

    if (!usuarioGuardado) {
      return config;
    }

    try {
      const usuario =
        JSON.parse(usuarioGuardado);

      if (usuario?.id) {
        config.headers['usuario-id'] =
          usuario.id;
      }
    } catch {
      localStorage.removeItem('usuario');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const estado =
      error.response?.status;

    if (
      estado === 401 ||
      estado === 403
    ) {
      const mensaje =
        error.response?.data?.mensaje || '';

      const esErrorPermisos =
        mensaje.includes('permisos') ||
        mensaje.includes('administrador') ||
        mensaje.includes('activa');

      if (esErrorPermisos) {
        localStorage.removeItem('usuario');

        if (
          window.location.pathname !==
          '/login'
        ) {
          window.location.href =
            '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);
export default api;