/**
 * CINEFLIX - Home Page (Robust Version)
 */

const Home = {
    heroInterval: null,
    heroMovies: [],
    currentHeroIndex: 0,

    // Demo fallback data
    demoMovies: [
        {
            id: 693134,
            title: "Dune: Part Two",
            overview: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hjhGP.jpg",
            poster_path: "/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
            vote_average: 8.2,
            release_date: "2024-02-27",
            media_type: "movie"
        },
        {
            id: 872585,
            title: "Oppenheimer",
            overview: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
            backdrop_path: "/nb3xI8XI3w4pMVZ38VijbsyBqIP.jpg",
            poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
            vote_average: 8.1,
            release_date: "2023-07-19",
            media_type: "movie"
        },
        {
            id: 155,
            title: "The Dark Knight",
            overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
            backdrop_path: "/dqK9Hag1054tghRQSqLSfrkvQnA.jpg",
            poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            vote_average: 8.5,
            release_date: "2008-07-16",
            media_type: "movie"
        },
        {
            id: 157336,
            title: "Interstellar",
            overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
            backdrop_path: "/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
            poster_path: "/gEU2QniL6C8z19uVOtYnZ5UYj52.jpg",
            vote_average: 8.4,
            release_date: "2014-11-05",
            media_type: "movie"
        },
        {
            id: 27205,
            title: "Inception",
            overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life.",
            backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
            poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
            vote_average: 8.4,
            release_date: "2010-07-15",
            media_type: "movie"
        }
    ],

    /**
     * Render home page - ALWAYS shows content
     */
    render(container) {
        // Build the full page HTML immediately with demo data
        const heroHTML = this.buildHero(this.demoMovies);
        const categoriesHTML = this.buildCategories();
        const trendingHTML = this.buildScrollRow('Trending Now', this.demoMovies);
        const popularHTML = this.buildScrollRow('Popular', this.demoMovies.slice(1));
        const topRatedHTML = this.buildScrollRow('Top Rated', this.demoMovies.slice(2));
        const nowPlayingHTML = this.buildScrollRow('Now Playing', this.demoMovies);
        const continueHTML = this.buildContinueWatching();

        container.innerHTML = `
            <div class="page" id="homePage">
                ${heroHTML}
                ${categoriesHTML}
                ${trendingHTML}
                ${continueHTML}
                ${popularHTML}
                ${topRatedHTML}
                ${nowPlayingHTML}
            </div>
        `;

        // Start hero carousel
        this.heroMovies = this.demoMovies;
        this.startHeroCarousel();

        // Then try to load real data from API in background
        this.loadRealData(container);
    },

    /**
     * Build hero carousel HTML
     */
    buildHero(movies) {
        if (!movies || !movies.length) return '';

        const slides = movies.map((movie, i) => {
            const title = movie.title || movie.name || 'Untitled';
            const overview = movie.overview || '';
            const mediaType = movie.media_type || 'movie';
            const backdrop = movie.backdrop_path 
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : '';

            return `
                <div class="hero-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
                    <div class="hero-bg" style="background-image: url('${backdrop}')"></div>
                    <div class="hero-content">
                        <span class="hero-badge">FEATURED</span>
                        <h1 class="hero-title">${this.escapeHtml(title).toUpperCase()}</h1>
                        <p class="hero-desc">${this.escapeHtml(this.truncate(overview, 120))}</p>
                        <div class="hero-actions">
                            <button class="btn-primary" onclick="event.stopPropagation(); Components.playContent(${movie.id}, '${mediaType}', '${this.escapeHtml(title).replace(/'/g, "\'")}')">
                                <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                Play Now
                            </button>
                            <button class="btn-secondary" onclick="event.stopPropagation(); Components.toggleWatchlist(${movie.id}, '${mediaType}', '${this.escapeHtml(title).replace(/'/g, "\'")}', '${movie.poster_path || ''}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                My List
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const dots = movies.map((_, i) => `
            <button class="hero-dot ${i === 0 ? 'active' : ''}" 
                    data-index="${i}" 
                    onclick="Home.setHeroSlide(${i})"></button>
        `).join('');

        return `
            <div class="hero-carousel" id="heroCarousel">
                ${slides}
                <div class="hero-dots" id="heroDots">${dots}</div>
            </div>
        `;
    },

    /**
     * Build category navigation
     */
    buildCategories() {
        const categories = [
            { label: 'Movies', href: '#/discover?type=movie', icon: 'movies' },
            { label: 'TV Shows', href: '#/discover?type=tv', icon: 'tv' },
            { label: 'Genres', href: '#/discover', icon: 'genres' },
            { label: 'Watchlist', href: '#/library', icon: 'watchlist' }
        ];

        const icons = {
            movies: '<rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/>',
            tv: '<rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/>',
            genres: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
            watchlist: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>'
        };

        const items = categories.map(c => `
            <a href="${c.href}" class="category-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons[c.icon]}</svg>
                <span>${c.label}</span>
            </a>
        `).join('');

        return `<div class="category-nav">${items}</div>`;
    },

    /**
     * Build horizontal scroll row
     */
    buildScrollRow(title, movies) {
        if (!movies || !movies.length) return '';

        const cards = movies.map(m => {
            const movieTitle = m.title || m.name || 'Untitled';
            const poster = m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : 'assets/placeholder.webp';
            const rating = m.vote_average ? m.vote_average.toFixed(1) : '0.0';
            const year = m.release_date || m.first_air_date ? new Date(m.release_date || m.first_air_date).getFullYear() : '';
            const mediaType = m.media_type || 'movie';

            return `
                <div class="movie-card" 
                     data-id="${m.id}" 
                     data-type="${mediaType}"
                     onclick="Router.navigate('detail', ${m.id}, '${mediaType}')">
                    <div class="poster">
                        <img src="${poster}" alt="${this.escapeHtml(movieTitle)}" loading="lazy" onerror="this.src='assets/placeholder.webp'">
                        <div class="rating">
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ${rating}
                        </div>
                    </div>
                    <div class="movie-title">${this.escapeHtml(movieTitle)}</div>
                    ${year ? `<div class="movie-meta">${year}</div>` : ''}
                </div>
            `;
        }).join('');

        return `
            <div class="section-header">
                <h2 class="section-title">${title}</h2>
                <a href="#/discover" class="see-all">
                    See All
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                </a>
            </div>
            <div class="horizontal-scroll">${cards}</div>
        `;
    },

    /**
     * Build continue watching section
     */
    buildContinueWatching() {
        const items = State.get('continueWatching');
        if (!items || !items.length) return '';

        const cards = items.slice(0, 5).map(item => {
            const title = item.title || item.name || 'Untitled';
            const poster = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/placeholder.webp';
            const progress = item.progress || 0;
            const mediaType = item.media_type || 'movie';

            return `
                <div class="continue-card" onclick="Components.playContent(${item.id}, '${mediaType}', '${this.escapeHtml(title).replace(/'/g, "\'")}')">
                    <div class="poster">
                        <img src="${poster}" alt="${this.escapeHtml(title)}" loading="lazy" onerror="this.src='assets/placeholder.webp'">
                        <div class="play-overlay">
                            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                    </div>
                    <div class="info">
                        <h4>${this.escapeHtml(title)}</h4>
                        <div class="meta">${item.runtime ? Math.floor(item.runtime/60) + 'h ' + (item.runtime%60) + 'm' : ''}</div>
                        <div class="progress-bar"><div class="fill" style="width: ${progress}%"></div></div>
                        <div class="progress-text">${progress}% completed</div>
                    </div>
                    <button class="more-btn" onclick="event.stopPropagation();">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');

        return `
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
     * Set active hero slide
     */
    setHeroSlide(index) {
        if (!this.heroMovies.length) return;
        this.currentHeroIndex = index;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
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
     * Load real data from API and update the page
     */
    async loadRealData(container) {
        try {
            const [trending, popular, topRated, nowPlaying] = await Promise.all([
                fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=becc030248ec01bad5e0a45c4239fac3&language=${State.get('language')}&page=1`).then(r => r.ok ? r.json() : null),
                fetch(`https://api.themoviedb.org/3/movie/popular?api_key=becc030248ec01bad5e0a45c4239fac3&language=${State.get('language')}&region=${State.get('region')}&page=1`).then(r => r.ok ? r.json() : null),
                fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=becc030248ec01bad5e0a45c4239fac3&language=${State.get('language')}&region=${State.get('region')}&page=1`).then(r => r.ok ? r.json() : null),
                fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=becc030248ec01bad5e0a45c4239fac3&language=${State.get('language')}&region=${State.get('region')}&page=1`).then(r => r.ok ? r.json() : null)
            ]);

            // Only update sections if we got real data
            if (trending?.results?.length) {
                const heroSection = container.querySelector('#heroCarousel');
                if (heroSection) {
                    this.heroMovies = trending.results.slice(0, 5);
                    heroSection.outerHTML = this.buildHero(this.heroMovies);
                    this.startHeroCarousel();
                }
            }

            if (trending?.results?.length) {
                const trendingSection = this.findSection(container, 'Trending Now');
                if (trendingSection) trendingSection.outerHTML = this.buildScrollRow('Trending Now', trending.results.slice(0, 10));
            }

            if (popular?.results?.length) {
                const popularSection = this.findSection(container, 'Popular');
                if (popularSection) popularSection.outerHTML = this.buildScrollRow('Popular', popular.results.slice(0, 10));
            }

            if (topRated?.results?.length) {
                const topRatedSection = this.findSection(container, 'Top Rated');
                if (topRatedSection) topRatedSection.outerHTML = this.buildScrollRow('Top Rated', topRated.results.slice(0, 10));
            }

            if (nowPlaying?.results?.length) {
                const nowPlayingSection = this.findSection(container, 'Now Playing');
                if (nowPlayingSection) nowPlayingSection.outerHTML = this.buildScrollRow('Now Playing', nowPlaying.results.slice(0, 10));
            }

            // Update continue watching
            const continueSection = this.findSection(container, 'Continue Watching');
            if (continueSection) {
                const newContinue = this.buildContinueWatching();
                if (newContinue) continueSection.outerHTML = newContinue;
            }

            Utils.showToast('Content updated from TMDB', 'success');

        } catch (error) {
            console.log('API load failed, keeping demo data:', error);
        }
    },

    /**
     * Find a section by its title
     */
    findSection(container, titleText) {
        const headers = container.querySelectorAll('.section-header');
        for (const header of headers) {
            const title = header.querySelector('.section-title');
            if (title && title.textContent === titleText) {
                return header;
            }
        }
        return null;
    },

    /**
     * Escape HTML
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Truncate text
     */
    truncate(text, length = 150) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length).trim() + '...' : text;
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
