// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Check if user is on admin page and redirect if not authenticated
        if (window.location.pathname.includes('/admin') && !this.isAuthenticated()) {
            window.location.href = '../login.html';
        }
    }

    checkAuthState() {
        const token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (token && user) {
            this.currentUser = JSON.parse(user);
            this.updateUI();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');
        const rememberMe = formData.get('rememberMe') === 'on';

        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري التسجيل...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Demo credentials (in real app, this would be a server-side check)
            if (username === 'admin' && password === 'admin123') {
                const user = {
                    id: 1,
                    username: 'admin',
                    name: 'مدير النظام',
                    role: 'admin',
                    lastLogin: new Date(),
                    permissions: ['products', 'orders', 'customers', 'analytics', 'settings']
                };

                const token = this.generateToken();
                
                this.currentUser = user;
                localStorage.setItem('admin_token', token);
                localStorage.setItem('admin_user', JSON.stringify(user));
                
                if (rememberMe) {
                    localStorage.setItem('remember_me', 'true');
                }

                if (window.flowerApp) {
                    window.flowerApp.showNotification('تم تسجيل الدخول بنجاح', 'success');
                }

                // Redirect to admin dashboard
                setTimeout(() => {
                    window.location.href = 'admin/dashboard.html';
                }, 1000);

            } else {
                throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة');
            }

        } catch (error) {
            if (window.flowerApp) {
                window.flowerApp.showNotification(error.message, 'error');
            }
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            this.currentUser = null;
            
            if (window.flowerApp) {
                window.flowerApp.showNotification('تم تسجيل الخروج بنجاح', 'success');
            }
            
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 1000);
        }
    }

    isAuthenticated() {
        const token = localStorage.getItem('admin_token');
        if (!token) return false;

        // Check if token is expired (demo - in real app, verify with server)
        const tokenData = this.parseToken(token);
        if (tokenData && tokenData.exp < Date.now()) {
            this.handleLogout();
            return false;
        }

        return true;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }

    generateToken() {
        // Demo token generation (in real app, this comes from server)
        const tokenData = {
            userId: this.currentUser.id,
            exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        return btoa(JSON.stringify(tokenData));
    }

    parseToken(token) {
        try {
            return JSON.parse(atob(token));
        } catch {
            return null;
        }
    }

    updateUI() {
        // Update user info in admin panel
        const userInfoElements = document.querySelectorAll('.user-info');
        userInfoElements.forEach(element => {
            if (this.currentUser) {
                element.textContent = this.currentUser.name;
            }
        });

        // Show/hide elements based on permissions
        this.updatePermissions();
    }

    updatePermissions() {
        const permissionElements = {
            'products': '[data-permission="products"]',
            'orders': '[data-permission="orders"]',
            'customers': '[data-permission="customers"]',
            'analytics': '[data-permission="analytics"]',
            'settings': '[data-permission="settings"]'
        };

        Object.entries(permissionElements).forEach(([permission, selector]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this.hasPermission(permission)) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;
        let feedback = [];

        if (password.length >= 8) strength++;
        else feedback.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');

        if (/[A-Z]/.test(password)) strength++;
        else feedback.push('يجب أن تحتوي على حرف كبير على الأقل');

        if (/[a-z]/.test(password)) strength++;
        else feedback.push('يجب أن تحتوي على حرف صغير على الأقل');

        if (/[0-9]/.test(password)) strength++;
        else feedback.push('يجب أن تحتوي على رقم على الأقل');

        if (/[^A-Za-z0-9]/.test(password)) strength++;
        else feedback.push('يجب أن تحتوي على رمز خاص على الأقل');

        return {
            strength,
            feedback,
            level: strength < 3 ? 'ضعيف' : strength < 5 ? 'متوسط' : 'قوي'
        };
    }

    // Session management
    startSessionTimer() {
        // Auto logout after 30 minutes of inactivity
        this.sessionTimer = setTimeout(() => {
            this.handleLogout();
        }, 30 * 60 * 1000);
    }

    resetSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        this.startSessionTimer();
    }
}

// Initialize auth manager
let authManager;

document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    
    // Add activity listeners for session management
    if (authManager.isAuthenticated()) {
        ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
            document.addEventListener(event, () => authManager.resetSessionTimer());
        });
        authManager.startSessionTimer();
    }
});