import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fsPromises from 'fs/promises';

const app = express();
const PORT = 3003;  // Säkerställ att detta är samma port som i klienten

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Aktivera CORS och tillåt förfrågningar från frontend
const corsOptions = {
    origin: 'http://192.168.0.35:8083',  // Frontendens URL (ändra om du använder en annan)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));  // Aktivera CORS med de definierade inställningarna

app.use(express.json());
app.use(express.static('public'));

// Funktion för att hantera sparande av text
app.post('/save', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Texten är obligatorisk!');
    }

    const filePath = path.join(__dirname, 'data.json');

    try {
        // Läs den befintliga filen
        let data = { text: [] };  // Sätt en tom array som standard
        try {
            const fileData = await fsPromises.readFile(filePath, 'utf-8');
            data = JSON.parse(fileData);  // Om filen inte är tom, parse den
        } catch (err) {
            // Om filen inte finns eller inte kan läsas, skapa en ny fil
            console.log('Ingen tidigare data hittades, skapar ny fil.');
        }

        // Lägg till den nya texten i data
        data.text.push(text);

        // Skriv tillbaka till filen
        await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2));

        res.status(200).send('Text sparad!');
    } catch (err) {
        console.error('Fel vid skrivning till fil:', err);
        res.status(500).send('Kunde inte spara till fil');
    }
});

// Funktion för att ladda text
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

// Funktion för att ta bort text
app.delete('/delete', async (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    try {
        // Rensa innehållet i data.json
        await fsPromises.writeFile(filePath, JSON.stringify({ text: [] }, null, 2));
        res.status(200).send('Text borttagen!');
    } catch (err) {
        console.error('Fel vid borttagning:', err);
        res.status(500).send('Kunde inte ta bort texten');
    }
});

// Starta servern
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servern kör på http://192.168.1.100:${PORT}`);
});