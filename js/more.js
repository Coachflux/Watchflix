/**
 * CINEFLIX - More Page (Settings & Options)
 */

const More = {
    /**
     * Render more/settings page
     */
    render(container) {
        const currentTheme = State.get('theme');
        const currentLang = State.get('language');
        const langName = Utils.getLanguageName(currentLang.split('-')[0]);

        container.innerHTML = `
            <div class="page" id="morePage">
                <div class="section-header" style="padding:20px;">
                    <h2 class="section-title">More</h2>
                </div>

                <div style="padding:0 20px;">
                    <!-- Theme Toggle -->
                    <div class="continue-card" style="margin:0 0 12px;" onclick="More.toggleTheme()">
                        <div style="width:40px;height:40px;border-radius:12px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                ${currentTheme === 'dark' 
                                    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
                                    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'
                                }
                            </svg>
                        </div>
                        <div class="info" style="flex:1;">
                            <h4>Appearance</h4>
                            <div class="meta">${currentTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Language -->
                    <div class="continue-card" style="margin:0 0 12px;" onclick="Router.navigate('nations')">
                        <div style="width:40px;height:40px;border-radius:12px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                            </svg>
                        </div>
                        <div class="info" style="flex:1;">
                            <h4>Language & Region</h4>
                            <div class="meta">${Utils.escapeHtml(langName)}</div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- My List -->
                    <div class="continue-card" style="margin:0 0 12px;" onclick="Router.navigate('library')">
                        <div style="width:40px;height:40px;border-radius:12px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <div class="info" style="flex:1;">
                            <h4>My List</h4>
                            <div class="meta">${State.get('watchlist').length} items saved</div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Downloads -->
                    <div class="continue-card" style="margin:0 0 12px;" onclick="Router.navigate('downloads')">
                        <div style="width:40px;height:40px;border-radius:12px;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </div>
                        <div class="info" style="flex:1;">
                            <h4>Downloads</h4>
                            <div class="meta">${State.get('downloads').length} items</div>
                        </div>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--text-muted);flex-shrink:0;">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- App Info -->
                    <div style="margin-top:32px;text-align:center;color:var(--text-muted);font-size:0.8125rem;">
                        <p>Cineflix v1.0</p>
                        <p style="margin-top:4px;">Powered by TMDB</p>
                        <p style="margin-top:12px;font-size:0.75rem;opacity:0.6;">
                            This product uses the TMDB API but is not endorsed or certified by TMDB.
                        </p>
                    </div>
                </div>
                <div style="height:40px;"></div>
            </div>
        `;
    },

    /**
     * Toggle theme from more page
     */
    toggleTheme() {
        const newTheme = State.toggleTheme();
        Utils.showToast(`Switched to ${newTheme} mode`, 'success');
        // Re-render to update the UI
        setTimeout(() => this.render(document.getElementById('pageContent')), 100);
    }
};

// Expose globally
window.More = More;
