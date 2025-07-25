import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Real database check
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json(
        { error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.firstName} ${user.lastName}`
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Giriş yapılamadı' },
      { status: 500 }
    )
  }
}