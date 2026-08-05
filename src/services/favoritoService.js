import api from './api.js';
const favoritoService = {
  async obtener(usuarioId) { return (await api.get(`/favoritos/usuario/${usuarioId}`)).data; },
  async verificar(usuarioId, productoId) { return (await api.get(`/favoritos/verificar/${usuarioId}/${productoId}`)).data; },
  async agregar(usuarioId, productoId) { return (await api.post('/favoritos', { usuario_id: usuarioId, producto_id: productoId })).data; },
  async eliminar(usuarioId, productoId) { return (await api.delete(`/favoritos/${usuarioId}/${productoId}`)).data; },
};
export default favoritoService;
