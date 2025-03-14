// Funktion för att ladda kommentarer från en lokal .json-fil
function loadComments() {
    fetch('http://192.168.0.35:3004/comments')  // Kontrollera sökvägen
        .then(response => response.json())
        .then(data => {
            const commentsContainer = document.getElementById('comments-container');
            commentsContainer.innerHTML = ''; // Rensa nuvarande kommentarer

            // Logga alla kommentarer
            if (data.length > 0) {
                console.log('Kommentarer hämtades:', data);
            } else {
                console.log('Inga kommentarer finns att visa.');
            }

            // Skapa en säker HTML-struktur för varje kommentar och lägg till i containern
            data.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.innerHTML = `
                    <strong>${sanitizeHTML(comment.username)}</strong>: ${sanitizeHTML(comment.comment)}
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => console.error('Fel vid hämtning av kommentarer:', error));
}

// Funktion för att lägga till en kommentar
function addComment() {
    const username = 'Användare';  // Här kan du använda den inloggades namn (t.ex. från localStorage)
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value;

    if (commentText.trim()) {
        const newComment = {
            username,
            comment: commentText
        };

        fetch('http://192.168.0.35:3004/add-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        })
        .then(response => response.json())
        .then(() => {
            loadComments(); // Uppdatera kommentarer direkt efter att den nya har lagts till
            commentInput.value = ''; // Töm inputfältet
        })
        .catch(error => console.error('Fel vid att lägga till kommentar:', error));
    } else {
        console.error('Kommentar kan inte vara tom.');
    }
}

// Enkel funktion för att sanera HTML
function sanitizeHTML(str) {
    const tempDiv = document.createElement('div');
    tempDiv.textContent = str;
    return tempDiv.innerHTML;
}

// Lägg till eventlyssnare för Enter-tangenten
document.getElementById('comment-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Förhindra att Enter ger ett radbryt
        addComment(); // Anropa funktionen för att lägga till kommentar
    }
});

// Ladda kommentarer när sidan laddas
window.onload = loadComments;