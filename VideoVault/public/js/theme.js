document.addEventListener("DOMContentLoaded", () => {
    const modeToggleButton = document.getElementById("mode-toggle");

    // Kontrollera om dark mode är aktiverat i localStorage
    const savedMode = localStorage.getItem("dark-mode");
    if (savedMode === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // Växla mellan dark och light mode
    modeToggleButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        // Spara preferensen i localStorage
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("dark-mode", "enabled");
        } else {
            localStorage.setItem("dark-mode", "disabled");
        }
    });
});