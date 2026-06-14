const routes = [
  { href: '/caja', label: 'Caja' },
  { href: '/cocina', label: 'Cocina' },
  { href: '/barra', label: 'Barra' },
  { href: '/pantalla', label: 'Pantalla' },
  { href: '/admin', label: 'Admin' }
];

export function renderNavigation(activeRoute) {
  const container = document.querySelector('[data-navigation]');

  if (!container) {
    return;
  }

  container.innerHTML = routes
    .map((route) => {
      const isActive = route.href === activeRoute ? 'active' : '';
      return `<li class="nav-item"><a class="nav-link ${isActive}" href="${route.href}">${route.label}</a></li>`;
    })
    .join('');
}
