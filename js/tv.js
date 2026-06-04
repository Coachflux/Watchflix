/**
 * CINEFLIX — TV Shows Page
 * Browse TV series, episodes, and seasons
 */

const TV = {
  async render() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="tv-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('tvShows')}</h1>
        </div>
        <div class="search-filters" id="tvFilters">
          <button class="filter-chip active" data-filter="popular">Popular</button>
          <button class="filter-chip" data-filter="toprated">Top Rated</button>
          <button class="filter-chip" data-filter="ontheair">On The Air</button>
          <button class="filter-chip" data-filter="airingtoday">Airing Today</button>
        </div>
        <div id="tvGrid" class="content-grid">
          ${Array(9).fill(0).map(() => Components.skeletonCard()).join('')}
        </div>
      </div>
    `;

    this._currentFilter = 'popular';
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

    const grid = document.getElementById('tvGrid');
    if (!append) grid.innerHTML = Array(9).fill(0).map(() => Components.skeletonCard()).join('');

    try {
      let data;
      // Map filters to API endpoints (using demo data for now)
      const demo = API.getDemoTV();
      data = { results: demo };

      const items = data.results || [];
      if (items.length === 0) this._hasMore = false;

      const html = items.map(item => Components.movieCard({ ...item, title: item.name })).join('');
      if (append) {
        grid.insertAdjacentHTML('beforeend', html);
      } else {
        grid.innerHTML = html;
      }
    } catch (err) {
      console.error('TV load error:', err);
      grid.innerHTML = API.getDemoTV().map(m => Components.movieCard({ ...m, title: m.name })).join('');
    } finally {
      this._loading = false;
    }
  },

  initFilters() {
    const filters = document.getElementById('tvFilters');
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
