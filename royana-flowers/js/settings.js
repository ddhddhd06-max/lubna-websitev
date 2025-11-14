// Settings Management
class SettingsManager {
    constructor() {
        this.settings = {};
        this.currentTab = 'general';
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.setupTabNavigation();
        this.setupPasswordStrength();
    }

    loadSettings() {
        // Load settings from localStorage or use defaults
        this.settings = JSON.parse(localStorage.getItem('site_settings')) || this.getDefaultSettings();
        this.applySettings();
    }

    getDefaultSettings() {
        return {
            general: {
                siteName: 'رويانا',
                siteDescription: 'جملة الورود المستوردة - لأنك تستحق الأفضل',
                contactEmail: 'info@royana.com',
                contactPhone: '07701234567',
                siteAddress: 'بغداد، المنصور - شارع الزهور، بناية ١٢٣',
                workingHours: 'الأحد - الخميس: 8:00 - 18:00',
                weekendHours: 'الجمعة - السبت: 10:00 - 16:00'
            },
            design: {
                primaryColor: '#e91e63',
                secondaryColor: '#9c27b0',
                theme: 'light',
                animations: true,
                rtl: true,
                responsive: true
            },
            products: {
                defaultCurrency: 'IQD',
                minOrderQuantity: 50,
                lowStockThreshold: 20,
                showPrices: true,
                showStock: true,
                featuredProducts: true
            },
            notifications: {
                newOrders: true,
                lowStock: true,
                newContacts: true,
                systemUpdates: true,
                emailNotifications: true,
                browserNotifications: false,
                smsNotifications: false,
                notificationEmail: 'notifications@royana.com'
            },
            security: {
                twoFactorAuth: false,
                sessionTimeout: true,
                loginAlerts: false
            }
        };
    }

    applySettings() {
        // Apply general settings
        this.applyGeneralSettings();
        
        // Apply design settings
        this.applyDesignSettings();
        
        // Update forms with current settings
        this.updateSettingsForms();
    }

    applyGeneralSettings() {
        const general = this.settings.general;
        
        // Update page title and meta information
        document.title = `${general.siteName} - لوحة التحكم`;
        
        // You can update other general settings here
        console.log('Applied general settings:', general);
    }

    applyDesignSettings() {
        const design = this.settings.design;
        
        // Update CSS variables
        if (design.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', design.primaryColor);
        }
        
        if (design.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', design.secondaryColor);
        }
        
        // Apply theme
        this.applyTheme(design.theme);
        
        // Toggle animations
        if (!design.animations) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }

    applyTheme(theme) {
        const body = document.body;
        
        // Remove existing theme classes
        body.classList.remove('theme-light', 'theme-dark', 'theme-auto');
        
        // Add new theme class
        body.classList.add(`theme-${theme}`);
        
        // Update theme in localStorage for persistence
        localStorage.setItem('preferred-theme', theme);
    }

    updateSettingsForms() {
        // Update general settings form
        this.updateForm('generalSettingsForm', this.settings.general);
        this.updateForm('designSettingsForm', this.settings.design);
        this.updateForm('productsSettingsForm', this.settings.products);
        this.updateForm('notificationsSettingsForm', this.settings.notifications);
        this.updateForm('securitySettingsForm', this.settings.security);
    }

    updateForm(formId, settings) {
        const form = document.getElementById(formId);
        if (!form) return;

        Object.entries(settings).forEach(([key, value]) => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'checkbox') {
                    input.checked = value;
                } else if (input.type === 'radio') {
                    const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = value;
                }
            }
        });
    }

    setupEventListeners() {
        // General settings form
        const generalForm = document.getElementById('generalSettingsForm');
        if (generalForm) {
            generalForm.addEventListener('submit', (e) => this.handleGeneralSettings(e));
        }

        // Design settings form
        const designForm = document.getElementById('designSettingsForm');
        if (designForm) {
            designForm.addEventListener('submit', (e) => this.handleDesignSettings(e));
            // Live preview for color changes
            designForm.querySelectorAll('input[type="color"]').forEach(input => {
                input.addEventListener('input', (e) => this.previewDesignChange(e));
            });
        }

        // Products settings form
        const productsForm = document.getElementById('productsSettingsForm');
        if (productsForm) {
            productsForm.addEventListener('submit', (e) => this.handleProductsSettings(e));
        }

        // Notifications settings form
        const notificationsForm = document.getElementById('notificationsSettingsForm');
        if (notificationsForm) {
            notificationsForm.addEventListener('submit', (e) => this.handleNotificationsSettings(e));
        }

        // Security settings form
        const securityForm = document.getElementById('securitySettingsForm');
        if (securityForm) {
            securityForm.addEventListener('submit', (e) => this.handleSecuritySettings(e));
        }

        // Backup actions
        const backupBtn = document.getElementById('createBackup');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => this.createBackup());
        }

        const restoreBtn = document.getElementById('restoreBackup');
        if (restoreBtn) {
            restoreBtn.addEventListener('click', () => this.restoreBackup());
        }

        const autoBackupBtn = document.getElementById('autoBackup');
        if (autoBackupBtn) {
            autoBackupBtn.addEventListener('click', () => this.setupAutoBackup());
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                // Update active tab button
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Show corresponding tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
                
                this.currentTab = tabId;
            });
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('newPassword');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthText = document.querySelector('.strength-text span');

        if (passwordInput && strengthBar && strengthText) {
            passwordInput.addEventListener('input', (e) => {
                const strength = this.calculatePasswordStrength(e.target.value);
                this.updatePasswordStrength(strength, strengthBar, strengthText);
            });
        }
    }

    calculatePasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return Math.min(strength, 5); // Max strength of 5
    }

    updatePasswordStrength(strength, bar, text) {
        const percentage = (strength / 5) * 100;
        const colors = ['#e53e3e', '#ed8936', '#ecc94b', '#68d391', '#38a169'];
        const labels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
        
        bar.style.width = `${percentage}%`;
        bar.style.backgroundColor = colors[strength - 1] || colors[0];
        text.textContent = labels[strength - 1] || labels[0];
        text.style.color = colors[strength - 1] || colors[0];
    }

    handleGeneralSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.settings.general = {
            siteName: formData.get('siteName'),
            siteDescription: formData.get('siteDescription'),
            contactEmail: formData.get('contactEmail'),
            contactPhone: formData.get('contactPhone'),
            siteAddress: formData.get('siteAddress'),
            workingHours: formData.get('workingHours'),
            weekendHours: formData.get('weekendHours')
        };
        
        this.saveSettings();
        this.applyGeneralSettings();
        this.showSuccess('تم حفظ الإعدادات العامة بنجاح');
    }

    handleDesignSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.settings.design = {
            primaryColor: formData.get('primaryColor'),
            secondaryColor: formData.get('secondaryColor'),
            theme: formData.get('theme'),
            animations: formData.get('animations') === 'on',
            rtl: formData.get('rtl') === 'on',
            responsive: formData.get('responsive') === 'on'
        };
        
        this.saveSettings();
        this.applyDesignSettings();
        this.showSuccess('تم تطبيق إعدادات التصميم بنجاح');
    }

    handleProductsSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.settings.products = {
            defaultCurrency: formData.get('defaultCurrency'),
            minOrderQuantity: parseInt(formData.get('minOrderQuantity')),
            lowStockThreshold: parseInt(formData.get('lowStockThreshold')),
            showPrices: formData.get('showPrices') === 'on',
            showStock: formData.get('showStock') === 'on',
            featuredProducts: formData.get('featuredProducts') === 'on'
        };
        
        this.saveSettings();
        this.showSuccess('تم حفظ إعدادات المنتجات بنجاح');
    }

    handleNotificationsSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        this.settings.notifications = {
            newOrders: formData.get('newOrders') === 'on',
            lowStock: formData.get('lowStock') === 'on',
            newContacts: formData.get('newContacts') === 'on',
            systemUpdates: formData.get('systemUpdates') === 'on',
            emailNotifications: formData.get('emailNotifications') === 'on',
            browserNotifications: formData.get('browserNotifications') === 'on',
            smsNotifications: formData.get('smsNotifications') === 'on',
            notificationEmail: formData.get('notificationEmail')
        };
        
        this.saveSettings();
        this.showSuccess('تم حفظ إعدادات الإشعارات بنجاح');
    }

    handleSecuritySettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const currentPassword = formData.get('currentPassword');
        const newPassword = formData.get('newPassword');
        const confirmPassword = formData.get('confirmPassword');
        
        // Validate current password (in real app, this would check against hashed password)
        if (currentPassword && currentPassword !== 'admin123') {
            this.showError('كلمة المرور الحالية غير صحيحة');
            return;
        }
        
        // Validate new password
        if (newPassword && newPassword !== confirmPassword) {
            this.showError('كلمات المرور غير متطابقة');
            return;
        }
        
        if (newPassword && newPassword.length < 8) {
            this.showError('كلمة المرور يجب أن تكون至少 8 أحرف');
            return;
        }
        
        // Update security settings
        this.settings.security = {
            twoFactorAuth: formData.get('twoFactorAuth') === 'on',
            sessionTimeout: formData.get('sessionTimeout') === 'on',
            loginAlerts: formData.get('loginAlerts') === 'on'
        };
        
        this.saveSettings();
        
        // In a real app, you would update the password here
        if (newPassword) {
            console.log('Password would be updated to:', newPassword);
            this.showSuccess('تم تحديث كلمة المرور والإعدادات الأمنية بنجاح');
        } else {
            this.showSuccess('تم حفظ الإعدادات الأمنية بنجاح');
        }
        
        // Reset form
        e.target.reset();
    }

    previewDesignChange(e) {
        const property = e.target.name === 'primaryColor' ? '--primary-color' : '--secondary-color';
        document.documentElement.style.setProperty(property, e.target.value);
    }

    createBackup() {
        const backupData = {
            timestamp: new Date().toISOString(),
            products: JSON.parse(localStorage.getItem('flowers_products')) || [],
            orders: JSON.parse(localStorage.getItem('flowers_orders')) || [],
            contacts: JSON.parse(localStorage.getItem('contact_messages')) || [],
            settings: this.settings,
            version: '1.0'
        };
        
        const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(backupBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `royana_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccess('تم إنشاء النسخة الاحتياطية بنجاح');
    }

    restoreBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const backupData = JSON.parse(event.target.result);
                    
                    if (confirm('هل أنت متأكد من استعادة النسخة الاحتياطية؟ سيتم استبدال جميع البيانات الحالية.')) {
                        this.restoreBackupData(backupData);
                        this.showSuccess('تم استعادة النسخة الاحتياطية بنجاح');
                    }
                } catch (error) {
                    this.showError('خطأ في ملف النسخة الاحتياطية');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    restoreBackupData(backupData) {
        if (backupData.products) {
            localStorage.setItem('flowers_products', JSON.stringify(backupData.products));
        }
        
        if (backupData.orders) {
            localStorage.setItem('flowers_orders', JSON.stringify(backupData.orders));
        }
        
        if (backupData.contacts) {
            localStorage.setItem('contact_messages', JSON.stringify(backupData.contacts));
        }
        
        if (backupData.settings) {
            this.settings = backupData.settings;
            this.saveSettings();
            this.applySettings();
        }
    }

    setupAutoBackup() {
        // In a real app, this would set up automatic backup scheduling
        const frequency = prompt('حدد تكرار النسخ الاحتياطي التلقائي (يومي، أسبوعي، شهري):', 'أسبوعي');
        
        if (frequency) {
            localStorage.setItem('auto_backup_frequency', frequency);
            this.showSuccess(`تم تفعيل النسخ الاحتياطي التلقائي (${frequency})`);
        }
    }

    saveSettings() {
        localStorage.setItem('site_settings', JSON.stringify(this.settings));
    }

    showSuccess(message) {
        if (window.flowerApp) {
            window.flowerApp.showNotification(message, 'success');
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (window.flowerApp) {
            window.flowerApp.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    // Method to reset all settings to defaults
    resetToDefaults() {
        if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى الافتراضيات؟')) {
            this.settings = this.getDefaultSettings();
            this.saveSettings();
            this.applySettings();
            this.updateSettingsForms();
            this.showSuccess('تم إعادة تعيين جميع الإعدادات');
        }
    }

    // Method to export settings
    exportSettings() {
        const settingsBlob = new Blob([JSON.stringify(this.settings, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(settingsBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'royana_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize settings manager
const settingsManager = new SettingsManager();