/**
 * CINEFLIX - Main Application
 */

const App = {
    /**
     * Initialize the application
     */
    init() {
        // Initialize state
        State.init();

        // Setup UI handlers
        this.setupSidebar();
        this.setupSearch();
        this.setupVideoPlayer();
        this.setupThemeToggle();
        this.setupServiceWorker();
        this.setupOnlineStatus();

        // Initialize router
        Router.init();

        // Initialize search
        Search.init();

        console.log('Cineflix initialized');
    },

    /**
     * Setup sidebar/menu
     */
    setupSidebar() {
        const menuBtn = document.getElementById('menuBtn');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('closeSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        menuBtn?.addEventListener('click', () => {
            sidebar?.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            sidebar?.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeSidebar?.addEventListener('click', closeMenu);
        sidebarOverlay?.addEventListener('click', closeMenu);

        // Close sidebar on route change
        window.addEventListener('hashchange', closeMenu);
    },

    /**
     * Setup search modal
     */
    setupSearch() {
        // Search is initialized in Search.init()
        // Additional setup if needed
    },

    /**
     * Setup video player modal
     */
    setupVideoPlayer() {
        const closeVideo = document.getElementById('closeVideo');
        const videoOverlay = document.getElementById('videoOverlay');

        closeVideo?.addEventListener('click', () => Components.closeVideo());
        videoOverlay?.addEventListener('click', () => Components.closeVideo());

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Components.closeVideo();
            }
        });
    },

    /**
     * Setup theme toggle
     */
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');

        themeToggle?.addEventListener('click', () => {
            const newTheme = State.toggleTheme();
            const label = themeToggle.querySelector('.theme-label');
            if (label) {
                label.textContent = newTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
            }
            Utils.showToast(`Switched to ${newTheme} mode`, 'success');
        });

        // Set initial label
        const label = themeToggle?.querySelector('.theme-label');
        if (label) {
            label.textContent = State.get('theme') === 'dark' ? 'Dark Mode' : 'Light Mode';
        }
    },

    /**
     * Setup Service Worker for PWA
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('service-worker.js')
                .then(registration => {
                    console.log('SW registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                Utils.showToast('Update available! Refresh to update.', 'info');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });

            // Listen for messages from SW
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'SYNC_COMPLETE') {
                    Utils.showToast('Downloads synced', 'success');
                }
            });
        }
    },

    /**
     * Setup online/offline status
     */
    setupOnlineStatus() {
        Utils.watchOnline((online) => {
            if (online) {
                Utils.showToast('You're back online', 'success');
            } else {
                Utils.showToast('You're offline. Some features may be limited.', 'error');
            }
        });

        // Initial status
        if (!Utils.isOnline()) {
            Utils.showToast('You're offline', 'error');
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Expose globally
window.App = App;
