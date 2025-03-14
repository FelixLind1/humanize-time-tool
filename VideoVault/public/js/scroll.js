// scroll.js
document.addEventListener("DOMContentLoaded", () => {
    // Hämta den aktuella sidans filnamn
    const currentPage = window.location.pathname.split("/").pop();

    // Kontrollera om sidan ska vara statisk eller scrollbar
    if (currentPage === "login.html") {
        // Gör sidan statisk (ingen scrollning)
        document.body.style.overflow = "hidden";
    } else {
        // Tillåt scrollning på alla andra sidor
        document.body.style.overflow = "auto";
    }
});