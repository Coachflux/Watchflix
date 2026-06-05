/**
 * CINEFLIX - Discover / Explore Page
 */

const Discover = {
    currentPage: 1,
    totalPages: 1,
    currentType: 'movie',
    currentSort: 'popularity.desc',
    currentGenre: null,
    isLoading: false,
    movies: [],
    genres: [],

    /**
     * Render discover page
     */
    async render(container, params = {}) {
        this.currentType = params.type || 'movie';
        this.currentSort = params.sort || 'popularity.desc';
        this.currentGenre = params.genre || null;
        this.currentPage = 1;
        this.movies = [];

        container.innerHTML = `
            <div class="page" id="discoverPage">
                <div class="discover-filters">
                    <div class="filter-group">
                        <label>Type</label>
                        <div class="filter-chips" id="typeFilters">
                            <button class="filter-chip ${this.currentType === 'movie' ? 'active' : ''}" data-type="movie">Movies</button>
                            <button class="filter-chip ${this.currentType === 'tv' ? 'active' : ''}" data-type="tv">TV Shows</button>
                        </div>
                    </div>
                    <div class="filter-group">
                        <label>Sort By</label>
                        <div class="filter-chips" id="sortFilters">
                            <button class="filter-chip ${this.currentSort === 'popularity.desc' ? 'active' : ''}" data-sort="popularity.desc">Popular</button>
                            <button class="filter-chip ${this.currentSort === 'vote_average.desc' ? 'active' : ''}" data-sort="vote_average.desc">Top Rated</button>
                            <button class="filter-chip ${this.currentSort === 'release_date.desc' ? 'active' : ''}" data-sort="release_date.desc">Latest</button>
                            <button class="filter-chip ${this.currentSort === 'revenue.desc' ? 'active' : ''}" data-sort="revenue.desc">Revenue</button>
                        </div>
                    </div>
                    <div class="filter-group">
                        <label>Genres</label>
                        <div class="filter-chips" id="genreFilters">
                            <button class="filter-chip ${!this.currentGenre ? 'active' : ''}" data-genre="">All</button>
                            <div id="genreList"></div>
                        </div>
                    </div>
                </div>
                <div class="movie-grid" id="movieGrid">
                    ${Utils.skeletonCard(12)}
                </div>
                <div class="load-more" id="loadMore" style="display:none;">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        // Load genres
        await this.loadGenres();

        // Bind filter events
        this.bindFilterEvents(container);

        // Load initial content
        await this.loadContent();

        // Setup infinite scroll
        this.setupInfiniteScroll(container);
    },

    /**
     * Load genres
     */
    async loadGenres() {
        try {
            const cachedGenres = State.get('genres');
            if (cachedGenres[this.currentType]?.length > 0) {
                this.genres = cachedGenres[this.currentType];
            } else {
                const data = this.currentType === 'movie' 
                    ? await API.getMovieGenres()
                    : await API.getTVGenres();
                this.genres = data.genres || [];

                const allGenres = { ...State.get('genres') };
                allGenres[this.currentType] = this.genres;
                State.set('genres', allGenres);
                localStorage.setItem('cineflix_genres', JSON.stringify(allGenres));
            }

            const genreList = document.getElementById('genreList');
            if (genreList) {
                genreList.innerHTML = this.genres.map(g => `
                    <button class="filter-chip ${this.currentGenre == g.id ? 'active' : ''}" 
                            data-genre="${g.id}">${Utils.escapeHtml(g.name)}</button>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading genres:', error);
        }
    },

    /**
     * Bind filter click events
     */
    bindFilterEvents(container) {
        container.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;

            const type = chip.dataset.type;
            const sort = chip.dataset.sort;
            const genre = chip.dataset.genre;

            if (type !== undefined && type !== this.currentType) {
                this.currentType = type;
                this.currentPage = 1;
                this.movies = [];
                this.updateActiveChip('typeFilters', type);
                this.loadGenres().then(() => this.loadContent());
            }

            if (sort !== undefined && sort !== this.currentSort) {
                this.currentSort = sort;
                this.currentPage = 1;
                this.movies = [];
                this.updateActiveChip('sortFilters', sort);
                this.loadContent();
            }

            if (genre !== undefined) {
                this.currentGenre = genre || null;
                this.currentPage = 1;
                this.movies = [];
                this.updateActiveChip('genreFilters', genre);
                this.loadContent();
            }
        });
    },

    /**
     * Update active filter chip
     */
    updateActiveChip(groupId, value) {
        const group = document.getElementById(groupId);
        if (!group) return;
        group.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.type === value || chip.dataset.sort === value || chip.dataset.genre === value);
        });
    },

    /**
     * Load content based on filters
     */
    async loadContent() {
        if (this.isLoading) return;
        this.isLoading = true;

        const grid = document.getElementById('movieGrid');
        const loadMore = document.getElementById('loadMore');

        if (this.currentPage === 1) {
            grid.innerHTML = Utils.skeletonCard(12);
        } else {
            loadMore.style.display = 'block';
        }

        try {
            let data;
            const params = {
                sort_by: this.currentSort,
                page: this.currentPage
            };

            if (this.currentGenre) {
                params.with_genres = this.currentGenre;
            }

            // Handle special sort values
            if (this.currentSort === 'trending') {
                data = this.currentType === 'movie'
                    ? await API.getTrendingMovies('week', this.currentPage)
                    : await API.getTrendingTV('week', this.currentPage);
            } else if (this.currentSort === 'now_playing') {
                data = await API.getNowPlaying(this.currentPage);
            } else if (this.currentSort === 'top_rated') {
                data = this.currentType === 'movie'
                    ? await API.getTopRatedMovies(this.currentPage)
                    : await API.getTopRatedTV(this.currentPage);
            } else if (this.currentSort === 'popular') {
                data = this.currentType === 'movie'
                    ? await API.getPopularMovies(this.currentPage)
                    : await API.getPopularTV(this.currentPage);
            } else {
                data = this.currentType === 'movie'
                    ? await API.discoverMovies(params)
                    : await API.discoverTV(params);
            }

            const results = data.results || [];
            this.totalPages = data.total_pages || 1;

            if (this.currentPage === 1) {
                this.movies = results;
            } else {
                this.movies.push(...results);
            }

            this.renderGrid(grid);

        } catch (error) {
            console.error('Discover load error:', error);
            if (this.currentPage === 1) {
                grid.innerHTML = Components.emptyState(
                    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
                    'Failed to load content',
                    'Please check your connection and try again.'
                );
            }
        } finally {
            this.isLoading = false;
            if (loadMore) loadMore.style.display = 'none';
        }
    },

    /**
     * Render movie grid
     */
    renderGrid(container) {
        if (!this.movies.length) {
            container.innerHTML = Components.emptyState(
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
                'No results found',
                'Try adjusting your filters to see more content.'
            );
            return;
        }

        container.innerHTML = this.movies.map(m => Components.movieCard(m, { showRating: true })).join('');
        Utils.lazyLoadImages(container);
    },

    /**
     * Setup infinite scroll
     */
    setupInfiniteScroll(container) {
        const mainContent = document.querySelector('.main-content');

        const handleScroll = Utils.throttle(() => {
            if (this.isLoading || this.currentPage >= this.totalPages) return;

            const scrollBottom = mainContent.scrollTop + mainContent.clientHeight;
            const threshold = mainContent.scrollHeight - 200;

            if (scrollBottom >= threshold) {
                this.currentPage++;
                this.loadContent();
            }
        }, 200);

        mainContent.addEventListener('scroll', handleScroll);
        this.scrollHandler = handleScroll;
    },

    /**
     * Cleanup
     */
    destroy() {
        const mainContent = document.querySelector('.main-content');
        if (mainContent && this.scrollHandler) {
            mainContent.removeEventListener('scroll', this.scrollHandler);
        }
    }
};

// Expose globally
window.Discover = Discover;
