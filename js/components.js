/**
 * CINEFLIX - Reusable UI Components
 */

const Components = {
    /**
     * Movie card component
     */
    movieCard(movie, options = {}) {
        const { large = false, wide = false, showRating = true } = options;
        const posterPath = movie.poster_path || movie.backdrop_path;
        const title = movie.title || movie.name || 'Untitled';
        const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
        const year = movie.release_date || movie.first_air_date 
            ? Utils.formatYear(movie.release_date || movie.first_air_date) 
            : '';
        const mediaType = movie.media_type || 'movie';

        const sizeClass = large ? 'large' : wide ? 'wide' : '';
        const imgSize = wide ? 'w780' : 'w500';

        return `
            <div class="movie-card ${sizeClass}" 
                 data-id="${movie.id}" 
                 data-type="${mediaType}"
                 onclick="Router.navigate('detail', ${movie.id}, '${mediaType}')">
                <div class="poster">
                    <img src="${Utils.getImageUrl(posterPath, imgSize)}" 
                         alt="${Utils.escapeHtml(title)}"
                         loading="lazy"
                         onerror="this.src='assets/placeholder.webp'">
                    ${showRating ? `
                        <div class="rating">
                            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ${rating}
                        </div>
                    ` : ''}
                </div>
                <div class="movie-title">${Utils.escapeHtml(title)}</div>
                ${year ? `<div class="movie-meta">${year}</div>` : ''}
            </div>
        `;
    },

    /**
     * Horizontal scroll row component
     */
    scrollRow(title, movies, options = {}) {
        if (!movies || movies.length === 0) return '';

        const { seeAllLink = null, cardOptions = {} } = options;
        const cards = movies.map(m => this.movieCard(m, cardOptions)).join('');

        return `
            <div class="section-header">
                <h2 class="section-title">${Utils.escapeHtml(title)}</h2>
                ${seeAllLink ? `
                    <a href="${seeAllLink}" class="see-all">
                        See All
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </a>
                ` : ''}
            </div>
            <div class="horizontal-scroll">
                ${cards}
            </div>
        `;
    },

    /**
     * Continue watching card
     */
    continueCard(item) {
        const title = item.title || item.name || 'Untitled';
        const posterPath = item.poster_path || item.backdrop_path;
        const runtime = item.runtime ? Utils.formatRuntime(item.runtime) : 
                       item.episode_run_time?.[0] ? Utils.formatRuntime(item.episode_run_time[0]) : '';
        const genres = item.genres?.map(g => g.name).slice(0, 2).join(', ') || 
                      item.genre_ids?.map(id => {
                          const genre = State.get('genres').movie?.find(g => g.id === id) ||
                                       State.get('genres').tv?.find(g => g.id === id);
                          return genre?.name;
                      }).filter(Boolean).slice(0, 2).join(', ') || '';
        const progress = item.progress || 0;
        const mediaType = item.media_type || 'movie';

        return `
            <div class="continue-card" 
                 data-id="${item.id}" 
                 data-type="${mediaType}"
                 onclick="Components.playContent(${item.id}, '${mediaType}', '${Utils.escapeHtml(title)}')">
                <div class="poster">
                    <img src="${Utils.getImageUrl(posterPath, 'w300')}" 
                         alt="${Utils.escapeHtml(title)}"
                         loading="lazy"
                         onerror="this.src='assets/placeholder.webp'">
                    <div class="play-overlay">
                        <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                </div>
                <div class="info">
                    <h4>${Utils.escapeHtml(title)}</h4>
                    <div class="meta">${runtime}${runtime && genres ? ' • ' : ''}${genres}</div>
                    <div class="progress-bar">
                        <div class="fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">${progress}% completed</div>
                </div>
                <button class="more-btn" onclick="event.stopPropagation(); Components.showItemMenu(${item.id}, '${mediaType}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="5" r="1"></circle>
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                </button>
            </div>
        `;
    },

    /**
     * Hero slide component
     */
    heroSlide(movie, index, isActive) {
        const title = movie.title || movie.name || 'Untitled';
        const overview = movie.overview || '';
        const mediaType = movie.media_type || 'movie';

        return `
            <div class="hero-slide ${isActive ? 'active' : ''}" data-index="${index}">
                <div class="hero-bg" style="background-image: url('${Utils.getBackdropUrl(movie.backdrop_path, 'original')}')"></div>
                <div class="hero-content">
                    <span class="hero-badge">FEATURED</span>
                    <h1 class="hero-title">${Utils.escapeHtml(title).toUpperCase()}</h1>
                    <p class="hero-desc">${Utils.escapeHtml(Utils.truncate(overview, 120))}</p>
                    <div class="hero-actions">
                        <button class="btn-primary" onclick="event.stopPropagation(); Components.playContent(${movie.id}, '${mediaType}', '${Utils.escapeHtml(title)}')">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            Play Now
                        </button>
                        <button class="btn-secondary" onclick="event.stopPropagation(); Components.toggleWatchlist(${movie.id}, '${mediaType}', '${Utils.escapeHtml(title).replace(/'/g, "\'")}', '${movie.poster_path || ''}')">
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
    },

    /**
     * Hero carousel dots
     */
    heroDots(count, activeIndex) {
        return Array(count).fill(0).map((_, i) => `
            <button class="hero-dot ${i === activeIndex ? 'active' : ''}" 
                    data-index="${i}" 
                    onclick="Home.setHeroSlide(${i})"></button>
        `).join('');
    },

    /**
     * Category nav item
     */
    categoryItem(icon, label, href, isActive = false) {
        return `
            <a href="${href}" class="category-item ${isActive ? 'active' : ''}">
                ${icon}
                <span>${label}</span>
            </a>
        `;
    },

    /**
     * Cast card
     */
    castCard(person) {
        return `
            <div class="cast-card">
                <img src="${Utils.getProfileUrl(person.profile_path, 'w185')}" 
                     alt="${Utils.escapeHtml(person.name)}"
                     loading="lazy"
                     onerror="this.src='assets/placeholder.webp'">
                <div class="name">${Utils.escapeHtml(person.name)}</div>
                <div class="role">${Utils.escapeHtml(person.character || person.job || '')}</div>
            </div>
        `;
    },

    /**
     * Genre tag
     */
    genreTag(genre) {
        return `
            <span class="genre-tag" onclick="Router.navigate('discover', null, null, 'genre=${genre.id}')">
                ${Utils.escapeHtml(genre.name)}
            </span>
        `;
    },

    /**
     * Empty state
     */
    emptyState(icon, title, description) {
        return `
            <div class="empty-state">
                ${icon}
                <h3>${Utils.escapeHtml(title)}</h3>
                <p>${Utils.escapeHtml(description)}</p>
            </div>
        `;
    },

    /**
     * Play content in video modal
     */
    playContent(id, mediaType, title) {
        const videoModal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');
        const videoInfo = document.getElementById('videoInfo');

        // Use vidsrc embed for playback
        const embedUrl = Utils.getVideoUrl(id, mediaType);

        videoFrame.src = embedUrl;
        videoInfo.innerHTML = `
            <h3>${Utils.escapeHtml(title)}</h3>
            <p>Now Playing</p>
        `;

        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add to continue watching
        State.addToContinue({
            id,
            media_type: mediaType,
            title,
            poster_path: '',
            runtime: 0
        }, 0);
    },

    /**
     * Close video modal
     */
    closeVideo() {
        const videoModal = document.getElementById('videoModal');
        const videoFrame = document.getElementById('videoFrame');

        videoFrame.src = '';
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Toggle watchlist
     */
    toggleWatchlist(id, mediaType, title, posterPath) {
        const isAdded = State.isInWatchlist(id, mediaType);

        if (isAdded) {
            State.removeFromWatchlist(id, mediaType);
            Utils.showToast('Removed from My List', 'info');
        } else {
            State.addToWatchlist({
                id,
                media_type: mediaType,
                title,
                poster_path: posterPath,
                added_at: Date.now()
            });
            Utils.showToast('Added to My List', 'success');
        }

        // Update button if visible
        this.updateWatchlistButtons();
    },

    /**
     * Update all watchlist buttons
     */
    updateWatchlistButtons() {
        document.querySelectorAll('[data-watchlist-btn]').forEach(btn => {
            const id = parseInt(btn.dataset.id);
            const type = btn.dataset.type;
            const isAdded = State.isInWatchlist(id, type);
            btn.innerHTML = isAdded 
                ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Added`
                : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List`;
        });
    },

    /**
     * Show item context menu
     */
    showItemMenu(id, mediaType) {
        // Simple menu - could be expanded to a modal
        const isInList = State.isInWatchlist(id, mediaType);
        if (isInList) {
            State.removeFromWatchlist(id, mediaType);
            Utils.showToast('Removed from My List', 'info');
        } else {
            Utils.showToast('Options: Add to list, Share, Download', 'info');
        }
    },

    /**
     * Share content
     */
    async shareContent(id, mediaType, title) {
        const url = Utils.getShareUrl(mediaType, id);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Check out ${title} on Cineflix`,
                    url: url
                });
            } catch (err) {
                // User cancelled
            }
        } else {
            await Utils.copyToClipboard(url);
            Utils.showToast('Link copied to clipboard', 'success');
        }
    },

    /**
     * Download content (simulated)
     */
    downloadContent(id, mediaType, title, posterPath) {
        const added = State.addDownload({
            id,
            media_type: mediaType,
            title,
            poster_path: posterPath,
            size: '1.2 GB',
            status: 'downloading'
        });

        if (added) {
            Utils.showToast('Download started', 'success');
            // Simulate download progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    State.updateDownload(id, { progress: 100, status: 'completed' });
                    clearInterval(interval);
                } else {
                    State.updateDownload(id, { progress: Math.round(progress) });
                }
            }, 2000);
        } else {
            Utils.showToast('Already in downloads', 'info');
        }
    }
};

// Expose globally
window.Components = Components;
