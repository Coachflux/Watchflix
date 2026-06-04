/**
 * CINEFLIX — Reusable Components
 * Shared UI building blocks used across all pages
 */

const Components = {
  // ── Hero Banner ──
  heroBanner(movie, index = 0, total = 1) {
    const poster = API.backdrop(movie.backdrop_path || movie.poster_path, 'w780');
    return `
      <div class="hero-banner fade-in" data-index="${index}">
        <img src="${poster}" alt="${movie.title || movie.name}" loading="eager">
        <div class="hero-overlay">
          <span class="hero-badge">★ ${Utils.t('trending')}</span>
          <div class="hero-title">${(movie.title || movie.name || '').toUpperCase()}</div>
          <div class="hero-subtitle">${movie.release_date ? movie.release_date.split('-')[0] : ''}</div>
          <p class="hero-desc">${movie.overview || ''}</p>
          <div class="hero-actions">
            <button class="btn btn-primary" onclick="Router.go('/movie/${movie.id}')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              ${Utils.t('playNow')}
            </button>
            <button class="btn btn-secondary" onclick="State.toggleWatchlist({id:${movie.id},title:'${(movie.title||movie.name||'').replace(/'/g,"\'")}',poster:'${movie.poster_path||''}',type:'movie'})">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              ${Utils.t('myList')}
            </button>
          </div>
        </div>
        ${total > 1 ? `<div class="hero-dots">${Array.from({length:total},(_,i)=>`<div class="hero-dot ${i===index?'active':''}" data-index="${i}"></div>`).join('')}</div>` : ''}
      </div>
    `;
  },

  // ── Movie Card ──
  movieCard(movie) {
    const poster = API.poster(movie.poster_path, 'w342');
    const rating = Utils.formatRating(movie.vote_average);
    const title = movie.title || movie.name || 'Untitled';
    return `
      <div class="movie-card" onclick="Router.go('/movie/${movie.id}')">
        <img class="poster" src="${poster}" alt="${title}" loading="lazy">
        <div class="rating-badge">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          ${rating}
        </div>
        <div class="card-title">${title}</div>
      </div>
    `;
  },

  // ── Continue Watching Card ──
  continueCard(item) {
    const poster = API.poster(item.poster_path, 'w342');
    const progress = item.progress || 0;
    const genres = (item.genre_ids || []).map(id => {
      const g = API._genres?.find(g => g.id === id);
      return g ? g.name : '';
    }).filter(Boolean).join(', ');
    return `
      <div class="continue-card" onclick="Router.go('/movie/${item.id}')">
        <div class="thumb">
          <img src="${poster}" alt="${item.title || item.name}" loading="lazy">
          <div class="play-overlay">
            <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        <div class="info">
          <div class="info-title">${item.title || item.name || 'Untitled'}</div>
          <div class="info-meta">${Utils.formatRuntime(item.runtime)} • ${genres}</div>
          <div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div>
          <div class="progress-text">${progress}%</div>
        </div>
        <button class="btn-icon more-btn" onclick="event.stopPropagation(); Components.showMore(${item.id})">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
        </button>
      </div>
    `;
  },

  // ── Section Header ──
  sectionHeader(title, link = null, linkText = null) {
    return `
      <div class="section-header">
        <h2 class="section-title">${title}</h2>
        ${link ? `<a href="${link}" class="section-link">${linkText || Utils.t('seeAll')} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>` : ''}
      </div>
    `;
  },

  // ── Horizontal Scroll Row ──
  scrollRow(items, renderer = 'movieCard') {
    const cards = items.map(item => this[renderer](item)).join('');
    return `<div class="scroll-row">${cards}</div>`;
  },

  // ── Category Tabs ──
  categoryTabs() {
    const tabs = [
      { icon: 'film', label: Utils.t('movies'), route: '/movies' },
      { icon: 'tv', label: Utils.t('tvShows'), route: '/tv' },
      { icon: 'grid', label: Utils.t('genres'), route: '/genres' },
      { icon: 'bookmark', label: Utils.t('watchlist'), route: '/watchlist' }
    ];
    const icons = {
      film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>',
      tv: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>',
      grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
      bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
    };
    return `
      <div class="category-tabs">
        ${tabs.map(t => `
          <a href="${t.route}" class="category-tab" data-route="${t.route.replace('/','')}">
            ${icons[t.icon]}
            <span>${t.label}</span>
          </a>
        `).join('')}
      </div>
    `;
  },

  // ── Skeleton Loaders ──
  skeletonHero() {
    return `<div class="hero-banner" style="background:var(--bg-secondary)"><div class="skeleton" style="position:absolute;inset:0"></div></div>`;
  },

  skeletonCard() {
    return `<div class="movie-card"><div class="skeleton" style="width:100%;aspect-ratio:2/3"></div><div class="skeleton" style="width:80%;height:14px;margin:8px auto"></div></div>`;
  },

  skeletonContinue() {
    return `<div class="continue-card"><div class="skeleton" style="width:120px;height:72px;border-radius:8px"></div><div style="flex:1"><div class="skeleton" style="width:60%;height:16px;margin-bottom:8px"></div><div class="skeleton" style="width:40%;height:12px;margin-bottom:8px"></div><div class="skeleton" style="width:100%;height:4px"></div></div></div>`;
  },

  // ── Empty State ──
  emptyState(title, message, icon = 'search') {
    const icons = {
      search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
      film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
      heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
    };
    return `
      <div class="empty-state">
        ${icons[icon] || icons.search}
        <h3>${title}</h3>
        <p>${message}</p>
      </div>
    `;
  },

  // ── Bottom Sheet for "More" options ──
  showMore(id) {
    const isWatchlisted = State.isInWatchlist(id);
    const sheet = document.createElement('div');
    sheet.innerHTML = `
      <div class="modal-overlay open" id="moreOverlay"></div>
      <div class="bottom-sheet open" id="moreSheet">
        <div class="sheet-handle"></div>
        <div class="sheet-body">
          <button class="btn btn-secondary" style="width:100%;margin-bottom:0.5rem" onclick="State.toggleWatchlist({id:${id}});Components.closeSheet()">
            ${isWatchlisted ? '− Remove from Watchlist' : '+ Add to Watchlist'}
          </button>
          <button class="btn btn-secondary" style="width:100%;margin-bottom:0.5rem" onclick="Utils.share({url:location.href});Components.closeSheet()">
            ↗ Share
          </button>
          <button class="btn btn-ghost" style="width:100%" onclick="Components.closeSheet()">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(sheet);
    document.getElementById('moreOverlay').addEventListener('click', () => this.closeSheet());
  },

  closeSheet() {
    const overlay = document.getElementById('moreOverlay');
    const sheet = document.getElementById('moreSheet');
    if (overlay) overlay.classList.remove('open');
    if (sheet) sheet.classList.remove('open');
    setTimeout(() => {
      overlay?.parentElement?.remove();
    }, 300);
  },

  // ── Genre Badge Map ──
  genreIcon(name) {
    const map = {
      'Action': '⚔️', 'Adventure': '🧭', 'Animation': '🎬', 'Comedy': '😂',
      'Crime': '🛡️', 'Documentary': '📹', 'Drama': '❤️', 'Family': '👨‍👩‍👧‍👦',
      'Fantasy': '✨', 'History': '🏛️', 'Horror': '👻', 'Music': '🎵',
      'Mystery': '🔍', 'Romance': '💕', 'Science Fiction': '🚀', 'TV Movie': '📺',
      'Thriller': '⚠️', 'War': '🏳️', 'Western': '🌵'
    };
    return map[name] || '🎬';
  }
};
