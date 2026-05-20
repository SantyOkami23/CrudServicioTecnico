const auth = {
  setToken(token) {
    localStorage.setItem('token', token);
  },

  getToken() {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  decodeToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  getUserRole() {
    const decoded = this.decodeToken();
    return decoded ? decoded.rol : null;
  },

  getUserId() {
    const decoded = this.decodeToken();
    return decoded ? decoded.id : null;
  },

  getUserEmail() {
    const decoded = this.decodeToken();
    return decoded ? decoded.email : null;
  },

  isTokenExpired() {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return true;
    return decoded.exp < Date.now() / 1000;
  },

  requireAuth() {
    if (!this.isAuthenticated() || this.isTokenExpired()) {
      this.removeToken();
      window.location.href = '/pages/login.html';
      return false;
    }
    return true;
  },

  logout() {
    this.removeToken();
    window.location.href = '/pages/login.html';
  }
};