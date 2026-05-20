const userApi = {
  async getAll(filters = {}) {
    const token = auth.getToken();
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/users?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener usuarios');
    }

    return response.json();
  },

  async getById(id) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al obtener usuario');
    }

    return response.json();
  },

  async update(id, userData) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al actualizar usuario');
    }

    return response.json();
  },

  async delete(id) {
    const token = auth.getToken();
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al eliminar usuario');
    }

    return response.json();
  },

  async uploadPhoto(id, file) {
    const token = auth.getToken();
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch(`${API_URL}/users/${id}/photo`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Error al subir foto');
    }

    return response.json();
  }
};