/**
 * CINEFLIX - TV Shows Page
 */

const TV = {
    currentPage: 1,
    totalPages: 1,
    isLoading: false,
    shows: [],
    currentCategory: 'popular',

    /**
     * Render TV shows page
     */
    async render(container) {
        container.innerHTML = `
            <div class="page" id="tvPage">
                <div class="discover-filters">
                    <div class="filter-group">
                        <label>Category</label>
                        <div class="filter-chips" id="tvCategoryFilters">
                            <button class="filter-chip active" data-category="popular">Popular</button>
                            <button class="filter-chip" data-category="top_rated">Top Rated</button>
                            <button class="filter-chip" data-category="trending">Trending</button>
                        </div>
                    </div>
                </div>
                <div class="movie-grid" id="tvGrid">
                    ${Utils.skeletonCard(12)}
                </div>
                <div class="load-more" id="tvLoadMore" style="display:none;">
                    <div class="spinner"></div>
                </div>
            </div>
        `;

        this.bindEvents(container);
        await this.loadShows();
        this.setupInfiniteScroll();
    },

    /**
     * Bind category filter events
     */
    bindEvents(container) {
        container.addEventListener('click', (e) => {
            const chip = e.target.closest('.filter-chip');
            if (!chip) return;

            const category = chip.dataset.category;
            if (category && category !== this.currentCategory) {
                this.currentCategory = category;
                this.currentPage = 1;
                this.shows = [];

                container.querySelectorAll('#tvCategoryFilters .filter-chip').forEach(c => {
                    c.classList.toggle('active', c.dataset.category === category);
                });

                this.loadShows();
            }
        });
    },

    /**
     * Load TV shows
     */
    async loadShows() {
        if (this.isLoading) return;
        this.isLoading = true;

        const grid = document.getElementById('tvGrid');
        const loadMore = document.getElementById('tvLoadMore');

        if (this.currentPage === 1) {
            grid.innerHTML = Utils.skeletonCard(12);
        } else {
            loadMore.style.display = 'block';
        }

        try {
            let data;
            switch (this.currentCategory) {
                case 'top_rated':
                    data = await API.getTopRatedTV(this.currentPage);
                    break;
                case 'trending':
                    data = await API.getTrendingTV('week', this.currentPage);
                    break;
                case 'popular':
                default:
                    data = await API.getPopularTV(this.currentPage);
                    break;
            }

            const results = data.results || [];
            this.totalPages = data.total_pages || 1;

            if (this.currentPage === 1) {
                this.shows = results;
            } else {
                this.shows.push(...results);
            }

            this.renderGrid(grid);

        } catch (error) {
            console.error('TV load error:', error);
            if (this.currentPage === 1) {
                grid.innerHTML = Components.emptyState(
                    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
                    'Failed to load TV shows',
                    'Please check your connection and try again.'
                );
            }
        } finally {
            this.isLoading = false;
            if (loadMore) loadMore.style.display = 'none';
        }
    },

    /**
     * Render TV grid
     */
    renderGrid(container) {
        if (!this.shows.length) {
            container.innerHTML = Components.emptyState(
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
                'No TV shows found',
                'Try a different category or check back later.'
            );
            return;
        }

        container.innerHTML = this.shows.map(s => Components.movieCard({...s, media_type: 'tv'}, { showRating: true })).join('');
        Utils.lazyLoadImages(container);
    },

    /**
     * Setup infinite scroll
     */
    setupInfiniteScroll() {
        const mainContent = document.querySelector('.main-content');

        this.scrollHandler = Utils.throttle(() => {
            if (this.isLoading || this.currentPage >= this.totalPages) return;

            const scrollBottom = mainContent.scrollTop + mainContent.clientHeight;
            const threshold = mainContent.scrollHeight - 200;

            if (scrollBottom >= threshold) {
                this.currentPage++;
                this.loadShows();
            }
        }, 200);

        mainContent.addEventListener('scroll', this.scrollHandler);
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
window.TV = TV;
