/**
 * Mega Games - Components Manager
 * ملف المكونات المركزية - الإصدار الحديث (البحث المنسدل)
 */




const layoutManager = {
    // 1. تحديد الصفحة النشطة لتلوين الزر الخاص بها
    isActive(pageName) {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) {
            return pageName === 'index.html' ? 'active' : '';
        }
        return path.includes(pageName) ? 'active' : '';
    },

    // 2. بناء الهيدر وحاوية البحث المنسدلة
   renderHeader() {
    const headerContainer = document.createElement('div');
    
    // 1. جلب حالة تسجيل الدخول من localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username') || '';

    // 2. بناء زر الدخول أو قائمة المستخدم حسب الحالة
    let authSection = '';
    if (isLoggedIn) {
        authSection = `
            <div class="nav-btn user-menu-trigger" id="userMenuBtn">
                <i class="fas fa-user-circle"></i> ${escapeHtml(username)} <i class="fas fa-chevron-down"></i>
            </div>
            <div id="userDropdown" class="user-dropdown">
                <a href="profile.html"><i class="fas fa-id-card"></i> الملف الشخصي</a>
                <a href="orders.html"><i class="fas fa-truck"></i> طلباتي</a>
                <a href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</a>
            </div>
        `;
    } else {
        authSection = `<a href="login.html" id="loginNavBtn" class="nav-btn login-nav-btn ${this.isActive('login.html')}">LOGIN</a>`;
    }

    // 3. بناء الـ HTML الكامل للهيدر
    headerContainer.innerHTML = `
        <header class="header">
            <div class="header-container">
                <div class="logo-wrapper">
                    <a href="index.html" class="logo-link">
                        <img src="logo.png" alt="Mega Games" class="site-logo">
                        <div class="logo-text">
                            <span class="logo-main">MEGA</span>
                            <span class="logo-sub">GAMES</span>
                        </div>
                    </a>
                </div>

                <nav class="nav">
                    <a href="index.html" class="nav-btn ${this.isActive('index.html')}">الرئيسية</a>

                    <div class="nav-inline-dropdown">
                        <a href="parts.html" class="nav-btn dropdown-custom-btn ${this.isActive('parts.html') || this.isActive('accessories.html') ? 'active' : ''}">
                            <span>القطع والعتاد</span> <i class="fas fa-angle-down nav-indicator-arrow"></i>
                        </a>
                        <div class="cyber-vertical-menu">
                            <a href="parts.html" class="${this.isActive('parts.html')}">// PARTS</a>
                            <a href="accessories.html" class="${this.isActive('accessories.html')}">// ACCESSORIES</a>
                        </div>
                    </div>

                    <a href="data.html" class="nav-btn ${this.isActive('data.html')}">الداتا والألعاب</a>

                    <div class="nav-inline-dropdown">
                        <a href="news.html" class="nav-btn dropdown-custom-btn ${this.isActive('news.html') || this.isActive('reviews.html') ? 'active' : ''}">
                            <span>الأخبار والمراجعات</span> <i class="fas fa-angle-down nav-indicator-arrow"></i>
                        </a>
                        <div class="cyber-vertical-menu">
                            <a href="news.html" class="${this.isActive('news.html')}">// GLOBAL_NEWS</a>
                            <a href="reviews.html" class="${this.isActive('reviews.html')}">// HARDWARE_REVIEWS</a>
                        </div>
                    </div>

                    <a href="cart.html" class="nav-btn ${this.isActive('cart.html')}">السلة</a>
                    
                    ${authSection}   <!-- هنا يتم إدراج الزر المناسب -->
                    
                    <button id="searchTrigger" class="search-trigger-btn" title="فتح البحث">
                        <span class="search-icon-svg">🔍</span>
                        <span class="search-label">بحث</span>
                    </button>
                </nav>
            </div>

            <div id="searchDropdown" class="search-dropdown">
                <div class="search-inner">
                    <input type="text" id="searchInput" placeholder="ما الذي تبحث عنه اليوم؟ (مثلاً: RTX 4090)" autocomplete="off">
                    <div class="search-bar-line"></div>
                </div>
            </div>
        </header>
    `;

    document.body.prepend(headerContainer);
    },

    // 3. إعداد أيقونة الموقع (Favicon)
    renderFavicon() {
        // حذف أي Favicon قديم لتجنب التكرار
        const existingFav = document.querySelector('link[rel="icon"]');
        if (existingFav) existingFav.remove();

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = 'icon.ico';
        document.head.appendChild(link);
    },

    // 4. حقن الـ Canvas الخاص بالخلفية إذا لم يكن موجوداً
    renderBackgroundCanvas() {
        if (!document.getElementById('tronGridCanvas')) {
            const canvas = document.createElement('canvas');
            canvas.id = 'tronGridCanvas';
            // نضعه في البداية ليكون خلف كل شيء
            document.body.prepend(canvas);
        }
    },

    // 5. تهيئة المكونات فور التحميل
    init() {
        this.renderBackgroundCanvas();
        this.renderFavicon();
        this.renderHeader();
        
        // إضافة كلاس للـ Body لضمان التنسيق الصحيح
        document.body.classList.add('components-loaded');
        
        console.log("Mega Games Components: Loaded Successfully (Modern Search UI)");
    }
};

// تشغيل النظام بمجرد أن يكون الـ DOM جاهزاً
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => layoutManager.init());
} else {
    layoutManager.init();
}

function createBackToTop() {
    const btn = document.createElement('button');
    btn.id = "backToTop";
    btn.className = "mega-glitch-btn";
    btn.innerHTML = `
        <div class="glitch-wrapper">
            <div class="glitch-text" data-text="▲">▲</div>
            <div class="energy-ring"></div>
            <div class="scanline"></div>
        </div>
        <span class="btn-label">TOP</span>
    `;
    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {
        if (window.pageYOffset > 400) {
            btn.classList.add("show");
        } else {
            btn.classList.remove("show");
        }
    });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}
document.addEventListener("DOMContentLoaded", createBackToTop);


(function() {
    function injectCommandGridFooter() {
        if (document.getElementById('mega-command-footer')) return;
        if (!document.body) { setTimeout(injectCommandGridFooter, 20); return; }

        // استدعاء FontAwesome لو مش موجودة
        if (!document.getElementById('fa-pro-load')) {
            const fa = document.createElement('link');
            fa.id = 'fa-pro-load';
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fa);
        }

        const footer = document.createElement('footer');
        footer.id = 'mega-command-footer';
        footer.className = "command-grid-footer";
        footer.innerHTML = `
            <div class="tech-lines-bg"></div>
            <div class="footer-container">
                
                <div class="f-top-bar">
                    <div class="f-brand">
                        <h2 class="f-logo">MEGA<span>GAMES</span></h2>
                        <div class="f-version">BUILD: v2.6.04 // STABLE</div>
                    </div>
                    <div class="f-stats">
                        <div class="stat-box"><span>REGION:</span> <b>EG_CAI</b></div>
                        <div class="stat-box"><span>LATENCY:</span> <b class="glow-g">12ms</b></div>
                        <div class="stat-box"><span>SSL:</span> <b class="glow-b">ACTIVE</b></div>
                    </div>
                </div>

                <div class="f-mid-grid">
                    <div class="f-column">
                        <h4 class="f-title"><i class="fas fa-microchip"></i> الهاردوير</h4>
                        <nav class="f-nav">
                            <a href="#">المعالجات المركزية (CPU)</a>
                            <a href="#">كروت الشاشة (GPU)</a>
                            <a href="#">اللوحات الأم (Motherboards)</a>
                            <a href="#">وحدات التخزين (SSD/NVMe)</a>
                        </nav>
                    </div>

                    <div class="f-column">
                        <h4 class="f-title"><i class="fas fa-shield-alt"></i> الدعم والضمان</h4>
                        <nav class="f-nav">
                            <a href="#">سياسة الاسترجاع</a>
                            <a href="#">تتبع شحنتك</a>
                            <a href="#">مراكز الصيانة</a>
                            <a href="#">الأسئلة الشائعة</a>
                        </nav>
                    </div>

                    <div class="f-column center-align">
                        <h4 class="f-title">SOCIAL_HUB</h4>
                        <div class="social-capsule-fixed">
                            <a href="https://wa.me/201xxxxxxxx" class="s-icon wa" target="_blank"><i class="fab fa-whatsapp"></i></a>
                            <a href="#" class="s-icon fb" target="_blank"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="s-icon ig" target="_blank"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="s-icon tt" target="_blank"><i class="fab fa-tiktok"></i></a>
                            <a href="#" class="s-icon tg" target="_blank"><i class="fab fa-telegram-plane"></i></a>
                            <a href="#" class="s-icon yt" target="_blank"><i class="fab fa-youtube"></i></a>
                        </div>
                        <p class="social-note">تابعنا للحصول على أحدث العروض والأسعار اليومية</p>
                    </div>
                </div>

                <div class="f-bottom-rights">
                    <div class="rights-content">
                        <p class="copyright-text">
                            جميع الحقوق محفوظة لموقع <span>MEGA GAMES</span> &copy; 2026. 
                            يُحظر نسخ أو إعادة استخدام المحتوى بدون إذن مسبق.
                        </p>
                        <div class="f-divider"></div>
                        <div class="f-coords">
                            <i class="fas fa-broadcast-tower"></i> 
                            COORDINATES: 30.0444° N, 31.2357° E
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(footer);
    }
    injectCommandGridFooter();
})();




// ==========================================================================
// دالة الـ PC Builder المتطورة الذكية (كبسولة نيون تفاعلية)
// ==========================================================================
function initCyberFloatingBuilder() {
    if (document.querySelector('.cyber-capsule-widget')) return;

    const floatingBadge = document.createElement('a');
    floatingBadge.href = 'pc-builder.html';
    floatingBadge.className = 'cyber-capsule-widget';
    
    // هيكل تكنولوجي يحتوي على النص المفسر والأيقونة التفاعلية معاً
    floatingBadge.innerHTML = `
        <div class="capsule-text-panel">
            <span class="en-tag">BUILD YOUR PC</span>
            <span class="ar-tag">مهندس التجميعات</span>
        </div>
        <div class="capsule-icon-zone">
            <div class="pulse-radar"></div>
            <i class="fas fa-tools main-widget-icon"></i>
            <span class="rig-indicator">// RIG</span>
        </div>
    `;
    
    document.body.appendChild(floatingBadge);
}

// تشغيل الدالة بشكل مستقل تماماً عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initCyberFloatingBuilder();
});