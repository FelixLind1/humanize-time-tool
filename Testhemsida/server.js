import express from "express";
import fs from "fs/promises"; // För asynkrona filoperationer
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Lägg till denna rad för att generera tokens

const app = express();
const port = 3000;
const SECRET_KEY = 'hemlig_nyckel'; // Byt ut detta mot en bättre hemlighet i produktion
const usersFilePath = "users.json"; // Lägg till korrekt filväg för användare

// Aktivera CORS för alla ursprung
app.use(cors());

// Middleware för att läsa JSON-data från body
app.use(express.json());

// Serverar statiska filer från "public"-mappen
app.use(express.static("public"));

// Endpoint för att hämta data från data.json
app.get("/data", async (req, res) => {
    try {
        const data = await fs.readFile("data.json", "utf8");
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(500).json({ error: "Kunde inte läsa filen" });
    }
});

// Endpoint för att spara ett nytt inlägg i data.json
app.post("/save", async (req, res) => {
    const newPost = req.body;

    try {
        const data = await fs.readFile("data.json", "utf8");
        let posts = JSON.parse(data);
        posts.push(newPost);

        await fs.writeFile("data.json", JSON.stringify(posts, null, 2));
        res.json({ message: "Inlägg sparat", post: newPost });
    } catch (err) {
        res.status(500).json({ error: "Kunde inte spara inlägget" });
    }
});

// Registrera en ny användare
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    try {
        const data = await fs.readFile(usersFilePath, 'utf-8'); // usersFilePath ska användas istället
        let users = data.trim().length > 0 ? JSON.parse(data) : [];

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Användaren finns redan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { email, username, password: hashedPassword };

        users.push(newUser);
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        res.status(200).json({ message: 'Användare registrerad!' });
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte spara användare' });
    }
});

// Logga in användare
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        const users = JSON.parse(data);

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ error: 'Ogiltig e-post eller lösenord' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Ogiltig e-post eller lösenord' });
        }

        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '7d' });
        res.status(200).json({ message: 'Inloggad framgångsrikt', token });
    } catch (err) {
        res.status(500).json({ error: 'Fel vid läsning av användardata' });
    }
});

// Kontrollera token vid sidladdning
app.get('/check-auth', (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Hämta token från Authorization-headern

    if (!token) {
        return res.json({ valid: false });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ valid: true, email: decoded.email });
    } catch (err) {
        res.json({ valid: false });
    }
});

// Starta servern och lyssna på IP-adressen och porten
app.listen(port, "192.168.0.124", () => {
    console.log(`Servern körs på http://192.168.0.124:${port}`);
});