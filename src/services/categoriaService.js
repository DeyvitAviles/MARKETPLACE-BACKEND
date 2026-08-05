import api from './api.js';
export async function obtenerCategorias() { return (await api.get('/categorias')).data; }
export async function crearCategoria(data) { return (await api.post('/categorias', data)).data; }
export async function actualizarCategoria(id, data) { return (await api.put(`/categorias/${id}`, data)).data; }
export async function eliminarCategoria(id) { return (await api.delete(`/categorias/${id}`)).data; }
export default { obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria };
