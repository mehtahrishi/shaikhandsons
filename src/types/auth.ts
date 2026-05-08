export interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export interface AdminUser {
  name: string;
  email: string;
  role: string;
}

export interface AdminJWTPayload {
  adminEmail: string;
  role: 'ADMIN';
  iat: number;
  exp: number;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string | null;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
}
