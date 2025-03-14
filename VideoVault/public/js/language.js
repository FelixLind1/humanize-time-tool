// Håll reda på det nuvarande språket, om inget valts, sätt svenska som standard
let currentLanguage = localStorage.getItem('language') || 'sv';

// Variabel för att lagra språkdata
let languageData = {};

// Funktion för att hämta språkdata från servern
async function loadLanguageData() {
    try {
        // Hämta språkdata från language.json
        const response = await fetch('/databas/language.json');
        if (!response.ok) {
            throw new Error('Kunde inte hämta språkdata');
        }

        languageData = await response.json();
        console.log(languageData); // Kontrollera att data är korrekt laddad

        // Efter att data har laddats, uppdatera texten på sidan
        updateText();
    } catch (error) {
        console.error('Fel vid laddning av språkdata:', error);
    }
}

// Funktion för att uppdatera all text på sidan baserat på det valda språket
function updateText() {
    if (!languageData[currentLanguage]) {
        console.error('Språkdata saknas för', currentLanguage);
        return;
    }

    // Uppdatera sidans titel
    document.title = languageData[currentLanguage].pageTitle;

    // Uppdatera alla element med data-translate attribut
    document.querySelectorAll("[data-translate]").forEach(element => {
        const key = element.getAttribute('data-translate');
        if (languageData[currentLanguage][key]) {
            // Om elementet är ett inputfält eller textarea, uppdatera placeholder
            if (element.tagName.toLowerCase() === "input" || element.tagName.toLowerCase() === "textarea") {
                element.setAttribute('placeholder', languageData[currentLanguage][key]);
            } else {
                element.textContent = languageData[currentLanguage][key];
            }
        }
    });
}

// Funktion för att ändra språk
function changeLanguage(language) {
    try {
      console.log('Ändrar språk till:', language);
      const translateElements = document.querySelectorAll('[data-translate]');
      if (translateElements.length > 0) {
        translateElements.forEach((element) => {
          const translationKey = element.getAttribute('data-translate');
          console.log('Översättningsnyckel för element:', translationKey);
          // Här kan du hämta översättningar för det valda språket och uppdatera elementens innehåll
        });
      } else {
        console.warn('Inga element med översättningsnycklar hittades.');
      }
    } catch (error) {
      console.error('Fel vid språkbyte:', error);
    }
  }
  
// Funktion för att byta språk och spara valet
function changeLanguage(language) {
    console.log("Valt språk:", language); // Logga det valda språket
    currentLanguage = language;
    localStorage.setItem('language', language);
    updateText(); // Uppdatera texten på sidan baserat på det valda språket
}

// Initialisera språkdata och uppdatera texten när sidan laddas
loadLanguageData();