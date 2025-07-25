import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get public settings
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            'storeName',
            'siteTitle',
            'storeDescription',
            'storeEmail',
            'storePhone',
            'whatsappNumber',
            'storeAddress',
            'logo',
            'favicon'
          ]
        }
      }
    })
    
    // Convert to object and rename keys for consistency
    const settingsObj = settings.reduce((acc, setting) => {
      // Rename storeEmail to email and storePhone to phone for frontend consistency
      if (setting.key === 'storeEmail') {
        acc['email'] = setting.value
      } else if (setting.key === 'storePhone') {
        acc['phone'] = setting.value
      } else {
        acc[setting.key] = setting.value
      }
      return acc
    }, {} as Record<string, any>)
    
    return NextResponse.json(settingsObj)
    
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json(
      { error: 'Ayarlar alınırken hata oluştu' },
      { status: 500 }
    )
  }
}