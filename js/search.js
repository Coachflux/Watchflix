/**
 * CINEFLIX — Search Page
 * Full-text search with filters, history, and suggestions
 */

const Search = {
  async render() {
    const main = document.getElementById('mainContent');
    const query = new URLSearchParams(location.hash.split('?')[1]).get('q') || '';

    main.innerHTML = `
      <div class="search-page">
        <div class="search-container">
          <div class="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="search" id="searchInput" placeholder="${Utils.t('search')}..." value="${query}" autocomplete="off">
            ${query ? `<button class="btn-icon" id="clearSearch" style="width:28px;height:28px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>` : ''}
          </div>
        </div>
        <div id="searchResults"></div>
      </div>
    `;

    this.initSearchInput();
    if (query) {
      await this.performSearch(query);
    } else {
      this.showSearchHistory();
    }
  },

  initSearchInput() {
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearch');

    input?.addEventListener('input', Utils.debounce((e) => {
      const val = e.target.value.trim();
      if (val.length >= 2) {
        this.performSearch(val);
      } else if (val.length === 0) {
        this.showSearchHistory();
      }
    }, 400));

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
          State.addSearchQuery(val);
          this.performSearch(val);
        }
      }
    });

    clearBtn?.addEventListener('click', () => {
      input.value = '';
      input.focus();
      this.showSearchHistory();
    });

    // Focus input on load
    setTimeout(() => input?.focus(), 100);
  },

  async performSearch(query) {
    const container = document.getElementById('searchResults');
    container.innerHTML = `
      <div class="content-grid" style="padding:0 1rem">
        ${Array(9).fill(0).map(() => Components.skeletonCard()).join('')}
      </div>
    `;

    try {
      const data = await API.search(query);
      const results = data.results?.filter(r => r.media_type !== 'person') || [];

      if (results.length === 0) {
        container.innerHTML = Components.emptyState(
          Utils.t('noResults'),
          Utils.t('tryDifferent'),
          'search'
        );
        return;
      }

      container.innerHTML = `
        <div class="section-header" style="padding-top:0.5rem">
          <h2 class="section-title">${results.length} results for "${query}"</h2>
        </div>
        <div class="content-grid" style="padding:0 1rem">
          ${results.map(r => Components.movieCard(r)).join('')}
        </div>
      `;
      Utils.observeLazy(container.querySelectorAll('img[data-src]'));
    } catch (err) {
      console.error('Search error:', err);
      // Fallback: filter demo data
      const demo = API.getDemoMovies().filter(m =>
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      if (demo.length === 0) {
        container.innerHTML = Components.emptyState(Utils.t('noResults'), Utils.t('tryDifferent'), 'search');
      } else {
        container.innerHTML = `
          <div class="content-grid" style="padding:0 1rem">
            ${demo.map(m => Components.movieCard(m)).join('')}
          </div>
        `;
      }
    }
  },

  showSearchHistory() {
    const container = document.getElementById('searchResults');
    const history = State.get('searchHistory') || [];
    const trending = ['Dune', 'Oppenheimer', 'Interstellar', 'The Batman', 'Stranger Things'];

    container.innerHTML = `
      <div style="padding:0 1rem">
        ${history.length > 0 ? `
          <div style="margin-bottom:1.5rem">
            <div class="section-header" style="padding:0;margin-bottom:0.5rem">
              <h3 style="font-size:0.875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em">Recent Searches</h3>
              <button class="btn-ghost" style="padding:0;font-size:0.75rem" onclick="State.set('searchHistory',[]);Search.showSearchHistory()">Clear</button>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
              ${history.map(q => `
                <button class="filter-chip" onclick="document.getElementById('searchInput').value='${q.replace(/'/g,"\'")}';Search.performSearch('${q.replace(/'/g,"\'")}')">${q}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        <div>
          <div class="section-header" style="padding:0;margin-bottom:0.5rem">
            <h3 style="font-size:0.875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em">Trending Searches</h3>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem">
            ${trending.map(t => `
              <button class="filter-chip" onclick="document.getElementById('searchInput').value='${t}';Search.performSearch('${t}')">${t}</button>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
};
