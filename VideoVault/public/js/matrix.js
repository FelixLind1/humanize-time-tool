const canvas = document.getElementById("matrix-canvas");
const ctx = canvas.getContext("2d");

// Anpassa canvas till fönsterstorlek
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%";
const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

// Rita Matrix-effekten
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0F0";
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, x) => {
        const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        ctx.fillText(char, x * fontSize, y * fontSize);

        // Återställ droppar
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
            drops[x] = 0;
        }
        drops[x]++;
    });
}

// Animering
setInterval(drawMatrix, 50);

// Uppdatera canvasstorlek vid fönsterändring
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Vänta tills sidan har laddats innan vi försöker spela ljudet
window.addEventListener('load', function() {
  var audioElement = document.getElementById('matrix-audio');
  // Försök att spela ljudet
  audioElement.play().catch(function(error) {
      console.log("Fel vid uppspelning av ljud: ", error);
  });
});