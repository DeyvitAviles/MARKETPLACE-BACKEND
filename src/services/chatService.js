import api from './api.js';
const chatService = {
  async crear(usuario1Id, usuario2Id, productoId) { return (await api.post('/chats/conversacion', { usuario1_id: usuario1Id, usuario2_id: usuario2Id, producto_id: productoId })).data; },
  async conversaciones(usuarioId) { return (await api.get(`/chats/usuario/${usuarioId}`)).data; },
  async detalle(id) { return (await api.get(`/chats/conversacion/${id}`)).data; },
  async mensajes(id) { return (await api.get(`/chats/mensajes/${id}`)).data; },
  async enviar(conversacionId, emisorId, mensaje) { return (await api.post('/chats/mensaje', { conversacion_id: conversacionId, emisor_id: emisorId, mensaje })).data; },
  async enviarImagen(conversacionId, emisorId, archivo) { const form = new FormData(); form.append('conversacion_id', conversacionId); form.append('emisor_id', emisorId); form.append('imagen', archivo); return (await api.post('/chats/imagen', form)).data; },
  async marcarLeidos(conversacionId, usuarioId) { return (await api.put(`/chats/mensajes/${conversacionId}/leidos`, { usuario_id: usuarioId })).data; },
};
export default chatService;
