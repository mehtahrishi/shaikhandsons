/**
 * PostgreSQL-based authentication service (replaces Appwrite)
 */

export interface AuthUser {
  id: number;
  email: string;
  fullName: string | null;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
}

/**
 * Create a new user account
 */
export async function signUp(email: string, password: string, fullName: string = ''): Promise<void> {
  const res = await fetch('/api/auth/create-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      fullName: fullName || undefined,
    }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Sign-up failed');
  }
}

/**
 * Validate credentials with the database
 */
export async function validateCredentials(email: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/validate-credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Invalid credentials');
  }
}

/**
 * Create session after OTP verification
 */
export async function createSessionFromOTP(email: string, password: string): Promise<void> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Login failed');
  }
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const res = await fetch('/api/auth/me', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user || null;
  } catch (err) {
    console.error('Failed to get current user:', err);
    return null;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to sign out:', err);
  }
}
