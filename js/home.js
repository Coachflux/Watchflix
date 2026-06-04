/**
 * CINEFLIX - Home Page
 */

const Home = {
    heroInterval: null,
    heroMovies: [],
    currentHeroIndex: 0,

    /**
     * Render home page
     */
    async render(container) {
        container.innerHTML = `
            <div class="page" id="homePage">
                <div id="heroSection">${Utils.skeletonHero()}</div>
                <div id="categoryNav"></div>
                <div id="trendingSection"></div>
                <div id="continueSection"></div>
                <div id="popularSection"></div>
                <div id="topRatedSection"></div>
                <div id="nowPlayingSection"></div>
            </div>
        `;

        try {
            // Load all data in parallel
            const [featured, homeData] = await Promise.all([
                API.getFeaturedContent(),
                API.getHomeData()
            ]);

            this.heroMovies = featured;
            this.renderHero(document.getElementById('heroSection'));
            this.renderCategories(document.getElementById('categoryNav'));
            this.renderTrending(document.getElementById('trendingSection'), homeData.trending);
            this.renderContinueWatching(document.getElementById('continueSection'));
            this.renderPopular(document.getElementById('popularSection'), homeData.popular);
            this.renderTopRated(document.getElementById('topRatedSection'), homeData.topRated);
            this.renderNowPlaying(document.getElementById('nowPlayingSection'), homeData.nowPlaying);

            // Start hero carousel
            this.startHeroCarousel();

        } catch (error) {
            console.error('Home render error:', error);
            container.innerHTML = `
                <div class="page" id="homePage">
                    ${Components.emptyState(
                        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
                        'Unable to load content',
                        'Please check your internet connection and try again.'
                    )}
                </div>
            `;
        }
    },

    /**
     * Render hero carousel
     */
    renderHero(container) {
        if (!this.heroMovies.length) {
            container.innerHTML = '';
            return;
        }

        const slides = this.heroMovies.map((movie, i) => 
            Components.heroSlide(movie, i, i === 0)
        ).join('');

        const dots = Components.heroDots(this.heroMovies.length, 0);

        container.innerHTML = `
            <div class="hero-carousel" id="heroCarousel">
                ${slides}
                <div class="hero-dots" id="heroDots">${dots}</div>
            </div>
        `;
    },

    /**
     * Set active hero slide
     */
    setHeroSlide(index) {
        if (!this.heroMovies.length) return;

        this.currentHeroIndex = index;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    },

    /**
     * Start auto-rotating hero carousel
     */
    startHeroCarousel() {
        this.stopHeroCarousel();
        this.heroInterval = setInterval(() => {
            const nextIndex = (this.currentHeroIndex + 1) % this.heroMovies.length;
            this.setHeroSlide(nextIndex);
        }, 6000);
    },

    /**
     * Stop hero carousel
     */
    stopHeroCarousel() {
        if (this.heroInterval) {
            clearInterval(this.heroInterval);
            this.heroInterval = null;
        }
    },

    /**
     * Render category navigation
     */
    renderCategories(container) {
        const categories = [
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
                label: 'Movies',
                href: '#/discover?type=movie',
                active: false
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
                label: 'TV Shows',
                href: '#/discover?type=tv',
                active: false
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
                label: 'Genres',
                href: '#/discover',
                active: false
            },
            {
                icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
                label: 'Watchlist',
                href: '#/library',
                active: false
            }
        ];

        container.innerHTML = `
            <div class="category-nav">
                ${categories.map(c => Components.categoryItem(c.icon, c.label, c.href, c.active)).join('')}
            </div>
        `;
    },

    /**
     * Render trending section
     */
    renderTrending(container, movies) {
        if (!movies || movies.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = Components.scrollRow('Trending Now', movies, {
            seeAllLink: '#/discover?sort=trending',
            cardOptions: { showRating: true }
        });
        Utils.lazyLoadImages(container);
    },

    /**
     * Render continue watching section
     */
    renderContinueWatching(container) {
        const items = State.get('continueWatching');
        if (!items || items.length === 0) {
            container.innerHTML = '';
            return;
        }

        const cards = items.slice(0, 5).map(item => Components.continueCard(item)).join('');

        container.innerHTML = `
            <div class="section-header">
                <h2 class="section-title">Continue Watching</h2>
                <a href="#/library?tab=continue" class="see-all">
                    See All
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </a>
            </div>
            ${cards}
        `;
    },

    /**
     * Render popular section
     */
    renderPopular(container, movies) {
        if (!movies || movies.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = Components.scrollRow('Popular', movies, {
            seeAllLink: '#/discover?sort=popular',
            cardOptions: { showRating: true }
        });
        Utils.lazyLoadImages(container);
    },

    /**
     * Render top rated section
     */
    renderTopRated(container, movies) {
        if (!movies || movies.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = Components.scrollRow('Top Rated', movies, {
            seeAllLink: '#/discover?sort=top_rated',
            cardOptions: { showRating: true }
        });
        Utils.lazyLoadImages(container);
    },

    /**
     * Render now playing section
     */
    renderNowPlaying(container, movies) {
        if (!movies || movies.length === 0) {
            container.innerHTML = '';
            return;
        }
        container.innerHTML = Components.scrollRow('Now Playing', movies, {
            seeAllLink: '#/discover?sort=now_playing',
            cardOptions: { showRating: true }
        });
        Utils.lazyLoadImages(container);
    },

    /**
     * Cleanup
     */
    destroy() {
        this.stopHeroCarousel();
    }
};

// Expose globally
window.Home = Home;
