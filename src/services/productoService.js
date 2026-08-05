import api from './api.js';

const productoService = {
  async obtenerProductos() { return (await api.get('/productos')).data; },
  async obtenerProducto(id) { return (await api.get(`/productos/${id}`)).data; },
  async obtenerPorUsuario(id) { return (await api.get(`/productos/usuario/${id}`)).data; },
  async crearProducto(formData) { return (await api.post('/productos', formData)).data; },
  async actualizarProducto(id, formData) { return (await api.put(`/productos/${id}`, formData)).data; },
  async eliminarProducto(id, usuarioId) { return (await api.delete(`/productos/${id}`, { data: { usuario_id: usuarioId } })).data; },
  async actualizarProductoAdmin(id, formData) { return (await api.put(`/productos/admin/${id}`, formData)).data; },
  async eliminarProductoAdmin(id) { return (await api.delete(`/productos/admin/${id}`)).data; },
};
export default productoService;
