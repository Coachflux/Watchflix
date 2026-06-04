/**
 * CINEFLIX - Search Functionality
 */

const Search = {
    currentQuery: '',
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    results: [],
    searchTimeout: null,

    /**
     * Initialize search handlers
     */
    init() {
        const searchBtn = document.getElementById('searchBtn');
        const closeSearch = document.getElementById('closeSearch');
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const searchModal = document.getElementById('searchModal');

        searchBtn?.addEventListener('click', () => this.open());
        closeSearch?.addEventListener('click', () => this.close());

        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearSearch.classList.toggle('visible', query.length > 0);

            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                if (query.length >= 2) {
                    this.search(query);
                } else if (query.length === 0) {
                    this.showHistory();
                }
            }, 400);
        });

        searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query.length >= 2) {
                    State.addSearch(query);
                    this.search(query);
                }
            }
        });

        clearSearch?.addEventListener('click', () => {
            searchInput.value = '';
            clearSearch.classList.remove('visible');
            searchInput.focus();
            this.showHistory();
        });

        // Close on overlay click or escape
        searchModal?.addEventListener('click', (e) => {
            if (e.target === searchModal) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal?.classList.contains('active')) {
                this.close();
            }
        });
    },

    /**
     * Open search modal
     */
    open() {
        const modal = document.getElementById('searchModal');
        const input = document.getElementById('searchInput');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input?.focus(), 300);
        this.showHistory();
    },

    /**
     * Close search modal
     */
    close() {
        const modal = document.getElementById('searchModal');
        const input = document.getElementById('searchInput');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (input) input.value = '';
        document.getElementById('clearSearch')?.classList.remove('visible');
    },

    /**
     * Show search history
     */
    showHistory() {
        const container = document.getElementById('searchResults');
        const history = State.get('searchHistory');

        if (!history.length) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 40px 20px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <h3>Search Movies & TV Shows</h3>
                    <p>Type at least 2 characters to search</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="search-section">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                    <h3>Recent Searches</h3>
                    <button onclick="State.clearSearchHistory(); Search.showHistory();" 
                            style="background:none;border:none;color:var(--text-muted);font-size:0.8125rem;cursor:pointer;">
                        Clear All
                    </button>
                </div>
                ${history.map(query => `
                    <div class="search-result-item" onclick="Search.search('${Utils.escapeHtml(query).replace(/'/g, "\'")}')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                        <div class="info">
                            <h4>${Utils.escapeHtml(query)}</h4>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Perform search
     */
    async search(query) {
        if (!query || query.length < 2) return;

        this.currentQuery = query;
        this.currentPage = 1;
        this.results = [];
        this.isLoading = false;

        const input = document.getElementById('searchInput');
        if (input && input.value !== query) {
            input.value = query;
        }

        const container = document.getElementById('searchResults');
        container.innerHTML = `
            <div class="search-section">
                <h3>Searching "${Utils.escapeHtml(query)}"...</h3>
                <div style="display:flex;gap:12px;padding:10px 0;">
                    ${Utils.skeletonCard(4)}
                </div>
            </div>
        `;

        try {
            const data = await API.searchMulti(query, 1);
            this.results = data.results || [];
            this.totalPages = data.total_pages || 1;

            this.renderResults(container);
            State.addSearch(query);

        } catch (error) {
            console.error('Search error:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <h3>Search failed</h3>
                    <p>Please check your connection and try again</p>
                </div>
            `;
        }
    },

    /**
     * Render search results
     */
    renderResults(container) {
        if (!this.results.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <h3>No results found</h3>
                    <p>Try different keywords or check your spelling</p>
                </div>
            `;
            return;
        }

        // Group results by type
        const movies = this.results.filter(r => r.media_type === 'movie');
        const tvShows = this.results.filter(r => r.media_type === 'tv');
        const people = this.results.filter(r => r.media_type === 'person');

        let html = '';

        if (movies.length) {
            html += `
                <div class="search-section">
                    <h3>Movies (${movies.length})</h3>
                    ${movies.slice(0, 6).map(m => this.renderResultItem(m)).join('')}
                </div>
            `;
        }

        if (tvShows.length) {
            html += `
                <div class="search-section">
                    <h3>TV Shows (${tvShows.length})</h3>
                    ${tvShows.slice(0, 6).map(m => this.renderResultItem(m)).join('')}
                </div>
            `;
        }

        if (people.length) {
            html += `
                <div class="search-section">
                    <h3>People (${people.length})</h3>
                    ${people.slice(0, 4).map(p => `
                        <div class="search-result-item">
                            <img src="${Utils.getProfileUrl(p.profile_path, 'w185')}" alt="${Utils.escapeHtml(p.name)}" onerror="this.src='assets/placeholder.webp'">
                            <div class="info">
                                <h4>${Utils.escapeHtml(p.name)}</h4>
                                <p>${p.known_for_department || 'Actor'}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        container.innerHTML = html;
        Utils.lazyLoadImages(container);
    },

    /**
     * Render individual search result item
     */
    renderResultItem(item) {
        const title = item.title || item.name || 'Untitled';
        const poster = item.poster_path;
        const year = item.release_date || item.first_air_date 
            ? Utils.formatYear(item.release_date || item.first_air_date) 
            : '';
        const type = item.media_type === 'tv' ? 'TV Show' : 'Movie';
        const rating = item.vote_average ? item.vote_average.toFixed(1) : '';

        return `
            <div class="search-result-item" onclick="Search.goToDetail(${item.id}, '${item.media_type}')">
                <img src="${Utils.getImageUrl(poster, 'w92')}" alt="${Utils.escapeHtml(title)}" onerror="this.src='assets/placeholder.webp'">
                <div class="info">
                    <h4>${Utils.escapeHtml(title)}</h4>
                    <p>${type}${year ? ' • ' + year : ''}${rating ? ' • ⭐ ' + rating : ''}</p>
                </div>
            </div>
        `;
    },

    /**
     * Navigate to detail from search
     */
    goToDetail(id, mediaType) {
        this.close();
        Router.navigate('detail', id, mediaType);
    }
};

// Expose globally
window.Search = Search;
