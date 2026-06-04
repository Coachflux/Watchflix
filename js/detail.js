/**
 * CINEFLIX — Detail Page
 * Movie/TV show details with cast, similar, and actions
 */

const Detail = {
  async render(id, type = 'movie') {
    const main = document.getElementById('mainContent');
    main.innerHTML = `
      <div class="detail-page">
        <div class="detail-hero">
          <div class="skeleton" style="position:absolute;inset:0"></div>
        </div>
        <div class="detail-content">
          <div class="detail-poster-row">
            <div class="detail-poster"><div class="skeleton" style="width:100%;height:100%"></div></div>
            <div class="detail-meta">
              <div class="skeleton" style="width:80%;height:28px;margin-bottom:8px"></div>
              <div class="skeleton" style="width:50%;height:16px"></div>
            </div>
          </div>
        </div>
      </div>
    `;

    try {
      let data;
      if (type === 'movie') {
        data = await API.movieDetails(id);
      } else {
        data = await API.tvDetails(id);
      }
      this.renderContent(data, type);
      State.addToHistory({
        id: data.id,
        title: data.title || data.name,
        poster_path: data.poster_path,
        type,
        genre_ids: data.genres?.map(g => g.id) || []
      });
    } catch (err) {
      console.error('Detail error:', err);
      // Fallback to demo data
      const demo = API.getDemoMovies().find(m => m.id == id) || API.getDemoMovies()[0];
      this.renderContent(demo, 'movie');
    }
  },

  renderContent(data, type) {
    const main = document.getElementById('mainContent');
    const backdrop = API.backdrop(data.backdrop_path, 'w780');
    const poster = API.poster(data.poster_path, 'w342');
    const title = data.title || data.name || 'Untitled';
    const rating = Utils.formatRating(data.vote_average);
    const year = (data.release_date || data.first_air_date || '').split('-')[0];
    const runtime = data.runtime ? Utils.formatRuntime(data.runtime) : (data.episode_run_time?.[0] ? `${data.episode_run_time[0]}m` : '');
    const genres = data.genres || [];
    const cast = data.credits?.cast?.slice(0, 10) || [];
    const similar = data.similar?.results?.slice(0, 6) || data.recommendations?.results?.slice(0, 6) || [];
    const isWatchlisted = State.isInWatchlist(data.id);

    const overview = data.overview || '';

    main.innerHTML = `
      <div class="detail-page">
        <div class="detail-hero">
          <img src="${backdrop}" alt="${title}" loading="eager">
          <div class="gradient"></div>
        </div>
        <div class="detail-content">
          <div class="detail-poster-row">
            <div class="detail-poster">
              <img src="${poster}" alt="${title}" loading="eager">
            </div>
            <div class="detail-meta">
              <h1 class="detail-title">${title}</h1>
              <div class="detail-tags">
                ${year ? `<span class="tag">${year}</span>` : ''}
                ${runtime ? `<span class="tag">${runtime}</span>` : ''}
                ${genres.slice(0, 2).map(g => `<span class="tag">${g.name}</span>`).join('')}
              </div>
              <div class="detail-rating">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>${rating}</span>
                <span style="color:var(--text-tertiary)">• ${Utils.formatNumber(data.vote_count)} votes</span>
              </div>
            </div>
          </div>

          <div class="detail-actions">
            <button class="btn btn-primary" onclick="Utils.toast('Starting playback...', 'info')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${Utils.t('playNow')}
            </button>
            <button class="btn btn-secondary" onclick="State.toggleWatchlist({id:${data.id},title:'${title.replace(/'/g,"\'")}',poster:'${data.poster_path||''}',type:'${type}'});this.innerHTML=State.isInWatchlist(${data.id})?'✓ In List':'+ ${Utils.t('myList')}'">
              ${isWatchlisted ? '✓ In List' : `+ ${Utils.t('myList')}`}
            </button>
            <button class="btn btn-secondary" onclick="Utils.share({title:'${title.replace(/'/g,"\'")}',url:location.href})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>

          <div class="detail-section">
            <h3>Storyline</h3>
            <p>${overview}</p>
          </div>

          ${cast.length > 0 ? `
            <div class="detail-section">
              <h3>Cast</h3>
              <div class="cast-grid">
                ${cast.map(c => `
                  <div class="cast-card">
                    <img src="${API.profile(c.profile_path)}" alt="${c.name}" loading="lazy">
                    <div class="name">${c.name}</div>
                    <div class="role">${c.character}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${similar.length > 0 ? `
            <div class="detail-section">
              <h3>More Like This</h3>
              <div class="scroll-row">
                ${similar.map(m => Components.movieCard(m)).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
};
