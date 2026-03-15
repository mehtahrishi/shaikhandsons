import { ID, AppwriteException } from 'appwrite';
import { account } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export type AuthUser = {
  $id: string;
  name: string;
  email: string;
  emailVerification: boolean;
  phone?: string;
  labels?: string[];
};

// ─── Sign Up ─────────────────────────────────────────────────────────────────

/**
 * Creates a new Appwrite account only.
 * User must still login afterwards.
 */
export async function signUp({ name, email, password }: SignUpData): Promise<void> {
  try {
    await account.create(ID.unique(), email, password, name);
  } catch (err) {
    const e = err as AppwriteException;
    throw new Error(e.message ?? 'Sign-up failed. Please try again.');
  }
}

// ─── Login Validation ────────────────────────────────────────────────────────

/**
 * Verifies email+password credentials by creating a temporary session and deleting it.
 * This proves the credentials are correct before we send the OTP.
 */
export async function validateCredentials(email: string, password: string): Promise<void> {
  try {
    try {
      // Clean up any existing session just in case
      await account.deleteSession('current');
    } catch {
      // ignore
    }

    // This throws if credentials are bad
    await account.createEmailPasswordSession(email, password);

    // Delete it immediately — real session comes after OTP!
    await account.deleteSession('current');
  } catch (err) {
    const e = err as AppwriteException;
    throw new Error(e.message ?? 'Invalid credentials. Please try again.');
  }
}

// ─── Create Final Session ───────────────────────────────────────────────────

/**
 * Creates the actual Appwrite session after the OTP has been verified.
 */
export async function createSessionFromCredentials(email: string, password: string): Promise<void> {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (err) {
    const e = err as AppwriteException;
    throw new Error(e.message ?? 'Failed to create session after OTP.');
  }
}

// ─── Get Current User ─────────────────────────────────────────────────────────

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const user = await account.get();
    return user as unknown as AuthUser;
  } catch {
    return null;
  }
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<void> {
  try {
    await account.deleteSession('current');
  } catch {
    // Ignore – already logged out
  }
}
