// Carousel functionality
const carousel = {
  elements: {
    next: document.getElementById("next"),
    prev: document.getElementById("prev"),
    container: document.querySelector(".carousel"),
    items: document.querySelectorAll(".carousel .item")
  },
  state: {
    active: 1,
    other1: null,
    other2: null,
    isAnimating: false
  },
  init() {
    if (!this.elements.container || this.elements.items.length === 0) {
      console.warn('Carousel elements not found');
      return;
    }
    
    this.elements.next.addEventListener('click', () => this.handleNext());
    this.elements.prev.addEventListener('click', () => this.handlePrev());
    this.startAutoPlay();
  },
  handleNext() {
    if (this.state.isAnimating) return;
    
    this.elements.container.classList.remove("prev");
    this.elements.container.classList.add("next");
    
    const count = this.elements.items.length;
    this.state.active = this.state.active + 1 >= count ? 0 : this.state.active + 1;
    this.state.other1 = this.state.active - 1 < 0 ? count - 1 : this.state.active - 1;
    this.state.other2 = this.state.active + 1 >= count ? 0 : this.state.active + 1;
    
    this.changeSlider();
  },
  handlePrev() {
    if (this.state.isAnimating) return;
    
    this.elements.container.classList.remove("next");
    this.elements.container.classList.add("prev");
    
    const count = this.elements.items.length;
    this.state.active = this.state.active - 1 < 0 ? count - 1 : this.state.active - 1;
    this.state.other1 = this.state.active + 1 >= count ? 0 : this.state.active + 1;
    this.state.other2 = this.state.other1 + 1 >= count ? 0 : this.state.other1 + 1;
    
    this.changeSlider();
  },
  changeSlider() {
    this.state.isAnimating = true;
    
    requestAnimationFrame(() => {
      const { items } = this.elements;
      const { active, other1, other2 } = this.state;
      
      // Remove old classes
      document.querySelector(".carousel .item.active")?.classList.remove("active");
      document.querySelector(".carousel .item.other_1")?.classList.remove("other_1");
      document.querySelector(".carousel .item.other_2")?.classList.remove("other_2");
      
      // Reset and trigger animations
      items.forEach(item => {
        const img = item.querySelector(".image img");
        const caption = item.querySelector(".image figcaption");
        
        if (img && caption) {
          img.style.animation = 'none';
          caption.style.animation = 'none';
          void item.offsetWidth; // Trigger reflow
          img.style.animation = '';
          caption.style.animation = '';
        }
      });
      
      // Add new classes
      items[active]?.classList.add("active");
      items[other1]?.classList.add("other_1");
      items[other2]?.classList.add("other_2");
      
      // Reset animation state after transition
      setTimeout(() => {
        this.state.isAnimating = false;
      }, 500);
    });
    
    this.resetAutoPlay();
  },
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (!document.hidden) {
        this.handleNext();
      }
    }, 5000);
  },
  resetAutoPlay() {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
};

// Initialize carousel
carousel.init();

// Navigation menu functionality
const nav = {
  elements: {
    menu: document.getElementById("navMenu"),
    hamburger: document.querySelector(".hamburger")
  },
  state: {
    isOpen: false
  },
  init() {
    if (!this.elements.menu || !this.elements.hamburger) {
      console.warn('Navigation elements not found');
      return;
    }
    
    document.addEventListener('click', this.handleDocumentClick.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  },
  toggleMenu(button) {
    this.state.isOpen = !this.state.isOpen;
    this.elements.menu.classList.toggle("show");
    button.setAttribute('aria-expanded', this.state.isOpen);
  },
  handleDocumentClick(e) {
    const { menu, hamburger } = this.elements;
    
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
      menu.classList.remove("show");
      hamburger.setAttribute('aria-expanded', 'false');
      this.state.isOpen = false;
    }
  },
  handleKeyDown(e) {
    if (e.key === 'Escape' && this.state.isOpen) {
      this.elements.menu.classList.remove("show");
      this.elements.hamburger.setAttribute('aria-expanded', 'false');
      this.state.isOpen = false;
    }
  }
};

// Initialize navigation
nav.init();

// Make toggleMenu global for the onclick handler
window.toggleMenu = function(button) {
  nav.toggleMenu(button);
};
