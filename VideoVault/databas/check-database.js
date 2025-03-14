const db = require('better-sqlite3')('../databas/mydatabase.db');

// Hämta alla tabeller
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
console.log('Tabeller:', tables);

// Om tabellen 'users' finns, hämta data från den
if (tables.some(table => table.name === 'users')) {
  const users = db.prepare('SELECT * FROM users;').all();
  console.log('Användardata:', users);
} else {
  console.log('Tabellen "users" finns inte.');
}

db.close();