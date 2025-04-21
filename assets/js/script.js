// Initialize Bootstrap components when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
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
