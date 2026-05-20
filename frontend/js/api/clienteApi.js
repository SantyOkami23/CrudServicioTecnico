const clienteApi = {
  async getAll(filters = {}) {
    const token = auth.getToken();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/clientes?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener clientes');
    }

    return response.json();
  },

  async getById(id) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener cliente');
    }

    return response.json();
  },

  async create(clienteData) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteData)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al crear cliente');
    }

    return response.json();
  },

  async update(id, clienteData) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteData)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al actualizar cliente');
    }

    return response.json();
  },

  async delete(id) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar cliente');
    }

    return response.json();
  }
};
