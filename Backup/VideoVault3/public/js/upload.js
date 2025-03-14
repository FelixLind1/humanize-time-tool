const dropArea = document.getElementById('drop-area');
const videoUploadInput = document.getElementById('video-upload');
const uploadForm = document.getElementById('upload-form');
const videoPreview = document.getElementById('video-preview');
const videoTitleInput = document.getElementById('video-title'); // Lägg till referens till titelinput

dropArea.addEventListener('click', () => {
    videoUploadInput.click();
});

videoUploadInput.addEventListener('change', handleFiles);
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');
    const files = event.dataTransfer.files;
    if (files.length) {
        videoUploadInput.files = files;
        handleFiles();
    }
});

function handleFiles() {
    const file = videoUploadInput.files[0];
    if (file) {
        const videoURL = URL.createObjectURL(file);
        videoPreview.src = videoURL;
        videoPreview.style.display = 'block';
        uploadForm.style.display = 'block'; // Visa formuläret för uppladdning
        dropArea.style.display = 'none'; // Göm drag-och-släpp-området när en video är vald

        // Sätter filnamnet som standardtitel utan filändelsen
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        videoTitleInput.value = fileName;
    }
}