document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('video-title');
    const descriptionInput = document.getElementById('video-description');
    const tagsInput = document.getElementById('video-tags');
    const videoInput = document.getElementById('video-upload');
    const thumbnailInput = document.getElementById('thumbnail-upload');
    const uploadButton = document.getElementById('upload-button');
    const videoContainer = document.querySelector('.video-container');
    const videoElement = document.getElementById('my-video');
    const videoSourceMp4 = document.getElementById('video-source');
    const uploadForm = document.getElementById('upload-form');
    const dropArea = document.getElementById('drop-area');
    const thumbnailPreview = document.getElementById('thumbnail-preview'); // Thumbnail förhandsvisning

    let videoFile = null;
    let thumbnailFile = null;
    let videoDuration = null;

    // Dölj thumbnail förhandsvisning från början
    thumbnailPreview.style.display = 'none';

    // Förhindra standardbeteende för drag-och-släpp
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => e.preventDefault());
        dropArea.addEventListener(eventName, (e) => e.stopPropagation());
    });

    // Visuell feedback för drag-och-släpp
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'));
    });

    // Hantera släppt fil
    dropArea.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            videoFile = files[0];
            console.log('Fil släppt:', videoFile);
            handleVideoPreview(videoFile);
        }
    });

    // Klicka på området för att öppna filväljaren
    dropArea.addEventListener('click', () => videoInput.click());

    // Hantera uppladdning via filväljaren
    videoInput.addEventListener('change', () => {
        if (videoInput.files.length > 0) {
            videoFile = videoInput.files[0];
            console.log('Fil vald via filväljare:', videoFile);
            handleVideoPreview(videoFile);
        }
    });

    // Förhandsgranska videon och extrahera längd
    function handleVideoPreview(file) {
        if (!file.type.startsWith('video/')) {
            alert('Vänligen välj en giltig videofil.');
            return;
        }

        const videoUrl = URL.createObjectURL(file);
        videoSourceMp4.src = videoUrl;
        videoElement.load();
        videoContainer.style.display = 'block';

        videoElement.onloadedmetadata = function() {
            const durationInSeconds = videoElement.duration;

            const hours = Math.floor(durationInSeconds / 3600);
            const minutes = Math.floor((durationInSeconds % 3600) / 60);
            const seconds = Math.floor(durationInSeconds % 60);

            const formattedDuration = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            console.log('Videons längd:', formattedDuration);

            videoDuration = formattedDuration;
        };

        uploadForm.style.display = 'block';
        dropArea.style.display = 'none'; 
    }

    // Förhandsgranska thumbnail
    thumbnailInput.addEventListener('change', () => {
        thumbnailFile = thumbnailInput.files[0];
        if (thumbnailFile && thumbnailFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                thumbnailPreview.src = e.target.result;
                thumbnailPreview.style.display = 'block';
            };
            reader.readAsDataURL(thumbnailFile);
        } else {
            thumbnailPreview.style.display = 'none';
        }
    });

    function laddaUpp() {
        if (!titleInput || !descriptionInput || !tagsInput) {
            alert("Ett eller flera formulärfält saknas i DOM.");
            return;
        }

        const title = titleInput.value;
        const description = descriptionInput.value;
        const tags = tagsInput.value;

        if (title.trim() === "" || description.trim() === "" || tags.trim() === "") {
            alert("Alla fält måste fyllas i!");
        } else if (!videoFile) {
            alert("Välj en video att ladda upp.");
        } else {
            // Generera ett unikt ID för varje video
            const uniqueId = `vid_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

            // Skapa en FormData för att skicka både video och metadata
            const formData = new FormData();
            formData.append('id', uniqueId); // Lägg till unikt ID
            formData.append('title', title);
            formData.append('description', description);
            formData.append('tags', tags);
            formData.append('video', videoFile); 
            formData.append('duration', videoDuration);
            formData.append('thumbnail', thumbnailFile); 

            fetch('http://192.168.0.35:3004/save', { 
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fel vid uppladdning');
                }
                return response.json();
            })
            .then(data => {
                console.log("Video uppladdad med ID:", uniqueId, data);
                alert("Videon har laddats upp!");
            })
            .catch(err => {
                console.error('Fel vid uppladdning:', err);
                alert("Det gick inte att ladda upp videon.");
            });            
        }
    }
    
    uploadButton.addEventListener('click', laddaUpp);
});