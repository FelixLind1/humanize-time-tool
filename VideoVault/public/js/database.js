const sqlite3 = require('sqlite3').verbose();

// Skapa eller öppna databasen
const db = new sqlite3.Database('./mydatabase.db', (err) => {
    if (err) {
        console.error('Fel vid anslutning till databasen:', err.message);
    } else {
        console.log('Ansluten till databasen.');
    }
});

// Skapa en tabell för att lagra videor om den inte redan finns
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        tags TEXT,
        video_filename TEXT,
        thumbnail_filename TEXT
    )
`;

db.run(createTableQuery, (err) => {
    if (err) {
        console.error('Fel vid skapandet av tabellen:', err.message);
    } else {
        console.log('Tabellen videos skapad eller redan existerande.');
    }
});

// Stäng databasen när allt är klart
db.close((err) => {
    if (err) {
        console.error('Fel vid stängning av databasen:', err.message);
    } else {
        console.log('Databasen stängdes.');
    }
});