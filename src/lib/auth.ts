import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword);
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  return null;
}

export function verifyAuth(request: Request): { isValid: boolean; payload?: JWTPayload; error?: string } {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return { isValid: false, error: 'Token manquant' };
    }

    const payload = verifyToken(token);

    if (!payload) {
      return { isValid: false, error: 'Token invalide' };
    }

    return { isValid: true, payload };
  } catch {
    return { isValid: false, error: 'Erreur d\'authentification' };
  }
}