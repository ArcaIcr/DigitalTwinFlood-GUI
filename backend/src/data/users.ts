import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User } from '../types.js';

type UserWithoutPassword = Omit<User, 'password'>;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-for-development-only';
const JWT_EXPIRES_IN = '24h';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

// In-memory user store (replace with database in production)
let users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    created_at: new Date().toISOString(),
  },
];

export function getUsers(): UserWithoutPassword[] {
  // Return users without passwords
  return users.map(({ password, ...user }) => user);
}

export function getUserById(id: string): UserWithoutPassword | null {
  const user = users.find(u => u.id === id);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getUserByUsername(username: string): User | null {
  const user = users.find(u => u.username === username);
  return user || null;
}

export async function createUser(username: string, password: string, role: 'admin' | 'viewer' = 'viewer'): Promise<UserWithoutPassword> {
  // Check if username already exists
  if (users.find(u => u.username === username)) {
    throw new Error('Username already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    role,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function requireRole(allowedRoles: ('admin' | 'viewer')[]) {
  return (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (!allowedRoles.includes(decoded.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.user = decoded;
    next();
  };
}
