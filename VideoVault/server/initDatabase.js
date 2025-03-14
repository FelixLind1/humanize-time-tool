import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';  // Importera fs en gång i filen

// Hämta den aktuella filens URL och katalog
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sökväg till databasmappen och användardatafilen
const databaseDir = join(__dirname, '../databas');
const userDataPath = join(databaseDir, 'user_data.json');

// Grunddata för användardatabasen
const defaultUsers = [
    {
        id: 1,
        email: 'admin@example.com',
        password: '123456', // Du kan ersätta detta med ett hashat lösenord
        username: 'Admin',
    },
    {
        id: 2,
        email: 'user@example.com',
        password: 'password', // Ersätt med säkrare lösenordshantering
        username: 'User1',
    },
];

// Funktion för att initialisera databasen
function initializeDatabase() {
    // Kontrollera om databas-mappen finns, annars skapa den
    if (!fs.existsSync(databaseDir)) {
        fs.mkdirSync(databaseDir);
        console.log('Databas-mappen skapades.');
    }

    // Kontrollera om user_data.json finns, annars skapa den med grunddata
    if (!fs.existsSync(userDataPath)) {
        fs.writeFileSync(userDataPath, JSON.stringify(defaultUsers, null, 2), 'utf8');
        console.log('user_data.json skapades med grundläggande användardata.');
    } else {
        console.log('user_data.json finns redan. Ingen åtgärd behövs.');
    }
}

// Kör funktionen för att initialisera databasen
initializeDatabase();