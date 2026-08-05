import api from './api.js';
const adminService = {
  async resumen() { return (await api.get('/admin/resumen')).data; },
  async conversaciones() { return (await api.get('/admin/conversaciones')).data; },
  async detalleConversacion(id) { return (await api.get(`/admin/conversaciones/${id}`)).data; },
  async eliminarConversacion(id) { return (await api.delete(`/admin/conversaciones/${id}`)).data; },
};
export default adminService;
