import express from 'express';
import https from 'https';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fsPromises from 'fs/promises';
import greenlockExpress from 'greenlock-express';
import greenlockStoreFs from 'greenlock-store-fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = 3003;

// Skapa Greenlock-express-instans med rätt metod
const le = greenlockExpress.create({
    version: 'draft-11',
    server: 'https://acme-v02.api.letsencrypt.org/directory',
    configDir: '/home/ituxs/.config/greenlock',
    approveDomains: ['felixlab.se'],
    email: 'your-email@example.com',
    agreeToTerms: true,
    store: greenlockStoreFs
});

// CORS-inställningar
const corsOptions = {
    origin: 'https://felixlab.se',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static('public'));

// Endpoints (save, load, delete)
app.post('/save', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Texten är obligatorisk!');
    }
    const filePath = path.join(__dirname, 'data.json');
    try {
        let data = { text: [] };
        try {
            const fileData = await fsPromises.readFile(filePath, 'utf-8');
            data = JSON.parse(fileData);
        } catch (err) {
            console.log('Ingen tidigare data hittades, skapar ny fil.');
        }
        data.text.push(text);
        await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));
        res.status(200).send('Text sparad!');
    } catch (err) {
        console.error('Fel vid skrivning till fil:', err);
        res.status(500).send('Kunde inte spara till fil');
    }
});

app.get('/load', async (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    try {
        const data = await fsPromises.readFile(filePath, 'utf-8');
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (err) {
        console.error('Fel vid läsning av fil:', err);
        res.status(500).send('Kunde inte läsa eller parsa filen');
    }
});

app.delete('/delete', async (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    try {
        await fsPromises.writeFile(filePath, JSON.stringify({ text: [] }, null, 2));
        res.status(200).send('Text borttagen!');
    } catch (err) {
        console.error('Fel vid borttagning:', err);
        res.status(500).send('Kunde inte ta bort texten');
    }
});

// Starta HTTPS-servern med Greenlock
le.listen(PORT, () => {
    console.log(`🔒 HTTPS-server körs på https://felixlab.se:${PORT}`);
});