import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        timeline: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Sipariş yüklenemedi' },
      { status: 500 }
    )
  }
}

// Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const currentOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    const updates: any = {}
    const timelineEvents: any[] = []

    // Status update
    if (data.status && data.status !== currentOrder.status) {
      updates.status = data.status
      timelineEvents.push({
        action: 'STATUS_CHANGED',
        description: `Sipariş durumu ${data.status} olarak güncellendi`,
        userName: 'Admin'
      })

      // Auto update payment status for delivered orders
      if (data.status === 'DELIVERED' && currentOrder.paymentStatus !== 'COMPLETED') {
        updates.paymentStatus = 'COMPLETED'
      }
    }

    // Tracking number update
    if (data.trackingNumber !== undefined) {
      updates.trackingNumber = data.trackingNumber
      if (data.trackingNumber) {
        timelineEvents.push({
          action: 'TRACKING_ADDED',
          description: `Kargo takip numarası eklendi: ${data.trackingNumber}`,
          userName: 'Admin'
        })
      }
    }

    // Admin notes update
    if (data.adminNotes !== undefined) {
      updates.adminNotes = data.adminNotes
    }

    // Payment status update
    if (data.paymentStatus && data.paymentStatus !== currentOrder.paymentStatus) {
      updates.paymentStatus = data.paymentStatus
      timelineEvents.push({
        action: 'PAYMENT_UPDATED',
        description: `Ödeme durumu ${data.paymentStatus} olarak güncellendi`,
        userName: 'Admin'
      })
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updates,
        timeline: {
          create: timelineEvents
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        timeline: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Sipariş güncellenemedi' },
      { status: 500 }
    )
  }
}

// Cancel order
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Bu sipariş iptal edilemez' },
        { status: 400 }
      )
    }

    // Update order status
    await prisma.order.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        timeline: {
          create: {
            action: 'ORDER_CANCELLED',
            description: 'Sipariş iptal edildi',
            userName: 'Admin'
          }
        }
      }
    })

    // Restore product stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { error: 'Sipariş iptal edilemedi' },
      { status: 500 }
    )
  }
}