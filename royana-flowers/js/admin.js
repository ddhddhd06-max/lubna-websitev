// Admin Dashboard Management
class AdminDashboard {
    constructor() {
        this.stats = {};
        this.charts = {};
        this.init();
    }

    init() {
        this.checkAuth();
        this.loadDashboardData();
        this.setupEventListeners();
        this.initCharts();
        this.setupRealTimeUpdates();
    }

    checkAuth() {
        if (!authManager || !authManager.isAuthenticated()) {
            window.location.href = '../login.html';
            return;
        }
    }

    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Mobile menu
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => authManager.handleLogout());
        }

        // Quick stats filters
        const periodFilters = document.querySelectorAll('.period-filter');
        periodFilters.forEach(filter => {
            filter.addEventListener('click', (e) => this.handlePeriodFilter(e));
        });

        // Refresh data
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        const main = document.querySelector('.admin-main');
        
        sidebar.classList.toggle('collapsed');
        main.classList.toggle('expanded');
        
        // Save state
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebar_collapsed', isCollapsed);
    }

    toggleMobileMenu() {
        const sidebar = document.querySelector('.admin-sidebar');
        sidebar.classList.toggle('mobile-active');
    }

    async loadDashboardData() {
        try {
            // Show loading state
            this.showLoading();
            
            // Simulate API calls
            await Promise.all([
                this.loadStats(),
                this.loadRecentActivity(),
                this.loadTopProducts(),
                this.loadSalesData()
            ]);

            this.updateDashboard();
            this.hideLoading();

        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.hideLoading();
            
            if (window.flowerApp) {
                window.flowerApp.showNotification('خطأ في تحميل البيانات', 'error');
            }
        }
    }

    async loadStats() {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const products = JSON.parse(localStorage.getItem('flowers_products')) || [];
        const orders = JSON.parse(localStorage.getItem('flowers_orders')) || [];
        
        this.stats = {
            totalProducts: products.length,
            inStockProducts: products.filter(p => p.inStock).length,
            totalOrders: orders.length,
            pendingOrders: orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.filter(o => o.status === 'completed').length,
            totalRevenue: orders
                .filter(o => o.status === 'completed')
                .reduce((sum, order) => sum + order.total, 0),
            monthlyGrowth: 15.3, // Simulated growth percentage
            customerSatisfaction: 94.7 // Simulated satisfaction rate
        };
    }

    async loadRecentActivity() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.recentActivity = [
            {
                id: 1,
                type: 'product_added',
                description: 'تم إضافة منتج جديد: ورد أحمر هولندي',
                user: 'مدير النظام',
                time: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                icon: '🌹'
            },
            {
                id: 2,
                type: 'order_placed',
                description: 'طلب جديد من زبون: #ORD-001',
                user: 'محل الورود الجميلة',
                time: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                icon: '📦'
            },
            {
                id: 3,
                type: 'stock_updated',
                description: 'تم تحديث مخزون ورد أبيض إكوادوري',
                user: 'مدير النظام',
                time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                icon: '📊'
            },
            {
                id: 4,
                type: 'customer_registered',
                description: 'زبون جديد مسجل: محل الجمال الوردي',
                user: 'نظام التسجيل',
                time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                icon: '👥'
            }
        ];
    }

    async loadTopProducts() {
        const products = JSON.parse(localStorage.getItem('flowers_products')) || [];
        
        this.topProducts = products
            .filter(p => p.featured)
            .slice(0, 5)
            .map(product => ({
                ...product,
                popularity: Math.floor(Math.random() * 100) + 50 // Simulated popularity
            }))
            .sort((a, b) => b.popularity - a.popularity);
    }

    async loadSalesData() {
        // Generate simulated sales data for the last 30 days
        const salesData = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            salesData.push({
                date: date.toISOString().split('T')[0],
                sales: Math.floor(Math.random() * 5000) + 1000,
                orders: Math.floor(Math.random() * 20) + 5
            });
        }
        
        this.salesData = salesData;
    }

    updateDashboard() {
        this.updateStatsCards();
        this.updateRecentActivity();
        this.updateTopProducts();
        this.updateCharts();
    }

    updateStatsCards() {
        const statsElements = {
            totalProducts: document.getElementById('totalProducts'),
            inStockProducts: document.getElementById('inStockProducts'),
            totalOrders: document.getElementById('totalOrders'),
            pendingOrders: document.getElementById('pendingOrders'),
            completedOrders: document.getElementById('completedOrders'),
            totalRevenue: document.getElementById('totalRevenue'),
            monthlyGrowth: document.getElementById('monthlyGrowth'),
            customerSatisfaction: document.getElementById('customerSatisfaction')
        };

        Object.entries(statsElements).forEach(([key, element]) => {
            if (element && this.stats[key] !== undefined) {
                if (key === 'totalRevenue') {
                    element.textContent = utils.formatPrice(this.stats[key]);
                } else if (key === 'monthlyGrowth' || key === 'customerSatisfaction') {
                    element.textContent = `${this.stats[key]}%`;
                } else {
                    element.textContent = this.stats[key];
                }
            }
        });
    }

    updateRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;

        container.innerHTML = this.recentActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${activity.icon}
                </div>
                <div class="activity-content">
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-meta">
                        <span class="activity-user">${activity.user}</span>
                        <span class="activity-time">${this.formatTimeAgo(activity.time)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateTopProducts() {
        const container = document.getElementById('topProducts');
        if (!container) return;

        container.innerHTML = this.topProducts.map((product, index) => `
            <div class="top-product-item">
                <div class="product-rank">
                    <span class="rank-number">${index + 1}</span>
                </div>
                <div class="product-emoji">
                    ${product.images[0]}
                </div>
                <div class="product-details">
                    <h4 class="product-name">${product.name}</h4>
                    <p class="product-category">${product.category}</p>
                </div>
                <div class="product-popularity">
                    <div class="popularity-bar">
                        <div class="popularity-fill" style="width: ${product.popularity}%"></div>
                    </div>
                    <span class="popularity-percent">${product.popularity}%</span>
                </div>
            </div>
        `).join('');
    }

    initCharts() {
        this.initSalesChart();
        this.initProductsChart();
        this.initRevenueChart();
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const labels = this.salesData.map(data => {
            const date = new Date(data.date);
            return date.toLocaleDateString('ar-IQ', { month: 'short', day: 'numeric' });
        });

        const sales = this.salesData.map(data => data.sales);
        const orders = this.salesData.map(data => data.orders);

        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'المبيعات (دينار)',
                        data: sales,
                        borderColor: '#e91e63',
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'عدد الطلبات',
                        data: orders,
                        borderColor: '#9c27b0',
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        rtl: true
                    },
                    title: {
                        display: true,
                        text: 'أداء المبيعات خلال 30 يوم'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'التاريخ'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'القيمة'
                        }
                    }
                }
            }
        });
    }

    initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const products = JSON.parse(localStorage.getItem('flowers_products')) || [];
        const categories = [...new Set(products.map(p => p.category))];
        const categoryCounts = categories.map(category => 
            products.filter(p => p.category === category).length
        );

        this.charts.products = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categories,
                datasets: [{
                    data: categoryCounts,
                    backgroundColor: [
                        '#e91e63',
                        '#9c27b0',
                        '#673ab7',
                        '#3f51b5',
                        '#2196f3',
                        '#03a9f4'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        rtl: true
                    },
                    title: {
                        display: true,
                        text: 'توزيع المنتجات حسب الفئة'
                    }
                }
            }
        });
    }

    initRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        const revenueData = [120000, 150000, 180000, 140000, 160000, 190000, 210000];
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'];

        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'الإيرادات (دينار)',
                    data: revenueData,
                    backgroundColor: 'rgba(233, 30, 99, 0.8)',
                    borderColor: '#e91e63',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'الإيرادات الشهرية'
                    }
                },
                scales: {
                    x: {
                        display: true
                    },
                    y: {
                        display: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }

    handlePeriodFilter(e) {
        const period = e.target.dataset.period;
        const filters = document.querySelectorAll('.period-filter');
        
        filters.forEach(filter => filter.classList.remove('active'));
        e.target.classList.add('active');

        // Update charts based on period
        this.updateChartsForPeriod(period);
    }

    updateChartsForPeriod(period) {
        // In a real app, this would fetch new data based on the period
        // For now, we'll just simulate with random data
        console.log('Updating charts for period:', period);
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم تحديث البيانات للفترة المحددة', 'info');
        }
    }

    refreshData() {
        this.loadDashboardData();
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('جاري تحديث البيانات...', 'info');
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateRealTimeStats();
        }, 30000);
    }

    updateRealTimeStats() {
        // Simulate minor changes in stats
        if (this.stats.pendingOrders > 0) {
            this.stats.pendingOrders += Math.random() > 0.7 ? 1 : 0;
            this.stats.totalOrders = this.stats.pendingOrders + this.stats.completedOrders;
            this.updateStatsCards();
        }
    }

    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
        if (diffHours < 24) return `منذ ${diffHours} ساعة`;
        if (diffDays < 7) return `منذ ${diffDays} يوم`;
        
        return date.toLocaleDateString('ar-IQ');
    }

    showLoading() {
        const loadingElement = document.getElementById('dashboardLoading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }

    hideLoading() {
        const loadingElement = document.getElementById('dashboardLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Initialize admin dashboard
let adminDashboard;

document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth manager to be ready
    if (typeof authManager !== 'undefined') {
        adminDashboard = new AdminDashboard();
    } else {
        // Redirect to login if not authenticated
        if (!localStorage.getItem('admin_token')) {
            window.location.href = '../login.html';
        } else {
            // Retry initialization after a short delay
            setTimeout(() => {
                adminDashboard = new AdminDashboard();
            }, 100);
        }
    }
});