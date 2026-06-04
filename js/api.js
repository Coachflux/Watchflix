/**
 * CINEFLIX — API Layer
 * TMDb integration with caching, fallback data, and offline support
 */

const API = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE: 'https://image.tmdb.org/t/p',
  // Demo key for development — replace with your own for production
  KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1YjBlMWRjM2E3YmY4ZGRkY2Y0ZjA2YzE1NzFjOTc2ZSIsInN1YiI6IjY1YjBlMWRjM2E3YmY4ZGRkY2Y0ZjA2YzE1NzFjOTc2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.demo',

  // In-memory cache
  _cache: new Map(),
  _cacheExpiry: 5 * 60 * 1000, // 5 minutes

  async fetch(endpoint, options = {}) {
    const cacheKey = `${endpoint}${JSON.stringify(options)}`;
    const cached = this._cache.get(cacheKey);
    if (cached && Date.now() - cached.ts < this._cacheExpiry) {
      return cached.data;
    }

    try {
      const url = `${this.BASE_URL}${endpoint}?api_key=${this.KEY}&language=${State.get('language') || 'en-US'}${options.params || ''}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this._cache.set(cacheKey, { data, ts: Date.now() });
      return data;
    } catch (err) {
      console.warn('API fetch failed:', err);
      // Return cached data even if expired, or fallback
      if (cached) return cached.data;
      throw err;
    }
  },

  // Image URLs
  poster(path, size = 'w342') {
    return path ? `${this.IMAGE_BASE}/${size}${path}` : 'assets/placeholder.webp';
  },
  backdrop(path, size = 'w780') {
    return path ? `${this.IMAGE_BASE}/${size}${path}` : 'assets/placeholder.webp';
  },
  profile(path, size = 'w185') {
    return path ? `${this.IMAGE_BASE}/${size}${path}` : 'assets/placeholder.webp';
  },

  // Endpoints
  async trending(timeWindow = 'day', page = 1) {
    return this.fetch(`/trending/all/${timeWindow}`, { params: `&page=${page}` });
  },

  async nowPlaying(page = 1) {
    return this.fetch('/movie/now_playing', { params: `&page=${page}` });
  },

  async popularMovies(page = 1) {
    return this.fetch('/movie/popular', { params: `&page=${page}` });
  },

  async topRated(page = 1) {
    return this.fetch('/movie/top_rated', { params: `&page=${page}` });
  },

  async upcoming(page = 1) {
    return this.fetch('/movie/upcoming', { params: `&page=${page}` });
  },

  async movieDetails(id) {
    return this.fetch(`/movie/${id}`, { params: '&append_to_response=credits,videos,similar,recommendations' });
  },

  async tvDetails(id) {
    return this.fetch(`/tv/${id}`, { params: '&append_to_response=credits,videos,similar,recommendations' });
  },

  async search(query, page = 1) {
    return this.fetch('/search/multi', { params: `&query=${encodeURIComponent(query)}&page=${page}` });
  },

  async discoverMovies(filters = {}, page = 1) {
    const params = new URLSearchParams({ page: String(page), ...filters });
    return this.fetch('/discover/movie', { params: '&' + params.toString() });
  },

  async genreMovies(genreId, page = 1) {
    return this.discoverMovies({ with_genres: String(genreId) }, page);
  },

  async genres() {
    const data = await this.fetch('/genre/movie/list');
    return data.genres || [];
  },

  // Fallback demo data for offline / no API key
  getDemoMovies() {
    return [
      { id: 1, title: 'Dune: Part Two', poster_path: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', backdrop_path: '/xOMo8BRK7PfcJv9JCnx7s5hjhGP.jpg', vote_average: 8.2, overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', release_date: '2024-02-27', genre_ids: [28, 12, 878], runtime: 166 },
      { id: 2, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdrop_path: '/fm6KqXpk3MUsHVluTP9Fn7g3sAD.jpg', vote_average: 8.6, overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', release_date: '2023-07-19', genre_ids: [18, 36], runtime: 180 },
      { id: 3, title: 'Godzilla Minus One', poster_path: '/hkxxMZG97C6B4OqMJX1pD8f9PhY.jpg', backdrop_path: '/vIgyYk8KGx1xJ9H3g6Y6Z6Q6Z6Q.jpg', vote_average: 7.8, overview: 'Post-war Japan is at its lowest point when a new crisis emerges in the form of a giant monster.', release_date: '2023-11-03', genre_ids: [28, 878, 27], runtime: 125 },
      { id: 4, title: 'The Batman', poster_path: '/74xTEgtD4bXvHshBqQq3h7j7j7j.jpg', backdrop_path: '/5P8SmMzSNYkQJ3T3zZ7z7z7z7z7.jpg', vote_average: 8.2, overview: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate.', release_date: '2022-03-01', genre_ids: [80, 28, 53], runtime: 176 },
      { id: 5, title: 'John Wick: Chapter 4', poster_path: '/vZloFAK7NmvMGK7BgKrfV4s3z3z.jpg', backdrop_path: '/h8gHED7W4s3d7z7z7z7z7z7z7z7.jpg', vote_average: 7.8, overview: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, he must face a new enemy.', release_date: '2023-03-22', genre_ids: [28, 80, 53], runtime: 169 },
      { id: 6, title: 'Interstellar', poster_path: '/gEU2QniL6E86tG9h9i1D7z7z7z7.jpg', backdrop_path: '/xJH7l7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 8.7, overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.', release_date: '2014-11-05', genre_ids: [12, 18, 878], runtime: 169 },
      { id: 7, title: 'Inception', poster_path: '/9gk7ad7z7z7z7z7z7z7z7z7z7.jpg', backdrop_path: '/s3TBrRGB1iav7gFOCNx7H31MV7V.jpg', vote_average: 8.4, overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task.', release_date: '2010-07-15', genre_ids: [28, 12, 878], runtime: 148 },
      { id: 8, title: 'The Dark Knight', poster_path: '/qJ2tWqW7z7z7z7z7z7z7z7z7z7.jpg', backdrop_path: '/nMKdUUepR0i5zn0y1T4z7z7z7z7.jpg', vote_average: 9.0, overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', release_date: '2008-07-16', genre_ids: [18, 28, 80, 53], runtime: 152 },
      { id: 9, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', backdrop_path: '/suaEOtk1N1sgg2N7z7z7z7z7z7.jpg', vote_average: 8.5, overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales.', release_date: '1994-10-14', genre_ids: [53, 80], runtime: 154 },
      { id: 10, title: 'The Matrix', poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', backdrop_path: '/ncE7z7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 8.2, overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.', release_date: '1999-03-31', genre_ids: [28, 878], runtime: 136 },
      { id: 11, title: 'Parasite', poster_path: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', backdrop_path: '/ApiBzeaa9t7z7z7z7z7z7z7z7.jpg', vote_average: 8.5, overview: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.', release_date: '2019-05-30', genre_ids: [35, 53, 18], runtime: 132 },
      { id: 12, title: 'Spider-Man: Across the Spider-Verse', poster_path: '/8Vt6mWEReuy4Of61Lnj5Xj7z7z7.jpg', backdrop_path: '/4H7z7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 8.4, overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its existence.', release_date: '2023-06-02', genre_ids: [28, 12, 16, 878], runtime: 140 }
    ];
  },

  getDemoTV() {
    return [
      { id: 101, name: 'Breaking Bad', poster_path: '/z7z7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 9.5, first_air_date: '2008-01-20', genre_ids: [18, 80], overview: 'A high school chemistry teacher turned methamphetamine manufacturer.' },
      { id: 102, name: 'Stranger Things', poster_path: '/z7z7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 8.7, first_air_date: '2016-07-15', genre_ids: [18, 9648, 10765], overview: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.' },
      { id: 103, name: 'The Last of Us', poster_path: '/z7z7z7z7z7z7z7z7z7z7z7z7.jpg', vote_average: 8.8, first_air_date: '2023-01-15', genre_ids: [18, 10765], overview: 'Joel and Ellie, a pair connected through the harshness of the world they live in, are forced to endure brutal circumstances.' }
    ];
  }
};
