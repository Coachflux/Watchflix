/**
 * CINEFLIX — Router
 * Hash-based SPA routing with history management
 */

const Router = {
  routes: {
    '/': { handler: () => Home.render(), title: 'Home', nav: 'home' },
    '/explore': { handler: () => Discover.render(), title: 'Explore', nav: 'explore' },
    '/downloads': { handler: () => Library.render('downloads'), title: 'Downloads', nav: 'downloads' },
    '/more': { handler: () => this.renderMore(), title: 'More', nav: 'more' },
    '/search': { handler: () => Search.render(), title: 'Search', nav: null },
    '/watchlist': { handler: () => Library.render('watchlist'), title: 'Watchlist', nav: null },
    '/history': { handler: () => Library.render('history'), title: 'History', nav: null },
    '/nations': { handler: () => Nations.render(), title: 'Nations', nav: null },
    '/settings': { handler: () => this.renderSettings(), title: 'Settings', nav: null },
    '/movies': { handler: () => Discover.render(), title: 'Movies', nav: null },
    '/tv': { handler: () => TV.render(), title: 'TV Shows', nav: null },
    '/genres': { handler: () => this.renderGenres(), title: 'Genres', nav: null },
    '/trending': { handler: () => this.renderTrending(), title: 'Trending', nav: null }
  },

  _currentRoute: null,
  _currentHandler: null,

  init() {
    window.addEventListener('hashchange', () => this.handle());
    window.addEventListener('popstate', () => this.handle());
    // Handle initial load
    this.handle();
  },

  handle() {
    const hash = location.hash.slice(1) || '/';
    const path = hash.split('?')[0];
    const params = new URLSearchParams(hash.split('?')[1]);

    // Extract ID from /movie/:id or /tv/:id
    let route = path;
    let id = null;
    let type = 'movie';

    const movieMatch = path.match(/^\/movie\/(\d+)$/);
    const tvMatch = path.match(/^\/tv\/(\d+)$/);

    if (movieMatch) {
      route = '/movie/:id';
      id = movieMatch[1];
    } else if (tvMatch) {
      route = '/tv/:id';
      id = tvMatch[1];
      type = 'tv';
    }

    // Save scroll position
    if (this._currentRoute) {
      const main = document.getElementById('mainContent');
      State.update('scrollPositions', pos => ({ ...pos, [this._currentRoute]: main?.scrollTop || 0 }));
    }

    // Destroy previous handler
    if (this._currentHandler?.destroy) {
      this._currentHandler.destroy();
    }

    // Match route
    const config = this.routes[route];
    if (config) {
      this._currentRoute = route;
      this._currentHandler = config;
      document.title = config.title ? `Cineflix — ${config.title}` : 'Cineflix';
      this.updateNav(config.nav);
      config.handler();
    } else if (route === '/movie/:id' || route === '/tv/:id') {
      this._currentRoute = route;
      document.title = 'Cineflix — Details';
      this.updateNav(null);
      Detail.render(id, type);
    } else {
      // 404 fallback to home
      this.go('/');
    }

    // Restore scroll position for known routes
    const savedScroll = State.get('scrollPositions')?.[route];
    if (savedScroll !== undefined && savedScroll > 0) {
      setTimeout(() => {
        const main = document.getElementById('mainContent');
        if (main) main.scrollTop = savedScroll;
      }, 50);
    } else {
      const main = document.getElementById('mainContent');
      if (main) main.scrollTop = 0;
    }
  },

  go(path) {
    location.hash = path;
  },

  updateNav(activeRoute) {
    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.route === activeRoute);
    });
    document.querySelectorAll('.side-menu .menu-link').forEach(link => {
      link.classList.toggle('active', link.dataset.route === activeRoute);
    });
  },

  // ── More Page ──
  renderMore() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="more-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('more')}</h1>
        </div>
        <div class="settings-list">
          <a href="#/watchlist" class="settings-item" style="text-decoration:none;color:inherit">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              ${Utils.t('watchlist')}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <a href="#/history" class="settings-item" style="text-decoration:none;color:inherit">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${Utils.t('history')}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <a href="#/nations" class="settings-item" style="text-decoration:none;color:inherit">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              ${Utils.t('nations')}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
          <a href="#/settings" class="settings-item" style="text-decoration:none;color:inherit">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              ${Utils.t('settings')}
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </a>
        </div>
      </div>
    `;
  },

  // ── Settings Page ──
  renderSettings() {
    const main = document.getElementById('mainContent');
    const darkMode = State.get('darkMode');
    const notifications = State.get('notifications');
    const autoPlay = State.get('autoPlay');
    const quality = State.get('downloadQuality');

    main.innerHTML = `
      <div class="settings-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('settings')}</h1>
        </div>
        <div class="settings-list">
          <div class="settings-item">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ${Utils.t('darkMode')}
            </div>
            <div class="toggle ${darkMode ? 'active' : ''}" id="darkModeToggle"></div>
          </div>
          <div class="settings-item">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              ${Utils.t('notifications')}
            </div>
            <div class="toggle ${notifications ? 'active' : ''}" id="notificationsToggle"></div>
          </div>
          <div class="settings-item">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${Utils.t('autoPlay')}
            </div>
            <div class="toggle ${autoPlay ? 'active' : ''}" id="autoPlayToggle"></div>
          </div>
          <a href="#/nations" class="settings-item" style="text-decoration:none;color:inherit">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              ${Utils.t('language')}
            </div>
            <span style="color:var(--text-tertiary);font-size:0.875rem">${Nations.getLanguageName(State.get('language') || 'en')}</span>
          </a>
          <div class="settings-item" style="border-bottom:none">
            <div class="label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              ${Utils.t('downloadQuality')}
            </div>
            <span style="color:var(--text-tertiary);font-size:0.875rem;text-transform:uppercase">${quality}</span>
          </div>
        </div>

        <div style="padding:2rem 1rem;text-align:center">
          <p style="font-size:0.75rem;color:var(--text-tertiary)">${Utils.t('version')}</p>
          <p style="font-size:0.75rem;color:var(--text-tertiary);margin-top:0.25rem">
            <a href="#" style="color:var(--text-brand)">${Utils.t('privacy')}</a> • 
            <a href="#" style="color:var(--text-brand)">${Utils.t('terms')}</a>
          </p>
        </div>
      </div>
    `;

    // Toggle handlers
    document.getElementById('darkModeToggle')?.addEventListener('click', () => {
      const newVal = !State.get('darkMode');
      State.set('darkMode', newVal);
      document.body.classList.toggle('dark', newVal);
      document.body.classList.toggle('light', !newVal);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', newVal ? '#0f172a' : '#f8fafc');
      document.getElementById('darkModeToggle').classList.toggle('active', newVal);
      Utils.toast(newVal ? 'Dark mode enabled' : 'Light mode enabled', 'success');
    });

    document.getElementById('notificationsToggle')?.addEventListener('click', () => {
      const newVal = !State.get('notifications');
      State.set('notifications', newVal);
      document.getElementById('notificationsToggle').classList.toggle('active', newVal);
    });

    document.getElementById('autoPlayToggle')?.addEventListener('click', () => {
      const newVal = !State.get('autoPlay');
      State.set('autoPlay', newVal);
      document.getElementById('autoPlayToggle').classList.toggle('active', newVal);
    });
  },

  // ── Genres Page ──
  renderGenres() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="genres-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('genres')}</h1>
        </div>
        <div id="genresGrid" style="padding:0 1rem">
          ${Array(6).fill(0).map(() => `<div class="skeleton" style="height:80px;border-radius:12px;margin-bottom:0.75rem"></div>`).join('')}
        </div>
      </div>
    `;

    this.loadGenres();
  },

  async loadGenres() {
    const grid = document.getElementById('genresGrid');
    try {
      const data = await API.genres();
      const genres = data.length > 0 ? data : [
        { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Science Fiction' },
        { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' }, { id: 37, name: 'Western' }
      ];

      grid.innerHTML = genres.map(g => `
        <div class="nation-card" style="margin-bottom:0.75rem" onclick="Router.go('/genre/${g.id}')">
          <span style="font-size:1.5rem;width:36px;text-align:center">${Components.genreIcon(g.name)}</span>
          <div class="nation-info">
            <div class="nation-name">${g.name}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      `).join('');
    } catch {
      grid.innerHTML = Components.emptyState('Genres unavailable', 'Please try again later.', 'film');
    }
  },

  // ── Trending Page ──
  renderTrending() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="trending-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('trending')}</h1>
        </div>
        <div class="search-filters" id="trendingFilters">
          <button class="filter-chip active" data-filter="day">Today</button>
          <button class="filter-chip" data-filter="week">This Week</button>
        </div>
        <div id="trendingGrid" class="content-grid">
          ${Array(9).fill(0).map(() => Components.skeletonCard()).join('')}
        </div>
      </div>
    `;

    this._trendingFilter = 'day';
    this.loadTrending();

    document.getElementById('trendingFilters')?.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        document.querySelectorAll('#trendingFilters .filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this._trendingFilter = e.target.dataset.filter;
        this.loadTrending();
      }
    });
  },

  async loadTrending() {
    const grid = document.getElementById('trendingGrid');
    grid.innerHTML = Array(9).fill(0).map(() => Components.skeletonCard()).join('');
    try {
      const data = await API.trending(this._trendingFilter);
      const items = data.results?.slice(0, 18) || API.getDemoMovies().slice(0, 18);
      grid.innerHTML = items.map(m => Components.movieCard(m)).join('');
    } catch {
      grid.innerHTML = API.getDemoMovies().slice(0, 18).map(m => Components.movieCard(m)).join('');
    }
  }
};
