import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { customerEmail: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { customerPhone: { contains: search } }
      ]
    }
    
    if (status !== 'all') {
      where.status = status
    }
    
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          _count: {
            select: { items: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({ where })
    ])

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Siparişler yüklenemedi' },
      { status: 500 }
    )
  }
}

// Create new order (manual order)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Generate order number
    const orderCount = await prisma.order.count()
    const orderNumber = `ORD-${(orderCount + 1).toString().padStart(6, '0')}`

    // Calculate totals
    let subtotal = 0
    for (const item of data.items) {
      subtotal += item.price * item.quantity
    }
    
    const tax = subtotal * 0.20 // %20 KDV
    const total = subtotal + tax + (data.shippingCost || 0) - (data.discount || 0)

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerName: data.customerName,
        deliveryAddress: data.deliveryAddress,
        billingAddress: data.billingAddress || data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        paymentStatus: 'COMPLETED', // Manual orders are paid
        shippingCompany: data.shippingCompany,
        shippingCost: data.shippingCost || 0,
        subtotal,
        tax,
        discount: data.discount || 0,
        total,
        status: 'CONFIRMED',
        orderNote: data.orderNote,
        adminNotes: 'Manuel sipariş',
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity
          }))
        },
        timeline: {
          create: {
            action: 'ORDER_CREATED',
            description: 'Sipariş manuel olarak oluşturuldu',
            userName: 'Admin'
          }
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        timeline: true
      }
    })

    // Update product stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Sipariş oluşturulamadı' },
      { status: 500 }
    )
  }
}