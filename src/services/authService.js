import api from './api.js';

const authService = {
  async iniciarSesion(correo, password) {
    const response = await api.post(
      '/usuarios/login',
      {
        correo,
        password,
      },
    );

    return response.data;
  },

  guardarUsuario(usuario) {
    localStorage.setItem(
      'usuario',
      JSON.stringify(usuario),
    );
  },

  obtenerUsuario() {
    const usuario =
      localStorage.getItem('usuario');

    if (!usuario) {
      return null;
    }

    try {
      return JSON.parse(usuario);
    } catch {
      return null;
    }
  },

  cerrarSesion() {
    localStorage.removeItem('usuario');
  },

  estaAutenticado() {
    return Boolean(
      localStorage.getItem('usuario'),
    );
  },
};

export default authService;