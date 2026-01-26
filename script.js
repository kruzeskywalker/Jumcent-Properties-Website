// ============================================
// JUMCENT PROPERTIES - JAVASCRIPT FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Mobile Navigation Toggle
  initMobileMenu();
  
  // Smooth Scroll for Navigation Links
  initSmoothScroll();
  
  // Header Scroll Effect
  initHeaderScroll();
  
  // Contact Form Handling
  initContactForm();
  
  // Image Gallery (for property detail pages)
  initGallery();
  
  // Lazy Loading Images
  initLazyLoading();
  
  // Active Navigation Highlighting
  highlightActiveNav();
});

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menu = document.querySelector('.nav-menu');
  
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
      toggle.classList.toggle('active');
      
      // Animate hamburger icon
      const hamburger = toggle.querySelector('.hamburger');
      if (hamburger) {
        hamburger.classList.toggle('active');
      }
    });
    
    // Close menu when clicking on a nav link
    const navLinks = menu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('active');
        toggle.classList.remove('active');
      }
    });
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Only prevent default for anchor links (not just "#")
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });
  }
}

// ============================================
// ACTIVE NAVIGATION HIGHLIGHTING
// ============================================
function highlightActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.querySelector('.contact-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Clear previous errors
      clearFormErrors();
      
      // Get form values
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const message = document.getElementById('message');
      
      let isValid = true;
      
      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
      }
      
      // Validate email
      if (!email.value.trim()) {
        showError(email, 'Please enter your email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Validate message
      if (!message.value.trim()) {
        showError(message, 'Please enter a message');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters long');
        isValid = false;
      }
      
      // If valid, show success message (in real app, this would submit to server)
      if (isValid) {
        showSuccessMessage();
        form.reset();
        
        // In a real application, you would make an AJAX call here:
        // fetch('/api/contact', {
        //   method: 'POST',
        //   body: JSON.stringify({ name: name.value, email: email.value, message: message.value })
        // })
      }
    });
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  const error = document.createElement('div');
  error.className = 'form-error';
  error.textContent = message;
  
  input.classList.add('error');
  formGroup.appendChild(error);
}

function clearFormErrors() {
  const errors = document.querySelectorAll('.form-error');
  errors.forEach(error => error.remove());
  
  const errorInputs = document.querySelectorAll('.form-input.error, .form-textarea.error');
  errorInputs.forEach(input => input.classList.remove('error'));
}

function showSuccessMessage() {
  const form = document.querySelector('.contact-form');
  const success = document.createElement('div');
  success.className = 'form-success';
  success.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. We\'ll get back to you soon.';
  
  form.insertBefore(success, form.firstChild);
  
  // Scroll to success message
  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Remove success message after 5 seconds
  setTimeout(() => {
    success.remove();
  }, 5000);
}

// ============================================
// IMAGE GALLERY
// ============================================
function initGallery() {
  const thumbnails = document.querySelectorAll('.gallery-thumbnail');
  const mainImage = document.querySelector('.gallery-main img');
  
  if (thumbnails.length > 0 && mainImage) {
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Get the image from the thumbnail
        const thumbImg = this.querySelector('img');
        if (thumbImg) {
          // Fade out main image
          mainImage.style.opacity = '0';
          
          // Change source and fade in
          setTimeout(() => {
            mainImage.src = thumbImg.src;
            mainImage.alt = thumbImg.alt;
            mainImage.style.opacity = '1';
          }, 200);
        }
      });
    });
    
    // Set first thumbnail as active
    if (thumbnails[0]) {
      thumbnails[0].classList.add('active');
    }
  }
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
  // Check if IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('fade-in');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Animate elements on scroll
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, {
      threshold: 0.1
    });
    
    elements.forEach(el => observer.observe(el));
  }
}

// External link handling (opens in new tab)
function initExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');
  links.forEach(link => {
    if (!link.hasAttribute('target')) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

// Initialize external links when DOM loads
document.addEventListener('DOMContentLoaded', initExternalLinks);

// ============================================
// SEO & ANALYTICS (Placeholder)
// ============================================

// This is where you would add:
// - Google Analytics
// - Facebook Pixel
// - Other tracking scripts

// Example:
// function initAnalytics() {
//   // Google Analytics code here
// }
