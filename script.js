/* =====================================================
   BEAUTY PERFECT — JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    const WHATSAPP_NUMBER = '33123456789';

    // --- DOM Elements ---
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const langToggle = document.getElementById('langToggle');
    const promoBanner = document.getElementById('promoBanner');
    const promoClose = document.getElementById('promoClose');

    // --- Promo Banner ---
    if (promoBanner && promoClose) {
        // Show navbar offset when promo is visible
        navbar.classList.add('has-promo');

        promoClose.addEventListener('click', () => {
            promoBanner.classList.add('hidden');
            navbar.classList.remove('has-promo');
        });
    }

    // --- Navbar Scroll ---
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide promo on scroll down
        if (scrollY > 200 && promoBanner && !promoBanner.classList.contains('hidden')) {
            promoBanner.classList.add('hidden');
            navbar.classList.remove('has-promo');
        }

        lastScroll = scrollY;
    }, { passive: true });

    // --- Hamburger Menu ---
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Language Toggle ---
    let currentLang = 'fr';

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            updateLanguage();
        });
    }

    function updateLanguage() {
        const frElements = document.querySelectorAll('[data-fr]');
        const enElements = document.querySelectorAll('[data-en]');

        frElements.forEach(el => {
            el.hidden = currentLang !== 'fr';
        });

        enElements.forEach(el => {
            el.hidden = currentLang !== 'en';
        });

        // Update toggle button labels
        const labels = langToggle.querySelectorAll('.lang-label');
        labels.forEach(label => {
            if (label.textContent === 'FR') {
                label.classList.toggle('lang-active', currentLang === 'fr');
                label.classList.toggle('lang-inactive', currentLang !== 'fr');
            }
            if (label.textContent === 'EN') {
                label.classList.toggle('lang-active', currentLang === 'en');
                label.classList.toggle('lang-inactive', currentLang !== 'en');
            }
        });

        // Update html lang attribute
        document.documentElement.lang = currentLang;
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (!questionBtn) return;

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(other => {
                other.classList.remove('active');
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Gallery Filter Tabs ---
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const showcases = document.querySelectorAll('.treatment-showcase');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update active tab
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter showcases — show only selected
            showcases.forEach(showcase => {
                if (showcase.getAttribute('data-category') === filter) {
                    showcase.classList.remove('hidden');
                } else {
                    showcase.classList.add('hidden');
                }
            });
        });
    });

    // --- Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(target)) return;

            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                counter.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    // --- Scroll Animations (IntersectionObserver) ---
    const animateElements = document.querySelectorAll(
        '.service-card, .treatment-showcase, .pricing-card, .testimonial-card, .team-card, .stat, .faq-item, .contact-card'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // Counter observer
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(aboutSection);
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Active Nav Link Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    function highlightNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // --- Timed Popup (shows after 5 minutes = 300000ms) ---
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose = document.getElementById('popupClose');
    const popupSkip = document.getElementById('popupSkip');

    function showPopup() {
        if (!popupOverlay) return;
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closePopup() {
        if (!popupOverlay) return;
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Show popup after 5 minutes (300000ms)
    let popupTimer = setTimeout(showPopup, 300000);

    if (popupClose) popupClose.addEventListener('click', closePopup);
    if (popupSkip) popupSkip.addEventListener('click', closePopup);

    // Close on overlay click (outside modal)
    if (popupOverlay) {
        popupOverlay.addEventListener('click', (e) => {
            if (e.target === popupOverlay) closePopup();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    });

    // --- Music Player ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicPanel = document.getElementById('musicPanel');
    const musicPlay = document.getElementById('musicPlay');
    const musicPlayIcon = document.getElementById('musicPlayIcon');
    const musicVolume = document.getElementById('musicVolume');
    const musicEq = document.getElementById('musicEq');

    let isMusicPlaying = false;
    let isPanelOpen = false;

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            isPanelOpen = !isPanelOpen;
            musicPanel.classList.toggle('active', isPanelOpen);
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
        if (isPanelOpen && musicToggle && musicPanel &&
            !musicToggle.contains(e.target) && !musicPanel.contains(e.target)) {
            isPanelOpen = false;
            musicPanel.classList.remove('active');
        }
    });

    function toggleMusic() {
        if (!bgMusic) return;

        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            musicPlayIcon.classList.remove('fa-pause');
            musicPlayIcon.classList.add('fa-play');
            musicToggle.classList.remove('playing');
            musicEq.classList.remove('playing');
        } else {
            bgMusic.volume = (musicVolume ? musicVolume.value : 30) / 100;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicPlayIcon.classList.remove('fa-play');
                musicPlayIcon.classList.add('fa-pause');
                musicToggle.classList.add('playing');
                musicEq.classList.add('playing');
            }).catch(() => {
                // Browser blocked autoplay — user needs to interact first (this is normal)
            });
        }
    }

    if (musicPlay) {
        musicPlay.addEventListener('click', toggleMusic);
    }

    if (musicVolume && bgMusic) {
        musicVolume.addEventListener('input', () => {
            bgMusic.volume = musicVolume.value / 100;
        });
    }

});

