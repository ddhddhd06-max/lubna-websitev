// Contact Form Management
class ContactManager {
    constructor() {
        this.contactForm = null;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.setupContactForm();
        this.setupFAQ();
        this.loadContactData();
    }

    setupContactForm() {
        this.contactForm = document.getElementById('contactForm');
        if (!this.contactForm) return;

        this.contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Fill form with URL parameters
        this.fillFormFromURL();
    }

    fillFormFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const product = urlParams.get('product');
        const design = urlParams.get('design');
        const message = urlParams.get('message');

        if (product) {
            document.getElementById('subject').value = 'استفسار عن منتج';
            document.getElementById('message').value = `المنتج: ${product}\n\n${message || 'أرغب في الاستفسار عن هذا المنتج'}`;
        }

        if (design) {
            document.getElementById('subject').value = 'طلب تصميم';
            document.getElementById('message').value = `التصميم: ${design}\n\n${message || 'أرغب في طلب تصميم مشابه'}`;
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const formData = new FormData(this.contactForm);
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Validate form
        if (!this.validateForm(formData)) {
            return;
        }

        // Show loading state
        this.isSubmitting = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save contact message
            this.saveContactMessage(formData);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.contactForm.reset();
            
        } catch (error) {
            this.showErrorMessage('حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.');
        } finally {
            // Reset loading state
            this.isSubmitting = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    validateForm(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || name.trim().length < 2) {
            this.showFieldError('name', 'الاسم يجب أن يكون至少 حرفين');
            return false;
        }

        if (!email || !this.isValidEmail(email)) {
            this.showFieldError('email', 'البريد الإلكتروني غير صحيح');
            return false;
        }

        if (!phone || !this.isValidPhone(phone)) {
            this.showFieldError('phone', 'رقم الهاتف غير صحيح');
            return false;
        }

        if (!subject) {
            this.showFieldError('subject', 'يرجى اختيار موضوع الرسالة');
            return false;
        }

        if (!message || message.trim().length < 10) {
            this.showFieldError('message', 'الرسالة يجب أن تكون至少 10 أحرف');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9]{10,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.closest('.form-group');
        
        // Remove existing error
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add error styling
        field.classList.add('error');
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #e53e3e;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        formGroup.appendChild(errorElement);
        
        // Focus on field
        field.focus();
        
        // Remove error on input
        field.addEventListener('input', () => {
            field.classList.remove('error');
            errorElement.remove();
        }, { once: true });
    }

    saveContactMessage(formData) {
        const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
        
        const newMessage = {
            id: Date.now(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            timestamp: new Date().toISOString(),
            status: 'new',
            read: false
        };
        
        messages.unshift(newMessage);
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        
        return newMessage;
    }

    showSuccessMessage() {
        if (window.flowerApp) {
            window.flowerApp.showNotification('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!', 'success');
        } else {
            alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً!');
        }
        
        // Create success animation
        this.createSuccessAnimation();
    }

    createSuccessAnimation() {
        const successAnimation = document.createElement('div');
        successAnimation.innerHTML = '✅';
        successAnimation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 4rem;
            z-index: 10000;
            animation: successPop 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(successAnimation);
        
        setTimeout(() => {
            document.body.removeChild(successAnimation);
        }, 2000);
    }

    showErrorMessage(message) {
        if (window.flowerApp) {
            window.flowerApp.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle');
            
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                        otherItem.querySelector('.faq-toggle').textContent = '+';
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0';
                    toggle.textContent = '+';
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    toggle.textContent = '−';
                }
            });
        });
    }

    loadContactData() {
        // Load and display contact statistics
        this.displayContactStats();
    }

    displayContactStats() {
        const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
        const today = new Date();
        const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recentMessages = messages.filter(msg => new Date(msg.timestamp) > lastWeek);
        const unreadMessages = messages.filter(msg => !msg.read);
        
        // You can display these stats somewhere in the admin panel
        console.log(`رسائل الاتصال: ${messages.length} إجمالي, ${recentMessages.length} هذا الأسبوع, ${unreadMessages.length} غير مقروءة`);
    }

    // Utility method to get contact analytics
    getContactAnalytics() {
        const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
        
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        return {
            total: messages.length,
            last30Days: messages.filter(msg => new Date(msg.timestamp) > last30Days).length,
            bySubject: this.groupBy(messages, 'subject'),
            byStatus: this.groupBy(messages, 'status'),
            unread: messages.filter(msg => !msg.read).length
        };
    }

    groupBy(array, key) {
        return array.reduce((groups, item) => {
            const val = item[key];
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});
    }
}

// Initialize contact manager
const contactManager = new ContactManager();