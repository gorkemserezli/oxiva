import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all products
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
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status !== 'all') {
      where.status = status
    }

    // Get products with pagination
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          _count: {
            select: { orderItems: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Ürünler yüklenemedi', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Create new product
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate unique slug
    let slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    
    // Check if slug exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    })
    
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        shortDesc: data.shortDescription,
        price: data.price,
        comparePrice: data.comparePrice || null,
        sku: data.sku,
        stock: parseInt(data.stock || '0'),
        status: data.status || 'DRAFT',
        images: data.images || [],
        features: data.features || [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Ürün oluşturulamadı' },
      { status: 500 }
    )
  }
}