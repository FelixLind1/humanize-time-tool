// Funktion för att spara texten till servern
function sparaText() {
    const rubrik = document.getElementById("rubrik");
    const userInput = document.getElementById("userInput").value;

    // Kontrollera om fältet är tomt
    if (userInput.trim() === "") {
        rubrik.innerHTML = "Inmatningsfältet är tomt. Skriv något!";
    } else {
        // Uppdatera rubriken med användarens text
        rubrik.innerHTML = `Du skrev: <strong>${userInput}</strong>`;

        // Skicka användarens input till servern för att spara den i data.json
        fetch('http://192.168.0.35:3003/save', {  // Rätt port
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: userInput })  // Skicka den inmatade texten
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Fel vid sparande');
            }
            return response.text();
        })
        .then(data => {
            console.log("Text sparad:", data);  // Logga serverns svar
            alert("Texten har sparats!");
        })
        .catch(err => {
            console.error('Fel vid sparande:', err);
            alert("Det gick inte att spara texten.");
        });
    }
}

// Funktion för att ladda text från servern
function laddaText() {
    fetch('http://192.168.0.35:3003/load', {  // Använd localhost här
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        console.log("Text laddad:", data);
        const rubrik = document.getElementById("rubrik");
        rubrik.innerText = data.text || "Inget sparat innehåll.";  // Uppdatera rubriken med laddad text
    })
    .catch(err => {
        console.error('Fel vid laddning:', err);
        alert("Det gick inte att ladda texten.");
    });
}

// Funktion för att ta bort texten från servern
function tabortText() {
    const rubrik = document.getElementById("rubrik");

    // Skicka en begäran till servern för att ta bort texten från data.json
    fetch('http://192.168.0.35:3003/delete', {  // Rätt URL
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })    
    .then(response => {
        if (!response.ok) {
            throw new Error('Fel vid borttagning');
        }
        return response.text();
    })
    .then(data => {
        console.log("Text borttagen:", data);  // Logga serverns svar
        rubrik.innerHTML = "Texten har tagits bort.";  // Uppdatera rubriken efter borttagning
    })
    .catch(err => {
        console.error('Fel vid borttagning:', err);
        alert("Det gick inte att ta bort texten.");
    });
}