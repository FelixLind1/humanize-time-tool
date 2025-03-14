// Importera nödvändiga moduler
const bcrypt = require('bcrypt');
const db = require('better-sqlite3')('./databas/mydatabase.db');
const express = require('express');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const app = express();
const port = 3000;

// Middleware för säkerhet
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Skapa tabeller för användare och videor om de inte redan finns
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        username TEXT UNIQUE,
        password TEXT
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        tags TEXT,
        video_filename TEXT,
        thumbnail_filename TEXT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`).run();

// Registrera användare
function registerUser(email, username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10); // Hasha lösenordet
    const stmt = db.prepare(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`);
    try {
        stmt.run(email, username, hashedPassword);
        console.log('Användare registrerad');
    } catch (error) {
        console.error('Fel vid registrering:', error.message);
    }
}

// Logga in användare
function loginUser(username, password, callback) {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
        callback(null, user);
    } else {
        callback('Felaktiga inloggningsuppgifter', null);
    }
}

// Lägg till video
function addVideo({ title, description, tags, video_filename, thumbnail_filename, user_id }) {
    const stmt = db.prepare(`INSERT INTO videos (title, description, tags, video_filename, thumbnail_filename, user_id) VALUES (?, ?, ?, ?, ?, ?)`);
    try {
        stmt.run(title, description, tags, video_filename, thumbnail_filename, user_id);
        console.log('Video tillagd');
    } catch (error) {
        console.error('Fel vid tillägg av video:', error.message);
    }
}

// Konfigurera multer för filuppladdning
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // Begränsa filstorlek till 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/') || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Ogiltig filtyp'), false);
        }
    }
});

// Registrera användare API
app.post('/api/register', (req, res) => {
    const { email, username, password } = req.body;
    registerUser(email, username, password);
    res.status(201).send('Användare registrerad');
});

// Logga in användare API
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    loginUser(username, password, (err, user) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).json({ id: user.id, username: user.username });
        }
    });
});

// Uppladdning av video API
app.post('/api/upload', upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), (req, res) => {
    const { video, thumbnail } = req.files;
    if (!video) {
        return res.status(400).send('Ingen video uppladdad');
    }

    const videoData = {
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        video_filename: video[0].filename,
        thumbnail_filename: thumbnail ? thumbnail[0].filename : null,
        user_id: req.body.user_id // Inloggad användares ID
    };

    addVideo(videoData);
    res.status(200).json({
        message: 'Video uppladdad',
        video: video[0].filename,
        thumbnail: thumbnail ? thumbnail[0].filename : null,
    });
});

// Starta servern
app.listen(port, () => {
    console.log(`Server körs på http://localhost:${port}`);
});