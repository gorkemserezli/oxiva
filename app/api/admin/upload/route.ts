import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'logo' or 'favicon'
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }
    
    // Validate file type based on upload type
    if (type === 'favicon') {
      // Only allow .ico files for favicon
      if (!file.name.endsWith('.ico') && file.type !== 'image/x-icon') {
        return NextResponse.json(
          { error: 'Favicon için sadece .ico dosyaları kabul edilir' },
          { status: 400 }
        )
      }
    } else {
      // Logo can be various image formats
      const validLogoTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
      if (!validLogoTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Geçersiz dosya tipi. PNG, JPG, SVG veya WebP kullanın' },
          { status: 400 }
        )
      }
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 2MB\'dan büyük olamaz' },
        { status: 400 }
      )
    }
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const filename = type === 'favicon' 
      ? `favicon-${timestamp}${extension}`
      : `logo-${timestamp}${extension}`
    
    const filepath = path.join(uploadDir, filename)
    
    // Write file
    await writeFile(filepath, buffer)
    
    // Return the public URL
    const publicUrl = `/uploads/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename 
    })
    
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken hata oluştu' },
      { status: 500 }
    )
  }
}