// Hämta videodata från en .json-fil
fetch('../../databas/videos.json')
  .then(response => response.json())
  .then(videoData => {
    // Välj videospelaren och metadata-delen
    const videoPlayer = document.querySelector('.container .video_player');
    const metadataContainer = document.createElement('div');
    metadataContainer.classList.add('video_metadata');
    
    // Funktion för att uppdatera metadata
    function updateMetadata(video) {
      metadataContainer.innerHTML = `
        <div class="metadata-title">${video.title}</div>
        <div class="metadata-duration">Duration: ${video.duration}</div>
        <div class="metadata-views">Views: ${video.views}</div>
        <div class="metadata-channel-name">Channel: ${video.channelName}</div>
        <div class="metadata-footer">Uploaded by ${video.channelName}</div>
      `;
      
      // Kontrollera om metadata redan är tillagd, annars lägg till den
      if (!videoPlayer.contains(metadataContainer)) {
        videoPlayer.appendChild(metadataContainer);
      }

      metadataContainer.classList.add('active');
    }
    
    // Visa metadata för den första videon (kan anpassas till vald video)
    updateMetadata(videoData[0]);
    
    // Här kan du lägga till funktionalitet för att välja video och uppdatera metadata
    // Exempel: om du har en lista med videoknappar, kan du lägga till en event listener:
    document.querySelectorAll('.video-thumbnail').forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        updateMetadata(videoData[index]);
      });
    });
  })
  .catch(error => console.error('Error fetching video data:', error));