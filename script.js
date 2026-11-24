// ============================================
// JUMCENT PROPERTIES — FRONTEND INTERACTIVITY
// Accessible · Performant · UK PECR Compliant
// ============================================

(function () {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-N89EW0TN2Y';
  const CONSENT_STORAGE_KEY = 'jumcent_cookie_consent_v1';
  let gaLoaded = false;

  // Enable progressive reveal styles before paint when motion is permitted
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.documentElement.classList.add('js-enabled');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    initHeaderScroll();
    highlightActiveNav();
    initSmoothScroll();
    initScrollReveal();
    initPropertyFilters();
    initGalleryAndLightbox();
    initContactForm();
    initCookieConsent();
  });

  // ============================================
  // 1. UK PECR / GDPR CONSENT-GATED ANALYTICS
  // ============================================
  function loadGoogleAnalytics() {
    if (gaLoaded) return;
    gaLoaded = true;

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(script);
  }

  function initCookieConsent() {
    let savedChoice = null;
    try {
      savedChoice = localStorage.getItem(CONSENT_STORAGE_KEY);
    } catch (_) {
      savedChoice = null;
    }

    if (savedChoice === 'accepted') {
      loadGoogleAnalytics();
    }

    // Build banner once so users can also reopen preferences from footer
    const banner = document.createElement('aside');
    banner.className = 'cookie-banner';
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.hidden = savedChoice === 'accepted' || savedChoice === 'essential';

    const text = document.createElement('p');
    text.textContent = 'We use optional analytics cookies to understand how visitors explore our properties and improve your experience. ';
    const policyLink = document.createElement('a');
    policyLink.href = 'privacy.html#cookies';
    policyLink.textContent = 'Read Cookie & Privacy Policy';
    text.appendChild(policyLink);

    const actions = document.createElement('div');
    actions.className = 'cookie-actions';

    const essentialBtn = document.createElement('button');
    essentialBtn.type = 'button';
    essentialBtn.className = 'btn btn-outline btn-sm';
    essentialBtn.textContent = 'Essential Only';

    const acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.className = 'btn btn-primary btn-sm';
    acceptBtn.textContent = 'Accept Analytics';

    essentialBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'essential');
      } catch (_) {}
      banner.hidden = true;
    });

    acceptBtn.addEventListener('click', function () {
      try {
        localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
      } catch (_) {}
      banner.hidden = true;
      loadGoogleAnalytics();
    });

    actions.appendChild(essentialBtn);
    actions.appendChild(acceptBtn);
    banner.appendChild(text);
    banner.appendChild(actions);
    document.body.appendChild(banner);

    // Allow reopening preferences from footer link
    document.querySelectorAll('[data-open-cookies]').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        banner.hidden = false;
        acceptBtn.focus();
      });
    });
  }

  // ============================================
  // 2. ACCESSIBLE MOBILE NAVIGATION
  // ============================================
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    const hamburger = toggle.querySelector('.hamburger');

    function setMenuOpen(isOpen) {
      menu.classList.toggle('active', isOpen);
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (hamburger) {
        hamburger.classList.toggle('active', isOpen);
      }
    }

    toggle.addEventListener('click', function () {
      const isOpen = !menu.classList.contains('active');
      setMenuOpen(isOpen);
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('click', function (e) {
      if (menu.classList.contains('active') && !toggle.contains(e.target) && !menu.contains(e.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('active')) {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  }

  // ============================================
  // 3. PASSIVE SCROLL HEADER
  // ============================================
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let ticking = false;
    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 60);
      ticking = false;
    }

    updateHeader();
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================
  // 4. ACTIVE NAVIGATION HIGHLIGHTING
  // ============================================
  function highlightActiveNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    const rawPage = window.location.pathname.split('/').pop() || 'index.html';
    const isPropertyDetail = rawPage.startsWith('property-');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      const isHome = (rawPage === '' || rawPage === 'index.html') && (href === '/' || href === 'index.html');
      const isDirectMatch = href === rawPage;
      const isPropertiesSection = isPropertyDetail && href === 'properties.html';

      if (isHome || isDirectMatch || isPropertiesSection) {
        link.classList.add('active');
        if (!isPropertiesSection) {
          link.setAttribute('aria-current', 'page');
        }
      }
    });
  }

  // ============================================
  // 5. SMOOTH ANCHOR SCROLLING
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || link.hasAttribute('data-open-cookies')) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 92;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
      });
    });
  }

  // ============================================
  // 6. PROGRESSIVE SCROLL REVEAL
  // ============================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(function (el) {
        el.classList.add('active');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ============================================
  // 7. UK / INTERNATIONAL PROPERTY FILTERING
  // ============================================
  function initPropertyFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('.property-card[data-region]');
    if (!filterButtons.length || !cards.length) return;

    const statusRegion = document.getElementById('filter-status');

    function applyFilter(region) {
      let visibleCount = 0;
      cards.forEach(function (card) {
        const cardRegion = card.getAttribute('data-region');
        const matches = region === 'all' || cardRegion === region;
        card.hidden = !matches;
        if (matches) {
          card.classList.add('active');
          visibleCount++;
        }
      });

      filterButtons.forEach(function (btn) {
        const isSelected = btn.getAttribute('data-filter') === region;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });

      if (statusRegion) {
        const labelMap = {
          all: 'all locations',
          uk: 'United Kingdom',
          international: 'International'
        };
        statusRegion.textContent = 'Showing ' + visibleCount + (visibleCount === 1 ? ' property' : ' properties') + ' in ' + (labelMap[region] || region) + '.';
      }
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const region = btn.getAttribute('data-filter');
        applyFilter(region);
        try {
          const url = new URL(window.location.href);
          if (region === 'all') {
            url.searchParams.delete('region');
          } else {
            url.searchParams.set('region', region);
          }
          window.history.replaceState({}, '', url.toString());
        } catch (_) {}
      });
    });

    // Apply initial filter from URL if present (?region=uk or ?region=international)
    try {
      const params = new URLSearchParams(window.location.search);
      const initialRegion = params.get('region');
      if (initialRegion && ['all', 'uk', 'international'].includes(initialRegion)) {
        applyFilter(initialRegion);
      }
    } catch (_) {}
  }

  // ============================================
  // 8. ACCESSIBLE GALLERY & FULLSCREEN LIGHTBOX
  // ============================================
  function initGalleryAndLightbox() {
    const gallery = document.querySelector('.gallery');
    const mainImg = document.querySelector('.gallery-main img');
    const thumbs = Array.from(document.querySelectorAll('.gallery-thumbnail'));
    if (!gallery || !mainImg || !thumbs.length) return;

    let currentIndex = 0;
    let lastFocusedBeforeModal = null;

    const mainContainer = document.querySelector('.gallery-main');

    // Add Prev / Next / Counter / Expand UI inside .gallery-main
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'gallery-nav-btn gallery-prev';
    prevBtn.setAttribute('aria-label', 'Previous photo');
    prevBtn.textContent = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'gallery-nav-btn gallery-next';
    nextBtn.setAttribute('aria-label', 'Next photo');
    nextBtn.textContent = '›';

    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.setAttribute('aria-live', 'polite');

    const expandBtn = document.createElement('button');
    expandBtn.type = 'button';
    expandBtn.className = 'gallery-expand-btn';
    expandBtn.textContent = '⤢ View Fullscreen';

    mainContainer.appendChild(prevBtn);
    mainContainer.appendChild(nextBtn);
    mainContainer.appendChild(expandBtn);
    mainContainer.appendChild(counter);

    // Build Lightbox Modal
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Property photo viewer');
    modal.hidden = true;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close fullscreen photo viewer');
    closeBtn.textContent = '×';

    const modalPrev = document.createElement('button');
    modalPrev.type = 'button';
    modalPrev.className = 'gallery-nav-btn gallery-prev';
    modalPrev.setAttribute('aria-label', 'Previous photo');
    modalPrev.textContent = '‹';

    const modalNext = document.createElement('button');
    modalNext.type = 'button';
    modalNext.className = 'gallery-nav-btn gallery-next';
    modalNext.setAttribute('aria-label', 'Next photo');
    modalNext.textContent = '›';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'lightbox-image-wrap';
    const modalImg = document.createElement('img');
    modalImg.alt = '';
    imgWrap.appendChild(modalImg);

    const caption = document.createElement('p');
    caption.className = 'lightbox-caption';

    modal.appendChild(closeBtn);
    modal.appendChild(modalPrev);
    modal.appendChild(imgWrap);
    modal.appendChild(modalNext);
    modal.appendChild(caption);
    document.body.appendChild(modal);

    function syncSlide(index) {
      currentIndex = (index + thumbs.length) % thumbs.length;
      const targetThumb = thumbs[currentIndex];
      const thumbImg = targetThumb.querySelector('img');
      if (!thumbImg) return;

      thumbs.forEach(function (t, idx) {
        const active = idx === currentIndex;
        t.classList.toggle('active', active);
        t.setAttribute('aria-current', active ? 'true' : 'false');
      });

      mainImg.src = thumbImg.src;
      mainImg.alt = thumbImg.alt;
      counter.textContent = (currentIndex + 1) + ' / ' + thumbs.length;

      if (!modal.hidden) {
        modalImg.src = thumbImg.src;
        modalImg.alt = thumbImg.alt;
        caption.textContent = thumbImg.alt + ' (' + (currentIndex + 1) + ' of ' + thumbs.length + ')';
      }
    }

    function openLightbox() {
      lastFocusedBeforeModal = document.activeElement;
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      syncSlide(currentIndex);
      closeBtn.focus();
    }

    function closeLightbox() {
      modal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
      }
    }

    thumbs.forEach(function (thumb, idx) {
      thumb.addEventListener('click', function () {
        syncSlide(idx);
      });
    });

    prevBtn.addEventListener('click', function () { syncSlide(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { syncSlide(currentIndex + 1); });
    modalPrev.addEventListener('click', function () { syncSlide(currentIndex - 1); });
    modalNext.addEventListener('click', function () { syncSlide(currentIndex + 1); });
    expandBtn.addEventListener('click', openLightbox);
    mainImg.addEventListener('click', openLightbox);
    closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') syncSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') syncSlide(currentIndex + 1);
    });

    // Touch swipe support on main gallery & lightbox
    let touchStartX = 0;
    [mainContainer, modal].forEach(function (surface) {
      surface.addEventListener('touchstart', function (e) {
        if (e.changedTouches && e.changedTouches[0]) {
          touchStartX = e.changedTouches[0].screenX;
        }
      }, { passive: true });

      surface.addEventListener('touchend', function (e) {
        if (!e.changedTouches || !e.changedTouches[0]) return;
        const delta = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(delta) > 45) {
          syncSlide(delta < 0 ? currentIndex + 1 : currentIndex - 1);
        }
      }, { passive: true });
    });

    syncSlide(0);
  }

  // ============================================
  // 9. HARDENED CONTACT FORM WITH PROPERTY PREFILL
  // ============================================
  function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Prefill property dropdown/subject if ?property=... is in URL
    try {
      const params = new URLSearchParams(window.location.search);
      const propParam = params.get('property');
      const propSelect = document.getElementById('property');
      const subjectInput = document.getElementById('subject');
      if (propParam && propSelect) {
        Array.from(propSelect.options).forEach(function (opt) {
          if (opt.value.toLowerCase() === propParam.toLowerCase()) {
            propSelect.value = opt.value;
          }
        });
      }
      if (propParam && subjectInput && !subjectInput.value) {
        subjectInput.value = 'Enquiry regarding ' + propParam;
      }
    } catch (_) {}

    let lastSubmitTime = 0;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearFormFeedback(form);

      // Honeypot bot check
      const honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        showBannerFeedback(form, 'Thank you! Your message has been received.', 'success');
        form.reset();
        return;
      }

      // Simple client-side rate cooldown (10s)
      const now = Date.now();
      if (now - lastSubmitTime < 10000) {
        showBannerFeedback(form, 'Please wait a moment before sending another message.', 'error');
        return;
      }

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      let isValid = true;

      if (!name || !name.value.trim()) {
        showFieldError(name, 'Please enter your full name.');
        isValid = false;
      }

      if (!email || !email.value.trim()) {
        showFieldError(email, 'Please enter your email address.');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (subject && !subject.value.trim()) {
        showFieldError(subject, 'Please enter a subject.');
        isValid = false;
      }

      if (!message || !message.value.trim()) {
        showFieldError(message, 'Please enter your message.');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Message must be at least 10 characters long.');
        isValid = false;
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            lastSubmitTime = Date.now();
            showBannerFeedback(
              form,
              'Thank you! Your message has been sent successfully. Our team will get back to you shortly.',
              'success'
            );
            form.reset();
          } else {
            return response.json().then(function (data) {
              const errMsg =
                data && Array.isArray(data.errors)
                  ? data.errors.map(function (err) { return err.message; }).join(', ')
                  : 'Sorry, there was a problem sending your message. Please email us directly at info@skykruze.com.';
              showBannerFeedback(form, errMsg, 'error');
            });
          }
        })
        .catch(function () {
          showBannerFeedback(
            form,
            'Network error while submitting the form. Please try again or email info@skykruze.com.',
            'error'
          );
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        });
    });
  }

  function showFieldError(input, message) {
    if (!input) return;
    const group = input.closest('.form-group');
    if (!group) return;
    const err = document.createElement('div');
    err.className = 'form-error';
    err.setAttribute('role', 'alert');
    err.textContent = message;
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    group.appendChild(err);
  }

  function showBannerFeedback(form, message, type) {
    const banner = document.createElement('div');
    banner.className = 'form-feedback ' + (type === 'success' ? 'form-success' : 'form-alert-error');
    banner.setAttribute('role', type === 'success' ? 'status' : 'alert');
    banner.textContent = message;
    form.insertBefore(banner, form.firstChild);
    banner.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  }

  function clearFormFeedback(form) {
    form.querySelectorAll('.form-error, .form-feedback').forEach(function (el) {
      el.remove();
    });
    form.querySelectorAll('.error').forEach(function (el) {
      el.classList.remove('error');
      el.removeAttribute('aria-invalid');
    });
  }
})();
