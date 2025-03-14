// Sökfunktion
function search() {
    try {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            const query = searchInput.value.trim(); // Trimma vita tecken
            if (query) {
                console.log('Söker efter:', query);
                // Byt till search.html och skicka sökfrågan som en parameter
                window.location.href = `search.html?q=${encodeURIComponent(query)}`;
            } else {
                console.warn('Sökfrågan är tom.');
            }
        } else {
            console.error('Sökfältet hittades inte.');
        }
    } catch (error) {
        console.error('Fel vid sökning:', error);
    }
}

// När sidan laddas, hantera sökfrågan från URL
document.addEventListener('DOMContentLoaded', () => {
    // Lägg till event listeners för sökning
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
  
    if (searchInput) {
        // Aktivera sökning vid Enter-tangent
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); // Förhindrar att formuläret skickas om det finns ett <form>-element
                search();
            }
        });
        console.log('Sökfältet finns och är tillgängligt.');
    } else {
        console.error('Sökfältet hittades inte.');
    }

    if (searchButton) {
        // Aktivera sökning vid klick på sökknappen
        searchButton.addEventListener('click', (event) => {
            event.preventDefault(); // Förhindrar att formuläret skickas om det finns ett <form>-element
            search();
        });
        console.log('Sökknappen finns och är tillgänglig.');
    }

    // Ladda JSON-data här istället
    loadVideoData();
});

// Läsa in JSON-data utan att använda import
function loadVideoData() {
    console.log('Laddar videoData...');
    fetch('../../databas/videos.json')  // Hämta JSON-data
        .then(response => response.json())
        .then(data => {
            console.log('DynamicVideoData hämtad:', data);
            // När datan är inläst, hantera den (spara till global variabel eller använd direkt)
            window.videoData = data;
            handleSearchOnLoad();
        })
        .catch(error => {
            console.error('Fel vid laddning av videoData:', error);
        });
}

// Hantera sökning vid laddning av sidan
function handleSearchOnLoad() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q'); // Hämta sökfrågan från URL
    console.log('Hämtad sökfråga från URL:', searchQuery);
    if (searchQuery) {
        console.log('Sökresultat för:', searchQuery);
        // Skicka sökfrågan till displayFilteredVideos
        displayFilteredVideos(searchQuery);
    }
}

// Funktion som skickar sökfrågan till en annan funktion som filtrerar videor
function displayFilteredVideos(query) {
    const resultsContainer = document.getElementById('resultsContainer');
    if (resultsContainer) {
        resultsContainer.innerHTML = `Sökresultat för: ${query}`;
        console.log('Resultatcontainer finns.');
    }

    // Filtrera videor baserat på sökfrågan
    const filteredVideos = filterVideosBySearchQuery(query);

    // Visa de filtrerade resultaten
    displaySearchResults(query, filteredVideos);
}

// Funktion som hanterar visning av sökresultat
function displaySearchResults(query, results) {
    const resultsContainer = document.getElementById('searchResultsContainer');
    if (resultsContainer) {
        if (results && results.length > 0) {
            resultsContainer.innerHTML = `Sökresultat för: ${query}`;
            console.log('Visar sökresultat:', results.length, 'resultat hittade.');
            
            // Visa varje resultat dynamiskt och gör det till en länk till video.html
            results.forEach(result => {
                const videoUrl = `video.html?id=${result.id}`;  // Länk till video.html med video-ID som parameter
            
                resultsContainer.innerHTML += `
                    <a href="${videoUrl}" class="search-result-item">
                        <div>
                            <img src="${result.thumbnail}" alt="${result.title}" />
                            <div class="video-info">
                                <h3>${result.title}</h3>
                                <p>${result.description}</p>
                                <div class="video-details">
                                    <span>${result.views} visningar</span>
                                    <span>${result.uploadDate}</span>
                                </div>
                            </div>
                        </div>
                    </a>
                `;
            });
        } else {
            resultsContainer.innerHTML = `
                <p class="no-results-message">Inga resultat för: <em>${query}</em></p>
            `;
            console.log('Inga resultat för:', query);
        }
    } else {
        console.error('Resultatcontainer ej funnen.');
    }
}

// Funktion för att filtrera videor baserat på sökfrågan
function filterVideosBySearchQuery(query) {
    console.log('Filtrerar videor baserat på sökfrågan:', query);
    // Filtrera videorna baserat på titel eller beskrivning
    const filteredVideos = window.videoData.filter(video =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(query.toLowerCase())) // Lägg till description om du vill söka där också
    );
    
    return filteredVideos;
}