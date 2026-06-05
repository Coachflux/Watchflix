/**
 * CINEFLIX - Library / Watchlist / Continue Watching Page
 */

const Library = {
    currentTab: 'watchlist',

    /**
     * Render library page
     */
    render(container, params = {}) {
        this.currentTab = params.tab || 'watchlist';

        container.innerHTML = `
            <div class="page" id="libraryPage">
                <div class="library-tabs">
                    <button class="library-tab ${this.currentTab === 'watchlist' ? 'active' : ''}" data-tab="watchlist">My List</button>
                    <button class="library-tab ${this.currentTab === 'continue' ? 'active' : ''}" data-tab="continue">Continue</button>
                    <button class="library-tab ${this.currentTab === 'downloads' ? 'active' : ''}" data-tab="downloads">Downloads</button>
                </div>
                <div id="libraryContent"></div>
            </div>
        `;

        this.bindEvents(container);
        this.renderContent();
    },

    /**
     * Bind tab events
     */
    bindEvents(container) {
        container.addEventListener('click', (e) => {
            const tab = e.target.closest('.library-tab');
            if (!tab) return;

            const tabName = tab.dataset.tab;
            if (tabName && tabName !== this.currentTab) {
                this.currentTab = tabName;
                container.querySelectorAll('.library-tab').forEach(t => {
                    t.classList.toggle('active', t.dataset.tab === tabName);
                });
                this.renderContent();
            }
        });
    },

    /**
     * Render current tab content
     */
    renderContent() {
        const content = document.getElementById('libraryContent');
        if (!content) return;

        switch (this.currentTab) {
            case 'watchlist':
                this.renderWatchlist(content);
                break;
            case 'continue':
                this.renderContinue(content);
                break;
            case 'downloads':
                this.renderDownloads(content);
                break;
            default:
                this.renderWatchlist(content);
        }
    },

    /**
     * Render watchlist
     */
    renderWatchlist(container) {
        const items = State.get('watchlist');

        if (!items.length) {
            container.innerHTML = Components.emptyState(
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
                'Your list is empty',
                'Add movies and TV shows to your list to watch them later.'
            );
            return;
        }

        container.innerHTML = `
            <div class="movie-grid">
                ${items.map(item => `
                    <div class="movie-card" 
                         data-id="${item.id}" 
                         data-type="${item.media_type || 'movie'}"
                         onclick="Router.navigate('detail', ${item.id}, '${item.media_type || 'movie'}')">
                        <div class="poster">
                            <img src="${Utils.getImageUrl(item.poster_path, 'w500')}" 
                                 alt="${Utils.escapeHtml(item.title || item.name || 'Untitled')}"
                                 loading="lazy"
                                 onerror="this.src='assets/placeholder.webp'">
                            <button class="rating" style="position:absolute;top:8px;right:8px;background:var(--error);color:white;border:none;border-radius:var(--radius-sm);padding:4px 8px;cursor:pointer;font-size:0.75rem;font-weight:700;"
                                    onclick="event.stopPropagation(); Library.removeFromWatchlist(${item.id}, '${item.media_type || 'movie'}')">
                                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div class="movie-title">${Utils.escapeHtml(item.title || item.name || 'Untitled')}</div>
                    </div>
                `).join('')}
            </div>
        `;
        Utils.lazyLoadImages(container);
    },

    /**
     * Render continue watching
     */
    renderContinue(container) {
        const items = State.get('continueWatching');

        if (!items.length) {
            container.innerHTML = Components.emptyState(
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
                'No recent watches',
                'Start watching something and it will appear here.'
            );
            return;
        }

        container.innerHTML = items.map(item => Components.continueCard(item)).join('');
        Utils.lazyLoadImages(container);
    },

    /**
     * Render downloads
     */
    renderDownloads(container) {
        const items = State.get('downloads');

        if (!items.length) {
            container.innerHTML = Components.emptyState(
                `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
                'No downloads',
                'Download movies and TV shows to watch offline.'
            );
            return;
        }

        container.innerHTML = items.map(item => `
            <div class="download-item">
                <img src="${Utils.getImageUrl(item.poster_path, 'w92')}" 
                     alt="${Utils.escapeHtml(item.title || 'Untitled')}"
                     onerror="this.src='assets/placeholder.webp'">
                <div class="info">
                    <h4>${Utils.escapeHtml(item.title || 'Untitled')}</h4>
                    <div class="size">${item.size || 'Unknown size'}</div>
                    <div class="progress-bar">
                        <div class="fill" style="width: ${item.progress || 0}%"></div>
                    </div>
                    <div class="status">${item.status === 'completed' ? 'Completed' : item.status === 'downloading' ? `Downloading ${item.progress || 0}%` : 'Pending'}</div>
                </div>
                <div class="actions">
                    ${item.status === 'completed' ? `
                        <button onclick="Components.playContent(${item.id}, '${item.media_type || 'movie'}', '${Utils.escapeHtml(item.title || '').replace(/'/g, "\'")}')">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                    ` : item.status === 'downloading' ? `
                        <button onclick="State.updateDownload(${item.id}, {status:'paused'}); Library.renderContent();">
                            <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        </button>
                    ` : `
                        <button onclick="State.updateDownload(${item.id}, {status:'downloading'}); Library.renderContent();">
                            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </button>
                    `}
                    <button onclick="State.removeDownload(${item.id}); Library.renderContent();">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    },

    /**
     * Remove from watchlist
     */
    removeFromWatchlist(id, mediaType) {
        State.removeFromWatchlist(id, mediaType);
        Utils.showToast('Removed from My List', 'info');
        this.renderContent();
    }
};

// Expose globally
window.Library = Library;
