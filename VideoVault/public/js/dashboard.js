document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Hämta användarens data för dashboard
        const response = await fetch('/api/dashboard');
        const user = await response.json();

        // Visa användarens uppgifter
        if (user && user.firstname) {
            document.getElementById('user-info').innerHTML = `
                <strong>Förnamn:</strong> ${user.firstname}<br>
                <strong>Efternamn:</strong> ${user.lastname}<br>
                <strong>E-post:</strong> ${user.email}<br>
            `;
        } else {
            document.getElementById('user-info').textContent = 'Inga användaruppgifter hittades.';
        }

        // Här kan du lägga till logik för att visa senaste aktiviteter
        const activitiesList = document.getElementById('activities');
        activitiesList.innerHTML = `
            <li>Uppladdad video: <a href="/videos/1">Min första video</a></li>
            <li>Kommentarer på din video: <a href="/comments">Se kommentarer</a></li>
        `;
        
        // Hämtar profildata från profiles.json
        const profilesResponse = await fetch('../databas/profiles.json');
        const profiles = await profilesResponse.json();

        // Lägger till profiler i dashboarden
        const dashboardContainer = document.querySelector('main');
        
        // Loopa igenom alla profiler och skapa HTML-element för varje
        profiles.forEach(profile => {
            const profileSection = document.createElement('section');
            
            // Skapa och lägg till kanalens namn, slogan och logo
            const profileHeader = document.createElement('h3');
            profileHeader.innerHTML = profile.name;
            
            const profileLogo = document.createElement('img');
            profileLogo.src = profile.logo;
            profileLogo.alt = `${profile.name} Logo`;
            profileLogo.classList.add('profile-logo');
            
            const profileSlogan = document.createElement('p');
            profileSlogan.innerHTML = profile.slogan;

            profileSection.appendChild(profileHeader);
            profileSection.appendChild(profileLogo);
            profileSection.appendChild(profileSlogan);
            
            // Lägg till antalet prenumeranter och videor
            const stats = document.createElement('p');
            stats.innerHTML = `Prenumeranter: ${profile.subscribers} | Videor: ${profile.videosCount}`;
            profileSection.appendChild(stats);
            
            // Lägg till beskrivning och popup-info
            const description = document.createElement('p');
            description.innerHTML = profile.description;
            profileSection.appendChild(description);

            const popupInfo = document.createElement('p');
            popupInfo.innerHTML = profile.popupInfo;
            profileSection.appendChild(popupInfo);

            // Lägg till externa länkar
            const link1 = document.createElement('a');
            link1.href = profile.link1;
            link1.innerHTML = profile.link1Text;
            profileSection.appendChild(link1);

            const link2 = document.createElement('a');
            link2.href = profile.link2;
            link2.innerHTML = profile.link2Text;
            profileSection.appendChild(link2);
            
            // Lägg till spellistor
            if (profile.playlists && profile.playlists.length > 0) {
                const playlistSection = document.createElement('div');
                playlistSection.classList.add('playlists');
                
                profile.playlists.forEach(playlist => {
                    const playlistItem = document.createElement('div');
                    playlistItem.classList.add('playlist-item');

                    const playlistThumbnail = document.createElement('img');
                    playlistThumbnail.src = playlist.thumbnail;
                    playlistThumbnail.alt = `${playlist.title} Thumbnail`;
                    playlistItem.appendChild(playlistThumbnail);

                    const playlistTitle = document.createElement('h4');
                    playlistTitle.innerHTML = playlist.title;
                    playlistItem.appendChild(playlistTitle);

                    const playlistDescription = document.createElement('p');
                    playlistDescription.innerHTML = playlist.description;
                    playlistItem.appendChild(playlistDescription);

                    const playlistLink = document.createElement('a');
                    playlistLink.href = playlist.url;
                    playlistLink.innerHTML = 'Se mer';
                    playlistItem.appendChild(playlistLink);

                    playlistSection.appendChild(playlistItem);
                });

                profileSection.appendChild(playlistSection);
            }

            // Lägg till hela sektionen till dashboarden
            dashboardContainer.appendChild(profileSection);
        });

        // Uppdatera användarens logga
        const userProfile = profiles.find(profile => profile.handle === 'moviesexpresspro');  // Exempel: Hitta användaren baserat på 'handle'

        if (userProfile && userProfile.logo) {
            // Om en logga finns, uppdatera bildens src
            const profileLogoElement = document.getElementById('profileLogo');
            profileLogoElement.src = userProfile.logo; // Uppdaterar loggan med användarens logga
        }

    } catch (error) {
        console.error('Fel vid hämtning av användaruppgifter:', error);
        document.getElementById('user-info').textContent = 'Kunde inte läsa användaruppgifter.';
    }
});