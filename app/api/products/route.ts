import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    if (slug) {
      // Get single product by slug
      const product = await prisma.product.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          shortDescription: true,
          price: true,
          comparePrice: true,
          stock: true,
          sku: true,
          status: true,
          images: true,
          features: true,
          seoTitle: true,
          seoDescription: true,
          seoKeywords: true,
          createdAt: true,
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      })
      
      if (!product) {
        return NextResponse.json(
          { error: 'Ürün bulunamadı' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(product)
    }
    
    // Get all active products
    const products = await prisma.product.findMany({
      where: {
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        comparePrice: true,
        stock: true,
        images: true,
        _count: {
          select: {
            orderItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(products)
    
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: 'Ürünler alınırken hata oluştu' },
      { status: 500 }
    )
  }
}