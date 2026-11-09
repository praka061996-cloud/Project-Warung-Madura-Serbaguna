/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from '../types/index.ts';

export interface RegisteredAccount {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

const STORAGE_KEY = 'ms_registered_accounts_v1';
const SESSION_KEY = 'ms_session_uid_v1';

// In-memory fallback if localStorage is unavailable (e.g. strict test environment)
let inMemoryStore: RegisteredAccount[] = [];

// Cryptographically hash password using standard SHA-256 with salt
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${password}::${salt}::ms_secret_2026`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Generate secure random salt
export function generateSalt(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Get all registered accounts
export function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as RegisteredAccount[];
      }
    }
  } catch (e) {
    console.warn('Could not read registered accounts from localStorage:', e);
  }
  return inMemoryStore;
}

// Save accounts list
function saveRegisteredAccounts(accounts: RegisteredAccount[]): void {
  inMemoryStore = accounts;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
    }
  } catch (e) {
    console.warn('Could not save registered accounts to localStorage:', e);
  }
}

// Find account by email (case-insensitive)
export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const clean = email.trim().toLowerCase();
  return getRegisteredAccounts().find((acc) => acc.email.toLowerCase() === clean);
}

// Find account by UID
export function findAccountByUid(uid: string): RegisteredAccount | undefined {
  return getRegisteredAccounts().find((acc) => acc.uid === uid);
}

// Register a new account into the secure store
export async function saveNewAccount(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  uid?: string;
}): Promise<RegisteredAccount> {
  const accounts = getRegisteredAccounts();
  const cleanEmail = data.email.trim().toLowerCase();

  const existing = accounts.find((a) => a.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('Alamat Gmail atau email ini sudah pernah terdaftar. Silakan masuk ke akun Anda.');
  }

  const salt = generateSalt();
  const passwordHash = await hashPasswordWithSalt(data.password, salt);
  const uid = data.uid || `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const newAccount: RegisteredAccount = {
    uid,
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    role: data.role,
    passwordHash,
    salt,
    createdAt: new Date().toISOString(),
  };

  accounts.push(newAccount);
  saveRegisteredAccounts(accounts);
  return newAccount;
}

// Verify entered password against stored salt and hash
export async function verifyAccountPassword(
  account: RegisteredAccount,
  enteredPassword: string
): Promise<boolean> {
  const computedHash = await hashPasswordWithSalt(enteredPassword, account.salt);
  return computedHash === account.passwordHash;
}

// Active session helpers
let inMemorySessionUid: string | null = null;

export function getActiveSessionUid(): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(SESSION_KEY);
    }
  } catch {
    // ignore
  }
  return inMemorySessionUid;
}

export function setActiveSessionUid(uid: string): void {
  inMemorySessionUid = uid;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, uid);
    }
  } catch {
    // ignore
  }
}

export function clearActiveSession(): void {
  inMemorySessionUid = null;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // ignore
  }
}

// Role Avatar helper
export function getAvatarForRole(role: UserRole): string {
  switch (role) {
    case 'owner':
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80';
    case 'courier':
      return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80';
    case 'admin':
      return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80';
    case 'customer':
    default:
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  }
}
