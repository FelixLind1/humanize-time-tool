document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    const resultsContainer = document.getElementById('search-results');

    if (!resultsContainer) {
        console.error('Elementet #search-results hittades inte.');
        return;
    }

    if (!searchQuery) {
        resultsContainer.innerHTML = '<p>Ingen sökterm angavs.</p>';
        return;
    }

    // Filtrera videor baserat på sökfrågan
    const filteredVideos = videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredVideos.length > 0) {
        displaySearchResults(filteredVideos, resultsContainer);
    } else {
        resultsContainer.innerHTML = '<p>Inga videor hittades.</p>';
    }
});

function displaySearchResults(filteredVideos, resultsContainer) {
    resultsContainer.innerHTML = ''; // Rensa tidigare resultat

    filteredVideos.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.classList.add('video-card');

        videoElement.innerHTML = `
            <div class="video-thumbnail">
                <img src="${video.thumbnail || '../images/default-thumbnail.webp'}" alt="${video.title}">
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;

        resultsContainer.appendChild(videoElement);
    });
}