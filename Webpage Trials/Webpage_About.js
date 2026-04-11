document.getElementById("toggle-facts").addEventListener("click", function () {
    const fact_list = document.getElementById("hidden-content");

    fact_list.classList.toggle("open");

    if (fact_list.classList.contains("open")) {
        this.innerHTML = "<b>Hide Facts</b>";
    } else {
        this.innerHTML = "<b>Want to learn more about me?</b>";
    }
});

