// Products Management
class ProductsManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('flowers_products')) || [];
        this.currentProduct = null;
        this.init();
    }

    init() {
        this.renderProductsTable();
        this.setupEventListeners();
        this.loadInitialProducts();
    }

    setupEventListeners() {
        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Edit product form
        const editProductForm = document.getElementById('editProductForm');
        if (editProductForm) {
            editProductForm.addEventListener('submit', (e) => this.handleEditProduct(e));
        }

        // Search functionality
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => this.handleSearch(e), 300));
        }

        // Filter functionality
        const filterSelect = document.getElementById('productFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e));
        }

        // Export buttons
        const exportBtn = document.getElementById('exportProducts');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportProducts());
        }
    }

    loadInitialProducts() {
        if (this.products.length === 0) {
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
                    description: 'أجود أنواع الورود الحمراء الهولندية ذات الجودة العالية',
                    images: ['🌹'],
                    inStock: true,
                    featured: true,
                    createdAt: new Date('2024-01-15'),
                    updatedAt: new Date('2024-01-15')
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
                    description: 'ورود بيضاء نقية من الإكوادور بشهرة عالمية',
                    images: ['🌸'],
                    inStock: true,
                    featured: false,
                    createdAt: new Date('2024-01-10'),
                    updatedAt: new Date('2024-01-10')
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
                    description: 'ورود وردية أنيقة من كينيا بتدرجات لونية رائعة',
                    images: ['💮'],
                    inStock: false,
                    featured: true,
                    createdAt: new Date('2024-01-08'),
                    updatedAt: new Date('2024-01-12')
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
                    description: 'باقة فاخرة متنوعة من أفضل الورود العالمية',
                    images: ['💐'],
                    inStock: true,
                    featured: true,
                    createdAt: new Date('2024-01-05'),
                    updatedAt: new Date('2024-01-05')
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
                    description: 'زنابق حمراء جميلة برائحة عطرة',
                    images: ['🌺'],
                    inStock: true,
                    featured: false,
                    createdAt: new Date('2024-01-03'),
                    updatedAt: new Date('2024-01-03')
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
                    description: 'توليب بألوان متعددة وجذابة',
                    images: ['🌷'],
                    inStock: true,
                    featured: true,
                    createdAt: new Date('2024-01-01'),
                    updatedAt: new Date('2024-01-01')
                }
            ];
            this.saveProducts();
        }
    }

    renderProductsTable(filteredProducts = null) {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;

        const productsToRender = filteredProducts || this.products;

        tbody.innerHTML = productsToRender.map(product => `
            <tr class="fade-in">
                <td>
                    <div class="product-cell">
                        <span class="product-emoji">${product.images[0]}</span>
                        <div class="product-info">
                            <strong>${product.name}</strong>
                            <small>${product.nameEn}</small>
                        </div>
                    </div>
                </td>
                <td>${product.category}</td>
                <td>${product.supplier}</td>
                <td>${product.origin}</td>
                <td>
                    <span class="quantity-badge ${product.quantity === 0 ? 'out-of-stock' : product.quantity < 100 ? 'low-stock' : 'in-stock'}">
                        ${product.quantity}
                    </span>
                </td>
                <td>${product.minOrder}</td>
                <td>
                    <span class="price">${utils.formatPrice(product.price)}</span>
                </td>
                <td>
                    <span class="status-badge ${product.inStock ? 'status-active' : 'status-inactive'}">
                        ${product.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                    </span>
                </td>
                <td>
                    <span class="featured-badge ${product.featured ? 'featured-yes' : 'featured-no'}">
                        ${product.featured ? '⭐ مميز' : '⚫ عادي'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-edit" onclick="productsManager.openEditModal(${product.id})" title="تعديل">
                            ✏️
                        </button>
                        <button class="btn-action btn-delete" onclick="productsManager.deleteProduct(${product.id})" title="حذف">
                            🗑️
                        </button>
                        <button class="btn-action btn-view" onclick="productsManager.viewProduct(${product.id})" title="عرض">
                            👁️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateProductsSummary();
    }

    updateProductsSummary() {
        const totalProducts = this.products.length;
        const inStockProducts = this.products.filter(p => p.inStock).length;
        const outOfStockProducts = this.products.filter(p => !p.inStock).length;
        const featuredProducts = this.products.filter(p => p.featured).length;
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.quantity), 0);

        // Update summary cards
        document.getElementById('totalProducts')?.textContent = totalProducts;
        document.getElementById('inStockProducts')?.textContent = inStockProducts;
        document.getElementById('outOfStockProducts')?.textContent = outOfStockProducts;
        document.getElementById('featuredProducts')?.textContent = featuredProducts;
        document.getElementById('totalValue')?.textContent = utils.formatPrice(totalValue);
    }

    handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newProduct = {
            id: Date.now(),
            name: formData.get('name'),
            nameEn: formData.get('nameEn'),
            category: formData.get('category'),
            supplier: formData.get('supplier'),
            origin: formData.get('origin'),
            quantity: parseInt(formData.get('quantity')),
            minOrder: parseInt(formData.get('minOrder')),
            price: parseInt(formData.get('price')),
            description: formData.get('description'),
            images: [formData.get('emoji') || '🌹'],
            inStock: formData.get('inStock') === 'on',
            featured: formData.get('featured') === 'on',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.products.unshift(newProduct);
        this.saveProducts();
        this.renderProductsTable();
        
        // Close modal and show notification
        this.closeModal('addProductModal');
        e.target.reset();
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم إضافة المنتج بنجاح', 'success');
        }
    }

    handleEditProduct(e) {
        e.preventDefault();
        if (!this.currentProduct) return;

        const formData = new FormData(e.target);
        
        const updatedProduct = {
            ...this.currentProduct,
            name: formData.get('name'),
            nameEn: formData.get('nameEn'),
            category: formData.get('category'),
            supplier: formData.get('supplier'),
            origin: formData.get('origin'),
            quantity: parseInt(formData.get('quantity')),
            minOrder: parseInt(formData.get('minOrder')),
            price: parseInt(formData.get('price')),
            description: formData.get('description'),
            images: [formData.get('emoji') || '🌹'],
            inStock: formData.get('inStock') === 'on',
            featured: formData.get('featured') === 'on',
            updatedAt: new Date()
        };

        const index = this.products.findIndex(p => p.id === this.currentProduct.id);
        if (index !== -1) {
            this.products[index] = updatedProduct;
            this.saveProducts();
            this.renderProductsTable();
            
            this.closeModal('editProductModal');
            if (window.flowerApp) {
                window.flowerApp.showNotification('تم تعديل المنتج بنجاح', 'success');
            }
        }
    }

    openEditModal(productId) {
        this.currentProduct = this.products.find(p => p.id === productId);
        if (!this.currentProduct) return;

        const modal = document.getElementById('editProductModal');
        const form = document.getElementById('editProductForm');

        // Fill form with product data
        form.querySelector('[name="name"]').value = this.currentProduct.name;
        form.querySelector('[name="nameEn"]').value = this.currentProduct.nameEn;
        form.querySelector('[name="category"]').value = this.currentProduct.category;
        form.querySelector('[name="supplier"]').value = this.currentProduct.supplier;
        form.querySelector('[name="origin"]').value = this.currentProduct.origin;
        form.querySelector('[name="quantity"]').value = this.currentProduct.quantity;
        form.querySelector('[name="minOrder"]').value = this.currentProduct.minOrder;
        form.querySelector('[name="price"]').value = this.currentProduct.price;
        form.querySelector('[name="description"]').value = this.currentProduct.description;
        form.querySelector('[name="emoji"]').value = this.currentProduct.images[0];
        form.querySelector('[name="inStock"]').checked = this.currentProduct.inStock;
        form.querySelector('[name="featured"]').checked = this.currentProduct.featured;

        this.openModal('editProductModal');
    }

    deleteProduct(productId) {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.renderProductsTable();
            
            if (window.flowerApp) {
                window.flowerApp.showNotification('تم حذف المنتج بنجاح', 'success');
            }
        }
    }

    viewProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('viewProductModal');
        const content = modal.querySelector('.modal-body');
        
        content.innerHTML = `
            <div class="product-detail-view">
                <div class="product-header">
                    <span class="product-emoji-large">${product.images[0]}</span>
                    <div class="product-titles">
                        <h3>${product.name}</h3>
                        <p class="product-name-en">${product.nameEn}</p>
                    </div>
                </div>
                
                <div class="product-details-grid">
                    <div class="detail-item">
                        <label>الفئة:</label>
                        <span>${product.category}</span>
                    </div>
                    <div class="detail-item">
                        <label>المورد:</label>
                        <span>${product.supplier}</span>
                    </div>
                    <div class="detail-item">
                        <label>بلد المنشأ:</label>
                        <span>${product.origin}</span>
                    </div>
                    <div class="detail-item">
                        <label>الكمية المتاحة:</label>
                        <span class="quantity-badge ${product.quantity === 0 ? 'out-of-stock' : product.quantity < 100 ? 'low-stock' : 'in-stock'}">
                            ${product.quantity}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>الحد الأدنى للطلب:</label>
                        <span>${product.minOrder}</span>
                    </div>
                    <div class="detail-item">
                        <label>السعر:</label>
                        <span class="price">${utils.formatPrice(product.price)}</span>
                    </div>
                    <div class="detail-item">
                        <label>الحالة:</label>
                        <span class="status-badge ${product.inStock ? 'status-active' : 'status-inactive'}">
                            ${product.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>مميز:</label>
                        <span class="featured-badge ${product.featured ? 'featured-yes' : 'featured-no'}">
                            ${product.featured ? '⭐ نعم' : '⚫ لا'}
                        </span>
                    </div>
                </div>
                
                <div class="product-description">
                    <label>الوصف:</label>
                    <p>${product.description}</p>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <small>تم الإنشاء: ${utils.formatDate(product.createdAt)}</small>
                    </div>
                    <div class="meta-item">
                        <small>آخر تعديل: ${utils.formatDate(product.updatedAt)}</small>
                    </div>
                </div>
            </div>
        `;

        this.openModal('viewProductModal');
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.nameEn.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.supplier.toLowerCase().includes(searchTerm) ||
            product.origin.toLowerCase().includes(searchTerm)
        );
        this.renderProductsTable(filteredProducts);
    }

    handleFilter(e) {
        const filterValue = e.target.value;
        let filteredProducts = this.products;

        switch (filterValue) {
            case 'in-stock':
                filteredProducts = this.products.filter(p => p.inStock);
                break;
            case 'out-of-stock':
                filteredProducts = this.products.filter(p => !p.inStock);
                break;
            case 'featured':
                filteredProducts = this.products.filter(p => p.featured);
                break;
            case 'low-stock':
                filteredProducts = this.products.filter(p => p.quantity > 0 && p.quantity < 100);
                break;
        }

        this.renderProductsTable(filteredProducts);
    }

    exportProducts() {
        const csvContent = this.convertToCSV(this.products);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(products) {
        const headers = ['الاسم', 'الاسم بالإنجليزية', 'الفئة', 'المورد', 'بلد المنشأ', 'الكمية', 'الحد الأدنى', 'السعر', 'الحالة', 'مميز'];
        const rows = products.map(product => [
            product.name,
            product.nameEn,
            product.category,
            product.supplier,
            product.origin,
            product.quantity,
            product.minOrder,
            product.price,
            product.inStock ? 'متوفر' : 'غير متوفر',
            product.featured ? 'نعم' : 'لا'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    saveProducts() {
        localStorage.setItem('flowers_products', JSON.stringify(this.products));
    }

    getProductStats() {
        return {
            total: this.products.length,
            inStock: this.products.filter(p => p.inStock).length,
            outOfStock: this.products.filter(p => !p.inStock).length,
            featured: this.products.filter(p => p.featured).length,
            totalValue: this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            categories: [...new Set(this.products.map(p => p.category))],
            suppliers: [...new Set(this.products.map(p => p.supplier))]
        };
    }
}

// Initialize products manager
let productsManager;

document.addEventListener('DOMContentLoaded', () => {
    productsManager = new ProductsManager();
});