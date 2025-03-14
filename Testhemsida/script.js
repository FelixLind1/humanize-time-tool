document.addEventListener('DOMContentLoaded', function () {
    const contentContainer = document.getElementById("contentContainer");
    const postForm = document.getElementById("postForm");
    const header = document.getElementById('header');
    const storedUser = JSON.parse(localStorage.getItem('user'));

    
// Hantera inloggad användare och visa rätt header
if (storedUser) {
    header.innerHTML = `
        <h1>Välkommen, ${storedUser.username}</h1>
        <button class="logo-btn" onclick="logout()"> 
            <!-- Här är den enfärgade cirkeln som knapp -->
        </button>
    `;
} else {
    header.innerHTML = `
        <h1>Textpublicering</h1>
        <button onclick="redirectToLogin()">Login</button>
    `;
}
    // Hämta och visa befintliga inlägg från servern
    function fetchPosts() {
        fetch("http://192.168.0.124:3000/data")
            .then(response => response.json())
            .then(data => {
                contentContainer.innerHTML = ''; // Rensa tidigare inlägg
                data.forEach(post => {
                    let postElement = document.createElement('div');
                    postElement.classList.add('post');
                    postElement.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.content}</p>
                    `;
                    contentContainer.appendChild(postElement);
                });
            })
            .catch(error => {
                console.error("Fel vid hämtning av data:", error);
                contentContainer.innerHTML = "<p>Det gick inte att hämta inlägg. Försök igen senare.</p>";
            });
    }

    // Hämta och visa inlägg vid sidladdning
    fetchPosts();

    // Hantera inlämning av nytt inlägg
    postForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("postTitle").value;
        const content = document.getElementById("postContent").value;

        if (!title || !content) {
            alert("Vänligen fyll i både titel och innehåll!");
            return;
        }

        const newPost = { title, content };

        // Lägg till det nya inlägget på sidan
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${newPost.title}</h3>
            <p>${newPost.content}</p>
        `;
        contentContainer.prepend(postElement);

        // Rensa formuläret
        postForm.reset();

        // Skicka det nya inlägget till servern för att spara i JSON
        fetch("http://192.168.0.124:3000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newPost)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Inlägg sparat:", data);
            fetchPosts();  // Uppdatera listan av inlägg
        })
        .catch(error => {
            console.error("Fel vid sparande av inlägg:", error);
            alert("Det gick inte att spara inlägget. Försök igen senare.");
        });
    });
});

// Funktion för att logga ut användaren
function logout() {
    localStorage.removeItem('user');
    // Omdirigera till login-sidan efter utloggning
    window.location.href = 'login.html';
}

// Funktion för att omdirigera till login-sidan
function redirectToLogin() {
    window.location.href = 'login-signup.html';
}