/**
 * CINEFLIX — State Management
 * Central reactive state store with persistence
 */

const State = {
  _data: {
    language: 'en',
    darkMode: true,
    watchlist: [],
    history: [],
    downloads: [],
    notifications: true,
    autoPlay: true,
    downloadQuality: 'hd',
    currentNation: { code: 'US', name: 'United States', lang: 'en' },
    user: null,
    searchHistory: [],
    lastRoute: '/',
    scrollPositions: {}
  },

  _listeners: new Map(),

  init() {
    // Load from localStorage
    const saved = Utils.storage.get('cineflix_state');
    if (saved) {
      this._data = { ...this._data, ...saved };
    }
    // Apply dark mode
    document.body.classList.toggle('dark', this._data.darkMode);
    document.body.classList.toggle('light', !this._data.darkMode);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
      this._data.darkMode ? '#0f172a' : '#f8fafc');
  },

  get(key) {
    return this._data[key];
  },

  set(key, value) {
    const old = this._data[key];
    this._data[key] = value;
    Utils.storage.set('cineflix_state', this._data);
    this._notify(key, value, old);
  },

  update(key, updater) {
    const current = this._data[key];
    const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    this.set(key, next);
  },

  subscribe(key, callback) {
    if (!this._listeners.has(key)) this._listeners.set(key, new Set());
    this._listeners.get(key).add(callback);
    // Return unsubscribe
    return () => this._listeners.get(key)?.delete(callback);
  },

  _notify(key, value, old) {
    this._listeners.get(key)?.forEach(cb => {
      try { cb(value, old, key); } catch (e) { console.error(e); }
    });
  },

  // Watchlist helpers
  isInWatchlist(id) {
    return this._data.watchlist.some(item => item.id === id);
  },

  toggleWatchlist(item) {
    const list = [...this._data.watchlist];
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list.splice(idx, 1);
      Utils.toast(Utils.t('removedFromWatchlist'), 'info');
    } else {
      list.unshift({ ...item, addedAt: Date.now() });
      Utils.toast(Utils.t('addedToWatchlist'), 'success');
    }
    this.set('watchlist', list);
  },

  // History helpers
  addToHistory(item) {
    const list = this._data.history.filter(i => i.id !== item.id);
    list.unshift({ ...item, watchedAt: Date.now(), progress: 0 });
    if (list.length > 100) list.pop();
    this.set('history', list);
  },

  updateProgress(id, progress) {
    const list = this._data.history.map(i =>
      i.id === id ? { ...i, progress, updatedAt: Date.now() } : i
    );
    this.set('history', list);
  },

  // Search history
  addSearchQuery(query) {
    if (!query.trim()) return;
    const list = this._data.searchHistory.filter(q => q !== query);
    list.unshift(query);
    if (list.length > 20) list.pop();
    this.set('searchHistory', list);
  }
};

// Initialize on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => State.init());
}
