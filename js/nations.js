/**
 * CINEFLIX - Language & Region Settings
 */

const Nations = {
    languages: [
        { code: 'en-US', name: 'English', region: 'US' },
        { code: 'es-ES', name: 'Español', region: 'ES' },
        { code: 'fr-FR', name: 'Français', region: 'FR' },
        { code: 'de-DE', name: 'Deutsch', region: 'DE' },
        { code: 'it-IT', name: 'Italiano', region: 'IT' },
        { code: 'pt-BR', name: 'Português', region: 'BR' },
        { code: 'ja-JP', name: '日本語', region: 'JP' },
        { code: 'ko-KR', name: '한국어', region: 'KR' },
        { code: 'zh-CN', name: '中文', region: 'CN' },
        { code: 'hi-IN', name: 'हिन्दी', region: 'IN' },
        { code: 'ar-SA', name: 'العربية', region: 'SA' },
        { code: 'tr-TR', name: 'Türkçe', region: 'TR' },
        { code: 'pl-PL', name: 'Polski', region: 'PL' },
        { code: 'nl-NL', name: 'Nederlands', region: 'NL' },
        { code: 'sv-SE', name: 'Svenska', region: 'SE' },
        { code: 'da-DK', name: 'Dansk', region: 'DK' },
        { code: 'no-NO', name: 'Norsk', region: 'NO' },
        { code: 'fi-FI', name: 'Suomi', region: 'FI' },
        { code: 'cs-CZ', name: 'Čeština', region: 'CZ' },
        { code: 'el-GR', name: 'Ελληνικά', region: 'GR' },
        { code: 'he-IL', name: 'עברית', region: 'IL' },
        { code: 'th-TH', name: 'ไทย', region: 'TH' },
        { code: 'id-ID', name: 'Bahasa Indonesia', region: 'ID' },
        { code: 'vi-VN', name: 'Tiếng Việt', region: 'VN' },
        { code: 'ms-MY', name: 'Bahasa Melayu', region: 'MY' },
        { code: 'tl-PH', name: 'Filipino', region: 'PH' },
        { code: 'uk-UA', name: 'Українська', region: 'UA' },
        { code: 'ru-RU', name: 'Русский', region: 'RU' }
    ],

    /**
     * Get flag SVG path
     */
    getFlagPath(region) {
        return `assets/flags/${region.toLowerCase()}.svg`;
    },

    /**
     * Render nations/language page
     */
    render(container) {
        const currentLang = State.get('language');

        container.innerHTML = `
            <div class="page" id="nationsPage">
                <div class="section-header" style="padding:20px;">
                    <h2 class="section-title">Language & Region</h2>
                </div>
                <p style="padding:0 20px 16px;color:var(--text-muted);font-size:0.875rem;">
                    Select your preferred language for content and interface.
                </p>
                <div class="nations-list">
                    ${this.languages.map(lang => `
                        <div class="nation-item ${lang.code === currentLang ? 'active' : ''}" 
                             data-lang="${lang.code}" 
                             data-region="${lang.region}"
                             onclick="Nations.selectLanguage('${lang.code}', '${lang.region}')">
                            <img class="nation-flag" src="${this.getFlagPath(lang.region)}" 
                                 alt="${lang.region}" 
                                 onerror="this.style.display='none'">
                            <div class="nation-info">
                                <div class="name">${Utils.escapeHtml(lang.name)}</div>
                                <div class="lang">${Utils.escapeHtml(lang.code)} • ${Utils.getRegionName(lang.region)}</div>
                            </div>
                            <svg class="nation-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                    `).join('')}
                </div>
                <div style="height:40px;"></div>
            </div>
        `;
    },

    /**
     * Select language
     */
    selectLanguage(language, region) {
        const oldLang = State.get('language');
        State.setLocale(language, region);

        // Update UI
        document.querySelectorAll('.nation-item').forEach(item => {
            item.classList.toggle('active', item.dataset.lang === language);
        });

        Utils.showToast(`Language changed to ${Utils.getLanguageName(language.split('-')[0])}`, 'success');

        // Reload current page data if language changed
        if (oldLang !== language) {
            setTimeout(() => {
                Router.refresh();
            }, 500);
        }
    }
};

// Expose globally
window.Nations = Nations;
