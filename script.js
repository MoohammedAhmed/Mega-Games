
class TronComets {
    constructor() {
        this.canvas = document.getElementById('tronGridCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.lights = [];
        this.colors = ['#ff4757', '#00d4ff', '#00ff88', '#ffa502']; 
        this.isActive = true;
        this.cometCount = 20;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('visibilitychange', () => { 
            this.isActive = !document.hidden; 
        });

        this.init();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.lights = [];
        for(let i = 0; i < this.cometCount; i++) {
            this.lights.push(this.createComet(true));
        }
    }

    createComet(isInitial = false) {
        const angle = (Math.PI / 4) + (Math.random() * Math.PI / 6); 
        const speed = 0.8 + Math.random() * 1.2;
        return {
            x: isInitial ? Math.random() * this.canvas.width : (Math.random() * this.canvas.width * 1.5) - 200,
            y: isInitial ? Math.random() * this.canvas.height : -100,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            length: 40 + Math.random() * 60,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            opacity: 0.1 + Math.random() * 0.3
        };
    }

    animate() {
        if (!this.isActive) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.fillStyle = 'rgba(5, 5, 5, 0.5)'; 
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.lights.forEach((comet, i) => {
            this.ctx.beginPath();
            const headX = comet.x + comet.vx * comet.length;
            const headY = comet.y + comet.vy * comet.length;
            const gradient = this.ctx.createLinearGradient(comet.x, comet.y, headX, headY);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1, comet.color);

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 1.2;
            this.ctx.globalAlpha = comet.opacity;
            this.ctx.moveTo(comet.x, comet.y);
            this.ctx.lineTo(headX, headY);
            this.ctx.stroke();

            comet.x += comet.vx; 
            comet.y += comet.vy;

            if (comet.y > this.canvas.height + 100 || comet.x > this.canvas.width + 100) {
                this.lights[i] = this.createComet();
            }
            this.ctx.globalAlpha = 1;
        });

        requestAnimationFrame(() => this.animate());
    }
}

const productsData = [
    { name: "Nvidia RTX 4090", brand: "NVIDIA", price: "75,000 EGP", type: "GPU" },
    { name: "AMD Radeon RX 7900", brand: "AMD", price: "48,000 EGP", type: "GPU" },
    { name: "ASUS ROG Motherboard", brand: "ASUS", price: "18,000 EGP", type: "MB" },
    { name: "Intel Core i9-13900K", brand: "Intel", price: "24,000 EGP", type: "CPU" }
];

const accessoriesData = [
    { name: "Logitech G502 Hero", brand: "Logitech", price: "2,800 EGP", type: "MOUSE" },
    { name: "Razer BlackWidow V4", brand: "Razer", price: "6,500 EGP", type: "KB" },
    { name: "HyperX Cloud II", brand: "HyperX", price: "3,800 EGP", type: "HEADSET" },
    { name: "Logitech G Pro Keyboard", brand: "Logitech", price: "4,200 EGP", type: "KB" },
    { name: "Razer DeathAdder", brand: "Razer", price: "3,100 EGP", type: "MOUSE" },
    { name: "SteelSeries QcK Pad", brand: "SteelSeries", price: "1,200 EGP", type: "MOUSEPAD" }
];

const newsData = [
    { title: "إطلاق كروت RTX 5090 قريباً", category: "Hardware", img: "News" },
    { title: "تحديث جديد للعبة GTA VI", category: "Games", img: "News" }
];

async function renderProducts() {   
    const container = document.getElementById('partsGrid') || document.getElementById('accessoriesGrid') || document.getElementById('dataGrid');
    if (!container) return; // حماية في حال عدم وجود حاوية للمنتجات في الصفحة

    try {
        // 1. جلب البيانات من ملف الـ JSON
        const response = await fetch('products.json');
        
        // التحقق من أن الملف متاح
        if (!response.ok) throw new Error(`لم يتم العثور على ملف البيانات (Status: ${response.status})`);
        
        const data = await response.json();
        
        // 2. تحديد نوع المنتجات بناءً على الصفحة الحالية
        let products = [];
        if (document.getElementById('partsGrid')) products = data.hardware || [];
        else if (document.getElementById('accessoriesGrid')) products = data.accessories || [];
        else if (document.getElementById('dataGrid')) products = data.dataGrid || [];
 
        // 3. تطبيق منطق التصفية (Filters) - try inside try لحماية البحث
        const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || "";
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filter:checked')).map(cb => cb.value.toLowerCase());
        const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value.toLowerCase());
        const selectedFilm = Array.from(document.querySelectorAll('.Film-filter:checked')).map(cb => cb.value.toLowerCase());
        const selectedGames = Array.from(document.querySelectorAll('.Games-filter:checked')).map(cb => cb.value.toLowerCase());
        const selectedPrograms = Array.from(document.querySelectorAll('.Programs-filter:checked')).map(cb => cb.value.toLowerCase());
        const selectedBrFilm = Array.from(document.querySelectorAll('.Film-filter:checked')).map(cb => cb.value.toLowerCase());
       

        const filtered = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm) || 
                                 p.brand.toLowerCase().includes(searchTerm) ||
                                 (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm)));
            
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand.toLowerCase());
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(p.type.toLowerCase());
            const matchesFilm = selectedFilm.length === 0 || selectedFilm.includes(p.type.toLowerCase()) || selectedFilm.includes(p.brand.toLowerCase());
            const matchesGames = selectedGames.length === 0 || selectedGames.includes(p.type.toLowerCase());
            const matchesPrograms = selectedPrograms.length === 0 || selectedPrograms.includes(p.type.toLowerCase());
            const matchesBrFilm = selectedBrFilm.length === 0 || selectedBrFilm.includes(p.type.toLowerCase());


            return matchesSearch && matchesBrand && matchesType && matchesFilm && matchesGames && matchesPrograms && matchesBrFilm;
        });

        // 4. عرض النتائج أو رسالة "لا يوجد نتائج"
        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: var(--neon-blue);">
                    <p>لم يتم العثور على منتجات تطابق بحثك 🔍</p>
                </div>`;
            return;
        }

        // 5. بناء الـ HTML بنفس التصميم الذي طلبته
        container.innerHTML = filtered.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image-container">
                    <div class="product-img-place">${product.type}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <div class="product-footer">
                        <span class="product-price-small">${product.price}</span>
                        <button class="buy-btn">التفاصيل</button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        // إدارة الخطأ: بدلاً من توقف الموقع، نعرض رسالة خطأ للمستخدم
        console.error("Critical Render Error:", error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; border: 1px dashed var(--primary-red);">
                <p style="color: var(--primary-red);">⚠️ عذراً، حدث خطأ أثناء تحميل المنتجات.</p>
                <small style="color: #666;">${error.message}</small>
                <br>
                <button onclick="location.reload()" style="margin-top:15px; cursor:pointer; background:none; border:1px solid var(--neon-green); color:var(--neon-green); padding:5px 10px;">إعادة محاولة</button>
            </div>`;
    }
}

// 4. دالة الصفحة الرئيسية
function renderHomePage() {
    const newsGrid = document.getElementById('latestNewsGrid');
    if (newsGrid) {
        newsGrid.innerHTML = newsData.map(news => `
            <div class="product-card">
                <div class="product-img-placeholder">${news.img}</div>
                <h4 style="margin:10px 0;">${news.title}</h4>
                <p style="color:var(--primary-red); font-size:0.8rem; font-weight:bold;">${news.category}</p>
            </div>
        `).join('');
    }

    const latestParts = document.getElementById('latestPartsGrid');
    if (latestParts) {
        latestParts.innerHTML = productsData.slice(0, 4).map(item => `
            <div class="product-card">
                <div class="product-info-wrapper">
                    <div class="part-icon-tag">${item.type}</div>
                    <h4 class="product-name-small">${item.name}</h4>
                </div>
                <div class="product-price-small">${item.price}</div>
            </div>
        `).join('');
    }
}

// 5. تهيئة الأحداث (Initialization)
window.addEventListener('load', () => {
    // تشغيل الخلفية
    new TronComets();

    // فحص أي صفحة نحن فيها
    if (document.getElementById('latestNewsGrid')) {
        renderHomePage();
    } else {
        renderProducts();
    }

    // إدارة البحث المنسدل
    const searchTrigger = document.getElementById('searchTrigger');
    const searchDropdown = document.getElementById('searchDropdown');
    const searchInput = document.getElementById('searchInput');

    if (searchTrigger && searchDropdown) {
        searchTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const active = searchDropdown.classList.toggle('active');
            if (active && searchInput) setTimeout(() => searchInput.focus(), 200);
        });

        document.addEventListener('click', (e) => {
            if (!searchDropdown.contains(e.target) && e.target !== searchTrigger) {
                searchDropdown.classList.remove('active');
            }
        });
    }

    // مدخل البحث
    if (searchInput) {
        searchInput.addEventListener('input', renderProducts);
    }

    // استماع لتغييرات الفلاتر (Checkboxes)
    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            renderProducts();
        }
    });

    // أنيميشن الانتقال بين الصفحات
    document.querySelectorAll('.nav-btn, .logo-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('http')) {
                e.preventDefault();
                document.body.style.transition = "opacity 0.3s";
                document.body.style.opacity = "0";
                setTimeout(() => { window.location.href = href; }, 300);
            }
        });
    });
});

// تفعيل القوائم القابلة للطي
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const parent = header.parentElement;
        parent.classList.toggle('active');
    });
});

window.onscroll = function() {
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    document.getElementById("myProgressBar").style.width = scrolled + "%";
};



// مصفوفة البيانات (جاهزة للربط بالباك إند)
        const reviewsData = [
            {
                id: 101,
                title: "مراجعة RTX 5090: وحش الأداء الذي تخطى التوقعات",
                category: "gpu",
                score: 98,
                views: "12.5K",
                readTime: "8 MIN",
                img: "gpu-review.jpg", // حط هنا مسار صورتك
                excerpt: "تحليل معمق لمعمارية Blackwell الجديدةوقفزة الأداء في تتبع الأشعة.",
                isFeatured: true
            },
            {
                id: 102,
                title: "هل ما زال Core i9-14900K الخيار الأفضل؟",
                category: "cpu",
                score: 88,
                views: "4.2K",
                readTime: "5 MIN",
                img: "cpu-review.jpg",
                excerpt: "مراجعة شاملة بعد 6 أشهر من الاستخدام المستمر في برامج الرندر والألعاب.",
                isFeatured: false
            },
            {
                id: 103,
                title: "تجميعة الـ 1000 دولار: أفضل قيمة في 2026",
                category: "builds",
                score: 92,
                views: "8.1K",
                readTime: "10 MIN",
                img: "pc-build.jpg",
                excerpt: "لقد جمعنا قطع هاردوير متناغمة لتقديم أداء 1440p ممتاز دون كسر الميزانية."
            }
        ];

        const grid = document.getElementById('articles-grid');

        // دالة إنشاء كارت المقال (Template)
        function createCard(article) {
            // التوحيد: أي مقال تقييمه عالي بياخد توهج أحمر أقوى بدل الذهبي
            const isElite = article.score >= 90;
            const cardClass = isElite ? 'article-card high-score' : 'article-card';
            
            return `
                <article class="${cardClass} ${article.isFeatured ? 'featured' : ''}" onclick="window.location.href='details.html?id=${article.id}'">
                    <div class="card-img-wrap">
                        <img src="${article.img}" alt="${article.title}">
                        <span class="card-tag">${article.category.toUpperCase()}</span>
                        <div class="hud-stats">
                            <span class="hud-tag"><i class="fas fa-eye"></i> ${article.views}</span>
                            <span class="hud-tag"><i class="fas fa-star"></i> ${article.score}%</span>
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-meta">ENTRY_FILE: #RE-${article.id}</div>
                        <h3 class="card-title">${article.title}</h3>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${article.score}%"></div>
                        </div>
                        <p class="card-excerpt">${article.excerpt}</p>
                        <span class="read-more-btn">فحص كامل البيانات ←</span>
                    </div>
                </article>
            `;
        }

        // دالة عرض المقالات بناءً على الفلتر
        function renderReviews(filter = 'all') {
            grid.innerHTML = "";
            const filtered = filter === 'all' 
                ? reviewsData 
                : reviewsData.filter(r => r.category === filter);

            filtered.forEach(article => {
                grid.innerHTML += createCard(article);
            });
        }

        // تفعيل أزرار الفلترة
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelector('.filter-btn.active').classList.remove('active');
                this.classList.add('active');
                renderReviews(this.dataset.cat);
            });
        });

        // تشغيل العرض عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => renderReviews());




const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        const btn = this;
        const successOverlay = document.getElementById('successOverlay');

        btn.classList.add('is-loading');

        setTimeout(() => {
            if (successOverlay) successOverlay.classList.add('active');
            btn.classList.remove('is-loading');
        }, 3000);
    });
}




// ==========================================================================
// MEGA GAMES - CORE AUTH CONTROLLER & BACKEND HANDLERS (FIXED)
// ==========================================================================

// 1. دالة معالجة بيانات الباك إند (جاهزة ومفتوحة لربط الـ API لاحقاً)
function handleAuth(event, type) {
    event.preventDefault();

    if (type === 'login') {
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;
        // (في الحقيقة هنا كان ممكن تتحقق من البيانات)
        
        // تخزين حالة تسجيل الدخول + اسم المستخدم (مؤقت)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', email.split('@')[0]); // أو استخدم اسم ثابت
        alert('تم الوصول بنجاح إلى نظام نيون سيستم!');
        window.location.href = 'index.html';

    } else if (type === 'register') {
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPassword').value;

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        alert('تم إنشاء ملفك الشخصي بنجاح!');
        window.location.href = 'index.html';
    }
}

// دالة الـ handleAuth جاهزة للباك إند ومفصولة عشان متعملش كراش
function handleAuth(event, type) {
    event.preventDefault();
    alert(type === 'login' ? 'تم الوصول بنجاح إلى نظام نيون سيستم!' : 'تم إنشاء ملفك الشخصي بنجاح!');
    window.location.href = 'index.html';
}

// تشغيل المحرك السليم للتبديل بدون تخريب التصميم
document.addEventListener('DOMContentLoaded', () => {
    new TronComets();

    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();

                // 1. شيل التنشيط من التابات
                authTabs.forEach(t => t.classList.remove('active'));
                // 2. شيل التنشيط من الفورمات
                document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
                
                // 3. نشط التاب اللي دُست عليه
                this.classList.add('active');
                
                // 4. اظهر الفورم المربوطة فوراً بكلاس active الأصلي بتاعك
                const targetTab = this.getAttribute('data-tab');
                if (targetTab === 'login' && loginForm) {
                    loginForm.classList.add('active');
                } else if (targetTab === 'register' && registerForm) {
                    registerForm.classList.add('active');
                }
            });
        });
    }

    // ربط السُبميت بدالة الباك إند
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => handleAuth(e, 'login'));
    }
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => handleAuth(e, 'register'));
    }
});


// ==========================================================================
// MEGA GAMES - PC BUILDER ENGINE
// ==========================================================================
let currentBuild = { cpu: 0, gpu: 0, ram: 0 };

function updateBuildSummary(category, selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    const text = selectedOption.value ? selectedOption.text.split(' (+')[0] : "لم يتم الاختيار بعد";

    // تحديث السعر في الذاكرة
    currentBuild[category] = price;

    // تحديث اسم المنتج المكتوب تحت العنوان
    const card = selectElement.closest('.step-card');
    if (card) {
        card.querySelector('.selected-product-name').innerText = text;
        if(selectedOption.value) {
            card.querySelector('.selected-product-name').style.color = 'var(--primary-red)';
        } else {
            card.querySelector('.selected-product-name').style.color = '#666';
        }
    }

    // حساب الإجمالي
    const total = currentBuild.cpu + currentBuild.gpu + currentBuild.ram;
    // بالعدّاد التصاعدي الأنيميشن الفخم ده:
    const targetPriceElement = document.getElementById('totalBuildPrice');
    const startPrice = parseFloat(targetPriceElement.innerText.replace(/,/g, '')) || 0;
    const duration = 800; // سرعة العداد بالملي ثانية
    const startTime = performance.now();

    function animatePrice(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // تأثير تسارع انسيابي للعداد
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentPrice = startPrice + (total - startPrice) * easeProgress;
        
        targetPriceElement.innerText = Math.floor(currentPrice).toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(animatePrice);
        }
    }
    requestAnimationFrame(animatePrice);}

    function addEntireBuildToCart() {
        const total = currentBuild.cpu + currentBuild.gpu + currentBuild.ram;
        if(total === 0) {
            alert("// ERROR: لا يمكن شحن تجميعة فارغة!");
            return;
        }
        alert(`// ACCESS_GRANTED: تم دمج التجميعة وشحنها للسلة! الإجمالي: ${total.toLocaleString()} ج.م`);
}// ==========================================================================
// MEGA GAMES - COMPLETE STABLE PC BUILDER ENGINE
// ==========================================================================
// تعريف كائن التجميعة ليشمل كافة المكونات الثمانية الجديدة
let currentBuild = { 
    cpu: 0, 
    mobo: 0, 
    gpu: 0, 
    ram: 0, 
    storage: 0, 
    psu: 0, 
    cooler: 0, 
    case: 0 
};

function updateBuildSummary(category, selectElement) {
    if (!selectElement) return;

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (!selectedOption) return;

    const price = parseFloat(selectedOption.getAttribute('data-price')) || 0;
    const text = selectedOption.value ? selectedOption.text.split(' (+')[0] : "لم يتم الاختيار بعد";

    // 1. حفظ السعر لايف في خانة القطعة الخاصة به
    currentBuild[category] = price;

    // 2. تحديث واجهة الكرت بالنص المختار وتلوينه
    const card = selectElement.closest('.step-card');
    if (card) {
        const nameLabel = card.querySelector('.selected-product-name');
        if (nameLabel) {
            nameLabel.innerText = text;
            nameLabel.style.color = selectedOption.value ? 'var(--primary-red)' : '#666';
        }
    }

    // 3. جمع كافة مكونات التجميعة الـ 8 الرياضية بشكل معزول وآمن
    const total = (currentBuild.cpu || 0) + 
                  (currentBuild.mobo || 0) + 
                  (currentBuild.gpu || 0) + 
                  (currentBuild.ram || 0) + 
                  (currentBuild.storage || 0) + 
                  (currentBuild.psu || 0) + 
                  (currentBuild.cooler || 0) + 
                  (currentBuild.case || 0);

    // 4. عرض الإجمالي الفوري في كارت الحساب الجانبي
    const priceDisplay = document.getElementById('totalBuildPrice');
    if (priceDisplay) {
        priceDisplay.innerText = total.toLocaleString();
    }
}

function addEntireBuildToCart() {
    const total = (currentBuild.cpu || 0) + 
                  (currentBuild.mobo || 0) + 
                  (currentBuild.gpu || 0) + 
                  (currentBuild.ram || 0) + 
                  (currentBuild.storage || 0) + 
                  (currentBuild.psu || 0) + 
                  (currentBuild.cooler || 0) + 
                  (currentBuild.case || 0);
                  
    if (total === 0) {
        alert("// ERROR: برجاء اختيار قطع التجميعة أولاً قبل الإرسال للسلة.");
        return;
    }
    alert(`// SUCCESS: تم إضافة التجميعة الكاملة بنجاح إلى السلة! الإجمالي: ${total.toLocaleString()} ج.م.`);
}