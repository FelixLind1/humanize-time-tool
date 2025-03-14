// Funktion för att hämta 'videoID' från URL:en
function getVideoIDFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const videoID = urlParams.get('id'); // Hämta 'id' parametern från URL
  console.log('videoID from URL:', videoID); // Lägg till logg för att kontrollera om ID:et finns
  return videoID;
}

// Funktion för att hämta videoinformation från videos.json
function fetchVideoData(videoID) {
  if (!videoID) {
    console.error('No videoID provided, cannot fetch video data!');
    return;
  }

  console.log('Fetching video data for videoID:', videoID); // Lägg till logg för att kontrollera vilket ID som används

  fetch('../../databas/videos.json') // Justera sökvägen om det behövs
    .then(response => response.json())
    .then(data => {
      console.log('Fetched video data:', data); // Logga hela datan för att se om alla videos är korrekta
      const video = data.find(video => video.id == videoID);
      console.log('Video found:', video); // Logga hela videoobjektet för att kontrollera

      if (video) {
        console.log('Video URL:', video.url); // Logga URL för att se om den finns
        updateVideoPlayer(video);
      } else {
        console.error('Video not found for videoID:', videoID); // Logga om ingen video hittades
      }
    })
    .catch(error => console.error('Error loading videos.json:', error)); // Logga om det är något fel vid hämtning av JSON
}

// Funktion för att uppdatera videospelaren med rätt video
function updateVideoPlayer(video) {
  // Hitta videospelarelementet
  const videoPlayer = document.querySelector('.video_player .main-video');
  if (videoPlayer) {
    console.log('Setting video URL:', video.url); // Lägg till logg för att visa vad som sätts
    if (video.url) {
      videoPlayer.src = video.url; // Sätt rätt videofil
    } else {
      console.error('Video URL is missing!');
    }
  }

  // Uppdatera titel
  const titleElement = document.querySelector('.video_player .video-title');
  if (titleElement) {
    titleElement.textContent = video.title || 'No title available'; // Uppdatera titel
  }

  // Uppdatera thumbnail
  const thumbnailElement = document.querySelector('.video_player .thumbnail');
  if (thumbnailElement) {
    thumbnailElement.src = video.thumbnail || 'default-thumbnail.jpg'; // Uppdatera thumbnail
  }

  // Uppdatera videoinformation (titel och beskrivning)
  const videoInfo = document.querySelector('#video_info');
  if (videoInfo) {
    videoInfo.innerHTML = `
      <h3>${video.title || 'No title available'}</h3>
      <p>${video.description || 'No description available'}</p>
    `;
  }
}

// Hämta videoID från URL och ladda rätt video
const videoID = getVideoIDFromURL();
console.log('Video ID from URL:', videoID); // Logga här också för att vara säker på att ID:et hämtas korrekt
if (videoID) {
  fetchVideoData(videoID); // Om videoID finns i URL:en, hämta videon
} else {
  console.error('No videoID in URL');
}