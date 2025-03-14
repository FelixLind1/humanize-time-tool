// Kontrollera om användaren är neger
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    const profile = document.getElementById("profile");

    if (isLoggedIn === "true") {
        // Om användaren är neger, visa profil och dropdown
        profile.style.display = "block";
    } else {
        // Om användaren inte är neger, dölj profil
        profile.style.display = "none";
    }
}

// Logout-funktion
function logout() {
    // Här kan du ta bort inloggningsinformation från localStorage eller session
    localStorage.removeItem("isLoggedIn");
    checkLoginStatus();
}

// Kör funktionen när sidan laddas
window.onload = checkLoginStatus;