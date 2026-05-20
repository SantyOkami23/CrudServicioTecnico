class Navbar {
  static render() {
    if (!auth.requireAuth()) return;

    const rol = auth.getUserRole();
    const userEmail = auth.getUserEmail();

    const menuItems = this.getMenuItems(rol);

    const navbar = document.createElement('nav');
    navbar.className = 'navbar';
    navbar.innerHTML = `
      <a href="/pages/dashboard.html" class="navbar-brand">
        <span class="icon">🔧</span> Soporte Técnico
      </a>
      <ul class="navbar-nav">
        ${menuItems.map(item => `
          <li><a href="${item.url}" class="${this.isActive(item.url) ? 'active' : ''}">${item.label}</a></li>
        `).join('')}
      </ul>
      <div class="navbar-right">
        <a href="/pages/perfil.html" class="user-info" title="Ver perfil">
          <span id="userNameDisplay" style="color:white;font-size:0.85rem;">${userEmail}</span>
        </a>
        <button class="btn-logout" onclick="auth.logout()">Cerrar Sesión</button>
      </div>
    `;

    // Insertar al inicio del body
    document.body.insertBefore(navbar, document.body.firstChild);
  }

  static getMenuItems(rol) {
    const menus = {
      'cliente': [
        { label: 'Dashboard', url: '/pages/dashboard.html' },
        { label: 'Mis Solicitudes', url: '/pages/solicitudes.html' },
        { label: 'Nueva Solicitud', url: '/pages/nueva-solicitud.html' },
      ],
      'tecnico': [
        { label: 'Dashboard', url: '/pages/dashboard.html' },
        { label: 'Solicitudes', url: '/pages/solicitudes.html' },
        { label: 'Clientes', url: '/pages/clientes.html' },
      ],
      'supervisor': [
        { label: 'Dashboard', url: '/pages/dashboard.html' },
        { label: 'Solicitudes', url: '/pages/solicitudes.html' },
        { label: 'Clientes', url: '/pages/clientes.html' },
        { label: 'Usuarios', url: '/pages/usuarios.html' },
      ],
      'administrador': [
        { label: 'Dashboard', url: '/pages/dashboard.html' },
        { label: 'Solicitudes', url: '/pages/solicitudes.html' },
        { label: 'Clientes', url: '/pages/clientes.html' },
        { label: 'Usuarios', url: '/pages/usuarios.html' },
        { label: 'Categorías', url: '/pages/categorias.html' },
      ]
    };

    return menus[rol] || [];
  }

  static isActive(url) {
    return window.location.pathname === url;
  }
}

// Renderizar navbar al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (auth.isAuthenticated() && !auth.isTokenExpired()) {
    Navbar.render();
  }
});