const bcrypt = require('bcrypt');
const saltRounds = 10; // Broj rundi za heširanje

export function hashPassword(password: String) {
  return bcrypt.hash(password, saltRounds);
}

export function checkPassword(password: String, hashedPassword: String) {
  return bcrypt.compare(password, hashedPassword);
}
