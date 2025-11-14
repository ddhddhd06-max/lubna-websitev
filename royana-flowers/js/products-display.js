// Products Display for Public Website
class ProductsDisplay {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 9;
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.setupEventListeners();
        this.hideLoading();
    }

    async loadProducts() {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Load from localStorage or use demo data
            const savedProducts = localStorage.getItem('flowers_products');
            
            if (savedProducts) {
                this.products = JSON.parse(savedProducts);
            } else {
                // Demo products data
                this.products = [
                    {
                        id: 1,
                        name: 'ورد أحمر هولندي',
                        nameEn: 'Dutch Red Rose',
                        category: 'ورود حمراء',
                        supplier: 'Holland Flowers',
                        origin: 'هولندا',
                        quantity: 500,
                        minOrder: 100,
                        price: 1500,
                        description: 'أجود أنواع الورود الحمراء الهولندية ذات الجودة العالية واللون النابض بالحياة. مثالية لتجار الجملة الذين يبحثون عن الجودة والتميز.',
                        images: ['🌹'],
                        inStock: true,
                        featured: true,
                        popularity: 95,
                        createdAt: new Date('2024-01-15')
                    },
                    {
                        id: 2,
                        name: 'ورد أبيض إكوادوري',
                        nameEn: 'Ecuadorian White Rose',
                        category: 'ورود بيضاء',
                        supplier: 'Ecuador Blooms',
                        origin: 'الإكوادور',
                        quantity: 300,
                        minOrder: 50,
                        price: 2000,
                        description: 'ورود بيضاء نقية من الإكوادور بشهرة عالمية. تتميز بطول الساق وكبر حجم الزهرة مما يجعلها مثالية للباقات الفاخرة.',
                        images: ['🌸'],
                        inStock: true,
                        featured: false,
                        popularity: 88,
                        createdAt: new Date('2024-01-10')
                    },
                    {
                        id: 3,
                        name: 'ورد وردي كيني',
                        nameEn: 'Kenyan Pink Rose',
                        category: 'ورود وردية',
                        supplier: 'Kenya Flowers',
                        origin: 'كينيا',
                        quantity: 0,
                        minOrder: 80,
                        price: 1800,
                        description: 'ورود وردية أنيقة من كينيا بتدرجات لونية رائعة. تشتهر برائحتها العطرة ومتانتها التي تجعلها تدوم لفترة أطول.',
                        images: ['💮'],
                        inStock: false,
                        featured: true,
                        popularity: 92,
                        createdAt: new Date('2024-01-08')
                    },
                    {
                        id: 4,
                        name: 'باقة متنوعة فاخرة',
                        nameEn: 'Luxury Mixed Bouquet',
                        category: 'باقات',
                        supplier: 'Global Bouquets',
                        origin: 'متنوع',
                        quantity: 150,
                        minOrder: 25,
                        price: 5000,
                        description: 'باقة فاخرة متنوعة من أفضل الورود العالمية. تشمل ورود حمراء وبيضاء ووردية مختارة بعناية لتتناسب مع جميع المناسبات.',
                        images: ['💐'],
                        inStock: true,
                        featured: true,
                        popularity: 98,
                        createdAt: new Date('2024-01-05')
                    },
                    {
                        id: 5,
                        name: 'زنبق أحمر',
                        nameEn: 'Red Lily',
                        category: 'زنابق',
                        supplier: 'Lily World',
                        origin: 'كولومبيا',
                        quantity: 200,
                        minOrder: 40,
                        price: 2500,
                        description: 'زنابق حمراء جميلة برائحة عطرة قوية. مثالية للتصميمات الفنية والباقات المميزة التي تترك انطباعاً لا ينسى.',
                        images: ['🌺'],
                        inStock: true,
                        featured: false,
                        popularity: 85,
                        createdAt: new Date('2024-01-03')
                    },
                    {
                        id: 6,
                        name: 'توليب متعدد الألوان',
                        nameEn: 'Multi-color Tulip',
                        category: 'توليب',
                        supplier: 'Tulip Masters',
                        origin: 'هولندا',
                        quantity: 400,
                        minOrder: 60,
                        price: 1200,
                        description: 'توليب بألوان متعددة وجذابة تشمل الأحمر والأصفر والوردي والأرجواني. تضيف لمسة من البهجة والحيوية لأي ترتيب زهري.',
                        images: ['🌷'],
                        inStock: true,
                        featured: true,
                        popularity: 90,
                        createdAt: new Date('2024-01-01')
                    },
                    {
                        id: 7,
                        name: 'ورد أصفر مشرق',
                        nameEn: 'Bright Yellow Rose',
                        category: 'ورود صفراء',
                        supplier: 'Sunshine Flowers',
                        origin: 'هولندا',
                        quantity: 350,
                        minOrder: 70,
                        price: 1700,
                        description: 'ورود صفراء مشرقة ترمز للصداقة والفرح. لونها الجذاب يجعلها خياراً مثالياً لباقات الصداقة والمناسبات السعيدة.',
                        images: ['🌼'],
                        inStock: true,
                        featured: false,
                        popularity: 82,
                        createdAt: new Date('2024-01-18')
                    },
                    {
                        id: 8,
                        name: 'باقة أعراس فاخرة',
                        nameEn: 'Luxury Wedding Bouquet',
                        category: 'باقات',
                        supplier: 'Wedding Specialists',
                        origin: 'متنوع',
                        quantity: 100,
                        minOrder: 30,
                        price: 7500,
                        description: 'باقة مصممة خصيصاً للأعراس الفاخرة، تجمع بين أجود الورود البيضاء والكريمية مع لمسات من الخضرة الفاخرة.',
                        images: ['💒'],
                        inStock: true,
                        featured: true,
                        popularity: 96,
                        createdAt: new Date('2024-01-20')
                    },
                    {
                        id: 9,
                        name: 'ورد برتقالي ناري',
                        nameEn: 'Fiery Orange Rose',
                        category: 'ورود برتقالية',
                        supplier: 'Tropical Blooms',
                        origin: 'كينيا',
                        quantity: 280,
                        minOrder: 55,
                        price: 1900,
                        description: 'ورود برتقالية نارية تعبر عن الحماس والطاقة. لونها الفريد يجعلها مميزة في أي ترتيب زهري أو باقة.',
                        images: ['🔥'],
                        inStock: true,
                        featured: false,
                        popularity: 79,
                        createdAt: new Date('2024-01-22')
                    }
                ];
            }

            this.filteredProducts = [...this.products];
            
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('حدث خطأ في تحميل المنتجات');
        }
    }

    renderProducts() {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToShow = this.filteredProducts.slice(startIndex, endIndex);

        if (productsToShow.length === 0) {
            this.showEmptyState();
            return;
        }

        container.innerHTML = productsToShow.map(product => `
            <div class="product-card fade-in" data-category="${product.category}" data-origin="${product.origin}">
                <div class="product-image">
                    <div class="product-emoji">${product.images[0]}</div>
                    ${product.featured ? '<div class="featured-badge">⭐ مميز</div>' : ''}
                    ${!product.inStock ? '<div class="out-of-stock-badge">🔴 غير متوفر</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-name-en">${product.nameEn}</p>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">الفئة:</span>
                            <span class="meta-value">${product.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">بلد المنشأ:</span>
                            <span class="meta-value">${product.origin}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">الحد الأدنى:</span>
                            <span class="meta-value">${product.minOrder} وحدة</span>
                        </div>
                    </div>

                    <div class="product-status">
                        <span class="status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                        </span>
                        <span class="stock-quantity">${product.quantity} وحدة متاحة</span>
                    </div>

                    <div class="product-actions">
                        <button class="btn btn-outline btn-sm" onclick="productsDisplay.viewProduct(${product.id})">
                            📋 تفاصيل أكثر
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="productsDisplay.contactAboutProduct(${product.id})" 
                                ${!product.inStock ? 'disabled' : ''}>
                            📞 استفسر عن السعر
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.updateLoadMoreButton();
        this.triggerAnimations();
    }

    setupEventListeners() {
        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => this.handleFilter());
        }

        // Origin filter
        const originFilter = document.getElementById('originFilter');
        if (originFilter) {
            originFilter.addEventListener('change', (e) => this.handleFilter());
        }

        // Stock filter
        const stockFilter = document.getElementById('stockFilter');
        if (stockFilter) {
            stockFilter.addEventListener('change', (e) => this.handleFilter());
        }

        // Sort by
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => this.handleSort());
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }
    }

    handleFilter() {
        const category = document.getElementById('categoryFilter').value;
        const origin = document.getElementById('originFilter').value;
        const stock = document.getElementById('stockFilter').value;

        this.filteredProducts = this.products.filter(product => {
            let matches = true;

            if (category && product.category !== category) {
                matches = false;
            }

            if (origin && product.origin !== origin) {
                matches = false;
            }

            if (stock === 'in-stock' && !product.inStock) {
                matches = false;
            } else if (stock === 'out-of-stock' && product.inStock) {
                matches = false;
            }

            return matches;
        });

        this.currentPage = 1;
        this.renderProducts();
    }

    handleSort() {
        const sortBy = document.getElementById('sortBy').value;

        this.filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'popular':
                    return b.popularity - a.popularity;
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                default:
                    return 0;
            }
        });

        this.currentPage = 1;
        this.renderProducts();
    }

    loadMore() {
        this.currentPage++;
        this.renderProducts();
    }

    updateLoadMoreButton() {
        const container = document.getElementById('loadMoreContainer');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!container || !loadMoreBtn) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (this.currentPage < totalPages) {
            container.style.display = 'block';
            loadMoreBtn.disabled = false;
            loadMoreBtn.textContent = 'تحميل المزيد';
        } else {
            container.style.display = 'none';
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Create modal for product details
        const modal = this.createProductModal(product);
        document.body.appendChild(modal);
        this.showModal(modal);
    }

    createProductModal(product) {
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="product-detail">
                        <div class="product-image-large">
                            <div class="product-emoji-large">${product.images[0]}</div>
                        </div>
                        <div class="product-details">
                            <p class="product-name-en">${product.nameEn}</p>
                            <p class="product-description">${product.description}</p>
                            
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <strong>الفئة:</strong>
                                    <span>${product.category}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>بلد المنشأ:</strong>
                                    <span>${product.origin}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>المورد:</strong>
                                    <span>${product.supplier}</span>
                                </div>
                                <div class="detail-item">
                                    <strong>الكمية المتاحة:</strong>
                                    <span class="${product.quantity === 0 ? 'out-of-stock' : 'in-stock'}">
                                        ${product.quantity} وحدة
                                    </span>
                                </div>
                                <div class="detail-item">
                                    <strong>الحد الأدنى للطلب:</strong>
                                    <span>${product.minOrder} وحدة</span>
                                </div>
                                <div class="detail-item">
                                    <strong>الحالة:</strong>
                                    <span class="status-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                                        ${product.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                                    </span>
                                </div>
                            </div>

                            <div class="product-actions-modal">
                                <button class="btn btn-primary" onclick="productsDisplay.contactAboutProduct(${product.id})" 
                                        ${!product.inStock ? 'disabled' : ''}>
                                    📞 استفسر عن السعر والكميات
                                </button>
                                <button class="btn btn-outline" onclick="productsDisplay.closeModal(this.closest('.product-modal'))">
                                    إغلاق
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add close event
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal(modal));
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal(modal));

        return modal;
    }

    showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        }, 300);
    }

    contactAboutProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Redirect to contact page with product info
        const message = `أرغب في الاستفسار عن سعر وكميات المنتج: ${product.name} (${product.nameEn})`;
        const url = `contact.html?product=${encodeURIComponent(product.name)}&message=${encodeURIComponent(message)}`;
        window.location.href = url;
    }

    triggerAnimations() {
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.1}s`;
            });
        }, 100);
    }

    hideLoading() {
        const loadingElement = document.getElementById('productsLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    showEmptyState() {
        const container = document.getElementById('productsGrid');
        const emptyState = document.getElementById('productsEmpty');
        const loadMoreContainer = document.getElementById('loadMoreContainer');
        
        if (container) container.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    }

    showError(message) {
        const container = document.getElementById('productsGrid');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>حدث خطأ</h3>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="productsDisplay.init()">إعادة المحاولة</button>
                </div>
            `;
        }
    }
}

// Initialize products display
const productsDisplay = new ProductsDisplay();