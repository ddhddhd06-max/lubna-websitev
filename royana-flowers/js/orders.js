// Orders Management System
class OrdersManager {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('flowers_orders')) || [];
        this.currentOrder = null;
        this.init();
    }

    init() {
        this.renderOrdersTable();
        this.setupEventListeners();
        this.loadInitialOrders();
        this.updateOrdersSummary();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('orderSearch');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => this.handleSearch(e), 300));
        }

        // Filter functionality
        const filterSelect = document.getElementById('orderFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e));
        }

        // Date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.addEventListener('change', (e) => this.handleDateFilter(e));
        }

        // Export button
        const exportBtn = document.getElementById('exportOrders');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportOrders());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshOrders');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Update status form
        const statusForm = document.getElementById('updateStatusForm');
        if (statusForm) {
            statusForm.addEventListener('submit', (e) => this.handleStatusUpdate(e));
        }
    }

    loadInitialOrders() {
        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 1,
                    orderNumber: 'ORD-001',
                    customer: {
                        name: 'محل الورود الجميلة',
                        phone: '07701234567',
                        email: 'info@beautifulflowers.com'
                    },
                    products: [
                        { id: 1, name: 'ورد أحمر هولندي', quantity: 150, price: 1500 },
                        { id: 4, name: 'باقة متنوعة فاخرة', quantity: 25, price: 5000 }
                    ],
                    total: 350000,
                    status: 'completed',
                    paymentMethod: 'نقدي',
                    notes: 'طلب عادي',
                    createdAt: new Date('2024-01-20'),
                    updatedAt: new Date('2024-01-20')
                },
                {
                    id: 2,
                    orderNumber: 'ORD-002',
                    customer: {
                        name: 'زهور البصرة',
                        phone: '07809876543',
                        email: 'basraflowers@email.com'
                    },
                    products: [
                        { id: 2, name: 'ورد أبيض إكوادوري', quantity: 80, price: 2000 },
                        { id: 6, name: 'توليب متعدد الألوان', quantity: 100, price: 1200 }
                    ],
                    total: 280000,
                    status: 'processing',
                    paymentMethod: 'حوالة بنكية',
                    notes: 'يجب التوصيل قبل الجمعة',
                    createdAt: new Date('2024-01-22'),
                    updatedAt: new Date('2024-01-22')
                },
                {
                    id: 3,
                    orderNumber: 'ORD-003',
                    customer: {
                        name: 'حديقة النجف',
                        phone: '0775112233',
                        email: 'najafgarden@email.com'
                    },
                    products: [
                        { id: 3, name: 'ورد وردي كيني', quantity: 120, price: 1800 },
                        { id: 5, name: 'زنبق أحمر', quantity: 60, price: 2500 }
                    ],
                    total: 366000,
                    status: 'pending',
                    paymentMethod: 'نقدي',
                    notes: '',
                    createdAt: new Date('2024-01-23'),
                    updatedAt: new Date('2024-01-23')
                },
                {
                    id: 4,
                    orderNumber: 'ORD-004',
                    customer: {
                        name: 'ورود بغداد',
                        phone: '0770445566',
                        email: 'baghdadroses@email.com'
                    },
                    products: [
                        { id: 1, name: 'ورد أحمر هولندي', quantity: 200, price: 1500 },
                        { id: 4, name: 'باقة متنوعة فاخرة', quantity: 30, price: 5000 },
                        { id: 6, name: 'توليب متعدد الألوان', quantity: 150, price: 1200 }
                    ],
                    total: 630000,
                    status: 'completed',
                    paymentMethod: 'شيك',
                    notes: 'عميل مميز - خصم 10%',
                    createdAt: new Date('2024-01-18'),
                    updatedAt: new Date('2024-01-19')
                },
                {
                    id: 5,
                    orderNumber: 'ORD-005',
                    customer: {
                        name: 'جنة الزهور',
                        phone: '0780777888',
                        email: 'flowerparadise@email.com'
                    },
                    products: [
                        { id: 2, name: 'ورد أبيض إكوادوري', quantity: 50, price: 2000 }
                    ],
                    total: 100000,
                    status: 'cancelled',
                    paymentMethod: 'نقدي',
                    notes: 'تم الإلغاء من قبل العميل',
                    createdAt: new Date('2024-01-21'),
                    updatedAt: new Date('2024-01-21')
                }
            ];
            this.saveOrders();
        }
    }

    renderOrdersTable(filteredOrders = null) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        const ordersToRender = filteredOrders || this.orders;

        tbody.innerHTML = ordersToRender.map(order => `
            <tr class="fade-in">
                <td>
                    <strong>${order.orderNumber}</strong>
                    <br>
                    <small class="text-muted">${utils.formatDate(order.createdAt)}</small>
                </td>
                <td>
                    <div class="customer-cell">
                        <strong>${order.customer.name}</strong>
                        <br>
                        <small>${order.customer.phone}</small>
                    </div>
                </td>
                <td>
                    <div class="products-cell">
                        ${order.products.map(product => `
                            <span class="product-badge">${product.name} (${product.quantity})</span>
                        `).join('')}
                    </div>
                </td>
                <td>${order.products.reduce((sum, product) => sum + product.quantity, 0)}</td>
                <td>
                    <span class="price">${utils.formatPrice(order.total)}</span>
                </td>
                <td>
                    <span class="status-badge ${this.getStatusClass(order.status)}">
                        ${this.getStatusText(order.status)}
                    </span>
                </td>
                <td>${utils.formatDate(order.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="ordersManager.viewOrder(${order.id})" title="عرض">
                            👁️
                        </button>
                        <button class="btn-action btn-edit" onclick="ordersManager.updateOrderStatus(${order.id})" title="تحديث الحالة">
                            ✏️
                        </button>
                        <button class="btn-action btn-delete" onclick="ordersManager.deleteOrder(${order.id})" title="حذف">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateOrdersCount(ordersToRender.length);
    }

    getStatusClass(status) {
        const statusClasses = {
            'pending': 'status-pending',
            'processing': 'status-processing',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return statusClasses[status] || 'status-pending';
    }

    getStatusText(status) {
        const statusTexts = {
            'pending': '⏳ قيد الانتظار',
            'processing': '🔄 قيد المعالجة',
            'completed': '✅ مكتمل',
            'cancelled': '❌ ملغى'
        };
        return statusTexts[status] || status;
    }

    updateOrdersSummary() {
        const totalOrders = this.orders.length;
        const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
        const completedOrders = this.orders.filter(o => o.status === 'completed').length;
        const totalRevenue = this.orders
            .filter(o => o.status === 'completed')
            .reduce((sum, order) => sum + order.total, 0);

        // Update summary cards
        document.getElementById('totalOrders')?.textContent = totalOrders;
        document.getElementById('pendingOrders')?.textContent = pendingOrders;
        document.getElementById('completedOrders')?.textContent = completedOrders;
        document.getElementById('totalRevenue')?.textContent = utils.formatPrice(totalRevenue);
    }

    updateOrdersCount(count) {
        const countElement = document.getElementById('ordersCount');
        if (countElement) {
            countElement.textContent = `${count} طلب`;
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredOrders = this.orders.filter(order =>
            order.orderNumber.toLowerCase().includes(searchTerm) ||
            order.customer.name.toLowerCase().includes(searchTerm) ||
            order.customer.phone.includes(searchTerm) ||
            order.products.some(product => product.name.toLowerCase().includes(searchTerm))
        );
        this.renderOrdersTable(filteredOrders);
    }

    handleFilter(e) {
        const filterValue = e.target.value;
        let filteredOrders = this.orders;

        if (filterValue) {
            filteredOrders = this.orders.filter(order => order.status === filterValue);
        }

        this.renderOrdersTable(filteredOrders);
    }

    handleDateFilter(e) {
        const filterValue = e.target.value;
        let filteredOrders = this.orders;

        const now = new Date();
        let startDate;

        switch (filterValue) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = null;
        }

        if (startDate) {
            filteredOrders = this.orders.filter(order => new Date(order.createdAt) >= startDate);
        }

        this.renderOrdersTable(filteredOrders);
    }

    viewOrder(orderId) {
        this.currentOrder = this.orders.find(o => o.id === orderId);
        if (!this.currentOrder) return;

        const modal = document.getElementById('orderDetailsModal');
        const content = modal.querySelector('#orderDetailsContent');
        
        content.innerHTML = `
            <div class="order-details">
                <div class="order-header">
                    <h4>${this.currentOrder.orderNumber}</h4>
                    <span class="status-badge ${this.getStatusClass(this.currentOrder.status)}">
                        ${this.getStatusText(this.currentOrder.status)}
                    </span>
                </div>

                <div class="customer-info">
                    <h5>معلومات العميل:</h5>
                    <p><strong>الاسم:</strong> ${this.currentOrder.customer.name}</p>
                    <p><strong>الهاتف:</strong> ${this.currentOrder.customer.phone}</p>
                    ${this.currentOrder.customer.email ? `<p><strong>البريد الإلكتروني:</strong> ${this.currentOrder.customer.email}</p>` : ''}
                </div>

                <div class="order-products">
                    <h5>المنتجات المطلوبة:</h5>
                    <table class="products-table">
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>الكمية</th>
                                <th>السعر</th>
                                <th>المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.currentOrder.products.map(product => `
                                <tr>
                                    <td>${product.name}</td>
                                    <td>${product.quantity}</td>
                                    <td>${utils.formatPrice(product.price)}</td>
                                    <td>${utils.formatPrice(product.quantity * product.price)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>الإجمالي:</strong></td>
                                <td><strong>${utils.formatPrice(this.currentOrder.total)}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div class="order-meta">
                    <div class="meta-item">
                        <strong>طريقة الدفع:</strong>
                        <span>${this.currentOrder.paymentMethod}</span>
                    </div>
                    <div class="meta-item">
                        <strong>تاريخ الطلب:</strong>
                        <span>${utils.formatDate(this.currentOrder.createdAt)}</span>
                    </div>
                    <div class="meta-item">
                        <strong>آخر تحديث:</strong>
                        <span>${utils.formatDate(this.currentOrder.updatedAt)}</span>
                    </div>
                </div>

                ${this.currentOrder.notes ? `
                    <div class="order-notes">
                        <h5>ملاحظات:</h5>
                        <p>${this.currentOrder.notes}</p>
                    </div>
                ` : ''}
            </div>
        `;

        this.openModal('orderDetailsModal');
    }

    updateOrderStatus(orderId) {
        this.currentOrder = this.orders.find(o => o.id === orderId);
        if (!this.currentOrder) return;

        const modal = document.getElementById('updateStatusModal');
        const form = document.getElementById('updateStatusForm');
        const statusSelect = document.getElementById('orderStatus');

        // Set current status
        statusSelect.value = this.currentOrder.status;

        this.openModal('updateStatusModal');
    }

    handleStatusUpdate(e) {
        e.preventDefault();
        if (!this.currentOrder) return;

        const formData = new FormData(e.target);
        const newStatus = formData.get('status');
        const notes = formData.get('notes');

        // Update order
        this.currentOrder.status = newStatus;
        this.currentOrder.updatedAt = new Date();
        
        if (notes) {
            this.currentOrder.notes = this.currentOrder.notes ? 
                `${this.currentOrder.notes}\n${new Date().toLocaleString('ar-IQ')}: ${notes}` : 
                `${new Date().toLocaleString('ar-IQ')}: ${notes}`;
        }

        // Save and refresh
        this.saveOrders();
        this.renderOrdersTable();
        this.updateOrdersSummary();
        
        this.closeModal('updateStatusModal');
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم تحديث حالة الطلب بنجاح', 'success');
        }
    }

    deleteOrder(orderId) {
        if (confirm('هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.')) {
            this.orders = this.orders.filter(o => o.id !== orderId);
            this.saveOrders();
            this.renderOrdersTable();
            this.updateOrdersSummary();
            
            if (window.flowerApp) {
                window.flowerApp.showNotification('تم حذف الطلب بنجاح', 'success');
            }
        }
    }

    exportOrders() {
        const csvContent = this.convertToCSV(this.orders);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(orders) {
        const headers = ['رقم الطلب', 'العميل', 'الهاتف', 'المنتجات', 'الكمية الإجمالية', 'المبلغ', 'الحالة', 'تاريخ الطلب'];
        const rows = orders.map(order => [
            order.orderNumber,
            order.customer.name,
            order.customer.phone,
            order.products.map(p => p.name).join(' - '),
            order.products.reduce((sum, p) => sum + p.quantity, 0),
            order.total,
            this.getStatusText(order.status),
            utils.formatDate(order.createdAt)
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    refreshData() {
        this.renderOrdersTable();
        this.updateOrdersSummary();
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم تحديث بيانات الطلبات', 'success');
        }
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

    saveOrders() {
        localStorage.setItem('flowers_orders', JSON.stringify(this.orders));
    }

    getOrderStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: this.orders.length,
            pending: this.orders.filter(o => o.status === 'pending').length,
            processing: this.orders.filter(o => o.status === 'processing').length,
            completed: this.orders.filter(o => o.status === 'completed').length,
            cancelled: this.orders.filter(o => o.status === 'cancelled').length,
            recent: this.orders.filter(o => new Date(o.createdAt) > last30Days).length,
            totalRevenue: this.orders.filter(o => o.status === 'completed')
                .reduce((sum, o) => sum + o.total, 0)
        };
    }
}

// Initialize orders manager
let ordersManager;

document.addEventListener('DOMContentLoaded', () => {
    ordersManager = new OrdersManager();
});