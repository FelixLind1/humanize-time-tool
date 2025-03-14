const languageData = {
    sv: { title: "VideoVault",
        searchPlaceholder: "Sök efter videor...",
        upload: "Ladda upp",
        livestream: "Livestream",
        login: "Logga in",
        account: "Mitt konto",
        categories: "Kategorier",
        home: "Hem",
        trends: "Trender",
        subscriptions: "Prenumerationer",
        library: "Bibliotek",
        history: "Historik",
        playlists: "Spellistor",
        viewingHistory: "Historik",
        chat: "Chatt",
        send: "Skicka",
        footerAbout: "Om oss",
        footerContact: "Kontakt",
        footerPrivacy: "Integritetspolicy",
        footerTerms: "Användarvillkor",
        notifications: "Notifikationer",
        profile: "Profil",
        logout: "Logga ut",
        settings: "Inställningar",
        feedback: "Feedback",
        help: "Hjälp",
        share: "Dela",
        copyright: "© 2024 Video Webbplats. Alla rättigheter förbehållna." }, // Din svenska översättning

    en: {  title: "VideoVault",
        searchPlaceholder: "Search for videos...",
        upload: "Upload",
        livestream: "Livestream",
        login: "Log in",
        account: "My Account",
        categories: "Categories",
        home: "Home",
        trends: "Trends",
        subscriptions: "Subscriptions",
        library: "Library",
        history: "History",
        playlists: "Playlists",
        viewingHistory: "History",
        chat: "Chat",
        send: "Send",
        footerAbout: "About Us",
        footerContact: "Contact",
        footerPrivacy: "Privacy Policy",
        footerTerms: "Terms of Service",
        notifications: "Notifications",
        profile: "Profile",
        logout: "Log out",
        settings: "Settings",
        feedback: "Feedback",
        help: "Help",
        share: "Share",
        copyright: "© 2024 Video Site. All rights reserved."
    }  // Din engelska översättning
};

// Standard språk (använd det sparade språket om det finns)
let currentLanguage = localStorage.getItem('language') || 'sv';

// Funktion för att uppdatera texten baserat på valt språk
function updateText() {
    document.title = languageData[currentLanguage].title;

    // Uppdatera sökfältets placeholder
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.placeholder = languageData[currentLanguage].searchPlaceholder;
    }

    // Direkt specifika element (som navigation och footer)
    const specificElements = {
        '.upload': 'upload',
        '.livestream': 'livestream',
        '.login': 'login',
        '.notification': 'notifications',
        '.profile': 'profile',
        '.logout': 'logout',
        '.settings': 'settings',
        '.footer-about': 'footerAbout',
        '.footer-contact': 'footerContact',
        '.footer-privacy': 'footerPrivacy',
        '.footer-terms': 'footerTerms'
    };

    for (const [selector, key] of Object.entries(specificElements)) {
        const element = document.querySelector(selector);
        if (element) element.textContent = languageData[currentLanguage][key];
    }

    // Uppdatera alla förekomster av ord på sidan baserat på ordlistan
    updateAllWords();
}

// Funktion för att uppdatera alla förekomster av ord som finns i ordlistan
function updateAllWords() {
    const words = languageData[currentLanguage];
    document.querySelectorAll("*").forEach(element => {
        const text = element.textContent.trim();
        if (words[text]) {
            element.textContent = words[text];
        }
    });
}

// Funktion för att ändra språk och spara valet
function changeLanguage(language) {
    currentLanguage = language;
    localStorage.setItem('language', language);
    updateText();
}

// Kalla på updateText för att uppdatera texten direkt när sidan laddas
updateText();