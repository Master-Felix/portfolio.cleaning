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
});
