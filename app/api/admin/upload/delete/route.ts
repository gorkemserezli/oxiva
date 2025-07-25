import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { jwtVerify } from 'jose'

// Helper function to verify JWT
async function verifyToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'oxiva-secret-key-2024')
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Yetkilendirme gerekli' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const payload = await verifyToken(token)
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 403 }
      )
    }

    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Dosya adı gerekli' },
        { status: 400 }
      )
    }
    
    // Extract filename from URL if it's a full path
    const file = filename.startsWith('/uploads/') 
      ? filename.replace('/uploads/', '')
      : filename
    
    // Security: Prevent directory traversal
    if (file.includes('..') || file.includes('/')) {
      return NextResponse.json(
        { error: 'Geçersiz dosya adı' },
        { status: 400 }
      )
    }
    
    const filepath = path.join(process.cwd(), 'public', 'uploads', file)
    
    // Check if file exists and delete it
    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({ success: true, message: 'Dosya silindi' })
    } else {
      // Don't error if file doesn't exist, just return success
      return NextResponse.json({ success: true, message: 'Dosya zaten mevcut değil' })
    }
    
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Dosya silinirken hata oluştu' },
      { status: 500 }
    )
  }
}