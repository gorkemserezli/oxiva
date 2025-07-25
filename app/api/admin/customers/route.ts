import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      role: 'USER' // Only get customers, not admins
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } }
      ]
    }

    // Get customers with pagination
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          orders: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          },
          _count: {
            select: { 
              orders: true,
              addresses: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])

    // Calculate customer stats
    const customersWithStats = await Promise.all(
      customers.map(async (customer) => {
        const orderStats = await prisma.order.aggregate({
          where: { userId: customer.id },
          _sum: { total: true },
          _avg: { total: true }
        })

        return {
          ...customer,
          totalSpent: orderStats._sum.total || 0,
          averageOrderValue: orderStats._avg.total || 0,
          lastOrderDate: customer.orders[0]?.createdAt || null
        }
      })
    )

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Müşteriler yüklenemedi' },
      { status: 500 }
    )
  }
}