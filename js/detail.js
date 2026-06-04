/**
 * CINEFLIX - Detail Page (Movie/TV Show)
 */

const Detail = {
    /**
     * Render detail page
     */
    async render(container, id, mediaType = 'movie') {
        container.innerHTML = `
            <div class="page" id="detailPage">
                <div class="detail-hero">
                    <div class="detail-hero-bg skeleton"></div>
                </div>
                <div class="detail-content">
                    <div class="detail-poster-row">
                        <div class="detail-poster skeleton"></div>
                        <div class="detail-info" style="padding-top:20px;">
                            <div class="skeleton" style="height:32px;width:70%;margin-bottom:12px;"></div>
                            <div class="skeleton" style="height:16px;width:50%;margin-bottom:20px;"></div>
                            <div class="skeleton" style="height:48px;width:200px;margin-bottom:20px;"></div>
                            <div class="skeleton" style="height:80px;width:100%;"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        try {
            const data = mediaType === 'movie' 
                ? await API.getMovieDetails(id)
                : await API.getTVDetails(id);

            if (!data || data.success === false) {
                throw new Error('Content not found');
            }

            this.renderDetail(container, data, mediaType);

        } catch (error) {
            console.error('Detail render error:', error);
            container.innerHTML = `
                <div class="page" id="detailPage">
                    ${Components.emptyState(
                        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
                        'Content not found',
                        'The movie or TV show you're looking for doesn't exist or has been removed.'
                    )}
                </div>
            `;
        }
    },

    /**
     * Render full detail view
     */
    renderDetail(container, data, mediaType) {
        const title = data.title || data.name || 'Untitled';
        const backdrop = data.backdrop_path;
        const poster = data.poster_path;
        const overview = data.overview || 'No overview available.';
        const runtime = data.runtime || (data.episode_run_time?.[0]) || 0;
        const releaseDate = data.release_date || data.first_air_date;
        const year = releaseDate ? Utils.formatYear(releaseDate) : '';
        const rating = data.vote_average ? data.vote_average.toFixed(1) : '0.0';
        const voteCount = data.vote_count || 0;
        const genres = data.genres || [];
        const cast = data.credits?.cast?.slice(0, 10) || [];
        const crew = data.credits?.crew || [];
        const director = crew.find(c => c.job === 'Director')?.name || '';
        const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        const similar = data.similar?.results?.slice(0, 10) || [];
        const recommendations = data.recommendations?.results?.slice(0, 10) || [];

        const isInWatchlist = State.isInWatchlist(data.id, mediaType);
        const status = data.status || '';
        const budget = data.budget;
        const revenue = data.revenue;

        // Certification
        let certification = '';
        if (mediaType === 'movie' && data.release_dates?.results) {
            const usRelease = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
            if (usRelease?.release_dates?.[0]) {
                certification = usRelease.release_dates[0].certification;
            }
        } else if (mediaType === 'tv' && data.content_ratings?.results) {
            const usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
            certification = usRating?.rating || '';
        }

        container.innerHTML = `
            <div class="page" id="detailPage">
                <div class="detail-hero">
                    <div class="detail-hero-bg" style="background-image: url('${Utils.getBackdropUrl(backdrop, 'original')}')"></div>
                </div>

                <div class="detail-content">
                    <div class="detail-poster-row">
                        <div class="detail-poster">
                            <img src="${Utils.getImageUrl(poster, 'w500')}" 
                                 alt="${Utils.escapeHtml(title)}"
                                 onerror="this.src='assets/placeholder.webp'">
                        </div>
                        <div class="detail-info">
                            <h1 class="detail-title">${Utils.escapeHtml(title)}</h1>
                            <div class="detail-meta">
                                ${year ? `<span>${year}</span>` : ''}
                                ${runtime ? `<span>${Utils.formatRuntime(runtime)}</span>` : ''}
                                ${certification ? `<span>${certification}</span>` : ''}
                                <span class="rating-badge">
                                    <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    ${rating}
                                </span>
                                <span>(${Utils.formatNumber(voteCount)} votes)</span>
                            </div>

                            <div class="detail-actions">
                                <button class="btn-primary" onclick="Components.playContent(${data.id}, '${mediaType}', '${Utils.escapeHtml(title).replace(/'/g, "\'")}')">
                                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    Watch Now
                                </button>
                                <button class="btn-secondary" data-watchlist-btn data-id="${data.id}" data-type="${mediaType}"
                                        onclick="Components.toggleWatchlist(${data.id}, '${mediaType}', '${Utils.escapeHtml(title).replace(/'/g, "\'")}', '${poster || ''}')">
                                    ${isInWatchlist ? `
                                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> In My List
                                    ` : `
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> My List
                                    `}
                                </button>
                                <button class="btn-secondary" onclick="Components.shareContent(${data.id}, '${mediaType}', '${Utils.escapeHtml(title).replace(/'/g, "\'")}')">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="detail-overview">${Utils.escapeHtml(overview)}</div>

                    ${genres.length ? `
                        <div class="detail-section">
                            <h3>Genres</h3>
                            <div class="genre-tags">
                                ${genres.map(g => Components.genreTag(g)).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${cast.length ? `
                        <div class="detail-section">
                            <h3>Cast</h3>
                            <div class="cast-grid">
                                ${cast.map(c => Components.castCard(c)).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${director ? `
                        <div class="detail-section">
                            <h3>Director</h3>
                            <p style="color:var(--text-secondary);font-size:0.9375rem;">${Utils.escapeHtml(director)}</p>
                        </div>
                    ` : ''}

                    ${trailer ? `
                        <div class="detail-section">
                            <h3>Trailer</h3>
                            <div style="position:relative;padding-bottom:56.25%;border-radius:var(--radius-lg);overflow:hidden;background:#000;">
                                <iframe src="https://www.youtube.com/embed/${trailer.key}" 
                                        style="position:absolute;inset:0;width:100%;height:100%;"
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen></iframe>
                            </div>
                        </div>
                    ` : ''}

                    ${similar.length ? `
                        <div class="detail-section">
                            <h3>Similar</h3>
                            <div class="horizontal-scroll">
                                ${similar.map(m => Components.movieCard({...m, media_type: mediaType})).join('')}
                            </div>
                        </div>
                    ` : ''}

                    ${recommendations.length ? `
                        <div class="detail-section">
                            <h3>Recommended</h3>
                            <div class="horizontal-scroll">
                                ${recommendations.map(m => Components.movieCard({...m, media_type: mediaType})).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <div style="height:40px;"></div>
                </div>
            </div>
        `;

        Utils.lazyLoadImages(container);
    }
};

// Expose globally
window.Detail = Detail;
