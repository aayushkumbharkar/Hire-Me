export async function loadComponent(selector) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const source = container.getAttribute('data-source');
  if (!source) return;
  
  try {
    const response = await fetch(window.location.origin + '/api/preview-68950fd6e9f096bd7fdefb1e/' + source);
    if (response.ok) {
      const html = await response.text();
      container.innerHTML = html;
      
      // Initialize component-specific functionality
      initializeComponent(container, source);
    }
  } catch (error) {
    console.error(`Failed to load component ${source}:`, error);
  }
}

function initializeComponent(container, source) {
  if (source.includes('navbar')) {
    initializeNavbar(container);
  }
}

function initializeNavbar(container) {
  // Mobile menu toggle
  const mobileMenuToggle = container.querySelector('[data-id="mobile-menu-toggle"]');
  const mobileNav = container.querySelector('[data-id="mobile-nav"]');
  
  if (mobileMenuToggle && mobileNav) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
      const icon = mobileMenuToggle.querySelector('i');
      icon.setAttribute('data-lucide', mobileNav.classList.contains('hidden') ? 'menu' : 'x');
      lucide.createIcons();
    });
  }
  
  // User menu toggle
  const userMenuToggle = container.querySelector('[data-id="user-menu-toggle"]');
  const userDropdown = container.querySelector('[data-id="user-dropdown"]');
  
  if (userMenuToggle && userDropdown) {
    userMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      userDropdown.classList.add('hidden');
    });
  }
  
  // Check authentication status and update navbar
  updateNavbarAuth(container);
}

function updateNavbarAuth(container) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const authButtons = container.querySelector('[data-id="auth-buttons"]');
  const userMenu = container.querySelector('[data-id="user-menu"]');
  const userName = container.querySelector('[data-id="user-name"]');
  
  if (user) {
    authButtons.style.display = 'none';
    userMenu.style.display = 'flex';
    if (userName) {
      userName.textContent = user.name || user.email;
    }
  } else {
    authButtons.style.display = 'flex';
    userMenu.style.display = 'none';
  }
  
  // Logout functionality
  const logoutBtn = container.querySelector('[data-id="nav-logout"]');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = 'index.html';
    });
  }
}