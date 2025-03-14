const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydatabase.db');

// Skapa en tabell för att lagra videor
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        tags TEXT,
        video_filename TEXT,
        thumbnail_filename TEXT
    )`);
});

// Stäng databasen
db.close();