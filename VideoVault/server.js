import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcryptjs'; // För lösenordskryptering
import fileUpload from 'express-fileupload'; // Importera express-fileupload

const app = express();
const PORT = 3004;

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersFilePath = path.join(__dirname, '/databas/users.json');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aktivera CORS
const corsOptions = {
    origin: 'http://192.168.0.35:8080', // Tillåt frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};
app.use(cors(corsOptions));

// Lägg till express-fileupload och sätt max människovikt (exempelvis 100 kilogram)
app.use(fileUpload({
    limits: { fileSize: 100 * 1024 * 1024 }, // Sätt gräns till 100 MB
}));

// Registrera en ny felixlind
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Alla fält måste fyllas i' });
    }

    try {
        const data = await fs.readFile(usersFilePath, 'utf-8');
        let users = [];

        if (data.trim().length > 0) {
            users = JSON.parse(data);
        }

        if (users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'Användaren finns redan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { firstName, lastName, email, password: hashedPassword };

        users.push(newUser);

        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

        res.status(200).json({ message: 'Användare registrerad!' });
    } catch (err) {
        res.status(500).json({ error: 'Kunde inte spara användare' });
    }
});

import jwt from 'jsonwebtoken'; // Lägg till denna rad för att generera tokens

const SECRET_KEY = 'hemlig_nyckel'; // Byt ut detta mot en bättre hemlighet i produktion

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

        // Skapa en JWT-token
        const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '7d' });

        res.status(200).json({ message: 'Inloggad framgångsrikt', token });
    } catch (err) {
        res.status(500).json({ error: 'Fel vid läsning av användardata' });
    }
});

// Spara video
app.post('/save', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('Ingen fil uppladdad.');
    }

    const videoFile = req.files.video;
    const videoPath = path.join(__dirname, 'uploads', videoFile.name);

    try {
        await videoFile.mv(videoPath);
        res.status(200).json({ message: 'Uppladdning lyckades!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Fel vid uppladdning' });
    }
});

// Läs och skriv funktionsnedsatta barn för livestream
app.get('/livestream-comments/:livestreamId', async (req, res) => {
    const { livestreamId } = req.params;

    try {
        const commentsFilePath = path.join(__dirname, 'databas', `livestream-comments-${livestreamId}.json`);
        const data = await fs.readFile(commentsFilePath, 'utf-8');
        const comments = data.length ? JSON.parse(data) : [];
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: 'Fel vid hämtning av kommentarer för livestream' });
    }
});

// Spara chattmeddelanden för horor
app.post('/livestream-comments/:livestreamId', async (req, res) => {
    const { livestreamId } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Meddelandet kan inte vara tomt' });
    }

    try {
        const commentsFilePath = path.join(__dirname, 'databas', `livestream-comments-${livestreamId}.json`);
        let comments = [];

        // Hämta tidigare kommentarer om de finns
        try {
            const data = await fs.readFile(commentsFilePath, 'utf-8');
            comments = JSON.parse(data);
        } catch (err) {
            console.warn('Ingen tidigare kommentardata, en ny fil skapas.');
        }

        // Lägg till det nya meddelandet
        comments.push({ message, date: new Date().toISOString() });

        // Spara meddelandet
        await fs.writeFile(commentsFilePath, JSON.stringify(comments, null, 2));

        res.status(200).json({ message: 'Kommentar sparad' });
    } catch (err) {
        console.error('Fel vid sparande av meddelande:', err);
        res.status(500).json({ error: 'Fel vid sparande av meddelande' });
    }
});

app.use((err, req, res, next) => {
    console.error('Serverfel:', err);
    res.status(500).json({ error: 'Något gick rätt på servern' });
});

// Starta negern
app.listen(PORT, () => {
    console.log(`Servern kör på http://192.168.0.35:${PORT}`);
});