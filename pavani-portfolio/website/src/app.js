(function () {
    const SECTIONS = ["home", "about", "portfolio", "achievements", "contact"];
    const THEME_KEY = "pavani-portfolio-theme";
    const EMAIL = "pavaninagapriya75@gmail.com";

    /* ---------- Section navigation (with #hash support + back button) ---------- */
    function showSection(id, pushHash) {
        if (!SECTIONS.includes(id)) id = "home";

        document.querySelectorAll(".control").forEach(btn => {
            btn.classList.toggle("active-btn", btn.dataset.id === id);
        });
        document.querySelectorAll(".container").forEach(section => {
            section.classList.toggle("active", section.id === id);
        });
        window.scrollTo({ top: 0, behavior: "instant" });

        if (pushHash && location.hash !== "#" + id) {
            history.pushState(null, "", "#" + id);
        }
    }

    document.querySelectorAll(".control").forEach(button => {
        button.addEventListener("click", () => showSection(button.dataset.id, true));
    });

    document.querySelectorAll("[data-nav]").forEach(link => {
        link.addEventListener("click", event => {
            event.preventDefault();
            showSection(link.dataset.nav, true);
        });
    });

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.addEventListener("popstate", () => showSection(location.hash.slice(1), false));
    showSection(location.hash.slice(1), false);

    /* ---------- Theme toggle (remembers the visitor's choice) ---------- */
    function readTheme() {
        try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
    }
    function saveTheme(value) {
        try { localStorage.setItem(THEME_KEY, value); } catch (e) { /* storage blocked — ignore */ }
    }

    const saved = readTheme();
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    if (saved === "light" || (!saved && prefersLight)) document.body.classList.add("light-mode");

    document.querySelector(".theme-btn").addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        saveTheme(isLight ? "light" : "dark");
        initParticles();
    });

    /* ---------- Rotating role text ---------- */
    const roles = [
        "Full-Stack Software Engineer",
        "Flutter Developer",
        "Node.js Backend Developer",
        "Auth & API Engineer"
    ];
    const typedEl = document.getElementById("typed");
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (typedEl && !reduceMotion) {
        let roleIndex = 0;
        let charIndex = roles[0].length;
        let deleting = true;

        const tick = () => {
            const word = roles[roleIndex];
            charIndex += deleting ? -1 : 1;
            typedEl.textContent = word.slice(0, charIndex);

            let delay = deleting ? 45 : 85;
            if (!deleting && charIndex === word.length) {
                delay = 2200;
                deleting = true;
            } else if (deleting && charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                delay = 350;
            }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 2500);
    }

    /* ---------- Particle background ---------- */
    function initParticles() {
        if (typeof particlesJS !== "function") return; // CDN blocked — page still works
        if (window.pJSDom && window.pJSDom.length) {
            window.pJSDom.forEach(p => p.pJS.fn.vendors.destroypJS());
            window.pJSDom = [];
        }
        const accent = getComputedStyle(document.body).getPropertyValue("--color-secondary").trim() || "#27ae60";
        particlesJS("particles-js", {
            particles: {
                number: { value: 70, density: { enable: true, value_area: 900 } },
                color: { value: accent },
                opacity: { value: 0.45 },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: accent, opacity: 0.25, width: 1 },
                move: { enable: true, speed: reduceMotion ? 0.3 : 1.6 }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true },
                modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } } }
            },
            retina_detect: true
        });
    }
    initParticles();

    /* ---------- Contact form → pre-filled email (no backend needed on S3) ---------- */
    const form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();
            const data = new FormData(form);
            const body =
                data.get("message") + "\n\n— " + data.get("name") + " (" + data.get("email") + ")";
            window.location.href =
                "mailto:" + EMAIL +
                "?subject=" + encodeURIComponent(data.get("subject")) +
                "&body=" + encodeURIComponent(body);
        });
    }
})();
