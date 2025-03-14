document.addEventListener('DOMContentLoaded', () => {
    const videoGridElement = document.getElementById('video-grid');

    // Example video data (could be replaced with a real API or database)
    const videos = [
        { title: "Sample Video 1", description: "A brief description of the video.", imageUrl: "https://via.placeholder.com/280x160?text=Video+1" },
        { title: "Sample Video 1", description: "A brief description of the video.", imageUrl: "https://via.placeholder.com/280x160?text=Video+1" },
        { title: "Sample Video 1", description: "A brief description of the video.", imageUrl: "https://via.placeholder.com/280x160?text=Video+1" },
        
    ];

    // Function to render video cards
    function renderVideos() {
        videoGridElement.innerHTML = ''; // Clear the grid first
        videos.forEach(video => {
            const videoCard = document.createElement('div');
            videoCard.classList.add('video-card');

            const videoImage = document.createElement('img');
            videoImage.src = video.imageUrl;

            const videoTitle = document.createElement('div');
            videoTitle.classList.add('video-title');
            videoTitle.textContent = video.title;

            const videoDescription = document.createElement('div');
            videoDescription.classList.add('video-description');
            videoDescription.textContent = video.description;

            videoCard.appendChild(videoImage);
            videoCard.appendChild(videoTitle);
            videoCard.appendChild(videoDescription);
            videoGridElement.appendChild(videoCard);
        });
    }

    // Initial render
    renderVideos();
});