import bcrypt from 'bcryptjs';

// Registrera användare
export function registerUser(db, email, username, password) {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`);
    try {
        stmt.run(email, username, hashedPassword);
        console.log('Användare registrerad:', username);
    } catch (error) {
        console.error('Fel vid registrering:', error.message);
        throw new Error('Fel vid registrering: ' + error.message);
    }
}

// Logga in användare
export function loginUser(db, username, password, callback) {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
        console.log('Användare inloggad:', username);
        callback(null, user);
    } else {
        console.error('Felaktiga inloggningsuppgifter:', username);
        callback('Felaktiga inloggningsuppgifter', null);
    }
}

// Lägg till video
export function addVideo(db, { title, description, tags, video_filename, thumbnail_filename, user_id }) {
    const stmt = db.prepare(`INSERT INTO videos (title, description, tags, video_filename, thumbnail_filename, user_id) VALUES (?, ?, ?, ?, ?, ?)`);
    try {
        stmt.run(title, description, tags, video_filename, thumbnail_filename, user_id);
        console.log('Video tillagd:', title);
    } catch (error) {
        console.error('Fel vid tillägg av video:', error.message);
        throw new Error('Fel vid tillägg av video: ' + error.message);
    }
}

// Sök efter videor
export function searchVideos(db, query) {
    console.log('Söker efter:', query);
    const videos = db.prepare(`
        SELECT * FROM videos
        WHERE title LIKE ? OR description LIKE ? OR tags LIKE ?
    `).all(`%${query}%`, `%${query}%`, `%${query}%`);

    return videos;
}