import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from 'better-sqlite3';
import express from 'express';
import multer from 'multer';
import path from 'path';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

// Ställ in att servera statiska filer från "public/uploads"
app.use('/VideoVault/public/uploads', express.static(path.join(process.cwd(), 'public', 'uploads'))); // Använd process.cwd() istället för __dirname

// Middleware för säkerhet
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);  // Hämta salt rounds från .env

// Exempel på att hash lösenord
bcrypt.hash('dittLösenord', saltRounds, (err, hashedPassword) => {
    if (err) {
        console.error('Fel vid hashning av lösenord', err);
    } else {
        console.log('Hashed password:', hashedPassword);
    }
});

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

// Skapa en funktion för att generera JWT-token
function generateToken(user) {
    return jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Registrera användare (asynkron funktion)
async function registerUser(email, username, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Asynkron hashning av lösenord
        const stmt = db.prepare(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`);
        stmt.run(email, username, hashedPassword);
        console.log('Användare registrerad');
    } catch (error) {
        console.error('Fel vid registrering:', error.message);
    }
}

// Logga in användare (asynkron funktion)
async function loginUser(username, password) {
    try {
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (user && await bcrypt.compare(password, user.password)) {  // Asynkron verifiering av lösenord
            const token = generateToken(user);  // Generera JWT-token
            return { user, token };
        } else {
            throw 'Felaktiga inloggningsuppgifter';
        }
    } catch (error) {
        throw 'Fel vid inloggning';
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
        const allowedMimeTypes = ['video/mp4', 'video/webm', 'image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Ogiltig filtyp. Tillåtna typer är: video/mp4, video/webm, image/jpeg, image/png'), false);
        }
    }
});

// Registrera användare API
app.post('/api/register', async (req, res) => {
    const { email, username, password } = req.body;
    try {
        await registerUser(email, username, password);
        res.status(201).send('Användare registrerad');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Logga in användare API
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await loginUser(username, password);
        res.status(200).json({
            message: 'Inloggning lyckades',
            user: data.user,
            token: data.token
        });
    } catch (err) {
        res.status(400).send(err);
    }
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
        user_id: req.body.user_id // Inloggad användares ID (hämta från JWT eller session)
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