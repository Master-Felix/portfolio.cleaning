/* ============================================
   Matxo Cleaning Services Website
   Main JavaScript
   ============================================ */

/* ===== Testimonials Slider ===== */
class TestimonialsSlider {
    constructor() {
        this.slider = document.querySelector('.testimonials-slider');
        this.track = document.querySelector('.testimonials-track');
        this.slides = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.querySelector('.prev-arrow');
        this.nextBtn = document.querySelector('.next-arrow');
        this.dotsContainer = document.querySelector('.slider-dots');

        this.currentIndex = 0;
        this.slideWidth = 100; // 100%
        this.slidesLength = this.slides.length;

        this.init();
    }

    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // Set initial state
        this.updateDots();
        this.slides.forEach(slide => slide.style.flex = `0 0 ${this.slideWidth}%`);
        this.track.style.width = `${this.slideWidth * this.slidesLength}%`;

        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Touch events
        let touchStartX = 0;
        let touchEndX = 0;

        this.slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.slider.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });

        // Auto play
        this.startAutoPlay();
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slidesLength) % this.slidesLength;
        this.updateSlider();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slidesLength;
        this.updateSlider();
    }

    updateSlider() {
        const offset = -this.currentIndex * this.slideWidth;
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
        this.resetAutoPlay();
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.nextSlide(), 5000);
    }

    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
}


/* ===== DOM Ready Initialization ===== */
// Initialize components when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    /* ===== Navbar Scroll Effect ===== */
    // Update navbar on scroll
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50;

    function updateNavbar() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Initial check
    updateNavbar();

    // Add scroll event listener
    window.addEventListener('scroll', function() {
        updateNavbar();
    });

    /* ===== Initialize Components ===== */
    // Initialize testimonials slider
    new TestimonialsSlider();

    /* ===== Service Modals ===== */
    // Initialize all service modals
    const serviceModals = [
        'facadeModal',
        'hydrojetModal',
        'solarpanelModal',
        'ventilationModal',
        'gasModal',
        'tankModal',
        'waterproofingModal'
    ];

    serviceModals.forEach(modalId => {
        const modalElement = document.getElementById(modalId);
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement, {
                keyboard: true,
                backdrop: true
            });

            // Add click handler for the corresponding button
            const btn = document.querySelector(`[data-bs-target="#${modalId}"]`);
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    modal.show();
                });
            }
        }
    });

    // Auto-fill service when coming from a modal
    const serviceSelect = document.getElementById('service');
    document.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
        if (btn.getAttribute('href') === '#contact') {
            btn.addEventListener('click', function() {
                const modalId = this.closest('.modal').id;
                const service = modalId.replace('Modal', '');
                setTimeout(() => {
                    serviceSelect.value = service;
                }, 100);
            });
        }
    });
});


/* ===== Form Handling ===== */
// Handle quote form submission
function handleQuoteSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validate phone number
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    // Validate date
    if (data.preferredDate) {
        const selectedDate = new Date(data.preferredDate);
        const today = new Date();
        if (selectedDate < today) {
            alert('Please select a future date');
            return false;
        }
    }

    // Create success message
    const form = event.target;
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3';
    successMessage.innerHTML = `
        <h4 class="alert-heading">Quote Request Received!</h4>
        <p>Thank you ${data.name}, we've received your quote request for ${form.service.options[form.service.selectedIndex].text}.</p>
        <p>We'll contact you within 24 hours at ${data.email} or ${data.phone} to discuss your project.</p>
    `;

    // Hide form and show success message
    form.style.display = 'none';
    form.parentNode.appendChild(successMessage);

    // Optional: Reset form for future use
    form.reset();

    return false;
}
