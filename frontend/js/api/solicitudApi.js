const solicitudApi = {
  async getAll(filters = {}) {
    const token = auth.getToken();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/solicitudes?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener solicitudes');
    }

    return response.json();
  },

  async getById(id) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/solicitudes/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener solicitud');
    }

    return response.json();
  },

  async create(solicitudData) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/solicitudes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(solicitudData)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al crear solicitud');
    }

    return response.json();
  },

  async asignarTecnico(id, tecnicoId) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/solicitudes/${id}/asignar`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tecnico_id: tecnicoId })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al asignar técnico');
    }

    return response.json();
  },

  async updateEstado(id, estado, comentario = '') {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/solicitudes/${id}/estado`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado, comentario })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al actualizar estado');
    }

    return response.json();
  },

  async getEstadisticas() {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/solicitudes/estadisticas`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener estadísticas');
    }

    return response.json();
  },

  async getCategorias() {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/categorias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener categorías');
    }

    return response.json();
  }
};