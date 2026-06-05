/**
 * CINEFLIX - TMDB API Client
 */

const API = {
    // TMDB Configuration
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: 'becc030248ec01bad5e0a45c4239fac3',

    // Request queue for rate limiting
    queue: [],
    processing: false,
    lastRequest: 0,
    MIN_INTERVAL: 50, // ms between requests

    /**
     * Make authenticated API request with rate limiting
     */
    async request(endpoint, params = {}) {
        return new Promise((resolve, reject) => {
            this.queue.push({ endpoint, params, resolve, reject });
            this.processQueue();
        });
    },


    /**
     * Process request queue
     */
    async processQueue() {
        if (this.processing || this.queue.length === 0) return;
        this.processing = true;

        const now = Date.now();
        const wait = Math.max(0, this.MIN_INTERVAL - (now - this.lastRequest));

        if (wait > 0) {
            await new Promise(r => setTimeout(r, wait));
        }

        const { endpoint, params, resolve, reject } = this.queue.shift();
        this.lastRequest = Date.now();

        try {
            const url = new URL(this.BASE_URL + endpoint);
            url.searchParams.append('api_key', this.API_KEY);
            url.searchParams.append('language', State.get('language'));

            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, value);
                }
            });

            const response = await fetch(url.toString(), {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 429) {
                    // Rate limited - retry after delay
                    this.queue.unshift({ endpoint, params, resolve, reject });
                    await new Promise(r => setTimeout(r, 1000));
                    this.processing = false;
                    this.processQueue();
                    return;
                }
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            resolve(data);
        } catch (error) {
            console.error('API Error:', error);
            reject(error);
        } finally {
            this.processing = false;
            this.processQueue();
        }
    },

    // ==================== MOVIES ====================

    /**
     * Get trending movies
     */
    async getTrendingMovies(timeWindow = 'week', page = 1) {
        return this.request(`/trending/movie/${timeWindow}`, { page });
    },

    /**
     * Get popular movies
     */
    async getPopularMovies(page = 1) {
        return this.request('/movie/popular', { page, region: State.get('region') });
    },

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page = 1) {
        return this.request('/movie/top_rated', { page, region: State.get('region') });
    },

    /**
     * Get now playing movies
     */
    async getNowPlaying(page = 1) {
        return this.request('/movie/now_playing', { page, region: State.get('region') });
    },

    /**
     * Get upcoming movies
     */
    async getUpcoming(page = 1) {
        return this.request('/movie/upcoming', { page, region: State.get('region') });
    },

    /**
     * Get movie details
     */
    async getMovieDetails(movieId) {
        return this.request(`/movie/${movieId}`, {
            append_to_response: 'credits,videos,similar,recommendations,release_dates'
        });
    },

    /**
     * Get movie videos
     */
    async getMovieVideos(movieId) {
        return this.request(`/movie/${movieId}/videos`);
    },

    /**
     * Get movie credits
     */
    async getMovieCredits(movieId) {
        return this.request(`/movie/${movieId}/credits`);
    },

    /**
     * Get similar movies
     */
    async getSimilarMovies(movieId, page = 1) {
        return this.request(`/movie/${movieId}/similar`, { page });
    },

    /**
     * Get movie recommendations
     */
    async getMovieRecommendations(movieId, page = 1) {
        return this.request(`/movie/${movieId}/recommendations`, { page });
    },

    // ==================== TV SHOWS ====================

    /**
     * Get trending TV shows
     */
    async getTrendingTV(timeWindow = 'week', page = 1) {
        return this.request(`/trending/tv/${timeWindow}`, { page });
    },

    /**
     * Get popular TV shows
     */
    async getPopularTV(page = 1) {
        return this.request('/tv/popular', { page });
    },

    /**
     * Get top rated TV shows
     */
    async getTopRatedTV(page = 1) {
        return this.request('/tv/top_rated', { page });
    },

    /**
     * Get TV show details
     */
    async getTVDetails(tvId) {
        return this.request(`/tv/${tvId}`, {
            append_to_response: 'credits,videos,similar,recommendations,content_ratings'
        });
    },

    /**
     * Get TV show videos
     */
    async getTVVideos(tvId) {
        return this.request(`/tv/${tvId}/videos`);
    },

    /**
     * Get TV season details
     */
    async getSeasonDetails(tvId, seasonNumber) {
        return this.request(`/tv/${tvId}/season/${seasonNumber}`);
    },

    /**
     * Get TV episode details
     */
    async getEpisodeDetails(tvId, seasonNumber, episodeNumber) {
        return this.request(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
    },

    // ==================== SEARCH ====================

    /**
     * Search movies and TV shows
     */
    async searchMulti(query, page = 1) {
        return this.request('/search/multi', { query, page, include_adult: false });
    },

    /**
     * Search movies
     */
    async searchMovies(query, page = 1) {
        return this.request('/search/movie', { query, page, include_adult: false });
    },

    /**
     * Search TV shows
     */
    async searchTV(query, page = 1) {
        return this.request('/search/tv', { query, page, include_adult: false });
    },

    /**
     * Search people
     */
    async searchPeople(query, page = 1) {
        return this.request('/search/person', { query, page });
    },

    // ==================== DISCOVER ====================

    /**
     * Discover movies with filters
     */
    async discoverMovies(params = {}) {
        const defaults = {
            sort_by: 'popularity.desc',
            include_adult: false,
            include_video: false,
            page: 1,
            region: State.get('region'),
            'vote_count.gte': 10
        };
        return this.request('/discover/movie', { ...defaults, ...params });
    },

    /**
     * Discover TV shows with filters
     */
    async discoverTV(params = {}) {
        const defaults = {
            sort_by: 'popularity.desc',
            include_adult: false,
            page: 1,
            'vote_count.gte': 10
        };
        return this.request('/discover/tv', { ...defaults, ...params });
    },

    // ==================== GENRES ====================

    /**
     * Get movie genres
     */
    async getMovieGenres() {
        return this.request('/genre/movie/list');
    },

    /**
     * Get TV genres
     */
    async getTVGenres() {
        return this.request('/genre/tv/list');
    },

    /**
     * Get movies by genre
     */
    async getMoviesByGenre(genreId, page = 1) {
        return this.discoverMovies({ with_genres: genreId, page });
    },

    /**
     * Get TV shows by genre
     */
    async getTVByGenre(genreId, page = 1) {
        return this.discoverTV({ with_genres: genreId, page });
    },

    // ==================== PERSON ====================

    /**
     * Get person details
     */
    async getPersonDetails(personId) {
        return this.request(`/person/${personId}`, {
            append_to_response: 'movie_credits,tv_credits,images'
        });
    },

    // ==================== CONFIGURATION ====================

    /**
     * Get API configuration
     */
    async getConfiguration() {
        return this.request('/configuration');
    },

    /**
     * Get available languages
     */
    async getLanguages() {
        return this.request('/configuration/languages');
    },

    /**
     * Get available countries
     */
    async getCountries() {
        return this.request('/configuration/countries');
    },

    // ==================== BATCH OPERATIONS ====================

    /**
     * Fetch multiple endpoints in parallel
     */
    async batch(requests) {
        const results = await Promise.allSettled(
            requests.map(req => {
                if (typeof req === 'string') {
                    return this.request(req);
                }
                return this.request(req.endpoint, req.params);
            })
        );
        return results.map(r => r.status === 'fulfilled' ? r.value : null);
    },

    /**
     * Get featured content for hero
     */
    async getFeaturedContent() {
        const [trending, popular] = await this.batch([
            { endpoint: '/trending/movie/week', params: { page: 1 } },
            { endpoint: '/movie/popular', params: { page: 1, region: State.get('region') } }
        ]);

        const movies = [];
        if (trending?.results) movies.push(...trending.results.slice(0, 3));
        if (popular?.results) {
            const unique = popular.results.filter(p => !movies.find(m => m.id === p.id));
            movies.push(...unique.slice(0, 2));
        }
        return movies.slice(0, 5);
    },

    /**
     * Get home page data
     */
    async getHomeData() {
        const [trending, popular, topRated, nowPlaying] = await this.batch([
            { endpoint: '/trending/movie/week', params: { page: 1 } },
            { endpoint: '/movie/popular', params: { page: 1, region: State.get('region') } },
            { endpoint: '/movie/top_rated', params: { page: 1, region: State.get('region') } },
            { endpoint: '/movie/now_playing', params: { page: 1, region: State.get('region') } }
        ]);

        return {
            trending: trending?.results?.slice(0, 10) || [],
            popular: popular?.results?.slice(0, 10) || [],
            topRated: topRated?.results?.slice(0, 10) || [],
            nowPlaying: nowPlaying?.results?.slice(0, 10) || []
        };
    }
};

// Expose globally
window.API = API;
