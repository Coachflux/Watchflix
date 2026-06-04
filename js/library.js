/**
 * CINEFLIX — Library Page
 * Watchlist, Downloads, and History management
 */

const Library = {
  async render(type = 'watchlist') {
    const main = document.getElementById('mainContent');
    const tabs = [
      { id: 'watchlist', label: Utils.t('watchlist') },
      { id: 'downloads', label: Utils.t('downloads') },
      { id: 'history', label: Utils.t('history') }
    ];

    main.innerHTML = `
      <div class="library-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('library')}</h1>
        </div>
        <div class="search-filters" id="libraryTabs">
          ${tabs.map(t => `
            <button class="filter-chip ${t.id === type ? 'active' : ''}" data-tab="${t.id}">${t.label}</button>
          `).join('')}
        </div>
        <div id="libraryContent"></div>
      </div>
    `;

    this._currentTab = type;
    this.initTabs();
    this.loadContent(type);
  },

  initTabs() {
    const tabs = document.getElementById('libraryTabs');
    tabs.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        tabs.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this._currentTab = e.target.dataset.tab;
        this.loadContent(this._currentTab);
      }
    });
  },

  loadContent(type) {
    const container = document.getElementById('libraryContent');

    switch (type) {
      case 'watchlist':
        this.renderWatchlist(container);
        break;
      case 'downloads':
        this.renderDownloads(container);
        break;
      case 'history':
        this.renderHistory(container);
        break;
    }
  },

  renderWatchlist(container) {
    const items = State.get('watchlist') || [];
    if (items.length === 0) {
      container.innerHTML = Components.emptyState(
        'Your Watchlist is Empty',
        'Save movies and shows to watch later. Tap "+ My List" on any title.',
        'heart'
      );
      return;
    }
    container.innerHTML = `
      <div class="content-grid" style="padding:0 1rem">
        ${items.map(item => Components.movieCard({
          id: item.id,
          title: item.title,
          poster_path: item.poster,
          vote_average: item.rating || 0
        })).join('')}
      </div>
    `;
  },

  renderDownloads(container) {
    const items = State.get('downloads') || [];
    if (items.length === 0) {
      container.innerHTML = Components.emptyState(
        'No Downloads',
        'Download movies and shows to watch offline.',
        'film'
      );
      return;
    }
    container.innerHTML = `
      <div class="content-grid" style="padding:0 1rem">
        ${items.map(item => Components.movieCard({
          id: item.id,
          title: item.title,
          poster_path: item.poster,
          vote_average: item.rating || 0
        })).join('')}
      </div>
    `;
  },

  renderHistory(container) {
    const items = State.get('history') || [];
    if (items.length === 0) {
      container.innerHTML = Components.emptyState(
        'No History',
        'Titles you watch will appear here.',
        'film'
      );
      return;
    }
    container.innerHTML = `
      <div style="padding:0 1rem">
        ${items.slice(0, 20).map(item => Components.continueCard({
          id: item.id,
          title: item.title,
          poster_path: item.poster_path,
          runtime: item.runtime,
          genre_ids: item.genre_ids || [],
          progress: item.progress || 0
        })).join('')}
      </div>
    `;
  }
};
