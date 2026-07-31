import api from './api.js';

const usuarioService = {
  async obtenerUsuarios() {
    const response = await api.get('/usuarios');

    return response.data;
  },

  async crearUsuario(usuario) {
    const response = await api.post(
      '/usuarios',
      usuario,
    );

    return response.data;
  },

  async actualizarUsuario(id, usuario) {
    const response = await api.put(
      `/usuarios/${id}/perfil`,
      usuario,
    );

    return response.data;
  },

  async obtenerPerfil(id) {
    const response = await api.get(
      `/usuarios/${id}/perfil`,
    );

    return response.data;
  },
};

export default usuarioService;