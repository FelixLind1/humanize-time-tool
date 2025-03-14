async function getVideoData(videoId) {
    try {
        const response = await fetch('../../databas/videos.json');
        if (!response.ok) {
            throw new Error('Video data could not be fetched.');
        }
        const videoData = await response.json();
        const video = videoData.find(v => v.id === videoId);

        if (video) {
            // Lägg till titeln och beskrivningen i HTML
            document.getElementById('video_info').innerHTML = `
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            `;
        } else {
            console.error('Video not found');
        }
    } catch (error) {
        console.error('Error fetching video data:', error);
    }
}