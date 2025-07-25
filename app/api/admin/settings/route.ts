import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { SignJWT, jwtVerify } from 'jose'

const prisma = new PrismaClient()

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

// Get settings
export async function GET(request: NextRequest) {
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

    // Get all settings
    const settings = await prisma.setting.findMany()
    
    // Convert to object format
    const settingsObject = settings.reduce((acc: any, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Ayarlar yüklenemedi' },
      { status: 500 }
    )
  }
}

// Update settings
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

    const data = await request.json()
    
    // Update each setting
    const updates = await Promise.all(
      Object.entries(data).map(async ([key, value]) => {
        return prisma.setting.upsert({
          where: { key },
          update: { value: value as any },
          create: {
            key,
            value: value as any,
            description: getSettingDescription(key)
          }
        })
      })
    )

    return NextResponse.json({ success: true, updated: updates.length })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Ayarlar güncellenemedi' },
      { status: 500 }
    )
  }
}

// Helper function to get setting descriptions
function getSettingDescription(key: string): string {
  const descriptions: Record<string, string> = {
    storeName: 'Mağaza adı',
    siteTitle: 'Site başlığı - tarayıcı sekmesinde görünür',
    storeEmail: 'Mağaza e-posta adresi',
    storePhone: 'Mağaza telefon numarası',
    storeAddress: 'Mağaza adresi',
    whatsappNumber: 'WhatsApp iletişim numarası',
    logo: 'Mağaza logosu',
    favicon: 'Tarayıcı simgesi',
    paymentMethods: 'Aktif ödeme yöntemleri',
    paytrMerchantId: 'PayTR Merchant ID',
    paytrMerchantKey: 'PayTR Merchant Key',
    paytrMerchantSalt: 'PayTR Merchant Salt',
    paytrSuccessUrl: 'PayTR başarılı ödeme URL',
    paytrFailUrl: 'PayTR başarısız ödeme URL',
    bankAccounts: 'Banka hesap bilgileri'
  }
  
  return descriptions[key] || key
}