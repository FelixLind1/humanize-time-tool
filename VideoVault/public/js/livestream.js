const urlParams = new URLSearchParams(window.location.search);
const livestreamId = urlParams.get('livestreamId');

// Skicka chattmeddelande till servern
document.getElementById('send-chat').addEventListener('click', function() {
    let chatInput = document.getElementById('chat-input').value;
    if (chatInput.trim() !== "") {
        let chatBox = document.getElementById('chat-box');
        let newMessage = document.createElement('div');
        newMessage.classList.add('chat-message');
        newMessage.textContent = chatInput;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Scrolla ner till senaste meddelandet
        document.getElementById('chat-input').value = ''; // Rensa inputfältet

        // Skicka meddelandet till servern för att spara i JSON-fil
        fetch('/livestream-comments/' + livestreamId, {  // Lägg till livestreamId i URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: chatInput })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Fel vid sparande av meddelande');
            }
        })
        .catch(error => {
            console.error('Fel vid kommunikation med servern:', error);
        });
    }
});

// Hämta och visa tidigare meddelanden från servern
function loadChatMessages() {
    fetch('/livestream-comments/' + livestreamId)
        .then(response => response.json())
        .then(data => {
            let chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            data.forEach(comment => {
                let messageDiv = document.createElement('div');
                messageDiv.classList.add('chat-message');
                messageDiv.textContent = comment.message;  // Visa meddelandet
                chatBox.appendChild(messageDiv);
            });
            chatBox.scrollTop = chatBox.scrollHeight; // Scrolla ner till senaste meddelandet
        })
        .catch(error => {
            console.error('Fel vid hämtning av meddelanden:', error);
        });
}

// Ladda tidigare meddelanden vid sidladdning
loadChatMessages();