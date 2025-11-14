// Analytics and Reporting System
class AnalyticsManager {
    constructor() {
        this.charts = {};
        this.analyticsData = {};
        this.init();
    }

    init() {
        this.loadAnalyticsData();
        this.initCharts();
        this.setupEventListeners();
        this.setupRealTimeUpdates();
    }

    loadAnalyticsData() {
        // Load products data
        const products = JSON.parse(localStorage.getItem('flowers_products')) || [];
        const orders = JSON.parse(localStorage.getItem('flowers_orders')) || [];
        const contacts = JSON.parse(localStorage.getItem('contact_messages')) || [];

        this.analyticsData = {
            products: {
                total: products.length,
                inStock: products.filter(p => p.inStock).length,
                outOfStock: products.filter(p => !p.inStock).length,
                featured: products.filter(p => p.featured).length,
                byCategory: this.groupBy(products, 'category'),
                byOrigin: this.groupBy(products, 'origin'),
                totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
            },
            orders: {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                completed: orders.filter(o => o.status === 'completed').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length,
                totalRevenue: orders.filter(o => o.status === 'completed')
                    .reduce((sum, o) => sum + o.total, 0),
                byMonth: this.groupOrdersByMonth(orders)
            },
            contacts: {
                total: contacts.length,
                new: contacts.filter(c => c.status === 'new').length,
                responded: contacts.filter(c => c.status === 'responded').length,
                bySubject: this.groupBy(contacts, 'subject'),
                byDate: this.groupContactsByDate(contacts)
            },
            performance: {
                conversionRate: this.calculateConversionRate(contacts, orders),
                averageOrderValue: this.calculateAverageOrderValue(orders),
                customerSatisfaction: this.calculateSatisfactionRate(orders)
            }
        };

        this.updateAnalyticsUI();
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const val = item[key];
            groups[val] = groups[val] || 0;
            groups[val]++;
            return groups;
        }, {});
    }

    groupOrdersByMonth(orders) {
        const months = {};
        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            months[monthKey] = months[monthKey] || { count: 0, revenue: 0 };
            months[monthKey].count++;
            if (order.status === 'completed') {
                months[monthKey].revenue += order.total;
            }
        });
        return months;
    }

    groupContactsByDate(contacts) {
        const dates = {};
        contacts.forEach(contact => {
            const date = new Date(contact.timestamp).toISOString().split('T')[0];
            dates[date] = dates[date] || 0;
            dates[date]++;
        });
        return dates;
    }

    calculateConversionRate(contacts, orders) {
        if (contacts.length === 0) return 0;
        const convertedContacts = contacts.filter(contact => {
            return orders.some(order => order.contactEmail === contact.email);
        });
        return (convertedContacts.length / contacts.length) * 100;
    }

    calculateAverageOrderValue(orders) {
        const completedOrders = orders.filter(o => o.status === 'completed');
        if (completedOrders.length === 0) return 0;
        const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
        return totalRevenue / completedOrders.length;
    }

    calculateSatisfactionRate(orders) {
        const ratedOrders = orders.filter(o => o.rating);
        if (ratedOrders.length === 0) return 0;
        const totalRating = ratedOrders.reduce((sum, o) => sum + o.rating, 0);
        return (totalRating / ratedOrders.length) * 20; // Convert to percentage
    }

    initCharts() {
        this.initSalesChart();
        this.initProductsChart();
        this.initRevenueChart();
        this.initPerformanceChart();
    }

    initSalesChart() {
        const ctx = document.getElementById('salesChart');
        if (!ctx) return;

        const salesData = this.generateSalesData();
        
        this.charts.sales = new Chart(ctx, {
            type: 'line',
            data: {
                labels: salesData.labels,
                datasets: [
                    {
                        label: 'المبيعات',
                        data: salesData.sales,
                        borderColor: '#e91e63',
                        backgroundColor: 'rgba(233, 30, 99, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'الطلبات',
                        data: salesData.orders,
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
                        text: 'أداء المبيعات خلال 12 شهر'
                    }
                }
            }
        });
    }

    initProductsChart() {
        const ctx = document.getElementById('productsChart');
        if (!ctx) return;

        const categories = this.analyticsData.products.byCategory;
        
        this.charts.products = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categories),
                datasets: [{
                    data: Object.values(categories),
                    backgroundColor: [
                        '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
                        '#2196f3', '#03a9f4', '#00bcd4', '#009688'
                    ],
                    borderWidth: 2
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

        const revenueData = this.generateRevenueData();
        
        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: revenueData.labels,
                datasets: [{
                    label: 'الإيرادات (دينار)',
                    data: revenueData.values,
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
                }
            }
        });
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const performanceData = this.analyticsData.performance;
        
        this.charts.performance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['معدل التحويل', 'متوسط قيمة الطلب', 'رضا العملاء', 'نمو المبيعات', 'الكفاءة'],
                datasets: [{
                    label: 'أداء المتجر',
                    data: [
                        performanceData.conversionRate,
                        performanceData.averageOrderValue / 1000, // Normalize
                        performanceData.customerSatisfaction,
                        75, // Simulated growth
                        80  // Simulated efficiency
                    ],
                    backgroundColor: 'rgba(233, 30, 99, 0.2)',
                    borderColor: '#e91e63',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    generateSalesData() {
        // Generate 12 months of sales data
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                       'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        
        const sales = [];
        const orders = [];
        
        for (let i = 0; i < 12; i++) {
            sales.push(Math.floor(Math.random() * 50000) + 10000);
            orders.push(Math.floor(Math.random() * 50) + 10);
        }
        
        return { labels: months, sales, orders };
    }

    generateRevenueData() {
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'];
        const values = [120000, 150000, 180000, 140000, 160000, 190000];
        
        return { labels: months, values };
    }

    updateAnalyticsUI() {
        // Update KPI cards
        this.updateKPICards();
        
        // Update statistics
        this.updateStatistics();
    }

    updateKPICards() {
        const kpis = {
            'totalRevenue': this.analyticsData.orders.totalRevenue,
            'totalOrders': this.analyticsData.orders.total,
            'totalProducts': this.analyticsData.products.total,
            'conversionRate': this.analyticsData.performance.conversionRate,
            'avgOrderValue': this.analyticsData.performance.averageOrderValue,
            'customerSatisfaction': this.analyticsData.performance.customerSatisfaction
        };

        Object.entries(kpis).forEach(([key, value]) => {
            const element = document.getElementById(key);
            if (element) {
                if (key.includes('Revenue') || key.includes('Value')) {
                    element.textContent = utils.formatPrice(value);
                } else if (key.includes('Rate') || key.includes('Satisfaction')) {
                    element.textContent = value.toFixed(1) + '%';
                } else {
                    element.textContent = value;
                }
            }
        });
    }

    updateStatistics() {
        this.updateProductsStats();
        this.updateOrdersStats();
        this.updateContactsStats();
    }

    updateProductsStats() {
        const container = document.getElementById('productsStats');
        if (!container) return;

        const stats = this.analyticsData.products;
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">إجمالي المنتجات</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.inStock}</div>
                    <div class="stat-label">منتجات متوفرة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.outOfStock}</div>
                    <div class="stat-label">منتجات غير متوفرة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.featured}</div>
                    <div class="stat-label">منتجات مميزة</div>
                </div>
            </div>
        `;
    }

    updateOrdersStats() {
        const container = document.getElementById('ordersStats');
        if (!container) return;

        const stats = this.analyticsData.orders;
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">إجمالي الطلبات</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.pending}</div>
                    <div class="stat-label">طلبات قيد الانتظار</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.completed}</div>
                    <div class="stat-label">طلبات مكتملة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${utils.formatPrice(stats.totalRevenue)}</div>
                    <div class="stat-label">إجمالي الإيرادات</div>
                </div>
            </div>
        `;
    }

    updateContactsStats() {
        const container = document.getElementById('contactsStats');
        if (!container) return;

        const stats = this.analyticsData.contacts;
        
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.total}</div>
                    <div class="stat-label">إجمالي الرسائل</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.new}</div>
                    <div class="stat-label">رسائل جديدة</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.responded}</div>
                    <div class="stat-label">رسائل تم الرد عليها</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Object.keys(stats.bySubject).length}</div>
                    <div class="stat-label">موضوعات مختلفة</div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Export buttons
        const exportButtons = document.querySelectorAll('[data-export]');
        exportButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.dataset.export;
                this.exportData(type);
            });
        });

        // Date range filters
        const dateFilters = document.querySelectorAll('.date-filter');
        dateFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                this.handleDateFilter(e.target.dataset.range);
            });
        });

        // Refresh data
        const refreshBtn = document.getElementById('refreshAnalytics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }
    }

    handleDateFilter(range) {
        // Update charts based on date range
        console.log('Filtering by date range:', range);
        // In a real application, this would refetch data from the server
        // based on the selected date range
    }

    exportData(type) {
        let data, filename, content;
        
        switch (type) {
            case 'products':
                data = JSON.parse(localStorage.getItem('flowers_products')) || [];
                filename = `products_export_${new Date().toISOString().split('T')[0]}.json`;
                content = JSON.stringify(data, null, 2);
                break;
            case 'orders':
                data = JSON.parse(localStorage.getItem('flowers_orders')) || [];
                filename = `orders_export_${new Date().toISOString().split('T')[0]}.json`;
                content = JSON.stringify(data, null, 2);
                break;
            case 'analytics':
                data = this.analyticsData;
                filename = `analytics_export_${new Date().toISOString().split('T')[0]}.json`;
                content = JSON.stringify(data, null, 2);
                break;
            default:
                return;
        }
        
        this.downloadFile(content, filename, 'application/json');
        
        if (window.flowerApp) {
            window.flowerApp.showNotification(`تم تصدير ${type} بنجاح`, 'success');
        }
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    refreshData() {
        this.loadAnalyticsData();
        
        // Update charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.update();
        });
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم تحديث البيانات', 'success');
        }
    }

    setupRealTimeUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateRealTimeData();
        }, 30000); // Every 30 seconds
    }

    updateRealTimeData() {
        // Simulate minor changes in analytics data
        const randomChange = (Math.random() - 0.5) * 10;
        
        if (this.analyticsData.performance.conversionRate > 0) {
            this.analyticsData.performance.conversionRate = 
                Math.max(0, this.analyticsData.performance.conversionRate + randomChange);
            
            this.updateKPICards();
        }
    }

    // Method to get predictions (simulated)
    getPredictions() {
        return {
            nextMonth: {
                revenue: this.analyticsData.orders.totalRevenue * 1.1, // 10% growth
                orders: Math.floor(this.analyticsData.orders.total * 1.05), // 5% growth
                popularCategory: this.getMostPopularCategory()
            },
            trends: {
                growing: ['ورود حمراء', 'باقات'],
                declining: ['ورود صفراء'],
                stable: ['توليب', 'زنابق']
            }
        };
    }

    getMostPopularCategory() {
        const categories = this.analyticsData.products.byCategory;
        return Object.keys(categories).reduce((a, b) => 
            categories[a] > categories[b] ? a : b
        );
    }
}

// Initialize analytics manager
const analyticsManager = new AnalyticsManager();