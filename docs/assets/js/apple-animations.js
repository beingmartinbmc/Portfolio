/**
 * Apple-Style Scroll Animation Engine
 * Inspired by apple.com's iPhone/Mac product pages
 * Uses IntersectionObserver for performant scroll-triggered animations
 * with progressive reveal, parallax depth, and staggered sequences.
 */
(function () {
  'use strict';

  // Apple's signature easing
  const APPLE_EASE = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)';
  const APPLE_EASE_OUT = 'cubic-bezier(0.16, 1, 0.3, 1)';

  // ─── SCROLL-TRIGGERED REVEAL ───────────────────────────────────────
  // Elements start hidden and animate in when they enter the viewport.
  // Supports: data-anim="fade-up|fade-down|fade-left|fade-right|scale|blur"
  //           data-delay="0|100|200|..." (ms)
  //           data-duration="600|800|1000|..." (ms)

  function initScrollReveal() {
    const selectors = [
      '[data-anim]',
      '.apple-fade-in',
      '.apple-slide-up',
      '.apple-scale-in',
      '.apple-blur-in',
      '.apple-slide-left',
      '.apple-slide-right'
    ].join(',');

    const elements = document.querySelectorAll(selectors);
    if (!elements.length) return;

    // Set initial hidden state
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.willChange = 'opacity, transform, filter';

      const anim = el.dataset.anim || getAnimClass(el);
      switch (anim) {
        case 'fade-up':
          el.style.transform = 'translateY(60px)'; break;
        case 'fade-down':
          el.style.transform = 'translateY(-60px)'; break;
        case 'fade-left':
          el.style.transform = 'translateX(80px)'; break;
        case 'fade-right':
          el.style.transform = 'translateX(-80px)'; break;
        case 'scale':
          el.style.transform = 'scale(0.85)'; break;
        case 'blur':
          el.style.transform = 'translateY(30px)';
          el.style.filter = 'blur(10px)'; break;
        default:
          el.style.transform = 'translateY(60px)';
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        const duration = parseInt(el.dataset.duration || '800', 10);

        setTimeout(() => {
          el.style.transition = [
            `opacity ${duration}ms ${APPLE_EASE_OUT}`,
            `transform ${duration}ms ${APPLE_EASE_OUT}`,
            `filter ${duration}ms ${APPLE_EASE_OUT}`
          ].join(', ');
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
          el.style.filter = 'blur(0px)';

          // Cleanup will-change after animation
          setTimeout(() => {
            el.style.willChange = 'auto';
          }, duration + 100);
        }, delay);

        observer.unobserve(el);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  function getAnimClass(el) {
    if (el.classList.contains('apple-slide-up')) return 'fade-up';
    if (el.classList.contains('apple-scale-in')) return 'scale';
    if (el.classList.contains('apple-blur-in')) return 'blur';
    if (el.classList.contains('apple-slide-left')) return 'fade-left';
    if (el.classList.contains('apple-slide-right')) return 'fade-right';
    return 'fade-up'; // default for apple-fade-in
  }

  // ─── STAGGERED CHILDREN ────────────────────────────────────────────
  // Container with [data-stagger] animates children one by one.
  // data-stagger="80" = 80ms between each child

  function initStaggeredReveal() {
    const containers = document.querySelectorAll('[data-stagger]');
    if (!containers.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const container = entry.target;
        const staggerDelay = parseInt(container.dataset.stagger || '100', 10);
        const children = Array.from(container.children);

        children.forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(40px)';

          setTimeout(() => {
            child.style.transition = `opacity 700ms ${APPLE_EASE_OUT}, transform 700ms ${APPLE_EASE_OUT}`;
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * staggerDelay);
        });

        observer.unobserve(container);
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    containers.forEach(c => observer.observe(c));
  }

  // ─── TEXT SPLIT REVEAL ─────────────────────────────────────────────
  // [data-text-reveal] splits text into words and staggers them in.
  // Like Apple's big headline reveals.

  function initTextReveal() {
    const elements = document.querySelectorAll('[data-text-reveal]');
    if (!elements.length) return;

    elements.forEach(el => {
      const text = el.textContent.trim();
      if (!text) return;

      const words = text.split(/\s+/);
      el.textContent = '';
      el.style.overflow = 'hidden';

      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'apple-word';
        span.style.cssText = `
          display: inline-block;
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 600ms ${APPLE_EASE_OUT}, transform 600ms ${APPLE_EASE_OUT};
          transition-delay: ${i * 60}ms;
        `;
        span.textContent = word;
        el.appendChild(span);

        // Add space after each word (except last)
        if (i < words.length - 1) {
          el.appendChild(document.createTextNode('\u00A0'));
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const words = entry.target.querySelectorAll('.apple-word');
        words.forEach(word => {
          word.style.opacity = '1';
          word.style.transform = 'translateY(0)';
        });

        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.2
    });

    elements.forEach(el => observer.observe(el));
  }

  // ─── LINE REVEAL ───────────────────────────────────────────────────
  // [data-line-reveal] reveals text line by line (for paragraphs)

  function initLineReveal() {
    const elements = document.querySelectorAll('[data-line-reveal]');
    if (!elements.length) return;

    elements.forEach(el => {
      el.style.opacity = '0';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.style.transition = `opacity 1000ms ${APPLE_EASE_OUT}`;
        el.style.opacity = '1';

        observer.unobserve(el);
      });
    }, {
      threshold: 0.3
    });

    elements.forEach(el => observer.observe(el));
  }

  // ─── PARALLAX DEPTH ────────────────────────────────────────────────
  // [data-parallax="0.3"] moves element at 30% scroll speed
  // Creates Apple-style depth layering

  function initParallax() {
    const elements = document.querySelectorAll('[data-parallax]');
    if (!elements.length) return;

    let ticking = false;

    function updatePositions() {
      const scrollY = window.pageYOffset;
      const viewportHeight = window.innerHeight;

      elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.3;
        const rect = el.getBoundingClientRect();
        const elementCenter = rect.top + rect.height / 2;
        const viewportCenter = viewportHeight / 2;
        const distance = elementCenter - viewportCenter;

        el.style.transform = `translateY(${distance * speed * -0.5}px)`;
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updatePositions();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updatePositions();
  }

  // ─── PROGRESS-BASED OPACITY ────────────────────────────────────────
  // [data-scroll-opacity] fades element based on viewport position
  // Peak opacity at center, fades at edges — Apple's signature effect

  function initScrollOpacity() {
    const elements = document.querySelectorAll('[data-scroll-opacity]');
    if (!elements.length) return;

    let ticking = false;

    function update() {
      const viewH = window.innerHeight;

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = center / viewH; // 0 = top, 1 = bottom

        // Peak at 0.5 (center), fade at edges
        const opacity = 1 - Math.abs(progress - 0.5) * 2;
        el.style.opacity = Math.max(0, Math.min(1, opacity * 1.5)).toFixed(3);
      });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    update();
  }

  // ─── COUNTER ANIMATION ─────────────────────────────────────────────
  // [data-count-to="100"] animates number from 0 to target

  function initCounters() {
    const elements = document.querySelectorAll('[data-count-to]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseFloat(el.dataset.countTo);
        const suffix = el.dataset.countSuffix || '';
        const duration = parseInt(el.dataset.countDuration || '2000', 10);
        const decimals = (target % 1 !== 0) ? 1 : 0;

        let start = 0;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Apple-style easeOutExpo
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = start + (target - start) * eased;

          el.textContent = current.toFixed(decimals) + suffix;

          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    elements.forEach(el => observer.observe(el));
  }

  // ─── SMOOTH SCROLL NAV ─────────────────────────────────────────────

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const offset = 80;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  // ─── PAGE LOAD REVEAL ──────────────────────────────────────────────

  function initPageLoad() {
    document.body.classList.add('loaded');

    const heroElements = document.querySelectorAll('.apple-hero-anim');
    heroElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      setTimeout(() => {
        el.style.transition = `opacity 1000ms ${APPLE_EASE_OUT}, transform 1000ms ${APPLE_EASE_OUT}`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 150);
    });
  }

  // ─── INITIALIZE ────────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollReveal();
    initStaggeredReveal();
    initTextReveal();
    initLineReveal();
    initParallax();
    initScrollOpacity();
    initCounters();
    initSmoothScroll();
  }

  window.addEventListener('load', initPageLoad);
})();
