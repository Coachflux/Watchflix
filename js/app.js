/**
 * CINEFLIX — Main Application
 * Entry point, event bindings, PWA registration, and global handlers
 */

const App = {
  init() {
    this.registerSW();
    this.bindEvents();
    this.setupHeaderScroll();
    Router.init();
    this.applyTheme();
  },

  registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.log('SW registration failed:', err));
    }
  },

  bindEvents() {
    // Menu toggle
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const closeMenu = document.getElementById('closeMenu');

    menuBtn?.addEventListener('click', () => {
      sideMenu?.classList.add('open');
      sideMenuOverlay?.classList.add('open');
    });

    const closeSideMenu = () => {
      sideMenu?.classList.remove('open');
      sideMenuOverlay?.classList.remove('open');
    };

    closeMenu?.addEventListener('click', closeSideMenu);
    sideMenuOverlay?.addEventListener('click', closeSideMenu);

    // Search button
    document.getElementById('searchBtn')?.addEventListener('click', () => {
      Router.go('/search');
    });

    // Profile button
    document.getElementById('profileBtn')?.addEventListener('click', () => {
      Utils.toast('Profile feature coming soon', 'info');
    });

    // Bottom nav click handling (prevent default for SPA feel)
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const route = item.getAttribute('href');
        Router.go(route);
      });
    });

    // Side menu links
    document.querySelectorAll('.side-menu .menu-link').forEach(link => {
      link.addEventListener('click', () => {
        closeSideMenu();
      });
    });

    // Network status
    window.addEventListener('online', () => Utils.toast('Back online', 'success'));
    window.addEventListener('offline', () => Utils.toast('You are offline', 'error'));

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSideMenu();
        Components.closeSheet?.();
      }
      // / to search
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        Router.go('/search');
      }
    });

    // Prevent zoom on double tap (iOS)
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) e.preventDefault();
      lastTouchEnd = now;
    }, { passive: false });
  },

  setupHeaderScroll() {
    const header = document.querySelector('.app-header');
    const main = document.getElementById('mainContent');
    if (!header || !main) return;

    main.addEventListener('scroll', Utils.throttle(() => {
      header.classList.toggle('scrolled', main.scrollTop > 10);
    }, 50));
  },

  applyTheme() {
    const dark = State.get('darkMode');
    document.body.classList.toggle('dark', dark !== false);
    document.body.classList.toggle('light', dark === false);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark !== false ? '#0f172a' : '#f8fafc');
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
