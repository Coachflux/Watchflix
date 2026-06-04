/**
 * CINEFLIX — Nations & Language Page
 * Region selection, language switching, and localization settings
 */

const Nations = {
  nations: [
    { code: 'US', name: 'United States', nameLocal: 'United States', lang: 'en', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', nameLocal: 'United Kingdom', lang: 'en', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', nameLocal: 'Canada', lang: 'en', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', nameLocal: 'Australia', lang: 'en', flag: '🇦🇺' },
    { code: 'ES', name: 'Spain', nameLocal: 'España', lang: 'es', flag: '🇪🇸' },
    { code: 'MX', name: 'Mexico', nameLocal: 'México', lang: 'es', flag: '🇲🇽' },
    { code: 'FR', name: 'France', nameLocal: 'France', lang: 'fr', flag: '🇫🇷' },
    { code: 'DE', name: 'Germany', nameLocal: 'Deutschland', lang: 'de', flag: '🇩🇪' },
    { code: 'IT', name: 'Italy', nameLocal: 'Italia', lang: 'it', flag: '🇮🇹' },
    { code: 'JP', name: 'Japan', nameLocal: '日本', lang: 'ja', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', nameLocal: '대한민국', lang: 'ko', flag: '🇰🇷' },
    { code: 'CN', name: 'China', nameLocal: '中国', lang: 'zh', flag: '🇨🇳' },
    { code: 'IN', name: 'India', nameLocal: 'भारत', lang: 'hi', flag: '🇮🇳' },
    { code: 'BR', name: 'Brazil', nameLocal: 'Brasil', lang: 'pt', flag: '🇧🇷' },
    { code: 'RU', name: 'Russia', nameLocal: 'Россия', lang: 'ru', flag: '🇷🇺' },
    { code: 'TR', name: 'Turkey', nameLocal: 'Türkiye', lang: 'tr', flag: '🇹🇷' },
    { code: 'SA', name: 'Saudi Arabia', nameLocal: 'السعودية', lang: 'ar', flag: '🇸🇦' },
    { code: 'EG', name: 'Egypt', nameLocal: 'مصر', lang: 'ar', flag: '🇪🇬' },
    { code: 'NL', name: 'Netherlands', nameLocal: 'Nederland', lang: 'nl', flag: '🇳🇱' },
    { code: 'SE', name: 'Sweden', nameLocal: 'Sverige', lang: 'sv', flag: '🇸🇪' },
    { code: 'PL', name: 'Poland', nameLocal: 'Polska', lang: 'pl', flag: '🇵🇱' },
    { code: 'ID', name: 'Indonesia', nameLocal: 'Indonesia', lang: 'id', flag: '🇮🇩' },
    { code: 'TH', name: 'Thailand', nameLocal: 'ไทย', lang: 'th', flag: '🇹🇭' },
    { code: 'VN', name: 'Vietnam', nameLocal: 'Việt Nam', lang: 'vi', flag: '🇻🇳' },
    { code: 'PH', name: 'Philippines', nameLocal: 'Pilipinas', lang: 'tl', flag: '🇵🇭' }
  ],

  async render() {
    const main = document.getElementById('mainContent');
    const currentNation = State.get('currentNation') || this.nations[0];

    main.innerHTML = `
      <div class="nations-page">
        <div class="section-header" style="padding-top:0.5rem">
          <h1 class="section-title" style="font-size:1.5rem">${Utils.t('nations')}</h1>
        </div>

        <div style="padding:0 1rem;margin-bottom:1.5rem">
          <h3 style="font-size:0.875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Current Region</h3>
          <div class="nation-card active" style="margin:0">
            <span class="flag" style="font-size:1.5rem">${currentNation.flag}</span>
            <div class="nation-info">
              <div class="nation-name">${currentNation.name}</div>
              <div class="nation-lang">${currentNation.nameLocal} • ${this.getLanguageName(currentNation.lang)}</div>
            </div>
            <div class="check">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </div>
        </div>

        <div style="padding:0 1rem">
          <h3 style="font-size:0.875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Available Regions</h3>
          <div class="nations-grid" id="nationsGrid">
            ${this.nations.map(n => this.nationCard(n, currentNation.code)).join('')}
          </div>
        </div>

        <div style="padding:0 1rem;margin-top:1.5rem">
          <h3 style="font-size:0.875rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.75rem">Language</h3>
          <div class="nations-grid" id="languageGrid">
            ${this.renderLanguageOptions()}
          </div>
        </div>
      </div>
    `;

    this.initInteractions();
  },

  nationCard(nation, currentCode) {
    const isActive = nation.code === currentCode;
    return `
      <div class="nation-card ${isActive ? 'active' : ''}" data-code="${nation.code}" data-lang="${nation.lang}">
        <span class="flag" style="font-size:1.5rem">${nation.flag}</span>
        <div class="nation-info">
          <div class="nation-name">${nation.name}</div>
          <div class="nation-lang">${nation.nameLocal}</div>
        </div>
        <div class="check">
          ${isActive ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
      </div>
    `;
  },

  renderLanguageOptions() {
    const currentLang = State.get('language') || 'en';
    const languages = [
      { code: 'en', name: 'English', local: 'English' },
      { code: 'es', name: 'Spanish', local: 'Español' },
      { code: 'fr', name: 'French', local: 'Français' },
      { code: 'de', name: 'German', local: 'Deutsch' },
      { code: 'ja', name: 'Japanese', local: '日本語' },
      { code: 'ko', name: 'Korean', local: '한국어' },
      { code: 'zh', name: 'Chinese', local: '中文' },
      { code: 'hi', name: 'Hindi', local: 'हिन्दी' },
      { code: 'pt', name: 'Portuguese', local: 'Português' },
      { code: 'ru', name: 'Russian', local: 'Русский' },
      { code: 'ar', name: 'Arabic', local: 'العربية' },
      { code: 'it', name: 'Italian', local: 'Italiano' }
    ];

    return languages.map(l => `
      <div class="nation-card ${l.code === currentLang ? 'active' : ''}" data-lang-code="${l.code}">
        <span class="flag" style="font-size:1.25rem;width:36px;text-align:center">🌐</span>
        <div class="nation-info">
          <div class="nation-name">${l.name}</div>
          <div class="nation-lang">${l.local}</div>
        </div>
        <div class="check">
          ${l.code === currentLang ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
        </div>
      </div>
    `).join('');
  },

  getLanguageName(code) {
    const map = {
      en: 'English', es: 'Spanish', fr: 'French', de: 'German', it: 'Italian',
      ja: 'Japanese', ko: 'Korean', zh: 'Chinese', hi: 'Hindi', pt: 'Portuguese',
      ru: 'Russian', ar: 'Arabic', tr: 'Turkish', nl: 'Dutch', sv: 'Swedish',
      pl: 'Polish', id: 'Indonesian', th: 'Thai', vi: 'Vietnamese', tl: 'Filipino'
    };
    return map[code] || code;
  },

  initInteractions() {
    // Nation selection
    document.getElementById('nationsGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.nation-card');
      if (!card) return;
      const code = card.dataset.code;
      const nation = this.nations.find(n => n.code === code);
      if (nation) {
        State.set('currentNation', nation);
        State.set('language', nation.lang);
        applyRTL();
        Utils.toast(`Region changed to ${nation.name}`, 'success');
        this.render();
      }
    });

    // Language selection
    document.getElementById('languageGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.nation-card');
      if (!card) return;
      const langCode = card.dataset.langCode;
      if (langCode) {
        State.set('language', langCode);
        applyRTL();
        Utils.toast(`Language changed to ${this.getLanguageName(langCode)}`, 'success');
        this.render();
      }
    });
  }
};
