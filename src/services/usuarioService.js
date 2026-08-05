import api from './api.js';

const usuarioService = {
  async obtenerUsuarios() { return (await api.get('/usuarios')).data; },
  async crearUsuario(usuario) { return (await api.post('/usuarios/admin', usuario)).data; },
  async actualizarUsuario(id, usuario) { return (await api.put(`/usuarios/admin/${id}`, usuario)).data; },
  async eliminarUsuario(id) { return (await api.delete(`/usuarios/admin/${id}`)).data; },
  async obtenerPerfil(id) { return (await api.get(`/usuarios/${id}/perfil`)).data; },
  async actualizarPerfil(id, datos) { return (await api.put(`/usuarios/${id}/perfil`, datos)).data; },
  async cambiarPassword(id, datos) { return (await api.put(`/usuarios/${id}/password`, datos)).data; },
};
export default usuarioService;
