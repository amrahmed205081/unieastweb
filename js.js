// Enhanced JavaScript for Unieast Corporate Website
// Optimized for performance, accessibility, and mobile experience

// Use strict mode
'use strict';

/**
 * Throttle function to limit execution rate
 */
const throttle = (func, limit) => {
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
};

/**
 * Initialize lazy loading for images
 */
const initLazyLoading = () => {
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
        // Ensure alt text exists
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', 'Unieast product image');
        }
    });
};

/**
 * Enhanced navbar active link highlighting
 * Works for both #anchor and index.html#anchor links
 */
const initNavbarHighlighting = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar ul li a');

    if (!sections.length || !navLinks.length) return;

    const updateActiveLink = throttle(() => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Offset for navbar
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop - sectionHeight / 3) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || href.endsWith(`#${current}`)) {
                link.classList.add('active');
            }
        });
    }, 100);

    window.addEventListener('scroll', updateActiveLink, { passive: true });
};

/**
 * Enhanced smooth scroll for anchor links
 */
const initSmoothScroll = () => {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;

        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
};

/**
 * Enhanced mobile menu with accessibility
 */
const initMobileMenu = () => {
    const toggleButton = document.querySelector('.menu-toggle');
    const navbarUl = document.querySelector('.navbar ul');

    if (!toggleButton || !navbarUl) return;

    // Set initial state
    const setInitialState = () => {
        if (window.innerWidth <= 768) {
            toggleButton.style.display = 'block';
            navbarUl.classList.add('mobile-menu');
            toggleButton.setAttribute('aria-expanded', 'false');
            navbarUl.setAttribute('aria-hidden', 'true');
        } else {
            toggleButton.style.display = 'none';
            navbarUl.classList.remove('mobile-menu', 'active');
        }
    };

    setInitialState();

    // Toggle menu (click + keyboard)
    const setMenuState = (isActive) => {
        if (isActive) {
            navbarUl.classList.add('active');
            toggleButton.classList.add('open');
            toggleButton.setAttribute('aria-expanded', 'true');
            navbarUl.setAttribute('aria-hidden', 'false');
            // move focus to first link for keyboard users
            const firstLink = navbarUl.querySelector('a');
            if (firstLink) firstLink.focus();
        } else {
            navbarUl.classList.remove('active');
            toggleButton.classList.remove('open');
            toggleButton.setAttribute('aria-expanded', 'false');
            navbarUl.setAttribute('aria-hidden', 'true');
        }
    };

    toggleButton.addEventListener('click', () => {
        const isActive = !navbarUl.classList.contains('active');
        setMenuState(isActive);
    });

    // Keyboard activation (Enter / Space)
    toggleButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleButton.click();
        }
    });

    // Close mobile menu when a nav link is clicked or activated via keyboard
    const navLinks = navbarUl.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && navbarUl.classList.contains('active')) {
                setMenuState(false);
                toggleButton.focus();
            }
        });
        link.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && window.innerWidth <= 768 && navbarUl.classList.contains('active')) {
                setMenuState(false);
                toggleButton.focus();
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbarUl.contains(e.target) && !toggleButton.contains(e.target) && navbarUl.classList.contains('active')) {
            navbarUl.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
            navbarUl.setAttribute('aria-hidden', 'true');
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbarUl.classList.contains('active')) {
            navbarUl.classList.remove('active');
            toggleButton.setAttribute('aria-expanded', 'false');
            navbarUl.setAttribute('aria-hidden', 'true');
        }
    });

    // Handle resize
    window.addEventListener('resize', throttle(() => {
        setInitialState();
        if (window.innerWidth > 768) {
            navbarUl.classList.remove('active');
        }
    }, 250), { passive: true });
};

/**
 * Add skip link for accessibility
 */
const initAccessibility = () => {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #0f1e2e;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 1001;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', () => skipLink.style.top = '6px');
    skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
    document.body.insertBefore(skipLink, document.body.firstChild);
};

/**
 * Performance optimizations
 */
const initPerformance = () => {
    // Passive listeners for better scroll performance
    ['touchstart', 'touchmove', 'touchend'].forEach(event => {
        document.addEventListener(event, () => {}, { passive: true });
    });
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initLazyLoading();
    initNavbarHighlighting();
    initSmoothScroll();
    initMobileMenu();
    initAccessibility();
    initPerformance();
    initImageZoom();
    initContactForm();
    initMapLocate();
    initMapViewLink();

    // Mark as loaded
    document.documentElement.classList.add('js-loaded');
});

/**
 * Image zoom modal functionality
 */
const initImageZoom = () => {
    // Prevent creating multiple modals
    if (document.querySelector('.modal')) return;

    // Create modal elements with accessibility attributes
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <button class="close" aria-label="Close image">&times;</button>
        <img class="modal-content" id="modalImg" alt="">
    `;
    document.body.appendChild(modal);

    const modalImg = document.getElementById('modalImg');
    const closeBtn = modal.querySelector('.close');
    let lastFocused = null;

    const openModal = (src, alt) => {
        lastFocused = document.activeElement;
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        modalImg.src = src;
        modalImg.alt = alt || '';
        closeBtn.focus();
    };

    const closeModal = () => {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    // Images to bind: product table images, product cards and images with class product-image
    const selectors = ['.product-table img', '.product-image', '.product-card img', '.projects-table img'];
    const imgs = document.querySelectorAll(selectors.join(', '));

    imgs.forEach(img => {
        img.style.cursor = 'pointer';

        // If wrapped in an anchor, prevent navigation and use href if present
        const parentLink = img.closest('a');
        if (parentLink) {
            parentLink.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(parentLink.href || img.src, img.alt);
            });
        }

        // Also bind direct image clicks
        img.addEventListener('click', (e) => {
            e.preventDefault();
            const src = (img.closest('a') && img.closest('a').href) ? img.closest('a').href : img.src;
            openModal(src, img.alt);
        });

        // Keyboard support: Enter opens modal when image is focused
        img.setAttribute('tabindex', '0');
        img.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const src = (img.closest('a') && img.closest('a').href) ? img.closest('a').href : img.src;
                openModal(src, img.alt);
            }
        });
    });

    // Close modal when clicking close button
    closeBtn.addEventListener('click', () => closeModal());

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard handling: Escape to close; trap Tab inside modal
    modal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'Tab') {
            // trap focus between closeBtn and modalImg (image not focusable by default)
            e.preventDefault();
            closeBtn.focus();
        }
    });

    // Touch: allow swipe down to close (simple implementation)
    let touchStartY = 0;
    modal.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchend', (e) => {
        const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : 0;
        if (touchEndY - touchStartY > 80) {
            closeModal();
        }
    });
};

/**
 * Ensure View Location link opens reliably and allow clicking the map wrapper to open Maps.
 */
const initMapViewLink = () => {
    const viewLink = document.getElementById('viewLocationLink');
    const mapWrapper = document.querySelector('.map-wrapper');
    if (!viewLink) return;

    // Ensure the link opens in a new tab/window (useful on some embedded contexts)
    viewLink.addEventListener('click', (e) => {
        // Let default occur but also explicitly open to avoid iframe capture issues
        e.preventDefault();
        const href = viewLink.href;
        window.open(href, '_blank', 'noopener');
    });

    // Clicking the visible map area should open the same link (user expectation)
    if (mapWrapper) {
        mapWrapper.style.cursor = 'pointer';
        mapWrapper.addEventListener('click', (e) => {
            // If user interacts with the iframe controls, ignore (we can't detect precisely),
            // but opening the external link is acceptable for tap-to-open behavior.
            const href = viewLink.href;
            window.open(href, '_blank', 'noopener');
        });
    }
};

/**
 * Contact form handler (client-side only)
 */
const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const msgSpan = document.getElementById('formMsg');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const message = form.message.value.trim();

        // Simple validation
        if (!name || !email || !phone || !message) {
            msgSpan.textContent = 'Please fill all fields.';
            return;
        }
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            msgSpan.textContent = 'Please enter a valid email.';
            return;
        }

        // Simulate submit (no backend). Show success and reset.
        msgSpan.textContent = 'Sending...';
        setTimeout(() => {
            msgSpan.textContent = 'Thanks! Your message has been received.';
            form.reset();
            setTimeout(() => { msgSpan.textContent = ''; }, 5000);
        }, 700);
    });
};

/**
 * Map locate handler: fetches user's geolocation and updates the footer map iframe
 */
const initMapLocate = () => {
    const btn = document.getElementById('locateBtn');
    const iframe = document.getElementById('footerMap');
    const viewLink = document.getElementById('viewLocationLink');
    if (!btn || !iframe) return;

    const resetBtn = (text = 'Locate me') => {
        btn.disabled = false;
        btn.textContent = text;
    };

    btn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        btn.disabled = true;
        btn.textContent = 'Locating...';

        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            // Update iframe to center on user's coordinates
            iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
            if (viewLink) viewLink.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
            resetBtn('Show my location');
        }, (err) => {
            console.error('Geolocation error:', err);
            alert('Unable to get your location: ' + (err.message || 'Permission denied'));
            resetBtn('Locate me');
        }, { enableHighAccuracy: true, timeout: 10000 });
    });
};