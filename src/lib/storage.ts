import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// User storage
export interface StoredUser {
  username: string;
  passwordHash: string;
  createdAt: string;
}

export function getUsers(): Record<string, StoredUser> {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading users file:', error);
  }
  return {};
}

export function saveUsers(users: Record<string, StoredUser>): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users file:', error);
  }
}

export function getUser(username: string): StoredUser | null {
  const users = getUsers();
  return users[username] || null;
}

export function createUser(username: string, passwordHash: string): boolean {
  const users = getUsers();
  if (users[username]) {
    return false; // User already exists
  }
  users[username] = {
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  return true;
}

export function validateUser(username: string, passwordHash: string): boolean {
  const user = getUser(username);
  return user !== null && user.passwordHash === passwordHash;
}
