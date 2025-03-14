// displayVideos.js
import config from './config.js'; // Importera konfigurationen

// Funktion för att hämta videor från servern
async function fetchVideos() {
    try {
        const response = await fetch(`${config.apiUrl}/videos`);
        const videos = await response.json();

        if (response.ok) {
            displayVideos(videos);
        } else {
            console.error('Misslyckades med att hämta videor:', videos.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion för att visa videor på sidan
function displayVideos(videos) {
    const videoContainer = document.getElementById('videoContainer'); // Antag att du har ett element med detta id
    videoContainer.innerHTML = ''; // Rensa innehållet

    videos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video'); // Lägg till en klass för styling

        // Skapa en videobild med länk
        videoElement.innerHTML = `
            <a href="video.html?id=${video.id}"> <!-- Länk till videosidan -->
                <img src="${video.thumbnail || config.defaultVideoThumbnail}" alt="${video.title}">
                <h3>${video.title}</h3>
            </a>
        `;

        videoContainer.appendChild(videoElement); // Lägg till videon i containern
    });
}

// Anropa funktionen för att hämta videor när sidan laddas
window.onload = fetchVideos;