/**
 * CINEFLIX — Utilities
 * Internationalization, formatting, DOM helpers, and shared utilities
 */

const Utils = {
  // ── i18n ──
  translations: {
    en: {
      home: 'Home', explore: 'Explore', downloads: 'Downloads', more: 'More',
      search: 'Search', watchlist: 'Watchlist', history: 'History',
      settings: 'Settings', nations: 'Nations & Language',
      discover: 'Discover', library: 'Library',
      trending: 'Trending Now', continueWatching: 'Continue Watching',
      seeAll: 'See All', playNow: 'Play Now', myList: 'My List',
      movies: 'Movies', tvShows: 'TV Shows', genres: 'Genres',
      noResults: 'No results found', tryDifferent: 'Try a different search term.',
      loading: 'Loading...', error: 'Something went wrong',
      addedToWatchlist: 'Added to Watchlist', removedFromWatchlist: 'Removed from Watchlist',
      darkMode: 'Dark Mode', notifications: 'Notifications', autoPlay: 'Auto Play',
      downloadQuality: 'Download Quality', language: 'Language',
      about: 'About', version: 'Version 1.0.0', privacy: 'Privacy Policy', terms: 'Terms of Service'
    },
    es: {
      home: 'Inicio', explore: 'Explorar', downloads: 'Descargas', more: 'Más',
      search: 'Buscar', watchlist: 'Mi Lista', history: 'Historial',
      settings: 'Ajustes', nations: 'Países e Idioma',
      discover: 'Descubrir', library: 'Biblioteca',
      trending: 'Tendencias', continueWatching: 'Continuar Viendo',
      seeAll: 'Ver Todo', playNow: 'Reproducir', myList: 'Mi Lista',
      movies: 'Películas', tvShows: 'Series', genres: 'Géneros',
      noResults: 'No hay resultados', tryDifferent: 'Prueba otro término.',
      loading: 'Cargando...', error: 'Algo salió mal',
      addedToWatchlist: 'Añadido a Mi Lista', removedFromWatchlist: 'Eliminado de Mi Lista',
      darkMode: 'Modo Oscuro', notifications: 'Notificaciones', autoPlay: 'Reproducción Automática',
      downloadQuality: 'Calidad de Descarga', language: 'Idioma',
      about: 'Acerca de', version: 'Versión 1.0.0', privacy: 'Política de Privacidad', terms: 'Términos de Servicio'
    },
    fr: {
      home: 'Accueil', explore: 'Explorer', downloads: 'Téléchargements', more: 'Plus',
      search: 'Rechercher', watchlist: 'Ma Liste', history: 'Historique',
      settings: 'Paramètres', nations: 'Nations & Langue',
      discover: 'Découvrir', library: 'Bibliothèque',
      trending: 'Tendances', continueWatching: 'Continuer à Regarder',
      seeAll: 'Voir Tout', playNow: 'Lecture', myList: 'Ma Liste',
      movies: 'Films', tvShows: 'Séries', genres: 'Genres',
      noResults: 'Aucun résultat', tryDifferent: 'Essayez un autre terme.',
      loading: 'Chargement...', error: 'Une erreur est survenue',
      addedToWatchlist: 'Ajouté à Ma Liste', removedFromWatchlist: 'Retiré de Ma Liste',
      darkMode: 'Mode Sombre', notifications: 'Notifications', autoPlay: 'Lecture Auto',
      downloadQuality: 'Qualité Téléchargement', language: 'Langue',
      about: 'À Propos', version: 'Version 1.0.0', privacy: 'Politique de Confidentialité', terms: 'Conditions d'Utilisation'
    },
    de: {
      home: 'Startseite', explore: 'Entdecken', downloads: 'Downloads', more: 'Mehr',
      search: 'Suche', watchlist: 'Merkliste', history: 'Verlauf',
      settings: 'Einstellungen', nations: 'Länder & Sprache',
      discover: 'Entdecken', library: 'Bibliothek',
      trending: 'Trends', continueWatching: 'Weiterschauen',
      seeAll: 'Alle Anzeigen', playNow: 'Abspielen', myList: 'Merkliste',
      movies: 'Filme', tvShows: 'Serien', genres: 'Genres',
      noResults: 'Keine Ergebnisse', tryDifferent: 'Versuchen Sie einen anderen Begriff.',
      loading: 'Laden...', error: 'Etwas ist schiefgelaufen',
      addedToWatchlist: 'Zur Merkliste hinzugefügt', removedFromWatchlist: 'Aus Merkliste entfernt',
      darkMode: 'Dunkelmodus', notifications: 'Benachrichtigungen', autoPlay: 'Autoplay',
      downloadQuality: 'Download-Qualität', language: 'Sprache',
      about: 'Über', version: 'Version 1.0.0', privacy: 'Datenschutz', terms: 'Nutzungsbedingungen'
    },
    ja: {
      home: 'ホーム', explore: '探索', downloads: 'ダウンロード', more: 'その他',
      search: '検索', watchlist: 'ウォッチリスト', history: '履歴',
      settings: '設定', nations: '国と言語',
      discover: '発見', library: 'ライブラリ',
      trending: 'トレンド', continueWatching: '続きを見る',
      seeAll: 'すべて表示', playNow: '再生', myList: 'マイリスト',
      movies: '映画', tvShows: 'テレビ番組', genres: 'ジャンル',
      noResults: '結果が見つかりません', tryDifferent: '別の検索語を試してください。',
      loading: '読み込み中...', error: 'エラーが発生しました',
      addedToWatchlist: 'ウォッチリストに追加', removedFromWatchlist: 'ウォッチリストから削除',
      darkMode: 'ダークモード', notifications: '通知', autoPlay: '自動再生',
      downloadQuality: 'ダウンロード品質', language: '言語',
      about: 'について', version: 'バージョン 1.0.0', privacy: 'プライバシーポリシー', terms: '利用規約'
    },
    ko: {
      home: '홈', explore: '탐색', downloads: '다운로드', more: '더보기',
      search: '검색', watchlist: '찜 목록', history: '시청 기록',
      settings: '설정', nations: '국가 및 언어',
      discover: '발견', library: '라이브러리',
      trending: '인기', continueWatching: '이어서 보기',
      seeAll: '모두 보기', playNow: '재생', myList: '찜 목록',
      movies: '영화', tvShows: 'TV 프로그램', genres: '장르',
      noResults: '결과 없음', tryDifferent: '다른 검색어를 시도하세요.',
      loading: '로딩 중...', error: '오류가 발생했습니다',
      addedToWatchlist: '찜 목록에 추가됨', removedFromWatchlist: '찜 목록에서 제거됨',
      darkMode: '다크 모드', notifications: '알림', autoPlay: '자동 재생',
      downloadQuality: '다운로드 품질', language: '언어',
      about: '정보', version: '버전 1.0.0', privacy: '개인정보 처리방침', terms: '서비스 약관'
    },
    zh: {
      home: '首页', explore: '探索', downloads: '下载', more: '更多',
      search: '搜索', watchlist: '观看列表', history: '历史记录',
      settings: '设置', nations: '国家与语言',
      discover: '发现', library: '库',
      trending: '热门', continueWatching: '继续观看',
      seeAll: '查看全部', playNow: '立即播放', myList: '我的列表',
      movies: '电影', tvShows: '电视剧', genres: '类型',
      noResults: '未找到结果', tryDifferent: '尝试不同的搜索词。',
      loading: '加载中...', error: '出错了',
      addedToWatchlist: '已添加到观看列表', removedFromWatchlist: '已从观看列表移除',
      darkMode: '深色模式', notifications: '通知', autoPlay: '自动播放',
      downloadQuality: '下载质量', language: '语言',
      about: '关于', version: '版本 1.0.0', privacy: '隐私政策', terms: '服务条款'
    },
    ar: {
      home: 'الرئيسية', explore: 'استكشاف', downloads: 'التنزيلات', more: 'المزيد',
      search: 'بحث', watchlist: 'قائمة المشاهدة', history: 'السجل',
      settings: 'الإعدادات', nations: 'الدول واللغة',
      discover: 'اكتشف', library: 'المكتبة',
      trending: 'الشائع', continueWatching: 'مواصلة المشاهدة',
      seeAll: 'عرض الكل', playNow: 'تشغيل', myList: 'قائمتي',
      movies: 'أفلام', tvShows: 'مسلسلات', genres: 'الأنواع',
      noResults: 'لا توجد نتائج', tryDifferent: 'جرب مصطلح بحث مختلف.',
      loading: 'جار التحميل...', error: 'حدث خطأ ما',
      addedToWatchlist: 'تمت الإضافة إلى القائمة', removedFromWatchlist: 'تمت الإزالة من القائمة',
      darkMode: 'الوضع الداكن', notifications: 'الإشعارات', autoPlay: 'التشغيل التلقائي',
      downloadQuality: 'جودة التنزيل', language: 'اللغة',
      about: 'حول', version: 'الإصدار 1.0.0', privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة'
    },
    pt: {
      home: 'Início', explore: 'Explorar', downloads: 'Downloads', more: 'Mais',
      search: 'Pesquisar', watchlist: 'Minha Lista', history: 'Histórico',
      settings: 'Configurações', nations: 'Países e Idioma',
      discover: 'Descobrir', library: 'Biblioteca',
      trending: 'Em Alta', continueWatching: 'Continuar Assistindo',
      seeAll: 'Ver Tudo', playNow: 'Assistir', myList: 'Minha Lista',
      movies: 'Filmes', tvShows: 'Séries', genres: 'Gêneros',
      noResults: 'Nenhum resultado', tryDifferent: 'Tente um termo diferente.',
      loading: 'Carregando...', error: 'Algo deu errado',
      addedToWatchlist: 'Adicionado à Lista', removedFromWatchlist: 'Removido da Lista',
      darkMode: 'Modo Escuro', notifications: 'Notificações', autoPlay: 'Reprodução Automática',
      downloadQuality: 'Qualidade de Download', language: 'Idioma',
      about: 'Sobre', version: 'Versão 1.0.0', privacy: 'Política de Privacidade', terms: 'Termos de Serviço'
    },
    ru: {
      home: 'Главная', explore: 'Обзор', downloads: 'Загрузки', more: 'Ещё',
      search: 'Поиск', watchlist: 'Список просмотра', history: 'История',
      settings: 'Настройки', nations: 'Страны и язык',
      discover: 'Открыть', library: 'Библиотека',
      trending: 'В тренде', continueWatching: 'Продолжить просмотр',
      seeAll: 'Смотреть всё', playNow: 'Смотреть', myList: 'Мой список',
      movies: 'Фильмы', tvShows: 'Сериалы', genres: 'Жанры',
      noResults: 'Ничего не найдено', tryDifferent: 'Попробуйте другой запрос.',
      loading: 'Загрузка...', error: 'Что-то пошло не так',
      addedToWatchlist: 'Добавлено в список', removedFromWatchlist: 'Удалено из списка',
      darkMode: 'Тёмная тема', notifications: 'Уведомления', autoPlay: 'Автовоспроизведение',
      downloadQuality: 'Качество загрузки', language: 'Язык',
      about: 'О приложении', version: 'Версия 1.0.0', privacy: 'Политика конфиденциальности', terms: 'Условия использования'
    },
    hi: {
      home: 'होम', explore: 'एक्सप्लोर', downloads: 'डाउनलोड', more: 'और',
      search: 'खोजें', watchlist: 'वॉचलिस्ट', history: 'इतिहास',
      settings: 'सेटिंग्स', nations: 'देश और भाषा',
      discover: 'खोजें', library: 'लाइब्रेरी',
      trending: 'ट्रेंडिंग', continueWatching: 'देखना जारी रखें',
      seeAll: 'सभी देखें', playNow: 'अभी चलाएं', myList: 'मेरी सूची',
      movies: 'फिल्में', tvShows: 'टीवी शो', genres: 'श्रेणियाँ',
      noResults: 'कोई परिणाम नहीं', tryDifferent: 'कोई अन्य शब्द खोजें।',
      loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया',
      addedToWatchlist: 'वॉचलिस्ट में जोड़ा गया', removedFromWatchlist: 'वॉचलिस्ट से हटाया गया',
      darkMode: 'डार्क मोड', notifications: 'सूचनाएं', autoPlay: 'ऑटो प्ले',
      downloadQuality: 'डाउनलोड गुणवत्ता', language: 'भाषा',
      about: 'के बारे में', version: 'संस्करण 1.0.0', privacy: 'गोपनीयता नीति', terms: 'सेवा की शर्तें'
    }
  },

  t(key, lang = null) {
    const l = lang || State.get('language') || 'en';
    return this.translations[l]?.[key] ?? this.translations.en[key] ?? key;
  },

  // ── Formatting ──
  formatRuntime(minutes) {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`.trim();
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString(State.get('language') || 'en', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  formatRating(rating) {
    return rating ? rating.toFixed(1) : '0.0';
  },

  formatNumber(num) {
    if (!num) return '0';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  },

  // ── DOM Helpers ──
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  },

  create(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'class') el.className = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    });
    children.forEach(c => el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return el;
  },

  // ── Debounce / Throttle ──
  debounce(fn, wait = 300) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  },

  throttle(fn, limit = 100) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
  },

  // ── Intersection Observer for lazy loading ──
  observeLazy(images) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    images.forEach(img => obs.observe(img));
  },

  // ── Toast ──
  toast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration + 300);
  },

  // ── Storage ──
  storage: {
    get(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
    remove(key) { localStorage.removeItem(key); }
  },

  // ── Network Status ──
  isOnline() { return navigator.onLine; },

  // ── Share ──
  async share(data) {
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { if (e.name !== 'AbortError') console.error(e); }
    } else {
      await navigator.clipboard.writeText(data.url || data.text || '');
      Utils.toast('Link copied to clipboard', 'success');
    }
  }
};

// Apply RTL for Arabic
function applyRTL() {
  const lang = State.get('language');
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
}
