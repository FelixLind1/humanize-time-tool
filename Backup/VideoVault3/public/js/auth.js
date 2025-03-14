// auth.js

// Funktion för att registrera en användare
async function registerUser(email, username, password) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, username, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Registrering lyckades!');
        } else {
            alert('Registrering misslyckades: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion för att logga in en användare
async function loginUser(email, password) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            // Spara användarinformation och logga in
            localStorage.setItem('user', JSON.stringify(data.user));
            alert('Inloggning lyckades!');
        } else {
            alert('Inloggning misslyckades: ' + data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Funktion för att logga ut användaren
function logoutUser() {
    localStorage.removeItem('user');
    alert('Utloggning lyckades!');
}