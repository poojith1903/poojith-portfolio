// Modern Portfolio JavaScript

document.addEventListener('DOMContentLoaded', () => {
    
    // --- CORE INITIALIZATION ---
    initNavigation();
    initScrollEffects();
    initTabs();
    initModalsAndLinks();
    initScrollAnimations();
    handleImageErrors();
    initTypedEffect();
    initParallaxEffect(); // Bubble movement is now active
    init3dImageTilt();   // 3D image tilt is now active
    
    console.log("🚀 Portfolio initialized successfully!");
});


/**
 * Initializes mobile navigation (hamburger menu) and smooth scrolling.
 */
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid section link, not just "#"
            if (href.length > 1 && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                const offsetTop = target.offsetTop - 70; // Adjust for fixed navbar height
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Handles scroll-related visual effects like the sticky navbar and scroll-to-top button.
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    const scrollToTopBtn = document.getElementById('scrollToTop');

    const handleScroll = () => {
        const scrollY = window.pageYOffset;
        
        // Navbar style on scroll
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        // Scroll-to-top button visibility
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', scrollY > 300);
        }
        
        // Update active nav link based on section
        updateActiveNavLink();
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Scroll to top functionality
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Updates the active state of navigation links based on the current scroll position.
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100; // Offset for better accuracy
        if (window.pageYOffset >= sectionTop) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        link.classList.toggle('active', linkHref === `#${currentSectionId}`);
    });
}

/**
 * Initializes the tab functionality in the "About Me" section.
 */
function initTabs() {
    const tabContainer = document.querySelector('.tabs');
    if (!tabContainer) return;

    const tabButtons = tabContainer.querySelectorAll('.tab-button');
    const tabContents = tabContainer.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab)?.classList.add('active');
        });
    });
}

/**
 * Sets up all event listeners for modals and other interactive links.
 */
function initModalsAndLinks() {
    const modals = document.querySelectorAll('.modal');
    
    // Function to open a modal
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };

    // Function to close a modal
    const closeModal = (modal) => {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    // --- Event Listeners for Opening Modals ---

    // CGPA Stat -> Achievements Modal
    document.getElementById('cgpa-stat')?.addEventListener('click', () => openModal('achievementsModal'));
    
    // Power BI Demo -> Power BI Modal
    document.getElementById('powerbi-demo-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('powerbiModal');
    });

    // Leadership "Learn More" links
    document.querySelectorAll('.leadership-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            openModal(modalId);
        });
    });
    
    // --- Event Listeners for Closing Modals ---
    
    // Close button inside modals
    modals.forEach(modal => {
        modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
    });

    // Close by clicking on the modal background
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target);
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    closeModal(modal);
                }
            });
        }
    });
}

/**
 * Uses Intersection Observer to apply animations to elements as they enter the viewport.
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .leadership-card, .cert-card, .contact-item, .about-image, .about-text');
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

/**
 * Provides a fallback for broken image links by adding a class to the image.
 */
function handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.onerror = null; 
            this.classList.add('in-error');
        });
    });
}

/**
 * Creates a typing animation for the hero section title.
 */
function initTypedEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const titles = [
        'AI/ML Engineer',
        'Data Scientist',
        'Web Developer',
        'Quantum Computing Enthusiast'
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentTitle = titles[titleIndex];
        let displayText = '';

        if (isDeleting) {
            displayText = currentTitle.substring(0, charIndex - 1);
            charIndex--;
        } else {
            displayText = currentTitle.substring(0, charIndex + 1);
            charIndex++;
        }

        heroTitle.textContent = displayText;
        heroTitle.style.minHeight = '2.4em'; // Prevents layout shift

        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && charIndex === currentTitle.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

/**
 * Creates a parallax effect for hero section shapes based on mouse movement.
 */
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', (e) => {
        const shapes = hero.querySelectorAll('.hero-shape');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        shapes.forEach(shape => {
            const speed = shape.getAttribute('data-speed');
            const x = (mouseX * speed) / 100;
            const y = (mouseY * speed) / 100;
            // We combine the original floating animation with the parallax translation
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

/**
 * Applies a 3D tilt effect to images on mouse movement.
 */
function init3dImageTilt() {
    const tiltContainers = document.querySelectorAll('.hero-image, .about-image');

    tiltContainers.forEach(container => {
        const image = container.querySelector('img');
        if (!image) return;

        container.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            const mouseX = (x / width - 0.5);
            const mouseY = (y / height - 0.5);

            const rotateX = mouseY * -12; // Max rotation in degrees
            const rotateY = mouseX * 12;

            image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        container.addEventListener('mouseleave', () => {
            image.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}