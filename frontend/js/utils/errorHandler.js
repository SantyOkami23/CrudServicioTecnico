const errorHandler = {
  show(message, type = 'error') {
    // Eliminar notificaciones anteriores
    document.querySelectorAll('.notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  },

  async handleApiError(response) {
    try {
      const data = await response.json();

      if (response.status === 401) {
        auth.removeToken();
        window.location.href = '/pages/login.html';
        return;
      }

      this.show(data.message || 'Error en la operación', 'error');
      return data;
    } catch (error) {
      this.show('Error de comunicación con el servidor', 'error');
    }
  },

  async apiCall(apiFunction, ...args) {
    try {
      return await apiFunction(...args);
    } catch (error) {
      this.show(error.message || 'Error inesperado', 'error');
      throw error;
    }
  }
};