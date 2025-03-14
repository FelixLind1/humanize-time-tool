// Laddar videoinformation och visar den i en grid
function loadVideos() {
  const videoGrid = document.getElementById('videoGrid'); // Hämta container

  // Hämta JSON-filen från den rätta URL:en
  fetch('/databas/videos.json')
    .then(response => response.json()) // Konvertera svaret till JSON
    .then(videos => {
      if (videos.length === 0) {
        videoGrid.innerHTML = '<p>Inga videor tillgängliga.</p>';
      } else {
        // Gå igenom varje video i JSON-datan
        videos.forEach(video => {
          // Skapa en div för varje video
          const videoElement = document.createElement('div');
          videoElement.classList.add('gridView-listItem'); // Klass från din CSS

          // Lägg till data-attribut för videometadata
          videoElement.dataset.id = video.id;
          videoElement.dataset.title = video.title;
          videoElement.dataset.description = video.description;
          videoElement.dataset.date = video.date;
          videoElement.dataset.duration = video.duration;
          videoElement.dataset.thumbnail = video.thumbnail;

          // Lägg till en länk runt figuren
          videoElement.innerHTML = `
            <a href="video.html?id=${video.id}" class="video-link">
              <figure>
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <figcaption>
                    <h6>${video.title}</h6>
                    <p>
                        <time>${video.duration}</time>
                        <time>${video.date}</time>
                    </p>
                </figcaption>
              </figure>
            </a>
          `;

          // Lägg till videon i griden
          videoGrid.appendChild(videoElement);
        });
      }
    })
    .catch(error => {
      console.error('Error loading video data:', error);
      videoGrid.innerHTML = '<p>Det gick inte att ladda videoinformationen.</p>';
    });
}

// Anropa funktionen för att ladda videorna
loadVideos();

// Hämta videoinformation från JSON och visa på detaljerad sida
function loadVideoDetails() {
  const videoId = new URLSearchParams(window.location.search).get('id'); // Hämta video-id från URL:en
  const videoDetailsContainer = document.getElementById('video-details'); // Container för videodetaljer

  // Visa laddningsmeddelande medan videodatan hämtas
  videoDetailsContainer.innerHTML = '<p>Laddar video...</p>';

  // Hämta JSON-filen från rätt URL
  fetch('/databas/videos.json')
    .then(response => response.json()) // Konvertera till JSON
    .then(videos => {
      // Hitta videon baserat på video-id
      const video = videos.find(v => v.id === parseInt(videoId));

      if (video) {
        // Fyll i videodetaljer i rätt element
        document.getElementById('videoTitle').textContent = video.title;
        document.getElementById('videoDescription').textContent = video.description;
        document.getElementById('video-date').textContent = `Datum: ${video.date}`;
        document.getElementById('video-duration').textContent = `Längd: ${video.duration}`;
      } else {
        // Om videon inte finns, visa ett felmeddelande
        videoDetailsContainer.innerHTML = '<p>Videon kunde inte hittas.</p>';
      }
    })
    .catch(error => {
      console.error('Error loading video data:', error);
      videoDetailsContainer.innerHTML = '<p>Det gick inte att ladda videodetaljerna.</p>';
    });
}

// Anropa funktionen för att ladda videodetaljer när sidan har laddats
window.onload = loadVideoDetails;