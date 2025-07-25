import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      userId,
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      district,
      sameAsDelivery,
      invoiceType,
      billingTitle,
      billingTcNo,
      billingTaxNo,
      billingTaxOffice,
      billingAddress,
      billingCity,
      billingDistrict,
      orderNote,
      productId,
      quantity,
      price,
      discountCode,
      discountAmount,
      subtotal,
      kdvAmount,
      shipping,
      total
    } = body
    
    // Validate required fields
    if (!email || !firstName || !lastName || !productId || !quantity) {
      return NextResponse.json(
        { error: 'Eksik bilgiler' },
        { status: 400 }
      )
    }
    
    // Check if product exists and has enough stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      )
    }
    
    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Yetersiz stok' },
        { status: 400 }
      )
    }
    
    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or get user
      let user = userId ? await tx.user.findUnique({ where: { id: userId } }) : null
      
      if (!user && email) {
        // Check if user exists with this email
        user = await tx.user.findUnique({ where: { email } })
        
        if (!user) {
          // Create guest user
          user = await tx.user.create({
            data: {
              email,
              firstName,
              lastName,
              phone,
              password: '', // Guest users don't have passwords
              role: 'USER',
              emailVerified: false
            }
          })
        }
      }
      
      if (!user) {
        throw new Error('Kullanıcı oluşturulamadı')
      }
      
      // Create delivery address
      const deliveryAddress = await tx.address.create({
        data: {
          userId: user.id,
          title: 'Teslimat Adresi',
          firstName,
          lastName,
          phone,
          address,
          city,
          district,
          type: 'DELIVERY'
        }
      })
      
      // Create billing address if different
      let billingAddressId = deliveryAddress.id
      if (!sameAsDelivery) {
        const billingAddressRecord = await tx.address.create({
          data: {
            userId: user.id,
            title: billingTitle || 'Fatura Adresi',
            firstName,
            lastName,
            phone,
            address: billingAddress || '',
            city: billingCity || '',
            district: billingDistrict || '',
            tcNo: billingTcNo,
            taxNo: billingTaxNo,
            taxOffice: billingTaxOffice,
            type: 'BILLING'
          }
        })
        billingAddressId = billingAddressRecord.id
      }
      
      // Generate order number
      const orderCount = await tx.order.count()
      const orderNumber = `ORD-${(orderCount + 1).toString().padStart(6, '0')}`
      
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          status: 'PENDING_PAYMENT',
          subtotal,
          shipping,
          discount: discountAmount || 0,
          kdv: kdvAmount,
          total,
          note: orderNote,
          deliveryAddressId: deliveryAddress.id,
          billingAddressId,
          paymentMethod: 'CREDIT_CARD',
          shippingMethod: 'MNG_KARGO',
          items: {
            create: {
              productId: product.id,
              quantity,
              price,
              total: price * quantity
            }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          deliveryAddress: true,
          billingAddress: true
        }
      })
      
      // Update product stock
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: product.stock - quantity
        }
      })
      
      // Save discount code usage if any
      if (discountCode) {
        // In a real app, you would track discount code usage
        // For now, just log it in the order
      }
      
      return order
    })
    
    return NextResponse.json({
      success: true,
      order: result,
      orderId: result.id,
      orderNumber: result.orderNumber
    })
    
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sipariş oluşturulurken hata oluştu' },
      { status: 500 }
    )
  }
}

// Get order details for payment confirmation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const orderId = searchParams.get('orderId')
    
    if (!orderNumber && !orderId) {
      return NextResponse.json(
        { error: 'Sipariş numarası veya ID gerekli' },
        { status: 400 }
      )
    }
    
    const order = await prisma.order.findFirst({
      where: orderNumber ? { orderNumber } : { id: orderId! },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        deliveryAddress: true,
        billingAddress: true
      }
    })
    
    if (!order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(order)
    
  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: 'Sipariş bilgileri alınırken hata oluştu' },
      { status: 500 }
    )
  }
}