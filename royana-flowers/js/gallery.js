// Gallery Management
class GalleryManager {
    constructor() {
        this.galleryItems = [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadGalleryItems();
        this.setupEventListeners();
        this.setupFiltering();
    }

    loadGalleryItems() {
        this.galleryItems = [
            {
                id: 1,
                title: 'باقة فاخرة',
                description: 'باقة متنوعة من الورود الحمراء والبيضاء مع لمسات من الخضرة',
                category: 'bouquets',
                image: '💐',
                date: 'يناير 2024',
                featured: true
            },
            {
                id: 2,
                title: 'حفل تخرج',
                description: 'تصميم خاص لحفل تخرج جامعي بألوان المدرسة',
                category: 'events',
                image: '🎓',
                date: 'ديسمبر 2023',
                featured: true
            },
            {
                id: 3,
                title: 'تصميم فني',
                description: 'تركيبة فنية من الورود بأنماط مبتكرة وألوان متناغمة',
                category: 'designs',
                image: '🎨',
                date: 'نوفمبر 2023',
                featured: false
            },
            {
                id: 4,
                title: 'زفاف مميز',
                description: 'تصميمات ورود لحفل زفاف فاخر في قاعة راقية',
                category: 'weddings',
                image: '💒',
                date: 'أكتوبر 2023',
                featured: true
            },
            {
                id: 5,
                title: 'باقة حمراء',
                description: 'باقة ورود حمراء كلاسيكية بتصميم أنيق وجذاب',
                category: 'bouquets',
                image: '🌹',
                date: 'سبتمبر 2023',
                featured: false
            },
            {
                id: 6,
                title: 'افتتاح شركة',
                description: 'تصميمات ورود لافتتاح شركة جديدة بألوان الشعار',
                category: 'events',
                image: '🏢',
                date: 'أغسطس 2023',
                featured: true
            },
            {
                id: 7,
                title: 'تصميم حديث',
                description: 'تركيبة عصرية تجمع بين الورود والعناصر الطبيعية',
                category: 'designs',
                image: '✨',
                date: 'يوليو 2023',
                featured: false
            },
            {
                id: 8,
                title: 'عرس تقليدي',
                description: 'تصميمات ورود لحفل زفاف تقليدي بألوان تراثية',
                category: 'weddings',
                image: '👰',
                date: 'يونيو 2023',
                featured: true
            }
        ];
    }

    setupEventListeners() {
        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.handleFilterChange(e.target.dataset.filter);
            });
        });

        // Gallery item clicks
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const itemId = parseInt(galleryItem.dataset.id);
                this.openLightbox(itemId);
            }
        });
    }

    setupFiltering() {
        this.renderGallery();
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderGallery();
    }

    renderGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;

        const filteredItems = this.currentFilter === 'all' 
            ? this.galleryItems 
            : this.galleryItems.filter(item => item.category === this.currentFilter);

        container.innerHTML = filteredItems.map(item => `
            <div class="gallery-item" data-category="${item.category}" data-id="${item.id}">
                <div class="gallery-card">
                    <div class="gallery-image">
                        <div class="image-placeholder">${item.image}</div>
                        ${item.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
                        <div class="gallery-overlay">
                            <button class="view-btn">👁️ عرض</button>
                        </div>
                    </div>
                    <div class="gallery-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <div class="gallery-meta">
                            <span class="category">${this.getCategoryName(item.category)}</span>
                            <span class="date">${item.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        this.animateGalleryItems();
    }

    getCategoryName(category) {
        const categories = {
            'bouquets': 'باقات',
            'events': 'مناسبات',
            'designs': 'تصميمات',
            'weddings': 'أعراس'
        };
        return categories[category] || category;
    }

    animateGalleryItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('fade-in');
        });
    }

    openLightbox(itemId) {
        const item = this.galleryItems.find(i => i.id === itemId);
        if (!item) return;

        const lightbox = this.createLightbox(item);
        document.body.appendChild(lightbox);
        this.showLightbox(lightbox);
    }

    createLightbox(item) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-nav lightbox-prev">‹</button>
                <button class="lightbox-nav lightbox-next">›</button>
                
                <div class="lightbox-body">
                    <div class="lightbox-image">
                        <div class="image-placeholder-large">${item.image}</div>
                    </div>
                    <div class="lightbox-info">
                        <h2>${item.title}</h2>
                        <p class="lightbox-description">${item.description}</p>
                        
                        <div class="lightbox-meta">
                            <div class="meta-item">
                                <strong>الفئة:</strong>
                                <span>${this.getCategoryName(item.category)}</span>
                            </div>
                            <div class="meta-item">
                                <strong>التاريخ:</strong>
                                <span>${item.date}</span>
                            </div>
                            <div class="meta-item">
                                <strong>الحالة:</strong>
                                <span class="status ${item.featured ? 'featured' : 'normal'}">
                                    ${item.featured ? '⭐ تصميم مميز' : '⚫ تصميم عادي'}
                                </span>
                            </div>
                        </div>

                        <div class="lightbox-features">
                            <h4>مميزات التصميم:</h4>
                            <ul>
                                <li>جودة عالية في اختيار الورود</li>
                                <li>تصميم مبتكر وجذاب</li>
                                <li>مناسب للمناسبة المستهدفة</li>
                                <li>ألوان متناغمة ومتناسقة</li>
                            </ul>
                        </div>

                        <div class="lightbox-actions">
                            <button class="btn btn-primary" onclick="galleryManager.contactAboutDesign(${item.id})">
                                📞 اطلب تصميم مشابه
                            </button>
                            <button class="btn btn-outline" onclick="galleryManager.shareDesign(${item.id})">
                                🔗 مشاركة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        lightbox.querySelector('.lightbox-close').addEventListener('click', () => this.closeLightbox(lightbox));
        lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => this.closeLightbox(lightbox));
        lightbox.querySelector('.lightbox-prev').addEventListener('click', () => this.navigateLightbox(-1, itemId));
        lightbox.querySelector('.lightbox-next').addEventListener('click', () => this.navigateLightbox(1, itemId));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboardNavigation(e, lightbox, itemId));

        return lightbox;
    }

    showLightbox(lightbox) {
        lightbox.style.display = 'block';
        setTimeout(() => {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    closeLightbox(lightbox) {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightbox.style.display = 'none';
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    }

    navigateLightbox(direction, currentId) {
        const filteredItems = this.currentFilter === 'all' 
            ? this.galleryItems 
            : this.galleryItems.filter(item => item.category === this.currentFilter);
        
        const currentIndex = filteredItems.findIndex(item => item.id === currentId);
        let newIndex = currentIndex + direction;
        
        if (newIndex < 0) newIndex = filteredItems.length - 1;
        if (newIndex >= filteredItems.length) newIndex = 0;
        
        const newItem = filteredItems[newIndex];
        
        // Close current lightbox and open new one
        const currentLightbox = document.querySelector('.lightbox');
        if (currentLightbox) {
            this.closeLightbox(currentLightbox);
            setTimeout(() => {
                this.openLightbox(newItem.id);
            }, 300);
        }
    }

    handleKeyboardNavigation(e, lightbox, currentId) {
        if (!lightbox) return;
        
        switch(e.key) {
            case 'Escape':
                this.closeLightbox(lightbox);
                break;
            case 'ArrowLeft':
                this.navigateLightbox(-1, currentId);
                break;
            case 'ArrowRight':
                this.navigateLightbox(1, currentId);
                break;
        }
    }

    contactAboutDesign(designId) {
        const design = this.galleryItems.find(item => item.id === designId);
        if (!design) return;

        const message = `أرغب في طلب تصميم مشابه للتصميم: ${design.title} - ${design.description}`;
        const url = `contact.html?design=${encodeURIComponent(design.title)}&message=${encodeURIComponent(message)}`;
        window.location.href = url;
    }

    shareDesign(designId) {
        const design = this.galleryItems.find(item => item.id === designId);
        if (!design) return;

        const shareText = `شاهد هذا التصميم الرائع من رويانا: ${design.title} - ${design.description}`;
        const shareUrl = window.location.href + `?design=${designId}`;
        
        if (navigator.share) {
            navigator.share({
                title: design.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText + ' ' + shareUrl).then(() => {
                if (window.flowerApp) {
                    window.flowerApp.showNotification('تم نسخ رابط التصميم', 'success');
                }
            });
        }
    }
}

// Initialize gallery manager
const galleryManager = new GalleryManager();