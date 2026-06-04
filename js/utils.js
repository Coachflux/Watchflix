/**
 * CINEFLIX - Utility Functions
 */

const Utils = {
    /**
     * Debounce function calls
     */
    debounce(fn, delay = 300) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn(...args), delay);
        };
    },

    /**
     * Throttle function calls
     */
    throttle(fn, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Format runtime to hours and minutes
     */
    formatRuntime(minutes) {
        if (!minutes) return '';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    },

    /**
     * Format date
     */
    formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    /**
     * Format year only
     */
    formatYear(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).getFullYear();
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
        if (!num) return '0';
        return num.toLocaleString();
    },

    /**
     * Format currency
     */
    formatCurrency(num) {
        if (!num) return '$0';
        return '$' + (num / 1000000).toFixed(1) + 'M';
    },

    /**
     * Truncate text with ellipsis
     */
    truncate(text, length = 150) {
        if (!text) return '';
        return text.length > length ? text.substring(0, length).trim() + '...' : text;
    },

    /**
     * Get TMDB image URL with size
     */
    getImageUrl(path, size = 'w500') {
        if (!path) return 'assets/placeholder.webp';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },

    /**
     * Get backdrop URL
     */
    getBackdropUrl(path, size = 'original') {
        if (!path) return '';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },

    /**
     * Get profile image URL
     */
    getProfileUrl(path, size = 'w185') {
        if (!path) return 'assets/placeholder.webp';
        return `https://image.tmdb.org/t/p/${size}${path}`;
    },

    /**
     * Generate video embed URL (uses TMDB videos or fallback)
     */
    getVideoUrl(movieId, type = 'movie') {
        // Use vidsrc.me as reliable embed source
        return `https://vidsrc.me/embed/${type}?tmdb=${movieId}`;
    },

    /**
     * Generate trailer embed URL from YouTube key
     */
    getTrailerUrl(key) {
        if (!key) return '';
        return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`;
    },

    /**
     * Lazy load images with IntersectionObserver
     */
    lazyLoadImages(container = document) {
        const images = container.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        images.forEach(img => imageObserver.observe(img));
    },

    /**
     * Show toast notification
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    },

    /**
     * Show/hide loading overlay
     */
    setLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }
    },

    /**
     * Generate skeleton loading HTML
     */
    skeletonCard(count = 6) {
        return Array(count).fill(0).map(() => `
            <div class="movie-card skeleton-card">
                <div class="poster skeleton"></div>
                <div class="title skeleton"></div>
            </div>
        `).join('');
    },

    /**
     * Generate skeleton hero
     */
    skeletonHero() {
        return `<div class="skeleton-hero skeleton"></div>`;
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Create element from HTML string
     */
    createElement(html) {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild;
    },

    /**
     * Smooth scroll to element
     */
    scrollTo(element, offset = 0) {
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    },

    /**
     * Detect if device is touch
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Detect if online
     */
    isOnline() {
        return navigator.onLine;
    },

    /**
     * Watch online status
     */
    watchOnline(callback) {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    },

    /**
     * Generate share link
     */
    getShareUrl(type, id) {
        const base = window.location.origin + window.location.pathname;
        return `${base}#/${type}/${id}`;
    },

    /**
     * Parse hash route
     */
    parseRoute() {
        const hash = window.location.hash.replace('#/', '') || '/';
        const parts = hash.split('/').filter(Boolean);
        return {
            path: parts[0] || 'home',
            id: parts[1] || null,
            sub: parts[2] || null
        };
    },

    /**
     * Get language name from code
     */
    getLanguageName(code) {
        const languages = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
            'ko': 'Korean', 'zh': 'Chinese', 'hi': 'Hindi', 'ar': 'Arabic',
            'tr': 'Turkish', 'pl': 'Polish', 'nl': 'Dutch', 'sv': 'Swedish',
            'da': 'Danish', 'no': 'Norwegian', 'fi': 'Finnish', 'cs': 'Czech',
            'el': 'Greek', 'he': 'Hebrew', 'th': 'Thai', 'id': 'Indonesian',
            'vi': 'Vietnamese', 'ms': 'Malay', 'tl': 'Tagalog', 'uk': 'Ukrainian'
        };
        return languages[code] || code.toUpperCase();
    },

    /**
     * Get region name from code
     */
    getRegionName(code) {
        const regions = {
            'US': 'United States', 'GB': 'United Kingdom', 'CA': 'Canada',
            'AU': 'Australia', 'DE': 'Germany', 'FR': 'France', 'IT': 'Italy',
            'ES': 'Spain', 'JP': 'Japan', 'KR': 'South Korea', 'IN': 'India',
            'BR': 'Brazil', 'MX': 'Mexico', 'RU': 'Russia', 'CN': 'China',
            'TR': 'Turkey', 'PL': 'Poland', 'NL': 'Netherlands', 'SE': 'Sweden',
            'AR': 'Argentina', 'BE': 'Belgium', 'CH': 'Switzerland', 'AT': 'Austria',
            'DK': 'Denmark', 'FI': 'Finland', 'NO': 'Norway', 'PT': 'Portugal',
            'GR': 'Greece', 'CZ': 'Czech Republic', 'HU': 'Hungary', 'RO': 'Romania',
            'ZA': 'South Africa', 'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia',
            'ID': 'Indonesia', 'TH': 'Thailand', 'PH': 'Philippines', 'MY': 'Malaysia',
            'SG': 'Singapore', 'TW': 'Taiwan', 'HK': 'Hong Kong'
        };
        return regions[code] || code;
    }
};

// Expose globally
window.Utils = Utils;
