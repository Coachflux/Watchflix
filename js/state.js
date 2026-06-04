/**
 * CINEFLIX - State Management
 */

const State = {
    // App state
    data: {
        theme: localStorage.getItem('cineflix_theme') || 'dark',
        language: localStorage.getItem('cineflix_language') || 'en-US',
        region: localStorage.getItem('cineflix_region') || 'US',
        watchlist: JSON.parse(localStorage.getItem('cineflix_watchlist') || '[]'),
        continueWatching: JSON.parse(localStorage.getItem('cineflix_continue') || '[]'),
        downloads: JSON.parse(localStorage.getItem('cineflix_downloads') || '[]'),
        searchHistory: JSON.parse(localStorage.getItem('cineflix_search') || '[]'),
        currentPage: 'home',
        heroIndex: 0,
        genres: { movie: [], tv: [] },
        user: null
    },

    // Subscribers
    listeners: new Map(),

    /**
     * Get state value
     */
    get(key) {
        return this.data[key];
    },

    /**
     * Set state value and notify listeners
     */
    set(key, value) {
        const oldValue = this.data[key];
        this.data[key] = value;

        // Persist to localStorage
        if (['theme', 'language', 'region'].includes(key)) {
            localStorage.setItem(`cineflix_${key}`, value);
        }
        if (['watchlist', 'continueWatching', 'downloads', 'searchHistory'].includes(key)) {
            localStorage.setItem(`cineflix_${key === 'continueWatching' ? 'continue' : key === 'searchHistory' ? 'search' : key}`, JSON.stringify(value));
        }

        // Notify listeners
        this.notify(key, value, oldValue);
    },

    /**
     * Subscribe to state changes
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // Return unsubscribe function
        return () => {
            this.listeners.get(key).delete(callback);
        };
    },

    /**
     * Notify listeners
     */
    notify(key, newValue, oldValue) {
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(cb => cb(newValue, oldValue));
        }
        // Also notify wildcard listeners
        if (this.listeners.has('*')) {
            this.listeners.get('*').forEach(cb => cb(key, newValue, oldValue));
        }
    },

    /**
     * Toggle theme
     */
    toggleTheme() {
        const newTheme = this.data.theme === 'dark' ? 'light' : 'dark';
        this.set('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        return newTheme;
    },

    /**
     * Apply current theme
     */
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.data.theme);
    },

    /**
     * Add to watchlist
     */
    addToWatchlist(item) {
        const list = this.data.watchlist;
        const exists = list.find(i => i.id === item.id && i.media_type === item.media_type);
        if (!exists) {
            list.unshift({
                ...item,
                added_at: Date.now()
            });
            this.set('watchlist', list);
            return true;
        }
        return false;
    },

    /**
     * Remove from watchlist
     */
    removeFromWatchlist(id, mediaType) {
        const list = this.data.watchlist.filter(i => !(i.id === id && i.media_type === mediaType));
        this.set('watchlist', list);
    },

    /**
     * Check if in watchlist
     */
    isInWatchlist(id, mediaType) {
        return this.data.watchlist.some(i => i.id === id && i.media_type === mediaType);
    },

    /**
     * Add to continue watching
     */
    addToContinue(item, progress = 0) {
        const list = this.data.continueWatching.filter(i => !(i.id === item.id && i.media_type === item.media_type));
        list.unshift({
            ...item,
            progress,
            updated_at: Date.now()
        });
        // Keep only last 20
        if (list.length > 20) list.pop();
        this.set('continueWatching', list);
    },

    /**
     * Update progress
     */
    updateProgress(id, mediaType, progress) {
        const list = this.data.continueWatching.map(i => {
            if (i.id === id && i.media_type === mediaType) {
                return { ...i, progress, updated_at: Date.now() };
            }
            return i;
        });
        this.set('continueWatching', list);
    },

    /**
     * Remove from continue watching
     */
    removeFromContinue(id, mediaType) {
        const list = this.data.continueWatching.filter(i => !(i.id === id && i.media_type === mediaType));
        this.set('continueWatching', list);
    },

    /**
     * Add search history
     */
    addSearch(query) {
        if (!query.trim()) return;
        let history = this.data.searchHistory.filter(q => q.toLowerCase() !== query.toLowerCase());
        history.unshift(query.trim());
        if (history.length > 10) history = history.slice(0, 10);
        this.set('searchHistory', history);
    },

    /**
     * Clear search history
     */
    clearSearchHistory() {
        this.set('searchHistory', []);
    },

    /**
     * Add download
     */
    addDownload(item) {
        const list = this.data.downloads;
        const exists = list.find(i => i.id === item.id);
        if (!exists) {
            list.unshift({
                ...item,
                status: 'pending',
                progress: 0,
                added_at: Date.now()
            });
            this.set('downloads', list);
            return true;
        }
        return false;
    },

    /**
     * Update download status
     */
    updateDownload(id, updates) {
        const list = this.data.downloads.map(d => {
            if (d.id === id) return { ...d, ...updates };
            return d;
        });
        this.set('downloads', list);
    },

    /**
     * Remove download
     */
    removeDownload(id) {
        const list = this.data.downloads.filter(d => d.id !== id);
        this.set('downloads', list);
    },

    /**
     * Set language and region
     */
    setLocale(language, region) {
        this.set('language', language);
        this.set('region', region);
    },

    /**
     * Get API language param
     */
    getApiLanguage() {
        return this.data.language;
    },

    /**
     * Get API region param
     */
    getApiRegion() {
        return this.data.region;
    },

    /**
     * Initialize state
     */
    init() {
        this.applyTheme();

        // Load genres from localStorage or fetch
        const cachedGenres = localStorage.getItem('cineflix_genres');
        if (cachedGenres) {
            this.data.genres = JSON.parse(cachedGenres);
        }
    }
};

// Expose globally
window.State = State;
