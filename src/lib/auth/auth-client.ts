/**
 * Centralized Client-side Authentication Helpers
 */

import { AuthUser } from '@/types/auth';

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
 * Send OTP verification code to email
 */
export async function sendOTP(email: string): Promise<{ token: string }> {
  const res = await fetch('/api/auth/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send OTP');
  }
  return data;
}

/**
 * Verify OTP code
 */
export async function verifyOTP(token: string, otp: string): Promise<{ success: boolean; email: string }> {
  const res = await fetch('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, otp }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Verification failed');
  }
  return data;
}

/**
 * Request password reset code
 */
export async function forgotPassword(email: string): Promise<{ token: string }> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send reset code');
  }
  return data;
}

/**
 * Reset password with OTP
 */
export async function resetPassword(data: { email: string; otp: string; newPassword: string; token: string }): Promise<void> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Password reset failed');
  }
}

/**
 * Update user profile
 */
export async function updateProfile(data: { phone?: string | null; address?: string | null; fullName?: string | null }): Promise<void> {
  const res = await fetch('/api/auth/update-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Failed to update profile');
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
