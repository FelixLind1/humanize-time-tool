document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');
    const fileContainer = document.getElementById('file-container');
    let files = [];

    // Dra och släpp eventhantering
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
        dropArea.addEventListener(event, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropArea.addEventListener('dragover', () => dropArea.classList.add('highlight'));
    dropArea.addEventListener('dragleave', () => dropArea.classList.remove('highlight'));
    dropArea.addEventListener('drop', (e) => {
        dropArea.classList.remove('highlight');
        handleFiles(e.dataTransfer.files);
    });

    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    function handleFiles(selectedFiles) {
        const fileArray = Array.from(selectedFiles);
        files = [...files, ...fileArray];
        displayFiles();
    }

    function displayFiles() {
        fileContainer.innerHTML = '';
        files.forEach((file, index) => {
            const fileCard = document.createElement('div');
            fileCard.classList.add('file-card');

            const fileName = document.createElement('p');
            fileName.textContent = file.name;

            const fileSize = document.createElement('p');
            fileSize.textContent = `Storlek: ${(file.size / 1024).toFixed(2)} KB`;

            fileCard.appendChild(fileName);
            fileCard.appendChild(fileSize);
            fileContainer.appendChild(fileCard);
        });
    }
});