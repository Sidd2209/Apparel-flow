import db from '../db';

export interface IUser {
  id?: number;
  googleId: string;
  email: string;
  name: string;
  department?: 'DESIGN' | 'SOURCING' | 'PRODUCTION' | 'SALES' | 'INVENTORY';
  preferredHomepage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Example: Fetch user by googleId
export function getUserByGoogleId(googleId: string): IUser | undefined {
  const user = db.prepare('SELECT * FROM users WHERE googleId = ?').get(googleId);
  if (user && typeof user === 'object') return user as IUser;
  return undefined;
}

// Example: Create user
export function createUser(user: Omit<IUser, 'id'>): IUser {
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO users (googleId, email, name, department, preferredHomepage, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(user.googleId, user.email, user.name, user.department, user.preferredHomepage, now, now);
  return getUserByGoogleId(user.googleId)!;
}
