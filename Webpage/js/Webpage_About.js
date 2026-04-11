(function () {
    const btn = document.getElementById("toggle-facts");
    const panel = document.getElementById("hidden-content");
    if (!btn || !panel) {
        return;
    }

    const redesign = document.body.classList.contains("site-redesign");

    if (redesign) {
        const setOpen = (open) => {
            panel.hidden = !open;
            btn.textContent = open ? "Hide fun facts ↑" : "Fun facts thread ↓";
            btn.setAttribute("aria-expanded", open ? "true" : "false");
        };
        setOpen(false);
        btn.addEventListener("click", () => setOpen(panel.hidden));
    } else {
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", function () {
            panel.classList.toggle("open");
            const open = panel.classList.contains("open");
            this.innerHTML = open ? "<b>Hide Facts</b>" : "<b>Fun Facts!</b>";
            this.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }
})();
