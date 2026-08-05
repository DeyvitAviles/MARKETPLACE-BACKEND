import api from './api.js';

const authService = {
  async iniciarSesion(correo, password) {
    const { data } = await api.post('/usuarios/login', { correo, password });
    this.guardarSesion(data.usuario, data.token);
    return data;
  },
  async registrar(datos) {
    const { data } = await api.post('/usuarios/registro', datos);
    return data;
  },
  async refrescarUsuario() {
    const { data } = await api.get('/usuarios/me');
    this.guardarUsuario(data.usuario);
    return data.usuario;
  },
  guardarSesion(usuario, token) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', token);
  },
  guardarUsuario(usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  },
  obtenerUsuario() {
    try { return JSON.parse(localStorage.getItem('usuario')) || null; } catch { return null; }
  },
  obtenerToken() { return localStorage.getItem('token'); },
  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  },
  estaAutenticado() { return Boolean(localStorage.getItem('token') && this.obtenerUsuario()); },
  esAdmin() { return ['administrador', 'superadministrador'].includes(this.obtenerUsuario()?.rol); },
  esSuperadmin() { return this.obtenerUsuario()?.rol === 'superadministrador'; },
};

export default authService;
