document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".login-card");

    cards.forEach(card => {
        card.addEventListener("click", () => {
            // Byt plats på korten med animation
            let currentZIndex = parseInt(window.getComputedStyle(card).zIndex);
            let nextCard = (currentZIndex === 1) ? 2 : (currentZIndex === 2) ? 3 : 1;

            // Justera z-index för alla kort
            cards.forEach(c => {
                if (parseInt(window.getComputedStyle(c).zIndex) === nextCard) {
                    c.style.zIndex = currentZIndex;
                }
            });

            card.style.zIndex = nextCard;

            // Lägg till en klass för att aktivera animation (frivilligt)
            card.classList.add("clicked");
            setTimeout(() => {
                card.classList.remove("clicked");
            }, 300); // Tiden bör matcha CSS-animationens varaktighet
        });
    });
});