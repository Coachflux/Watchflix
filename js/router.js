/**
 * CINEFLIX - Router
 */

const Router = {
    currentPage: null,
    currentController: null,
    routes: {
        'home': { controller: Home, title: 'Home' },
        'discover': { controller: Discover, title: 'Explore' },
        'search': { controller: Search, title: 'Search' },
        'detail': { controller: Detail, title: 'Details' },
        'tv': { controller: TV, title: 'TV Shows' },
        'library': { controller: Library, title: 'My List' },
        'nations': { controller: Nations, title: 'Settings' },
        'more': { controller: More, title: 'More' },
        'downloads': { controller: Library, title: 'Downloads' },
        'more': { controller: null, title: 'More' }
    },

    /**
     * Initialize router
     */
    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());

        // Handle initial route
        if (!window.location.hash) {
            window.location.hash = '#/';  
        } else {
            this.handleRoute();
        }

        // Handle browser back/forward
        window.addEventListener('popstate', () => this.handleRoute());
    },

    /**
     * Parse current route
     */
    parseRoute() {
        const hash = window.location.hash.replace('#/', '') || '/';
        const [path, queryString] = hash.split('?');
        const parts = path.split('/').filter(Boolean);

        const params = {};
        if (queryString) {
            queryString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) params[key] = decodeURIComponent(value || '');
            });
        }

        return {
            path: parts[0] || 'home',
            id: parts[1] || null,
            sub: parts[2] || null,
            params
        };
    },

    /**
     * Handle route change
     */
    async handleRoute() {
        const route = this.parseRoute();
        const pageContent = document.getElementById('pageContent');

        if (!pageContent) return;

        // Cleanup previous controller
        if (this.currentController && this.currentController.destroy) {
            this.currentController.destroy();
        }

        // Scroll to top
        const mainContent = document.querySelector('.main-content');
        if (mainContent) mainContent.scrollTop = 0;

        // Update active nav
        this.updateActiveNav(route.path);

        // Update page title
        const routeConfig = this.routes[route.path];
        if (routeConfig) {
            document.title = routeConfig.title ? `${routeConfig.title} - Cineflix` : 'Cineflix - Movies & TV Shows';
        }

        // Handle special routes
        if (route.path === 'downloads') {
            route.params.tab = 'downloads';
            route.path = 'library';
        }

        // More page is now handled by the More controller

        // Render page
        const controller = this.routes[route.path]?.controller;
        if (controller) {
            this.currentController = controller;
            this.currentPage = route.path;

            try {
                if (route.path === 'detail' && route.id) {
                    await controller.render(pageContent, route.id, route.params.type || 'movie');
                } else {
                    await controller.render(pageContent, route.params);
                }
            } catch (error) {
                console.error('Route render error:', error);
                pageContent.innerHTML = `
                    <div class="page">
                        ${Components.emptyState(
                            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
                            'Something went wrong',
                            'Please try again or go back to home.'
                        )}
                    </div>
                `;
            }
        } else {
            // 404 - redirect to home
            this.navigate('home');
        }
    },

    /**
     * Navigate to a route
     */
    navigate(path, id = null, type = null, extra = null) {
        let hash = `#/${path}`;
        if (id) hash += `/${id}`;
        if (type) hash += `/${type}`;
        if (extra) hash += `?${extra}`;

        window.location.hash = hash;
    },

    /**
     * Refresh current route
     */
    refresh() {
        this.handleRoute();
    },

    /**
     * Update active navigation state
     */
    updateActiveNav(path) {
        // Bottom nav
        document.querySelectorAll('.nav-item').forEach(item => {
            const itemPage = item.dataset.page;
            const isActive = 
                (path === 'home' && itemPage === 'home') ||
                (path === 'discover' && itemPage === 'discover') ||
                (path === 'library' && itemPage === 'downloads') ||
                (path === 'downloads' && itemPage === 'downloads') ||
                (path === 'more' && itemPage === 'more');
            item.classList.toggle('active', isActive);
        });

        // Sidebar links
        document.querySelectorAll('.sidebar-section a').forEach(link => {
            const href = link.getAttribute('href')?.replace('#/', '') || '';
            link.classList.toggle('active', href === path || (path === 'home' && href === '/'));
        });
    }
};

// Expose globally
window.Router = Router;
