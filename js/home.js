/**
 * CINEFLIX - Home Page
 */

const Home = {
    heroInterval: null,
    heroMovies: [],
    currentHeroIndex: 0,

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

    render(container) {
        const movies = this.demoMovies;

        // Build hero slides
        let slidesHtml = '';
        let dotsHtml = '';
        for (let i = 0; i < movies.length; i++) {
            const m = movies[i];
            const isActive = i === 0 ? 'active' : '';
            const backdrop = 'https://image.tmdb.org/t/p/original' + m.backdrop_path;
            const title = m.title;
            const overview = m.overview.length > 120 ? m.overview.substring(0, 120) + '...' : m.overview;

            slidesHtml += '<div class="hero-slide ' + isActive + '" data-index="' + i + '">' +
                '<div class="hero-bg" style="background-image: url(' + "'" + backdrop + "'" + ')"></div>' +
                '<div class="hero-content">' +
                    '<span class="hero-badge">FEATURED</span>' +
                    '<h1 class="hero-title">' + title.toUpperCase() + '</h1>' +
                    '<p class="hero-desc">' + overview + '</p>' +
                    '<div class="hero-actions">' +
                        '<button class="btn-primary" onclick="Home.playMovie(' + m.id + ', ' + "'" + m.media_type + "'" + ', ' + "'" + title.replace(/'/g, "\\'") + "'" + ')">' +
                            '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play Now' +
                        '</button>' +
                        '<button class="btn-secondary" onclick="Home.addToList(' + m.id + ', ' + "'" + m.media_type + "'" + ', ' + "'" + title.replace(/'/g, "\\'") + "'" + ', ' + "'" + m.poster_path + "'" + ')">' +
                            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List' +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';

            dotsHtml += '<button class="hero-dot ' + (i === 0 ? 'active' : '') + '" data-index="' + i + '" onclick="Home.setHeroSlide(' + i + ')"></button>';
        }

        // Build movie cards for a row
        function buildCards(movieList) {
            let cards = '';
            for (let i = 0; i < movieList.length; i++) {
                const m = movieList[i];
                const poster = 'https://image.tmdb.org/t/p/w500' + m.poster_path;
                const rating = m.vote_average.toFixed(1);
                const year = new Date(m.release_date).getFullYear();

                cards += '<div class="movie-card" onclick="Home.goToDetail(' + m.id + ', ' + "'" + m.media_type + "'" + ')">' +
                    '<div class="poster">' +
                        '<img src="' + poster + '" alt="' + m.title + '" loading="lazy" onerror="this.src=' + "'" + 'assets/placeholder.webp' + "'" + '">' +
                        '<div class="rating">' +
                            '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + rating +
                        '</div>' +
                    '</div>' +
                    '<div class="movie-title">' + m.title + '</div>' +
                    '<div class="movie-meta">' + year + '</div>' +
                '</div>';
            }
            return cards;
        }

        // Build category nav
        const categoriesHtml = '<div class="category-nav">' +
            '<a href="#/discover?type=movie" class="category-item">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/></svg>' +
                '<span>Movies</span>' +
            '</a>' +
            '<a href="#/discover?type=tv" class="category-item">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>' +
                '<span>TV Shows</span>' +
            '</a>' +
            '<a href="#/discover" class="category-item">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
                '<span>Genres</span>' +
            '</a>' +
            '<a href="#/library" class="category-item">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>' +
                '<span>Watchlist</span>' +
            '</a>' +
        '</div>';

        // Build section header
        function sectionHeader(title) {
            return '<div class="section-header">' +
                '<h2 class="section-title">' + title + '</h2>' +
                '<a href="#/discover" class="see-all">See All <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></a>' +
            '</div>';
        }

        // Assemble full page
        container.innerHTML = '<div class="page" id="homePage">' +
            '<div class="hero-carousel" id="heroCarousel">' + slidesHtml + '<div class="hero-dots">' + dotsHtml + '</div></div>' +
            categoriesHtml +
            sectionHeader('Trending Now') +
            '<div class="horizontal-scroll">' + buildCards(movies) + '</div>' +
            sectionHeader('Popular') +
            '<div class="horizontal-scroll">' + buildCards(movies.slice(1)) + '</div>' +
            sectionHeader('Top Rated') +
            '<div class="horizontal-scroll">' + buildCards(movies.slice(2)) + '</div>' +
            sectionHeader('Now Playing') +
            '<div class="horizontal-scroll">' + buildCards(movies) + '</div>' +
        '</div>';

        this.heroMovies = movies;
        this.startHeroCarousel();

        // Try to load real data in background
        this.loadRealData(container);
    },

    playMovie(id, type, title) {
        if (typeof Components !== 'undefined' && Components.playContent) {
            Components.playContent(id, type, title);
        } else {
            alert('Playing: ' + title);
        }
    },

    addToList(id, type, title, poster) {
        if (typeof State !== 'undefined' && State.addToWatchlist) {
            State.addToWatchlist({id: id, media_type: type, title: title, poster_path: poster});
            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast('Added to My List', 'success');
            }
        }
    },

    goToDetail(id, type) {
        if (typeof Router !== 'undefined' && Router.navigate) {
            Router.navigate('detail', id, type);
        }
    },

    setHeroSlide(index) {
        if (!this.heroMovies.length) return;
        this.currentHeroIndex = index;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    },

    startHeroCarousel() {
        this.stopHeroCarousel();
        this.heroInterval = setInterval(() => {
            const nextIndex = (this.currentHeroIndex + 1) % this.heroMovies.length;
            this.setHeroSlide(nextIndex);
        }, 6000);
    },

    stopHeroCarousel() {
        if (this.heroInterval) {
            clearInterval(this.heroInterval);
            this.heroInterval = null;
        }
    },

    async loadRealData(container) {
        try {
            const apiKey = 'becc030248ec01bad5e0a45c4239fac3';
            const lang = (typeof State !== 'undefined' && State.get) ? State.get('language') : 'en-US';
            const region = (typeof State !== 'undefined' && State.get) ? State.get('region') : 'US';

            const [trending, popular, topRated, nowPlaying] = await Promise.all([
                fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=' + apiKey + '&language=' + lang + '&page=1').then(r => r.ok ? r.json() : null).catch(() => null),
                fetch('https://api.themoviedb.org/3/movie/popular?api_key=' + apiKey + '&language=' + lang + '&region=' + region + '&page=1').then(r => r.ok ? r.json() : null).catch(() => null),
                fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=' + apiKey + '&language=' + lang + '&region=' + region + '&page=1').then(r => r.ok ? r.json() : null).catch(() => null),
                fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=' + apiKey + '&language=' + lang + '&region=' + region + '&page=1').then(r => r.ok ? r.json() : null).catch(() => null)
            ]);

            if (trending && trending.results && trending.results.length > 0) {
                this.heroMovies = trending.results.slice(0, 5);
                // Re-render hero with real data
                const heroCarousel = container.querySelector('.hero-carousel');
                if (heroCarousel) {
                    let slidesHtml = '';
                    let dotsHtml = '';
                    for (let i = 0; i < this.heroMovies.length; i++) {
                        const m = this.heroMovies[i];
                        const isActive = i === 0 ? 'active' : '';
                        const backdrop = 'https://image.tmdb.org/t/p/original' + m.backdrop_path;
                        const title = m.title || m.name || 'Untitled';
                        const overview = (m.overview || '').length > 120 ? m.overview.substring(0, 120) + '...' : (m.overview || '');

                        slidesHtml += '<div class="hero-slide ' + isActive + '" data-index="' + i + '">' +
                            '<div class="hero-bg" style="background-image: url(' + "'" + backdrop + "'" + ')"></div>' +
                            '<div class="hero-content">' +
                                '<span class="hero-badge">FEATURED</span>' +
                                '<h1 class="hero-title">' + title.toUpperCase() + '</h1>' +
                                '<p class="hero-desc">' + overview + '</p>' +
                                '<div class="hero-actions">' +
                                    '<button class="btn-primary" onclick="Home.playMovie(' + m.id + ', ' + "'" + (m.media_type || 'movie') + "'" + ', ' + "'" + title.replace(/'/g, "\\'") + "'" + ')">' +
                                        '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg> Play Now' +
                                    '</button>' +
                                    '<button class="btn-secondary" onclick="Home.addToList(' + m.id + ', ' + "'" + (m.media_type || 'movie') + "'" + ', ' + "'" + title.replace(/'/g, "\\'") + "'" + ', ' + "'" + (m.poster_path || '') + "'" + ')">' +
                                        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';

                        dotsHtml += '<button class="hero-dot ' + (i === 0 ? 'active' : '') + '" data-index="' + i + '" onclick="Home.setHeroSlide(' + i + ')"></button>';
                    }
                    heroCarousel.innerHTML = slidesHtml + '<div class="hero-dots">' + dotsHtml + '</div>';
                    this.currentHeroIndex = 0;
                    this.startHeroCarousel();
                }
            }

            // Update movie rows with real data
            function updateRow(container, title, movieList) {
                if (!movieList || !movieList.length) return;
                const headers = container.querySelectorAll('.section-header');
                for (let h = 0; h < headers.length; h++) {
                    const t = headers[h].querySelector('.section-title');
                    if (t && t.textContent === title) {
                        const scroll = headers[h].nextElementSibling;
                        if (scroll && scroll.classList.contains('horizontal-scroll')) {
                            let cards = '';
                            for (let i = 0; i < movieList.length && i < 10; i++) {
                                const m = movieList[i];
                                const poster = m.poster_path ? 'https://image.tmdb.org/t/p/w500' + m.poster_path : 'assets/placeholder.webp';
                                const rating = m.vote_average ? m.vote_average.toFixed(1) : '0.0';
                                const year = m.release_date || m.first_air_date ? new Date(m.release_date || m.first_air_date).getFullYear() : '';
                                const movieTitle = m.title || m.name || 'Untitled';

                                cards += '<div class="movie-card" onclick="Home.goToDetail(' + m.id + ', ' + "'" + (m.media_type || 'movie') + "'" + ')">' +
                                    '<div class="poster">' +
                                        '<img src="' + poster + '" alt="' + movieTitle + '" loading="lazy" onerror="this.src=' + "'" + 'assets/placeholder.webp' + "'" + '">' +
                                        '<div class="rating">' +
                                            '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ' + rating +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="movie-title">' + movieTitle + '</div>' +
                                    (year ? '<div class="movie-meta">' + year + '</div>' : '') +
                                '</div>';
                            }
                            scroll.innerHTML = cards;
                        }
                        break;
                    }
                }
            }

            if (trending && trending.results) updateRow(container, 'Trending Now', trending.results);
            if (popular && popular.results) updateRow(container, 'Popular', popular.results);
            if (topRated && topRated.results) updateRow(container, 'Top Rated', topRated.results);
            if (nowPlaying && nowPlaying.results) updateRow(container, 'Now Playing', nowPlaying.results);

            if (typeof Utils !== 'undefined' && Utils.showToast) {
                Utils.showToast('Movies loaded from TMDB', 'success');
            }
        } catch (e) {
            console.log('Background load failed:', e);
        }
    },

    destroy() {
        this.stopHeroCarousel();
    }
};

window.Home = Home;
