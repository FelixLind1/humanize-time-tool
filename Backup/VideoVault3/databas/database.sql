CREATE DATABASE videowebsite;

USE videowebsite;

-- Tabell för användare
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    channel_id VARCHAR(20) NOT NULL UNIQUE, -- Kanal-ID genereras vid kontoskapning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabell för videor
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Koppling till användare (kanal)
    video_title VARCHAR(100),
    description TEXT,
    tags VARCHAR(255),
    filename VARCHAR(255),
    thumbnail_filename VARCHAR(255),
    views INT DEFAULT 0, -- Antal visningar, börjar på 0
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);