// Global JavaScript for Amazon Boost Shopify Theme

(function() {
  'use strict';

  // Utility functions
  const utils = {
    // Debounce function
    debounce: function(func, wait, immediate) {
      let timeout;
      return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },

    // Throttle function
    throttle: function(func, limit) {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },

    // Smooth scroll to element
    scrollToElement: function(element, offset = 0) {
      const targetPosition = element.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    },

    // Check if element is in viewport
    isInViewport: function(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    // Add animation classes when elements come into view
    animateOnScroll: function() {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach(element => {
        if (this.isInViewport(element)) {
          element.classList.add('animate-in');
        }
      });
    }
  };

  // Form handling
  const forms = {
    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', this.handleSubmit.bind(this));
      }
    },

    handleSubmit: function(e) {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      
      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission (replace with actual endpoint)
      setTimeout(() => {
        this.showSuccess(form);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        form.reset();
      }, 2000);
    },

    showSuccess: function(form) {
      const successMessage = document.createElement('div');
      successMessage.className = 'form-success';
      successMessage.innerHTML = `
        <div style="background: #10b981; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
          Thank you! Your message has been sent successfully. We'll get back to you soon.
        </div>
      `;
      form.appendChild(successMessage);
      
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }
  };

  // Navigation
  const navigation = {
    init: function() {
      this.bindEvents();
      this.handleScroll();
    },

    bindEvents: function() {
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            utils.scrollToElement(target, 80);
          }
        });
      });

      // Mobile menu toggle
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mobileMenu = document.querySelector('.mobile-menu');
      
      if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
          mobileMenu.classList.toggle('active');
          this.classList.toggle('active');
        });
      }
    },

    handleScroll: function() {
      const header = document.querySelector('header');
      if (!header) return;

      const scrollHandler = utils.throttle(() => {
        if (window.scrollY > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, 100);

      window.addEventListener('scroll', scrollHandler);
    }
  };

  // Animations
  const animations = {
    init: function() {
      this.bindEvents();
      this.animateOnLoad();
    },

    bindEvents: function() {
      window.addEventListener('scroll', utils.throttle(() => {
        utils.animateOnScroll();
      }, 100));
    },

    animateOnLoad: function() {
      // Animate elements on page load
      const elements = document.querySelectorAll('[data-animate-on-load]');
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('animate-in');
        }, index * 100);
      });
    }
  };

  // Testimonials carousel
  const testimonials = {
    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {
      const testimonialCards = document.querySelectorAll('.testimonial-card');
      if (testimonialCards.length > 0) {
        testimonialCards.forEach(card => {
          card.addEventListener('mouseenter', this.handleHover.bind(this));
          card.addEventListener('mouseleave', this.handleHoverEnd.bind(this));
        });
      }
    },

    handleHover: function(e) {
      const card = e.currentTarget;
      card.style.transform = 'translateY(-8px) scale(1.02)';
    },

    handleHoverEnd: function(e) {
      const card = e.currentTarget;
      card.style.transform = 'translateY(0) scale(1)';
    }
  };

  // Pricing toggle
  const pricing = {
    init: function() {
      this.bindEvents();
    },

    bindEvents: function() {
      const pricingToggle = document.querySelector('.pricing-toggle');
      if (pricingToggle) {
        pricingToggle.addEventListener('change', this.handleToggle.bind(this));
      }
    },

    handleToggle: function(e) {
      const isAnnual = e.target.checked;
      const prices = document.querySelectorAll('.pricing-card-price');
      
      prices.forEach(price => {
        const currentPrice = price.textContent;
        if (isAnnual) {
          // Apply annual discount (20% off)
          const numericPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
          const annualPrice = (numericPrice * 0.8).toFixed(0);
          price.textContent = `$${annualPrice}`;
        } else {
          // Restore original price
          const numericPrice = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
          const monthlyPrice = (numericPrice / 0.8).toFixed(0);
          price.textContent = `$${monthlyPrice}`;
        }
      });
    }
  };

  // Lazy loading for images
  const lazyLoading = {
    init: function() {
      this.bindEvents();
      this.loadImages();
    },

    bindEvents: function() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    },

    loadImages: function() {
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        if (utils.isInViewport(img)) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
        }
      });
    }
  };

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    forms.init();
    navigation.init();
    animations.init();
    testimonials.init();
    pricing.init();
    lazyLoading.init();
  });

  // Expose utils globally for use in other scripts
  window.themeUtils = utils;

})(); 