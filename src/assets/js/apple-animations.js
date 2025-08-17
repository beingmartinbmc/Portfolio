// Apple-style scroll animations - Optimized Version
document.addEventListener('DOMContentLoaded', function() {
  // Performance optimizations
  let ticking = false;
  let lastScrollY = 0;
  
  // Throttled scroll handler for better performance
  function updateScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Debounced resize handler
  let resizeTimeout;
  function handleResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Recalculate positions after resize
      updateParallaxPositions();
    }, 250);
  }

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        // Unobserve after animation to save memory
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with Apple animation classes
  const animatedElements = document.querySelectorAll('.apple-fade-in, .apple-slide-up, .apple-scale-in');
  animatedElements.forEach(el => observer.observe(el));

  // Stagger animations for child elements - optimized
  const staggerContainers = document.querySelectorAll('.stagger-children');
  staggerContainers.forEach(container => {
    const children = Array.from(container.children);
    children.forEach((child, index) => {
      child.style.animationDelay = `${index * 0.1}s`;
      child.style.opacity = '0';
      child.style.animation = 'fadeInUp 0.8s ease-out forwards';
    });
  });

  // Smooth scroll for navigation links - optimized
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Parallax effect - optimized with throttling
  const parallaxElements = document.querySelectorAll('.parallax');
  
  function updateParallaxPositions() {
    const scrolled = window.pageYOffset;
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  function handleScroll() {
    const currentScrollY = window.pageYOffset;
    
    // Only update if scroll position changed significantly
    if (Math.abs(currentScrollY - lastScrollY) > 5) {
      updateParallaxPositions();
      lastScrollY = currentScrollY;
    }
  }

  // Hover animations - optimized with passive listeners
  const hoverElements = document.querySelectorAll('.hover-lift, .hover-scale, .hover-glow');
  hoverElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.3s ease-out';
    }, { passive: true });
  });

  // Typing animation - optimized with better performance
  const typingElements = document.querySelectorAll('.typing-animation');
  typingElements.forEach(element => {
    const text = element.textContent;
    element.textContent = '';
    element.style.overflow = 'hidden';
    element.style.borderRight = '2px solid #667eea';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        // Use requestAnimationFrame for smoother typing
        requestAnimationFrame(() => {
          setTimeout(typeWriter, 100);
        });
      } else {
        element.style.borderRight = 'none';
      }
    };
    
    // Start typing animation when element comes into view
    const typingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typeWriter();
          typingObserver.unobserve(entry.target);
        }
      });
    });
    
    typingObserver.observe(element);
  });

  // Floating animation - optimized with CSS
  const floatElements = document.querySelectorAll('.float');
  floatElements.forEach(element => {
    element.style.animation = 'float 3s ease-in-out infinite';
  });

  // Pulse animation - optimized with CSS
  const pulseElements = document.querySelectorAll('.pulse');
  pulseElements.forEach(element => {
    element.style.animation = 'pulse 2s ease-in-out infinite';
  });

  // Event listeners with optimizations
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  // Preload critical animations
  function preloadAnimations() {
    const style = document.createElement('style');
    style.textContent = `
      .preload-animations {
        opacity: 0;
        transform: translateY(30px);
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize preloading
  preloadAnimations();
});

// Add smooth reveal animation for page load - optimized
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
  
  // Animate elements on initial page load with better performance
  const initialElements = document.querySelectorAll('.initial-animation');
  initialElements.forEach((element, index) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        element.classList.add('appear');
      }, index * 150); // Reduced delay for faster feel
    });
  });

  // Remove loading states
  const loadingElements = document.querySelectorAll('.loading');
  loadingElements.forEach(element => {
    element.classList.remove('loading');
  });
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    }, 0);
  });
}
