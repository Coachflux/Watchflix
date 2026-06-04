/**
 * CINEFLIX — Home Page
 * Featured hero, trending, categories, and continue watching
 */

const Home = {
  async render() {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="home-page">
        <div id="heroSection">${Components.skeletonHero()}</div>
        ${Components.categoryTabs()}
        <div id="trendingSection">
          ${Components.sectionHeader(Utils.t('trending'), '/trending', Utils.t('seeAll'))}
          <div class="scroll-row" id="trendingRow">
            ${Array(4).fill(0).map(() => Components.skeletonCard()).join('')}
          </div>
        </div>
        <div id="continueSection"></div>
      </div>
    `;

    try {
      await this.loadHero();
      await this.loadTrending();
      this.loadContinueWatching();
      this.initHeroCarousel();
    } catch (err) {
      console.error('Home render error:', err);
      Utils.toast(Utils.t('error'), 'error');
    }
  },

  async loadHero() {
    const section = document.getElementById('heroSection');
    try {
      const data = await API.trending('day');
      const movies = data.results?.slice(0, 5) || API.getDemoMovies().slice(0, 5);
      this._heroMovies = movies;
      section.innerHTML = Components.heroBanner(movies[0], 0, movies.length);
      this.initHeroCarousel();
    } catch {
      const movies = API.getDemoMovies().slice(0, 5);
      this._heroMovies = movies;
      section.innerHTML = Components.heroBanner(movies[0], 0, movies.length);
    }
  },

  initHeroCarousel() {
    if (!this._heroMovies || this._heroMovies.length <= 1) return;
    let current = 0;
    const section = document.getElementById('heroSection');

    // Auto-advance every 6 seconds
    this._heroInterval = setInterval(() => {
      current = (current + 1) % this._heroMovies.length;
      this.updateHero(current);
    }, 6000);

    // Click on dots
    section.addEventListener('click', (e) => {
      if (e.target.classList.contains('hero-dot')) {
        clearInterval(this._heroInterval);
        current = parseInt(e.target.dataset.index);
        this.updateHero(current);
        this._heroInterval = setInterval(() => {
          current = (current + 1) % this._heroMovies.length;
          this.updateHero(current);
        }, 6000);
      }
    });
  },

  updateHero(index) {
    const section = document.getElementById('heroSection');
    section.innerHTML = Components.heroBanner(this._heroMovies[index], index, this._heroMovies.length);
  },

  async loadTrending() {
    const row = document.getElementById('trendingRow');
    try {
      const data = await API.trending('day');
      const movies = data.results?.slice(0, 10) || API.getDemoMovies().slice(0, 10);
      row.innerHTML = movies.map(m => Components.movieCard(m)).join('');
      Utils.observeLazy(row.querySelectorAll('img[data-src]'));
    } catch {
      row.innerHTML = API.getDemoMovies().slice(0, 10).map(m => Components.movieCard(m)).join('');
    }
  },

  loadContinueWatching() {
    const section = document.getElementById('continueSection');
    const history = State.get('history') || [];
    const active = history.filter(h => h.progress > 0 && h.progress < 100).slice(0, 4);

    if (active.length === 0) {
      // Show demo continue watching
      const demo = [
        { id: 6, title: 'Interstellar', poster_path: '/gEU2QniL6E86tG9h9i1D7zR1n2ua.jpg', runtime: 169, genre_ids: [12, 18, 878], progress: 67 },
        { id: 7, title: 'Inception', poster_path: '/9gk7ad7z7z7z7z7z7z7z7z7z7.jpg', runtime: 148, genre_ids: [28, 12, 878], progress: 42 }
      ];
      section.innerHTML = `
        ${Components.sectionHeader(Utils.t('continueWatching'), '/history', Utils.t('seeAll'))}
        ${demo.map(item => Components.continueCard(item)).join('')}
      `;
      return;
    }

    section.innerHTML = `
      ${Components.sectionHeader(Utils.t('continueWatching'), '/history', Utils.t('seeAll'))}
      ${active.map(item => Components.continueCard(item)).join('')}
    `;
  },

  destroy() {
    if (this._heroInterval) clearInterval(this._heroInterval);
  }
};
