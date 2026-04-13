const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Virtual start time (ms): shared timeline across navigations (do not overwrite from pagehide — WAAPI currentTime is often 0 during teardown). */
const BACKDROP_MARQUEE_T0_KEY = "backdropMarqueeT0";

const BACKDROP_SLIDE_FILES = [
    "Anteloupe.jpg",
    "Balloons.jpg",
    "CN_Tower_Stance.jpg",
    "Costco_Field.jpg",
    "Family_Canyon.jpg",
    "Gala.jpg",
    "Greendrop_Stance.jpg",
    "hero-field.png",
    "Island.jpg",
    "Korean_Field.jpg",
    "SJU_Mirror.jpg",
    "TorontoRink.jpg",
    "Victoria_Stance.jpg",
    "Waterloo_Park_Buildings.jpg",
    "Waterloo_Snow.jpg",
];

function parseCssTimeMs(value) {
    if (!value || value === "0s") {
        return 0;
    }
    const s = String(value).trim();
    const n = parseFloat(s);
    if (Number.isNaN(n)) {
        return 0;
    }
    if (s.endsWith("ms")) {
        return n;
    }
    return n * 1000;
}

function buildBackdropTrackHTML() {
    const basePath = "../images/";
    const oneSet = BACKDROP_SLIDE_FILES.map(
        (name) =>
            `<div class="backdrop-gallery__slide" style="background-image: url('${basePath}${encodeURI(name)}');"></div>`
    ).join("");
    return `<div class="backdrop-gallery__track">${oneSet}${oneSet}</div>`;
}

function populateBackdropGalleries() {
    document.querySelectorAll("[data-backdrop-root]").forEach((root) => {
        if (root.querySelector(".backdrop-gallery__track")) {
            return;
        }
        root.insertAdjacentHTML("beforeend", buildBackdropTrackHTML());
    });
}

function syncBackdropMarqueeTiming(track) {
    if (prefersReducedMotion || !track) {
        return;
    }
    const durationMs = parseCssTimeMs(getComputedStyle(track).animationDuration);
    if (!durationMs) {
        return;
    }

    let t0Str;
    try {
        t0Str = sessionStorage.getItem(BACKDROP_MARQUEE_T0_KEY);
    } catch (_) {
        return;
    }

    let t0;
    if (t0Str == null || t0Str === "") {
        const skew = Math.floor(Math.random() * durationMs);
        t0 = Date.now() - skew;
        try {
            sessionStorage.setItem(BACKDROP_MARQUEE_T0_KEY, String(t0));
        } catch (_) {}
    } else {
        t0 = Number(t0Str);
        if (!Number.isFinite(t0)) {
            const skew = Math.floor(Math.random() * durationMs);
            t0 = Date.now() - skew;
            try {
                sessionStorage.setItem(BACKDROP_MARQUEE_T0_KEY, String(t0));
            } catch (_) {}
        }
    }

    const elapsed = Date.now() - t0;
    track.style.animationDelay = `${-(elapsed % durationMs)}ms`;
}

function setupBackdropMarquee() {
    if (prefersReducedMotion) {
        return;
    }

    const applyTiming = () => {
        const track = document.querySelector(".backdrop-gallery__track");
        syncBackdropMarqueeTiming(track);
    };

    window.addEventListener("pageshow", (ev) => {
        if (ev.persisted) {
            requestAnimationFrame(applyTiming);
        }
    });

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            applyTiming();
            const track = document.querySelector(".backdrop-gallery__track");
            if (track && !parseCssTimeMs(getComputedStyle(track).animationDuration)) {
                requestAnimationFrame(applyTiming);
            }
        });
    });
}

function getPreferredTheme() {
    try {
        const storedTheme = localStorage.getItem("site-theme");
        if (storedTheme === "light" || storedTheme === "dark") {
            return storedTheme;
        }
    } catch (_) {}
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

function createThemeToggle(nav) {
    if (!nav || nav.querySelector(".theme-toggle")) {
        return;
    }

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "theme-toggle";
    toggleButton.setAttribute("aria-label", "Toggle light and dark mode");
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

    if (document.body.classList.contains("site-redesign")) {
        const inner = nav.querySelector(".nav-inner");
        const endSlot = inner && inner.querySelector(".nav-end");
        const endcap = inner && inner.querySelector(".nav-endcap");
        if (endSlot) {
            endSlot.appendChild(toggleButton);
        } else if (endcap) {
            endcap.appendChild(toggleButton);
        } else if (inner) {
            inner.appendChild(toggleButton);
        } else {
            nav.appendChild(toggleButton);
        }
    } else {
        nav.appendChild(toggleButton);
    }
}

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

    const contactSlot = nav.querySelector("[data-contact-social-slot]");
    if (contactSlot) {
        contactSlot.appendChild(wrap);
        return;
    }

    if (document.body.classList.contains("site-redesign")) {
        const inner = nav.querySelector(".nav-inner");
        const start = inner && inner.querySelector(".nav-start");
        const endcap = inner && inner.querySelector(".nav-endcap");
        const brandInStart = start && start.querySelector(".nav-brand");
        const brandInCap = endcap && endcap.querySelector(".nav-brand");
        if (inner && start && brandInStart) {
            start.insertBefore(wrap, brandInStart);
        } else if (inner && endcap && brandInCap) {
            endcap.insertBefore(wrap, brandInCap);
        } else if (inner && brandInCap) {
            inner.insertBefore(wrap, brandInCap);
        } else if (inner) {
            inner.insertBefore(wrap, inner.firstChild);
        } else {
            nav.insertBefore(wrap, nav.firstChild);
        }
    } else {
        nav.insertBefore(wrap, nav.firstChild);
    }
}

function setupRevealAnimations() {
    const bubblePages = document.body.classList.contains("site-redesign");
    const selectors = bubblePages
        ? [".reveal-on-scroll", "[data-chat-bubble]", ".project-spotlight", ".contact-panel"]
        : ["header", "section", ".project-list", ".home-images", ".about-images", ".general-button", ".view-website-button", ".contact-panel"];

    const revealTargets = [];
    const seen = new Set();
    selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => {
            if (!seen.has(el)) {
                seen.add(el);
                revealTargets.push(el);
            }
        });
    });

    revealTargets.forEach((el) => {
        el.setAttribute("data-reveal", "");
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealTargets.forEach((el) => el.classList.add("is-visible", "in-view"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible", "in-view");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
}

function setupHeroMouseParallax() {
    const layer = document.querySelector("[data-hero-parallax]");
    if (!layer || prefersReducedMotion) {
        return;
    }

    const hero = layer.closest(".hero");
    const strength = 6;

    const onMove = (event) => {
        const rect = hero
            ? hero.getBoundingClientRect()
            : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const mx = Math.round(x * strength * 4) / 4;
        const my = Math.round(y * strength * 4) / 4;
        layer.style.setProperty("--mx", `${mx}px`);
        layer.style.setProperty("--my", `${my}px`);
    };

    const onLeave = () => {
        layer.style.setProperty("--mx", "0px");
        layer.style.setProperty("--my", "0px");
    };

    const parallaxTarget = hero || document.body;
    parallaxTarget.addEventListener("mousemove", onMove, { passive: true });
    parallaxTarget.addEventListener("mouseleave", onLeave);
}

function setupHeroParallaxLegacy() {
    if (document.body.classList.contains("site-redesign")) {
        return;
    }
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
                const cards = stack.querySelectorAll(".project-card");
                const backCard = cards[cards.length - 1];
                const frontCard = cards[0];
                if (backCard && frontCard) {
                    stack.insertBefore(backCard, frontCard);
                    updateCardIndices();
                }
            });
        }

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

function appendRichBullet(li, text) {
    const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
    parts.forEach((part) => {
        if (!part) {
            return;
        }
        if (part.startsWith("**") && part.endsWith("**")) {
            const strong = document.createElement("strong");
            strong.textContent = part.slice(2, -2);
            li.appendChild(strong);
        } else {
            li.appendChild(document.createTextNode(part));
        }
    });
}

function setupTypewriterElements() {
    const nodes = document.querySelectorAll("[data-typewriter-text]");
    if (nodes.length === 0) {
        return;
    }
    nodes.forEach((el, index) => {
        const full = el.getAttribute("data-typewriter-text") || "";
        el.textContent = "";
        if (prefersReducedMotion || !full) {
            el.textContent = full;
            return;
        }
        let i = 0;
        const startDelay = 260 + index * 140;
        const step = () => {
            if (i <= full.length) {
                el.textContent = full.slice(0, i);
                i += 1;
                window.setTimeout(step, 40);
            }
        };
        window.setTimeout(step, startDelay);
    });
}

function setupTypewriterHeadlines() {
    if (document.body.classList.contains("site-redesign")) {
        return;
    }
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

function setupInteractiveCursor() {
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (isTouchDevice) {
        return;
    }

    document.body.classList.add("cursor-enhanced");

    const cursor = document.createElement("div");
    cursor.id = "interactive-cursor";
    document.body.appendChild(cursor);

    cursor.style.left = `${window.innerWidth / 2}px`;
    cursor.style.top = `${window.innerHeight / 2}px`;

    let lastTrail = 0;
    const trailEveryMs = 48;

    document.addEventListener("mousemove", (event) => {
        cursor.classList.remove("is-hidden");
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;

        const target = event.target;
        const interactive =
            target instanceof Element &&
            (target.closest("a, button, input, textarea, select, .dj-jog, .nav-social-link, .theme-toggle, .nav-brand") !== null);
        cursor.classList.toggle("is-pointer", Boolean(interactive));

        const now = performance.now();
        if (now - lastTrail > trailEveryMs && !prefersReducedMotion) {
            lastTrail = now;
            const dot = document.createElement("span");
            dot.className = "cursor-trail-dot";
            dot.style.left = `${event.clientX}px`;
            dot.style.top = `${event.clientY}px`;
            document.body.appendChild(dot);
            window.setTimeout(() => dot.remove(), 480);
        }
    });

    const hide = () => {
        cursor.classList.add("is-hidden");
        cursor.classList.remove("is-pointer");
    };
    window.addEventListener("blur", hide);
    document.addEventListener("mouseleave", hide);
}

function setupDjMixerProjects() {
    const root = document.querySelector("[data-mixer]");
    const dataEl = document.getElementById("projects-data");
    if (!root || !dataEl) {
        return;
    }

    let projects = [];
    try {
        projects = JSON.parse(dataEl.textContent.trim());
    } catch (_) {
        return;
    }

    const card = root.querySelector("[data-project-card]");
    const titleEl = root.querySelector("[data-project-title]");
    const metaEl = root.querySelector("[data-project-meta]");
    const bodyEl = root.querySelector("[data-project-body]");
    const tagsEl = root.querySelector("[data-project-tags]");
    const actionsEl = root.querySelector("[data-project-actions]");
    const leftJog = root.querySelector('[data-jog="prev"]');
    const rightJog = root.querySelector('[data-jog="next"]');

    if (!card || !titleEl || !metaEl || !bodyEl || !tagsEl || !actionsEl || !leftJog || !rightJog) {
        return;
    }

    let index = 0;

    const render = () => {
        const p = projects[index];
        if (!p) {
            return;
        }
        titleEl.textContent = p.title || "";
        metaEl.textContent = p.meta || "";
        bodyEl.innerHTML = "";
        const ul = document.createElement("ul");
        ul.className = "project-spotlight-list";
        (p.bullets || []).forEach((line) => {
            const li = document.createElement("li");
            appendRichBullet(li, line);
            ul.appendChild(li);
        });
        if (ul.childNodes.length) {
            bodyEl.appendChild(ul);
        }
        tagsEl.innerHTML = "";
        (p.tags || []).forEach((tag) => {
            const span = document.createElement("span");
            span.className = "project-tag";
            span.textContent = tag;
            tagsEl.appendChild(span);
        });
        actionsEl.innerHTML = "";
        (p.actions || []).forEach((action) => {
            const a = document.createElement("a");
            a.className = "btn-deck";
            a.textContent = action.label;
            a.href = action.href || "#";
            if (action.href && /^https?:\/\//i.test(action.href)) {
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }
            actionsEl.appendChild(a);
        });
    };

    const spin = (jogEl) => {
        jogEl.classList.remove("is-spinning");
        void jogEl.offsetWidth;
        jogEl.classList.add("is-spinning");
    };

    const transitionTo = (nextIndex) => {
        index = (nextIndex + projects.length) % projects.length;
        card.classList.add("is-transitioning");
        window.setTimeout(() => {
            render();
            card.classList.remove("is-transitioning");
        }, prefersReducedMotion ? 0 : 200);
    };

    const go = (delta, jogEl) => {
        spin(jogEl);
        transitionTo(index + delta);
    };

    const wireJog = (jogEl, deltaSign) => {
        let startAngle = 0;
        let accumulated = 0;
        let active = false;
        let dragMoved = false;

        const angleFromEvent = (event) => {
            const rect = jogEl.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            return Math.atan2(event.clientY - cy, event.clientX - cx);
        };

        jogEl.addEventListener("pointerdown", (event) => {
            if (event.button !== 0) {
                return;
            }
            dragMoved = false;
            active = true;
            accumulated = 0;
            startAngle = angleFromEvent(event);
            jogEl.setPointerCapture(event.pointerId);
        });

        jogEl.addEventListener(
            "pointermove",
            (event) => {
                if (!active) {
                    return;
                }
                event.preventDefault();
                const a = angleFromEvent(event);
            let d = a - startAngle;
            if (d > Math.PI) {
                d -= Math.PI * 2;
            }
            if (d < -Math.PI) {
                d += Math.PI * 2;
            }
            if (Math.abs(d) > 0.03) {
                dragMoved = true;
            }
            accumulated += d;
            startAngle = a;
            const threshold = 0.65;
            if (accumulated > threshold) {
                accumulated = 0;
                go(deltaSign, jogEl);
            } else if (accumulated < -threshold) {
                accumulated = 0;
                go(-deltaSign, jogEl);
            }
            },
            { passive: false }
        );

        const end = () => {
            active = false;
            accumulated = 0;
        };
        jogEl.addEventListener("pointerup", end);
        jogEl.addEventListener("pointercancel", end);

        jogEl.addEventListener("click", (e) => {
            if (dragMoved) {
                e.preventDefault();
                dragMoved = false;
                return;
            }
            go(deltaSign, jogEl);
        });
    };

    wireJog(leftJog, -1);
    wireJog(rightJog, 1);

    window.addEventListener("keydown", (event) => {
        const key = event.key;
        if (key !== "ArrowLeft" && key !== "ArrowRight") {
            return;
        }
        const target = event.target;
        const typingTarget =
            target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']");
        if (typingTarget) {
            return;
        }
        event.preventDefault();
        if (key === "ArrowLeft") {
            go(-1, leftJog);
        } else {
            go(1, rightJog);
        }
    });

    render();
}

document.addEventListener("DOMContentLoaded", () => {
    populateBackdropGalleries();
    applyTheme(getPreferredTheme());
    setupBackdropMarquee();

    const nav = document.querySelector("nav");
    createNavSocialLinks(nav);
    createThemeToggle(nav);
    setupRevealAnimations();
    setupHeroMouseParallax();
    setupHeroParallaxLegacy();
    setupProjectCardStacks();
    setupDjMixerProjects();
    setupTypewriterElements();
    setupTypewriterHeadlines();
    setupInteractiveCursor();

});
