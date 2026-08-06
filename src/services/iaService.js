import api from './api.js';

const iaService = {
  async consultar(mensaje, historial = []) {
    const { data } = await api.post('/ia/chat', { mensaje, historial });
    return data;
  },
};

export default iaService;
