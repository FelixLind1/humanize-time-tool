// Variabler
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// Byt mellan formulär
showRegisterLink.addEventListener('click', function() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

showLoginLink.addEventListener('click', function() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

// Hantera registrering
document.getElementById('register-btn').addEventListener('click', async function() {
    const email = document.getElementById('register-email').value;
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (email && username && password) {
        try {
            const response = await fetch('http://192.168.0.124:3000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registrering lyckades!');
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
            } else {
                alert(data.error || 'Fel vid registrering');
            }
        } catch (error) {
            alert('Något gick fel vid registreringen');
        }
    } else {
        alert('Vänligen fyll i alla fält!');
    }
});

// Hantera inloggning
document.getElementById('login-btn').addEventListener('click', async function() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://192.168.0.124:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token); // Spara JWT-token
            alert('Inloggning lyckades!');
            window.location.href = 'dashboard.html'; // Ändra till önskad sida
        } else {
            alert(data.error || 'Fel vid inloggning');
        }
    } catch (error) {
        alert('Något gick fel vid inloggningen');
    }
});

// Kolla om användaren är inloggad vid sidladdning
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('http://192.168.0.124:3000/check-auth', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                window.location.href = 'dashboard.html'; // Gå till dashboard om inloggad
            } else {
                localStorage.removeItem('token'); // Ta bort ogiltig token
            }
        });
    }
}

// Kör vid sidladdning
checkLoginStatus();

document.getElementById("toggle-password").addEventListener("click", function() {
  const passwordField = document.getElementById("login-password");
  if (passwordField.type === "password") {
    passwordField.type = "text";
    this.innerText = "🙈"; // Ändra ikon till "dölj"
  } else {
    passwordField.type = "password";
    this.innerText = "👁️"; // Ändra ikon till "visa"
  }
});