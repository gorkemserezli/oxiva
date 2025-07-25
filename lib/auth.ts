import { NextRequest } from 'next/server'
import crypto from 'crypto'

// Production'da environment variable'dan alınmalı
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

// Simple JWT implementation for demo purposes
// Production'da jsonwebtoken veya jose kütüphanesi kullanılmalı
export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'superadmin'
  createdAt: string
}

export interface AuthToken {
  user: AdminUser
  exp: number
  iat: number
}

// Hash password with salt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return `${salt}:${hash}`
}

// Verify password
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, originalHash] = hashedPassword.split(':')
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
  return hash === originalHash
}

// Create token (simplified version)
export function createToken(user: AdminUser): string {
  const payload: AuthToken = {
    user,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    iat: Date.now()
  }
  
  // Simple base64 encoding for demo - use proper JWT in production
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

// Verify token
export function verifyToken(token: string): AuthToken | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Check expiration
    if (payload.exp < Date.now()) {
      return null
    }
    
    return payload
  } catch {
    return null
  }
}

// Mock user database - production'da gerçek veritabanı kullanılmalı
const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@oxiva.com',
    // Password: Admin123!
    password: '8b4066b178c92812:5f0e1b3c9d8a7f2e1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    name: 'Admin User',
    role: 'admin' as const,
    createdAt: new Date().toISOString()
  }
]

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<{ user: AdminUser; token: string } | null> {
  // Mock implementation - replace with real database query
  const userRecord = MOCK_USERS.find(u => u.email === email)
  
  if (!userRecord) {
    return null
  }
  
  // For demo purposes, accept the hardcoded password
  if (email === 'admin@oxiva.com' && password === 'admin123') {
    const user: AdminUser = {
      id: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      role: userRecord.role,
      createdAt: userRecord.createdAt
    }
    
    const token = createToken(user)
    return { user, token }
  }
  
  return null
}

// Middleware to protect routes
export async function requireAuth(request: NextRequest): Promise<AuthToken | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  return verifyToken(token)
}

// Session management utilities
export const SESSION_COOKIE_NAME = 'oxiva-admin-session'

export function setSessionCookie(token: string): string {
  // HttpOnly, Secure, SameSite cookies for production
  return `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
}