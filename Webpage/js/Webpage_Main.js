// Shared feature flags used by interactive effects.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Resolve theme preference from localStorage, then OS fallback.
function getPreferredTheme() {
    try {
        const storedTheme = localStorage.getItem("site-theme");
        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }
    } catch (_) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Apply or clear dark-theme attribute at the document level.
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

// Inject top-right theme toggle with animated icon states.
function createThemeToggle(nav) {
    if (!nav || nav.querySelector(".theme-toggle")) {
        return;
    }

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "theme-toggle";
    toggleButton.setAttribute("aria-label", "Toggle dark mode");
    toggleButton.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle class="icon-sun-core" cx="12" cy="12" r="4" fill="currentColor"></circle>
            <line class="icon-ray" x1="12" y1="2.5" x2="12" y2="5.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
            <line class="icon-ray" x1="12" y1="18.6" x2="12" y2="21.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
            <line class="icon-ray" x1="2.5" y1="12" x2="5.4" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
            <line class="icon-ray" x1="18.6" y1="12" x2="21.5" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></line>
            <path class="icon-moon" d="M14.9 3.8A8.9 8.9 0 1 0 20.2 18a8 8 0 1 1-5.3-14.2Z" fill="currentColor"></path>
        </svg>
    `;

    toggleButton.addEventListener("click", () => {
        const nextTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        try {
            localStorage.setItem("site-theme", nextTheme);
        } catch (_) {}
    });

    nav.appendChild(toggleButton);
}

// Top-left social icon links (matches Contact page URLs).
function createNavSocialLinks(nav) {
    if (!nav || nav.querySelector(".nav-social")) {
        return;
    }

    const wrap = document.createElement("div");
    wrap.className = "nav-social";
    wrap.setAttribute("aria-label", "Social profiles");

    const items = [
        {
            href: "https://www.instagram.com/dj_jang197/",
            label: "Instagram",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
        },
        {
            href: "https://www.linkedin.com/in/daniel-jang197",
            label: "LinkedIn",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        },
        {
            href: "https://github.com/DJ-jang197",
            label: "GitHub",
            svg: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>',
        },
    ];

    items.forEach(({ href, label, svg }) => {
        const a = document.createElement("a");
        a.href = href;
        a.className = "nav-social-link";
        a.setAttribute("aria-label", label);
        a.setAttribute("title", label);
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = svg;
        wrap.appendChild(a);
    });

    nav.insertBefore(wrap, nav.firstChild);
}

// Keep nav progress indicator synced with page scroll.
function updateScrollProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${Math.min(100, Math.max(0, progress))}%`);
}

// Reveal sections/images/buttons as they enter viewport.
function setupRevealAnimations() {
    const revealTargets = document.querySelectorAll("header, section, .project-list, .home-images, .about-images, .general-button, .view-website-button");
    revealTargets.forEach((el) => {
        el.setAttribute("data-reveal", "");
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach((el) => el.classList.add("in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
}

// Add subtle parallax offset to hero backgrounds on scroll.
function setupHeroParallax() {
    const headers = Array.from(document.querySelectorAll("header"));
    if (prefersReducedMotion || headers.length === 0) {
        return;
    }

    const updateParallax = () => {
        headers.forEach((header) => {
            const rect = header.getBoundingClientRect();
            const viewCenter = window.innerHeight / 2;
            const distance = rect.top + rect.height / 2 - viewCenter;
            const offset = Math.max(-12, Math.min(12, distance * -0.03));
            header.style.setProperty("--parallax-offset", `${offset}px`);
        });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
}

// Handle project stack ordering + left/right arrow cycling.
function setupProjectCardStacks() {
    const stacks = document.querySelectorAll(".card-stack");
    stacks.forEach((stack) => {
        const updateCardIndices = () => {
            const cards = stack.querySelectorAll(".project-card");
            cards.forEach((card, index) => {
                card.style.setProperty("--card-index", String(index));
            });
        };

        const leftArrow = stack.querySelector(".stack-arrow-left");
        const rightArrow = stack.querySelector(".stack-arrow-right");

        if (rightArrow) {
            rightArrow.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                // Next: front card moves to back.
                const frontCard = stack.querySelector(".project-card");
                if (frontCard) {
                    stack.appendChild(frontCard);
                    updateCardIndices();
                }
            });
        }

        if (leftArrow) {
            leftArrow.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                // Previous: back card moves to front.
                const cards = stack.querySelectorAll(".project-card");
                const backCard = cards[cards.length - 1];
                const frontCard = cards[0];
                if (backCard && frontCard) {
                    stack.insertBefore(backCard, frontCard);
                    updateCardIndices();
                }
            });
        }

        // Keyboard support for accessibility while focused on the stack.
        stack.addEventListener("keydown", (event) => {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                const frontCard = stack.querySelector(".project-card");
                if (frontCard) {
                    stack.appendChild(frontCard);
                    updateCardIndices();
                }
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                const cards = stack.querySelectorAll(".project-card");
                const backCard = cards[cards.length - 1];
                const frontCard = cards[0];
                if (backCard && frontCard) {
                    stack.insertBefore(backCard, frontCard);
                    updateCardIndices();
                }
            }
        });

        updateCardIndices();
    });
}

// Animate large hero headings with a typewriter effect.
function setupTypewriterHeadlines() {
    const headlines = document.querySelectorAll(".big-font");
    if (headlines.length === 0 || prefersReducedMotion) {
        return;
    }

    let delay = 120;
    headlines.forEach((headline) => {
        const fullText = headline.textContent || "";
        headline.classList.add("typewriter-line");
        headline.textContent = "";
        [...fullText].forEach((character, index) => {
            window.setTimeout(() => {
                headline.textContent += character;
            }, delay + index * 36);
        });
        delay += fullText.length * 36 + 140;
    });
}

// Render a single crosshair cursor that adds confetti on button hover.
function setupInteractiveCursor() {
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouchDevice) {
        return;
    }

    document.body.classList.add("cursor-enhanced");

    const cursor = document.createElement("div");
    cursor.id = "interactive-cursor";
    cursor.innerHTML = `
        <span class="cursor-v"></span>
        <span class="cursor-h"></span>
        <span class="confetti"></span>
        <span class="confetti"></span>
        <span class="confetti"></span>
        <span class="confetti"></span>
    `;
    document.body.appendChild(cursor);

    // Place cursor immediately in the viewport center before first move.
    cursor.style.left = `${window.innerWidth / 2}px`;
    cursor.style.top = `${window.innerHeight / 2}px`;

    document.addEventListener("mousemove", (event) => {
        // Immediate tracking to avoid lerp/trailing lag.
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        const target = event.target;
        if (target instanceof Element && target.closest("button")) {
            cursor.classList.add("cursor-button");
        } else {
            cursor.classList.remove("cursor-button");
        }
    });
}

// Wire up all shared page features once DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme());
    const nav = document.querySelector("nav");
    createNavSocialLinks(nav);
    createThemeToggle(nav);
    updateScrollProgress();
    setupRevealAnimations();
    setupHeroParallax();
    setupProjectCardStacks();
    setupTypewriterHeadlines();
    setupInteractiveCursor();

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
});
