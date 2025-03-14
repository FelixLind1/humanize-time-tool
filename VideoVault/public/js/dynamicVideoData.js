// Tom array för att lagra videodata och profildata
let dynamicVideoData = [];
let profileData = [];

// Funktion för att hämta videodata och profildata från JSON-filer
async function loadDynamicVideoData() {
  try {
    const [videoResponse, profileResponse] = await Promise.all([
      fetch('../../databas/videos.json'),
      fetch('../../databas/profiles.json'),
    ]);

    if (!videoResponse.ok || !profileResponse.ok) {
      throw new Error(`Fel vid hämtning av data: ${videoResponse.statusText}, ${profileResponse.statusText}`);
    }

    dynamicVideoData = await videoResponse.json();
    profileData = await profileResponse.json();

    console.log("DynamicVideoData hämtad:", dynamicVideoData);
    console.log("ProfileData hämtad:", profileData);

    // Kontrollera om vi är på en profilsida eller startsidan
    const urlParams = new URLSearchParams(window.location.search);
    const channelIdFromUrl = urlParams.get('channelId');
    
    console.log("Hämtad kanal-ID från URL:", channelIdFromUrl);

    if (channelIdFromUrl) {
      displayProfileVideos(channelIdFromUrl);
    } else {
      displayAllVideos();
    }
    renderProfileDropdown(); // Rendera dropdown för profiler
  } catch (error) {
    console.error("Fel vid hämtning av data:", error);
    const resultsContainer = document.getElementById('videoGrid') || document.getElementById('ProfileVideoGrid');
    if (resultsContainer) {
      resultsContainer.innerHTML = "<p>Fel vid hämtning av videor. Vänligen försök igen senare.</p>";
    }
  }
}

// Funktion för att visa alla videor på index.html
function displayAllVideos() {
  const resultsContainer = document.getElementById('videoGrid');
  if (!resultsContainer) {
    console.error('Det gick inte att hitta elementet med ID "videoGrid".');
    return;
  }

  resultsContainer.innerHTML = ""; // Rensa tidigare resultat

  dynamicVideoData.forEach(video => {
    const profile = profileData.find(p => p.id === video.channelId);
    const validDuration = video['video-duration']
      ? convertDurationToSeconds(video['video-duration'])
      : 0;

    const videoElement = document.createElement('div');
    videoElement.classList.add('video-item');

    videoElement.innerHTML = `
      <a href="video.html?id=${video.id}" class="video-link">
        <div class="video-thumbnail-container">
          <img src="${video.thumbnail || 'https://www.fillmurray.com/100/100'}" alt="${video.title}" class="video-thumbnail">
          <div class="video-duration ${video.isLive ? 'live-duration' : ''}">
            ${video.isLive ? 'LIVE' : formatDuration(validDuration)}
          </div>
        </div>
        <div class="video-info">
          <div class="title-container">
            <h3 class="video-title">${truncateDescription(video.title, 50)}</h3>
            <a href="profile.html?channelId=${video.channelId}">
              <div class="logo-circle">
                <img src="../../databas/Profiles/${profile?.logo || 'logo.jpg'}" class="channel-logo-grid">
              </div>
            </a>
          </div>
          <div class="video-channel">${video.channelName}</div>
          <div class="video-views">
            ${video.isLive ? `${video.liveViewers} tittare` : formatViews(video.views)}
          </div>
        </div>
      </a>
    `;
    resultsContainer.appendChild(videoElement);
  });
}

// Funktion för att visa videor på profilsidan (specificerat kanalID)
function displayProfileVideos(channelId) {
  const resultsContainer = document.getElementById('channelContent');
  if (!resultsContainer) {
    console.error('Det gick inte att hitta elementet med ID "channelContent".');
    return;
  }

  resultsContainer.innerHTML = ""; // Rensa tidigare resultat
  console.log("Visar videor för kanal med ID:", channelId);

  const filteredVideos = dynamicVideoData.filter(video => video.channelId == channelId); // Dubbelkolla datatyper

  console.log("Filtrerade videor:", filteredVideos);

  if (!filteredVideos.length) {
    console.log("Inga videor tillgängliga för denna kanal.");
    resultsContainer.innerHTML = "<p>Inga videor tillgängliga för denna kanal.</p>";
    return;
  }

  filteredVideos.forEach(video => {
    const profile = profileData.find(p => p.id === video.channelId);
    const validDuration = video['video-duration']
      ? convertDurationToSeconds(video['video-duration'])
      : 0;

    const videoElement = document.createElement('div');
    videoElement.classList.add('video-item');

    videoElement.innerHTML = `
      <a href="video.html?id=${video.id}" class="video-link">
        <div class="video-thumbnail-container">
          <img src="${video.thumbnail || 'https://www.fillmurray.com/100/100'}" alt="${video.title}" class="video-thumbnail">
          <div class="video-duration ${video.isLive ? 'live-duration' : ''}">
            ${video.isLive ? 'LIVE' : formatDuration(validDuration)}
          </div>
        </div>
        <div class="video-info">
          <div class="title-container">
            <h3 class="video-title">${truncateDescription(video.title, 50)}</h3>
            <a href="profile.html?channelId=${video.channelId}">
              <div class="logo-circle">
                <img src="../../databas/Profiles/${profile?.logo || 'logo.jpg'}" class="channel-logo-grid">
              </div>
            </a>
          </div>
          <div class="video-channel">${video.channelName}</div>
          <div class="video-views">
            ${video.isLive ? `${video.liveViewers} tittare` : formatViews(video.views)}
          </div>
        </div>
      </a>
    `;
    resultsContainer.appendChild(videoElement);
  });
}

// Funktion för att rendera profiler i en dropdown
function renderProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  if (!dropdown) return;

  dropdown.innerHTML = profileData
    .map(profile => `<option value="${profile.id}">${profile.name}</option>`)
    .join('');

  dropdown.addEventListener('change', function () {
    handleProfileSelection(this.value);
  });
}

// Funktion för att hantera profilval
function handleProfileSelection(selectedChannelId) {
  console.log("Vald kanal:", selectedChannelId);
  displayProfileVideos(selectedChannelId);
}

// Konvertera tid från format "mm:ss" eller "hh:mm:ss" till sekunder
function convertDurationToSeconds(duration) {
  const parts = duration.split(':').map(Number);
  return parts.reduce((acc, time) => acc * 60 + time);
}

// Formatera visningstid till "hh:mm:ss" eller "mm:ss"
function formatDuration(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return hrs
    ? `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Formatera visningar till läsbart format
function formatViews(views) {
  if (!views || typeof views !== 'string') {
    return 'Ingen information om visningar';
  }

  const numericViews = parseInt(views.replace(/\s+/g, '')) || 0;

  // Hantera extremt stora värden
  if (numericViews >= 1e30) {
    return 'error: för stort värde';  // Om värdet är större än 1e30, visa felmeddelande
  } else if (numericViews >= 1e27) {
    return (numericViews / 1e27).toFixed(1) + ' QV visningar';  // Kvadriljarder
  } else if (numericViews >= 1e24) {
    return (numericViews / 1e24).toFixed(1) + ' QT visningar';  // Triljoner
  } else if (numericViews >= 1e21) {
    return (numericViews / 1e21).toFixed(1) + ' TR visningar';  // Trillioner
  } else if (numericViews >= 1e18) {
    return (numericViews / 1e18).toFixed(1) + ' TN visningar';  // Trillioner
  } else if (numericViews >= 1e15) {
    return (numericViews / 1e15).toFixed(1) + ' BD visningar';  // Biljarder
  } else if (numericViews >= 1e12) {
    return (numericViews / 1e12).toFixed(1) + ' BN visningar';  // Biljoner
  } else if (numericViews >= 1e9) {
    return (numericViews / 1e9).toFixed(1) + ' MD visningar';   // Miljarder
  } else if (numericViews >= 1e6) {
    return (numericViews / 1e6).toFixed(1) + ' MN visningar';   // Miljoner
  } else if (numericViews >= 1e3) {
    return (numericViews / 1e3).toFixed(1) + ' TN visningar';   // Tusen
  } else {
    return `${views} visningar`;  // Visar det exakta värdet för mindre än 1000
  }
}

// Funktion för att trunka en titel om den är för lång
function truncateDescription(description, length) {
  if (description.length > length) {
    return description.slice(0, length) + '...';
  }
  return description;
}

// Ladda videodata och profiler vid sidladdning
window.onload = loadDynamicVideoData;