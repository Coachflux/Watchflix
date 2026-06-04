/**
 * CINEFLIX — Discover / Explore Page
 * Browse by category, genre, and curated collections
 */

const Discover = {
  async render() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="discover-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('explore')}</h1>
        </div>
        <div class="search-filters" id="discoverFilters">
          <button class="filter-chip active" data-filter="all">All</button>
          <button class="filter-chip" data-filter="movie">Movies</button>
          <button class="filter-chip" data-filter="tv">TV Shows</button>
          <button class="filter-chip" data-filter="popular">Popular</button>
          <button class="filter-chip" data-filter="toprated">Top Rated</button>
          <button class="filter-chip" data-filter="upcoming">Upcoming</button>
        </div>
        <div id="discoverGrid" class="content-grid">
          ${Array(9).fill(0).map(() => Components.skeletonCard()).join('')}
        </div>
      </div>
    `;

    this._currentFilter = 'all';
    this._page = 1;
    this._loading = false;
    this._hasMore = true;

    await this.loadContent();
    this.initFilters();
    this.initInfiniteScroll();
  },

  async loadContent(append = false) {
    if (this._loading || !this._hasMore) return;
    this._loading = true;

    const grid = document.getElementById('discoverGrid');
    if (!append) grid.innerHTML = Array(9).fill(0).map(() => Components.skeletonCard()).join('');

    try {
      let data;
      switch (this._currentFilter) {
        case 'movie':
          data = await API.popularMovies(this._page);
          break;
        case 'tv':
          data = { results: API.getDemoTV() };
          break;
        case 'popular':
          data = await API.popularMovies(this._page);
          break;
        case 'toprated':
          data = await API.topRated(this._page);
          break;
        case 'upcoming':
          data = await API.upcoming(this._page);
          break;
        default:
          data = await API.trending('week', this._page);
      }

      const items = data.results || [];
      if (items.length === 0) this._hasMore = false;

      const html = items.map(item => Components.movieCard(item)).join('');
      if (append) {
        grid.insertAdjacentHTML('beforeend', html);
      } else {
        grid.innerHTML = html;
      }
      Utils.observeLazy(grid.querySelectorAll('img[data-src]'));
    } catch (err) {
      console.error('Discover load error:', err);
      if (!append) {
        grid.innerHTML = API.getDemoMovies().map(m => Components.movieCard(m)).join('');
      }
    } finally {
      this._loading = false;
    }
  },

  initFilters() {
    const filters = document.getElementById('discoverFilters');
    filters.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-chip')) {
        filters.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        this._currentFilter = e.target.dataset.filter;
        this._page = 1;
        this._hasMore = true;
        this.loadContent();
      }
    });
  },

  initInfiniteScroll() {
    const main = document.getElementById('mainContent');
    main.addEventListener('scroll', Utils.throttle(() => {
      if (main.scrollTop + main.clientHeight >= main.scrollHeight - 200) {
        this._page++;
        this.loadContent(true);
      }
    }, 300));
  }
};
