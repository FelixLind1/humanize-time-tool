document.addEventListener('DOMContentLoaded', function () {
    // Hämta kanalens ID från URL:en
    const urlParams = new URLSearchParams(window.location.search);
    const channelId = urlParams.get('channelId');  // Exempel: ?channelId=1

    if (!channelId) {
        console.error('Kanal-ID saknas i URL:en');
        return;
    }

    // Läs in profiles.json för kanalens information
    fetch('../../databas/profiles.json')  // Se till att den är korrekt länkad
        .then(response => response.json())
        .then(profiles => {
            // Hitta den kanal som matchar det ID som vi fått från URL:en
            const channelData = profiles.find(profile => profile.id === channelId);

            if (channelData) {
                const channelContainer = document.getElementById('channelContainer');

                // Ersätt platshållarna med kanalens data
                const channelHTML = `
<div class="header-container">
    <div class="banner" style="background: url('${channelData.bannerUrl}') no-repeat center center; background-size: cover;">
        <h1 id="channelName">${channelData.name}</h1>
        <p id="channelSlogan">${channelData.slogan}</p>
    </div>

    <div class="channel-info">
        <div class="logo-container">
            <img id="channelLogo" src="${channelData.logo}" alt="Channel Logo" class="main-logo" />
        </div>
        <div class="channel-details">
            <h2 id="channelNameDetails">${channelData.name}</h2>
            <p id="channelDescription">${channelData.description}<a href="#" class="more-link" onclick="showPopup(event)">...mer</a></p>

            <!-- Popup -->
            <div id="popup" class="popup">
                <div class="popup-content">
                    <span class="popup-close" onclick="closePopup()">&times;</span>
                    <h3>Mer information om kanalen</h3>
                    <p id="channelPopupInfo">${channelData.popupInfo}</p>
                </div>
            </div>

            <div id="channelLinks" class="channel-links">
                <a href="${channelData.link1}">${channelData.link1Text}</a><br />
                <a href="${channelData.link2}">${channelData.link2Text}</a>
            </div>

            <div class="channel-pages">
                <span onclick="goToProfile('hem')">Hem</span>
                <span onclick="goToProfile('videor')">Videor</span>
                <span onclick="goToProfile('spellistor')">Spellistor</span>
                <span onclick="goToProfile('community')">Community</span>
            </div>

            <!-- Profilsektioner -->
            <div id="hem" class="profile-section">
                <h2>Hem</h2>
                <p>Välkommen till hemsidan!</p>
            </div>
            <div id="videor" class="profile-section" style="display:none;">
                <h2>Videor</h2>
                <p>Här är alla dina videor.</p>
                <div id="videoContainer"></div> <!-- Här kommer vi att lägga till videoinformation -->
            </div>
            <div id="spellistor" class="profile-section" style="display:none;">
                <h2>Spellistor</h2>
                <p>Här är dina spellistor.</p>
                <div id="playlistContainer"></div> <!-- Här kommer vi att lägga till spellistor -->
            </div>
            <div id="community" class="profile-section" style="display:none;">
                <h2>Community</h2>
                <p>Här är din community.</p>
            </div>
        </div>
    </div>            
</div>
`;
                // Lägg till HTML-innehållet i container
                channelContainer.innerHTML = channelHTML;

                // Läs in videodata från videos.json
                fetch('../../databas/videos.json')  // Se till att länken är korrekt
                    .then(response => response.json())
                    .then(videos => {
                        // Filtrera videor som tillhör den aktuella kanalen
                        const channelVideos = videos.filter(video => video.channelId === channelId);

                        // Ladda videoinformationen i videosektionen
                        loadDynamicVideoData(channelVideos);
                    })
                    .catch(error => console.error('Fel vid hämtning av videodata:', error));

                // Läs in spellistor från kanaldata
                loadDynamicPlaylists(channelData.playlists);

                // Kontrollera om en hash redan finns och visa rätt sektion
                const hash = window.location.hash.substring(1);
                if (hash) {
                    showSection(hash);
                } else {
                    // Om ingen hash finns, visa standardsektionen (t.ex. Hem)
                    showSection('hem');
                }
            } else {
                console.error('Kanal ej funnen');
            }
        })
        .catch(error => console.error('Fel vid hämtning av data:', error));
});

// Funktion för att visa popupen
function showPopup(event) {
    event.preventDefault();  // Förhindrar att länken följer sin normala funktion
    const popup = document.getElementById('popup');
    popup.classList.add('show'); // Lägg till klassen som gör popupen synlig
}

// Funktion för att stänga popupen
function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show'); // Ta bort klassen som gör popupen synlig
}

// Funktion för att skapa dynamiska videoinnehåll
function createContentItem(type, title, description, url, thumbnail) {
    return `
    <div class="content-item">
        <img src="${thumbnail}" alt="${title}" class="content-thumbnail" />
        <div class="content-details">
            <h3 class="content-title">${title}</h3>
            <p class="content-description">${description}</p>
            <a href="${url}" class="content-link">Se ${type}</a>
        </div>
    </div>
    `;
}

// Funktion för att visa videodata under "Videor"-sektionen
function loadDynamicVideoData(videos) {
    const videoContainer = document.getElementById('videoContainer');
    if (!videos || videos.length === 0) {
        videoContainer.innerHTML = '<p>Inga videor tillgängliga.</p>';
        return;
    }

    videos.forEach(video => {
        const videoHTML = createContentItem('video', video.title, video.description, video.url, video.thumbnail);
        videoContainer.innerHTML += videoHTML;
    });
}

function loadDynamicPlaylists(playlists) {
    const playlistContainer = document.getElementById('playlistContainer');
    if (!playlists || playlists.length === 0) {
        playlistContainer.innerHTML = '<p>Inga spellistor tillgängliga.</p>';
        return;
    }

    playlists.forEach(playlist => {
        const playlistHTML = createContentItem('spellista', playlist.title, playlist.description, playlist.url, playlist.thumbnail);
        playlistContainer.innerHTML += playlistHTML;
    });
}

// Funktion för att navigera till rätt sektion när man klickar på knappar
function goToProfile(page) {
    window.location.hash = page.toLowerCase();
    showSection(page);
}

// Funktion för att visa den valda sektionen baserat på hash-värdet
function showSection(page) {
    const sections = document.querySelectorAll('.profile-section');
    sections.forEach(section => section.style.display = 'none');
    
    const activeSection = document.getElementById(page.toLowerCase());
    if (activeSection) {
        activeSection.style.display = 'block';
    } else {
        console.error(`Sektionen ${page} finns inte`);
    }
}