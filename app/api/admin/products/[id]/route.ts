import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        orderItems: {
          include: {
            order: true
          },
          take: 10,
          orderBy: { createdAt: 'desc' }
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
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Ürün yüklenemedi' },
      { status: 500 }
    )
  }
}

// Update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    
    // Check if SKU is unique (if changed)
    if (data.sku) {
      const existingSku = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          NOT: { id: params.id }
        }
      })
      
      if (existingSku) {
        return NextResponse.json(
          { error: 'Bu SKU zaten kullanımda' },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        shortDesc: data.shortDescription,
        price: data.price,
        comparePrice: data.comparePrice || null,
        sku: data.sku,
        stock: parseInt(data.stock || '0'),
        status: data.status,
        images: data.images || [],
        features: data.features || [],
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords
      }
    })

    return NextResponse.json({ product })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Ürün güncellenemedi' },
      { status: 500 }
    )
  }
}

// Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if product has orders
    const orderCount = await prisma.orderItem.count({
      where: { productId: params.id }
    })
    
    if (orderCount > 0) {
      return NextResponse.json(
        { error: 'Bu ürün siparişlerde kullanıldığı için silinemez' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Ürün silinemedi' },
      { status: 500 }
    )
  }
}