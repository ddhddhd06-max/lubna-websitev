// Main Application JavaScript
class FlowerApp {
    constructor() {
        this.products = [];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.checkAuth();
        this.initAnimations();
        this.setupScrollEffects();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Loading screen
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading');
                if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }
            }, 1000);
        });
    }

    async loadProducts() {
        try {
            // Simulate API call
            this.products = [
                {
                    id: 1,
                    name: 'ورد أحمر مميز',
                    category: 'ورود حمراء',
                    image: '🌹',
                    description: 'أجود أنواع الورود الحمراء المستوردة',
                    inStock: true
                },
                {
                    id: 2,
                    name: 'ورد أبيض نقي',
                    category: 'ورود بيضاء',
                    image: '🌸',
                    description: 'ورود بيضاء نقية من أفضل المزارع',
                    inStock: true
                },
                {
                    id: 3,
                    name: 'ورد وردي أنيق',
                    category: 'ورود وردية',
                    image: '💮',
                    description: 'تشكيلة ورود وردية أنيقة',
                    inStock: false
                },
                {
                    id: 4,
                    name: 'باقة متنوعة',
                    category: 'باقات',
                    image: '💐',
                    description: 'باقة متنوعة من أجمل الورود',
                    inStock: true
                }
            ];

            this.renderProductsPreview();
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    renderProductsPreview() {
        const container = document.getElementById('preview-products');
        if (!container) return;

        const previewProducts = this.products.slice(0, 3);
        
        container.innerHTML = previewProducts.map(product => `
            <div class="product-card fade-in">
                <div class="product-image">
                    ${product.image}
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-meta">
                        <span class="category">${product.category}</span>
                        <span class="stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? '🟢 متوفر' : '🔴 غير متوفر'}
                        </span>
                    </div>
                </div>
            </div>
        `).join('');

        this.triggerAnimations();
    }

    initAnimations() {
        // Initialize floating flowers
        this.createFloatingFlowers();
        
        // Initialize typewriter effect
        this.initTypewriter();
        
        // Initialize particle effects
        this.initParticles();
    }

    createFloatingFlowers() {
        const container = document.querySelector('.floating-flowers');
        if (!container) return;

        for (let i = 0; i < 8; i++) {
            const flower = document.createElement('div');
            flower.className = `flower f${i + 1}`;
            flower.style.cssText = `
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                width: ${20 + Math.random() * 30}px;
                height: ${20 + Math.random() * 30}px;
                animation-delay: ${Math.random() * 6}s;
            `;
            container.appendChild(flower);
        }
    }

    initTypewriter() {
        const elements = document.querySelectorAll('.typewriter');
        elements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.width = '0';
            
            setTimeout(() => {
                let i = 0;
                const timer = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(timer);
                    }
                }, 100);
            }, 1000);
        });
    }

    initParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        hero.appendChild(particlesContainer);

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${2 + Math.random() * 4}px;
                height: ${2 + Math.random() * 4}px;
                animation-delay: ${Math.random() * 6}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    setupScrollEffects() {
        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Fade in elements on scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    triggerAnimations() {
        // Trigger animations for newly added elements
        setTimeout(() => {
            document.querySelectorAll('.product-card').forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
                card.classList.add('fade-in');
            });
        }, 100);
    }

    checkAuth() {
        const token = localStorage.getItem('admin_token');
        if (token) {
            this.currentUser = JSON.parse(localStorage.getItem('admin_user'));
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });

        // Auto remove
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.flowerApp = new FlowerApp();
});

// Utility functions
const utils = {
    formatPrice(price) {
        return new Intl.NumberFormat('ar-IQ', {
            style: 'currency',
            currency: 'IQD'
        }).format(price);
    },

    formatDate(date) {
        return new Intl.DateTimeFormat('ar-IQ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
};