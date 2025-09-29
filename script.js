// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupScrollAnimations();
    setupCopyFunctionality();
    setupMobileMenu();
    setupSmoothScrolling();
    setupHeaderScroll();
    setupTooltips();
    setupProgressBar();
    setupThemeToggle();
    setupSearchFunctionality();
}

// Navigation Setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.chapter');
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.toc-item, .info-card, .node-card, .step, .glossary-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Copy to Clipboard Functionality
function setupCopyFunctionality() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            copyToClipboard(this);
        });
    });
}

function copyToClipboard(button) {
    const promptBox = button.closest('.prompt-box, .code-block');
    const content = promptBox.querySelector('.prompt-content, .code-content');
    const text = content.textContent.trim();
    
    // Create temporary textarea for copying
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showCopyError(button);
    }
    
    document.body.removeChild(textarea);
}

function showCopySuccess(button) {
    const originalIcon = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.add('copied');
    
    setTimeout(() => {
        button.innerHTML = originalIcon;
        button.classList.remove('copied');
    }, 2000);
    
    // Show toast notification
    showToast('Prompt copiado com sucesso!', 'success');
}

function showCopyError(button) {
    showToast('Erro ao copiar. Tente novamente.', 'error');
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add toast styles if not already present
    if (!document.querySelector('#toast-styles')) {
        const toastStyles = document.createElement('style');
        toastStyles.id = 'toast-styles';
        toastStyles.textContent = `
            .toast {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                padding: 16px;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                border-left: 4px solid;
            }
            .toast-success { border-left-color: #10b981; }
            .toast-error { border-left-color: #ef4444; }
            .toast-info { border-left-color: #6366f1; }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #374151;
                font-weight: 500;
            }
            .toast.show { transform: translateX(0); }
        `;
        document.head.appendChild(toastStyles);
    }
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Mobile Menu
function setupMobileMenu() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling
function setupSmoothScrolling() {
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Section Function (for buttons)
function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Header Scroll Effect
function setupHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add scrolled styles
    if (!document.querySelector('#header-scroll-styles')) {
        const headerStyles = document.createElement('style');
        headerStyles.id = 'header-scroll-styles';
        headerStyles.textContent = `
            .header {
                transition: transform 0.3s ease, background-color 0.3s ease;
            }
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 2px 20px rgba(0,0,0,0.1);
            }
        `;
        document.head.appendChild(headerStyles);
    }
}

// Tooltips
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = e.target.getAttribute('data-tooltip');
    
    // Add tooltip styles if not already present
    if (!document.querySelector('#tooltip-styles')) {
        const tooltipStyles = document.createElement('style');
        tooltipStyles.id = 'tooltip-styles';
        tooltipStyles.textContent = `
            .tooltip {
                position: absolute;
                background: #1f2937;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 14px;
                z-index: 10000;
                pointer-events: none;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.2s, transform 0.2s;
            }
            .tooltip.show {
                opacity: 1;
                transform: translateY(0);
            }
            .tooltip::before {
                content: '';
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-bottom: 5px solid #1f2937;
            }
        `;
        document.head.appendChild(tooltipStyles);
    }
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    
    setTimeout(() => tooltip.classList.add('show'), 10);
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    if (e.target._tooltip) {
        e.target._tooltip.classList.remove('show');
        setTimeout(() => {
            if (e.target._tooltip && e.target._tooltip.parentNode) {
                document.body.removeChild(e.target._tooltip);
            }
            e.target._tooltip = null;
        }, 200);
    }
}

// Progress Bar
function setupProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    
    // Add progress bar styles
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgba(99, 102, 241, 0.1);
            z-index: 10001;
        }
        .reading-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #f59e0b);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(progressStyles);
    document.body.appendChild(progressBar);
    
    const progressBarFill = progressBar.querySelector('.reading-progress-bar');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBarFill.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Theme Toggle (Dark/Light Mode)
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('data-tooltip', 'Alternar tema');
    
    // Add theme toggle styles
    const themeStyles = document.createElement('style');
    themeStyles.textContent = `
        .theme-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #6366f1;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }
        .theme-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }
        .theme-toggle.dark-mode {
            background: #f59e0b;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        .theme-toggle.dark-mode:hover {
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        body.dark-theme {
            background: #0A0A1A; /* Fundo azul escuro */
            color: #E0E0E0; /* Cor de texto clara */
        }
        body.dark-theme .header {
            background: rgba(10, 10, 26, 0.95); /* Header mais escuro */
            border-bottom-color: #303040;
        }
        body.dark-theme .chapter {
            background: #1A1A33; /* Fundo do capítulo um pouco mais claro que o body */
        }
        body.dark-theme .info-card,
        body.dark-theme .node-card,
        body.dark-theme .glossary-item {
            background: #2A2A4A; /* Cards com fundo azul escuro */
            border-color: #404060;
        }
    `;
    document.head.appendChild(themeStyles);
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        themeToggle.classList.toggle('dark-mode', isDark);
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Search Functionality
function setupSearchFunctionality() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" placeholder="Buscar no guia..." class="search-input">
            <button class="search-btn"><i class="fas fa-search"></i></button>
            <div class="search-results"></div>
        </div>
    `;
    
    // Add search styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        .search-container.active {
            opacity: 1;
            visibility: visible;
        }
        .search-box {
            background: var(--white);
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 20px;
            width: 500px;
            max-width: 90vw;
            position: relative;
        }
        body.dark-theme .search-box {
            background: var(--gray-800);
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .search-input {
            width: 100%;
            padding: 12px 50px 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            outline: none;
            transition: border-color 0.2s;
        }
        body.dark-theme .search-input {
            background: var(--gray-700);
            border-color: var(--gray-600);
            color: var(--gray-100);
        }
        .search-input:focus {
            border-color: #6366f1;
        }
        .search-btn {
            position: absolute;
            right: 28px;
            top: 32px;
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            font-size: 16px;
        }
        body.dark-theme .search-btn {
            color: var(--gray-400);
        }
        .search-results {
            max-height: 300px;
            overflow-y: auto;
            margin-top: 16px;
        }
        .search-result {
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        body.dark-theme .search-result {
            color: var(--gray-200);
        }
        .search-result:hover {
            background: #f3f4f6;
        }
        body.dark-theme .search-result:hover {
            background: var(--gray-700);
        }
        .search-result-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 4px;
        }
        body.dark-theme .search-result-title {
            color: var(--gray-100);
        }
        .search-result-snippet {
            font-size: 14px;
            color: #6b7280;
        }
        body.dark-theme .search-result-snippet {
            color: var(--gray-400);
        }
        .search-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 9999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        body.dark-theme .search-overlay {
            background: rgba(0,0,0,0.7);
        }
        .search-overlay.active {
            opacity: 1;
            visibility: visible;
        }
    `;
    document.head.appendChild(searchStyles);
    
    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    
    document.body.appendChild(searchOverlay);
    document.body.appendChild(searchContainer);
    
    const searchInput = searchContainer.querySelector('.search-input');
    const searchResults = searchContainer.querySelector('.search-results');
    
    // Open search with Ctrl+K or Cmd+K
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
        if (e.key === 'Escape') {
            closeSearch();
        }
    });
    
    searchOverlay.addEventListener('click', closeSearch);
    
    function openSearch() {
        searchContainer.classList.add('active');
        searchOverlay.classList.add('active');
        searchInput.focus();
    }
    
    function closeSearch() {
        searchContainer.classList.remove('active');
        searchOverlay.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    }
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }
        
        const results = searchContent(query);
        displaySearchResults(results);
    });
    
    function searchContent(query) {
        const results = [];
        const chapters = document.querySelectorAll('.chapter');
        
        chapters.forEach(chapter => {
            const title = chapter.querySelector('.chapter-title').textContent;
            const content = chapter.textContent.toLowerCase();
            
            if (content.includes(query)) {
                const snippet = extractSnippet(content, query);
                results.push({
                    title: title,
                    snippet: snippet,
                    element: chapter
                });
            }
        });
        
        return results;
    }
    
    function extractSnippet(content, query) {
        const index = content.indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + 100);
        return content.substring(start, end) + '...';
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result">Nenhum resultado encontrado</div>';
            return;
        }
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result" onclick="goToResult('${result.element.id}')">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-snippet">${result.snippet}</div>
            </div>
        `).join('');
    }
    
    window.goToResult = function(elementId) {
        closeSearch();
        scrollToSection(elementId);
    };
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Home key - scroll to top
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End key - scroll to bottom
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy Loading for Images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', setupLazyLoading);

// Export functions for global access
window.scrollToSection = scrollToSection;
window.copyToClipboard = copyToClipboard;
