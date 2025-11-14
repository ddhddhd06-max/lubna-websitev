// Customers Management System
class CustomersManager {
    constructor() {
        this.customers = JSON.parse(localStorage.getItem('flowers_customers')) || [];
        this.currentCustomer = null;
        this.init();
    }

    init() {
        this.renderCustomersTable();
        this.setupEventListeners();
        this.loadInitialCustomers();
        this.updateCustomersSummary();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('customerSearch');
        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => this.handleSearch(e), 300));
        }

        // Filter functionality
        const filterSelect = document.getElementById('customerFilter');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => this.handleFilter(e));
        }

        // Add customer button
        const addBtn = document.getElementById('addCustomerBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.openModal('addCustomerModal'));
        }

        // Export button
        const exportBtn = document.getElementById('exportCustomers');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportCustomers());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshCustomers');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshData());
        }

        // Add customer form
        const addForm = document.getElementById('addCustomerForm');
        if (addForm) {
            addForm.addEventListener('submit', (e) => this.handleAddCustomer(e));
        }
    }

    loadInitialCustomers() {
        if (this.customers.length === 0) {
            // Load customers from orders if available
            const orders = JSON.parse(localStorage.getItem('flowers_orders')) || [];
            const uniqueCustomers = {};
            
            orders.forEach(order => {
                const key = order.customer.phone;
                if (!uniqueCustomers[key]) {
                    uniqueCustomers[key] = {
                        id: Object.keys(uniqueCustomers).length + 1,
                        name: order.customer.name,
                        company: '',
                        email: order.customer.email || '',
                        phone: order.customer.phone,
                        address: '',
                        type: 'regular',
                        notes: '',
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrder: null,
                        createdAt: order.createdAt,
                        status: 'active'
                    };
                }
                
                uniqueCustomers[key].totalOrders++;
                uniqueCustomers[key].totalSpent += order.total;
                if (!uniqueCustomers[key].lastOrder || new Date(order.createdAt) > new Date(uniqueCustomers[key].lastOrder)) {
                    uniqueCustomers[key].lastOrder = order.createdAt;
                }
            });

            this.customers = Object.values(uniqueCustomers);
            
            // If no orders, add some demo customers
            if (this.customers.length === 0) {
                this.customers = [
                    {
                        id: 1,
                        name: 'محل الورود الجميلة',
                        company: 'الورود الجميلة',
                        email: 'info@beautifulflowers.com',
                        phone: '07701234567',
                        address: 'بغداد، الكرادة',
                        type: 'vip',
                        notes: 'عميل مميز - طلبات منتظمة',
                        totalOrders: 12,
                        totalSpent: 2850000,
                        lastOrder: new Date('2024-01-20'),
                        createdAt: new Date('2023-06-15'),
                        status: 'active'
                    },
                    {
                        id: 2,
                        name: 'زهور البصرة',
                        company: 'زهور البصرة',
                        email: 'basraflowers@email.com',
                        phone: '07809876543',
                        address: 'البصرة، الجزائر',
                        type: 'wholesaler',
                        notes: 'تاجر جملة - كميات كبيرة',
                        totalOrders: 8,
                        totalSpent: 1920000,
                        lastOrder: new Date('2024-01-22'),
                        createdAt: new Date('2023-08-20'),
                        status: 'active'
                    },
                    {
                        id: 3,
                        name: 'حديقة النجف',
                        company: 'حديقة النجف',
                        email: 'najafgarden@email.com',
                        phone: '0775112233',
                        address: 'النجف، المدينة',
                        type: 'regular',
                        notes: '',
                        totalOrders: 5,
                        totalSpent: 980000,
                        lastOrder: new Date('2024-01-23'),
                        createdAt: new Date('2023-10-10'),
                        status: 'active'
                    },
                    {
                        id: 4,
                        name: 'ورود بغداد',
                        company: 'ورود بغداد',
                        email: 'baghdadroses@email.com',
                        phone: '0770445566',
                        address: 'بغداد، المنصور',
                        type: 'vip',
                        notes: 'عميل نشط - يفضل الباقات الفاخرة',
                        totalOrders: 15,
                        totalSpent: 3650000,
                        lastOrder: new Date('2024-01-18'),
                        createdAt: new Date('2023-05-01'),
                        status: 'active'
                    },
                    {
                        id: 5,
                        name: 'جنة الزهور',
                        company: 'جنة الزهور',
                        email: 'flowerparadise@email.com',
                        phone: '0780777888',
                        address: 'اربيل، الشوارع الرئيسية',
                        type: 'regular',
                        notes: 'عميل جديد',
                        totalOrders: 2,
                        totalSpent: 320000,
                        lastOrder: new Date('2024-01-21'),
                        createdAt: new Date('2024-01-10'),
                        status: 'active'
                    }
                ];
            }
            
            this.saveCustomers();
        }
    }

    renderCustomersTable(filteredCustomers = null) {
        const tbody = document.getElementById('customersTableBody');
        if (!tbody) return;

        const customersToRender = filteredCustomers || this.customers;

        tbody.innerHTML = customersToRender.map(customer => `
            <tr class="fade-in">
                <td>
                    <div class="customer-cell">
                        <strong>${customer.name}</strong>
                        ${customer.company ? `<br><small>${customer.company}</small>` : ''}
                        ${customer.type === 'vip' ? '<span class="vip-badge">⭐</span>' : ''}
                    </div>
                </td>
                <td>
                    <div class="contact-cell">
                        <div>📞 ${customer.phone}</div>
                        ${customer.email ? `<div>📧 ${customer.email}</div>` : ''}
                    </div>
                </td>
                <td>
                    <span class="orders-count">${customer.totalOrders}</span>
                </td>
                <td>
                    <span class="price">${utils.formatPrice(customer.totalSpent)}</span>
                </td>
                <td>
                    ${customer.lastOrder ? utils.formatDate(customer.lastOrder) : 'لا يوجد'}
                </td>
                <td>
                    <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${customer.status === 'active' ? '🟢 نشط' : '🔴 غير نشط'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-action btn-view" onclick="customersManager.viewCustomer(${customer.id})" title="عرض">
                            👁️
                        </button>
                        <button class="btn-action btn-edit" onclick="customersManager.editCustomer(${customer.id})" title="تعديل">
                            ✏️
                        </button>
                        <button class="btn-action btn-delete" onclick="customersManager.deleteCustomer(${customer.id})" title="حذف">
                            🗑️
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        this.updateCustomersCount(customersToRender.length);
    }

    updateCustomersSummary() {
        const totalCustomers = this.customers.length;
        const newCustomers = this.customers.filter(c => {
            const customerDate = new Date(c.createdAt);
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            return customerDate > thirtyDaysAgo;
        }).length;
        
        const vipCustomers = this.customers.filter(c => c.type === 'vip').length;
        
        const totalRevenue = this.customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
        const avgOrderValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

        // Update summary cards
        document.getElementById('totalCustomers')?.textContent = totalCustomers;
        document.getElementById('newCustomers')?.textContent = newCustomers;
        document.getElementById('vipCustomers')?.textContent = vipCustomers;
        document.getElementById('avgOrderValue')?.textContent = utils.formatPrice(avgOrderValue);
    }

    updateCustomersCount(count) {
        const countElement = document.getElementById('customersCount');
        if (countElement) {
            countElement.textContent = `${count} عميل`;
        }
    }

    handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const filteredCustomers = this.customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm) ||
            customer.company.toLowerCase().includes(searchTerm) ||
            customer.phone.includes(searchTerm) ||
            customer.email.toLowerCase().includes(searchTerm)
        );
        this.renderCustomersTable(filteredCustomers);
    }

    handleFilter(e) {
        const filterValue = e.target.value;
        let filteredCustomers = this.customers;

        switch (filterValue) {
            case 'new':
                const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                filteredCustomers = this.customers.filter(c => new Date(c.createdAt) > thirtyDaysAgo);
                break;
            case 'vip':
                filteredCustomers = this.customers.filter(c => c.type === 'vip');
                break;
            case 'active':
                filteredCustomers = this.customers.filter(c => c.status === 'active');
                break;
            case 'inactive':
                filteredCustomers = this.customers.filter(c => c.status === 'inactive');
                break;
        }

        this.renderCustomersTable(filteredCustomers);
    }

    handleAddCustomer(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const newCustomer = {
            id: Date.now(),
            name: formData.get('name'),
            company: formData.get('company'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            type: formData.get('type'),
            notes: formData.get('notes'),
            totalOrders: 0,
            totalSpent: 0,
            lastOrder: null,
            createdAt: new Date(),
            status: 'active'
        };

        this.customers.unshift(newCustomer);
        this.saveCustomers();
        this.renderCustomersTable();
        
        this.closeModal('addCustomerModal');
        e.target.reset();
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم إضافة العميل بنجاح', 'success');
        }
    }

    viewCustomer(customerId) {
        this.currentCustomer = this.customers.find(c => c.id === customerId);
        if (!this.currentCustomer) return;

        const modal = document.getElementById('customerDetailsModal');
        const content = modal.querySelector('#customerDetailsContent');
        
        // Load customer's orders
        const orders = JSON.parse(localStorage.getItem('flowers_orders')) || [];
        const customerOrders = orders.filter(order => order.customer.phone === this.currentCustomer.phone);
        
        content.innerHTML = `
            <div class="customer-details">
                <div class="customer-header">
                    <h4>${this.currentCustomer.name}</h4>
                    ${this.currentCustomer.type === 'vip' ? '<span class="vip-badge-large">⭐ عميل مميز</span>' : ''}
                    <span class="status-badge ${this.currentCustomer.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${this.currentCustomer.status === 'active' ? '🟢 نشط' : '🔴 غير نشط'}
                    </span>
                </div>

                <div class="customer-info-grid">
                    <div class="info-section">
                        <h5>معلومات الاتصال:</h5>
                        <p><strong>الهاتف:</strong> ${this.currentCustomer.phone}</p>
                        ${this.currentCustomer.email ? `<p><strong>البريد الإلكتروني:</strong> ${this.currentCustomer.email}</p>` : ''}
                        ${this.currentCustomer.company ? `<p><strong>الشركة:</strong> ${this.currentCustomer.company}</p>` : ''}
                        ${this.currentCustomer.address ? `<p><strong>العنوان:</strong> ${this.currentCustomer.address}</p>` : ''}
                    </div>

                    <div class="info-section">
                        <h5>الإحصائيات:</h5>
                        <p><strong>عدد الطلبات:</strong> ${this.currentCustomer.totalOrders}</p>
                        <p><strong>إجمالي المشتريات:</strong> ${utils.formatPrice(this.currentCustomer.totalSpent)}</p>
                        <p><strong>متوسط قيمة الطلب:</strong> ${utils.formatPrice(this.currentCustomer.totalOrders > 0 ? this.currentCustomer.totalSpent / this.currentCustomer.totalOrders : 0)}</p>
                        <p><strong>آخر طلب:</strong> ${this.currentCustomer.lastOrder ? utils.formatDate(this.currentCustomer.lastOrder) : 'لا يوجد'}</p>
                    </div>
                </div>

                ${this.currentCustomer.notes ? `
                    <div class="customer-notes">
                        <h5>ملاحظات:</h5>
                        <p>${this.currentCustomer.notes}</p>
                    </div>
                ` : ''}

                ${customerOrders.length > 0 ? `
                    <div class="customer-orders">
                        <h5>آخر الطلبات:</h5>
                        <div class="orders-list">
                            ${customerOrders.slice(0, 5).map(order => `
                                <div class="order-item">
                                    <span class="order-number">${order.orderNumber}</span>
                                    <span class="order-date">${utils.formatDate(order.createdAt)}</span>
                                    <span class="order-amount">${utils.formatPrice(order.total)}</span>
                                    <span class="status-badge ${ordersManager.getStatusClass(order.status)}">
                                        ${ordersManager.getStatusText(order.status)}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;

        this.openModal('customerDetailsModal');
    }

    editCustomer(customerId) {
        this.currentCustomer = this.customers.find(c => c.id === customerId);
        if (!this.currentCustomer) return;

        // For now, we'll just show the details modal
        // In a real app, you would have an edit form
        this.viewCustomer(customerId);
    }

    deleteCustomer(customerId) {
        if (confirm('هل أنت متأكد من حذف هذا العميل؟ سيتم حذف جميع بياناته.')) {
            this.customers = this.customers.filter(c => c.id !== customerId);
            this.saveCustomers();
            this.renderCustomersTable();
            this.updateCustomersSummary();
            
            if (window.flowerApp) {
                window.flowerApp.showNotification('تم حذف العميل بنجاح', 'success');
            }
        }
    }

    exportCustomers() {
        const csvContent = this.convertToCSV(this.customers);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(customers) {
        const headers = ['الاسم', 'الشركة', 'الهاتف', 'البريد الإلكتروني', 'النوع', 'عدد الطلبات', 'إجمالي المشتريات', 'آخر طلب', 'الحالة'];
        const rows = customers.map(customer => [
            customer.name,
            customer.company || '',
            customer.phone,
            customer.email || '',
            this.getTypeText(customer.type),
            customer.totalOrders,
            customer.totalSpent,
            customer.lastOrder ? utils.formatDate(customer.lastOrder) : '',
            customer.status === 'active' ? 'نشط' : 'غير نشط'
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    getTypeText(type) {
        const typeTexts = {
            'regular': 'عادي',
            'vip': 'مميز',
            'wholesaler': 'تاجر جملة'
        };
        return typeTexts[type] || type;
    }

    refreshData() {
        this.renderCustomersTable();
        this.updateCustomersSummary();
        
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم تحديث بيانات العملاء', 'success');
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

    saveCustomers() {
        localStorage.setItem('flowers_customers', JSON.stringify(this.customers));
    }

    getCustomerStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: this.customers.length,
            new: this.customers.filter(c => new Date(c.createdAt) > last30Days).length,
            vip: this.customers.filter(c => c.type === 'vip').length,
            active: this.customers.filter(c => c.status === 'active').length,
            totalRevenue: this.customers.reduce((sum, c) => sum + c.totalSpent, 0),
            avgOrderValue: this.customers.length > 0 ? 
                this.customers.reduce((sum, c) => sum + c.totalSpent, 0) / this.customers.length : 0
        };
    }
}

// Initialize customers manager
let customersManager;

document.addEventListener('DOMContentLoaded', () => {
    customersManager = new CustomersManager();
});