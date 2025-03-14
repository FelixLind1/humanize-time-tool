// Funktion för att öppna delnings-popupen
function openSharePopup() {
    // Hitta popup-elementet
    const sharePopup = document.querySelector('.share-popup');
    const shareLinkInput = document.querySelector('.share-link');
    
    // Visa popupen
    sharePopup.style.display = 'flex';

    // Generera en delbar länk (kan vara en statisk länk eller en dynamiskt genererad baserat på videon)
    const videoUrl = window.location.href;  // Använd den aktuella URL:en (kan bytas ut mot videolänk)
    shareLinkInput.value = videoUrl;  // Sätt länk i inputfältet
}

// Funktion för att stänga delnings-popupen
function closeSharePopup() {
    const sharePopup = document.querySelector('.share-popup');
    sharePopup.style.display = 'none';  // Dölj popupen
}

// Funktion för att kopiera länk till urklipp
function copyLink() {
    const shareLinkInput = document.querySelector('.share-link');
    shareLinkInput.select();
    document.execCommand('copy');

    const copyMessage = document.querySelector('.copy-message');
    copyMessage.classList.remove('hidden');
    copyMessage.classList.add('visible');

    // Ta bort kopieringsmeddelandet efter 2 sekunder
    setTimeout(() => {
        copyMessage.classList.remove('visible');
        copyMessage.classList.add('hidden');
    }, 2000);
}

function openFacebookShare() {
    // Hämta den aktuella videons URL
    var videoUrl = window.location.href; // Om du har en specifik video, använd den här istället.
    
    // Koda URL:en för att säkerställa att specialtecken hanteras korrekt
    var encodedUrl = encodeURIComponent(videoUrl);
    
    // Facebook delnings-URL
    var facebookShareUrl = "https://www.facebook.com/dialog/share?app_id=87741124305&href=" + encodedUrl + "&display=popup";
    
    // Öppna Facebook delningsdialogen i en popup
    window.open(facebookShareUrl, 'FacebookShare', 'width=600,height=400');
}

// Lägg till eventlyssnare för kopieringsknappen
document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.querySelector('.copy-button');
    copyButton.addEventListener('click', copyLink);
});