const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a[href$='.html'], .site-nav a[href='index.html']");
const heroVideo = document.querySelector(".hero-video");
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-counter]");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");

if (menuToggle && siteNav) {
    const closeMenu = () => {
        menuToggle.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        siteNav.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        siteNav.classList.toggle("is-open", isOpen);
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 980) {
            closeMenu();
        }
    });
}

if (heroVideo) {
    heroVideo.play().catch(() => {
        heroVideo.setAttribute("controls", "controls");
    });
}

if (header) {
    const syncHeaderState = () => {
        header.classList.toggle("scrolled", window.scrollY > 24);
    };

    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
}

if (navLinks.length) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const normalized = href === "" ? "index.html" : href;
        link.classList.toggle("active", normalized === currentPage);
    });
}

if (revealItems.length) {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.16
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
}

if (counters.length) {
    const startCounter = (element) => {
        const target = Number(element.dataset.counter || 0);
        const suffix = element.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = Math.floor(progress * target);
            element.textContent = `${value}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                element.textContent = `${target}${suffix}`;
            }
        };

        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    startCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.45
        }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
}

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formStatus.textContent = "Thanks. Your message is ready. Reach RS Nexus directly using the email or phone details on this page.";
        contactForm.reset();
    });
}
