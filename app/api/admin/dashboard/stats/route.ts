import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // Get current month stats
    const [
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      monthRevenue,
      lastMonthRevenue,
      recentOrders,
      topProducts
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: { paymentStatus: 'COMPLETED' },
        _sum: { total: true }
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Total customers
      prisma.user.count({ where: { role: 'USER' } }),
      
      // Total products
      prisma.product.count({ where: { status: 'ACTIVE' } }),
      
      // Current month revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: { gte: startOfMonth }
        },
        _sum: { total: true }
      }),
      
      // Last month revenue
      prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth
          }
        },
        _sum: { total: true }
      }),
      
      // Recent orders
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true
        }
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true,
          total: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      })
    ])

    // Get product details for top products
    const topProductIds = topProducts.map(p => p.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: topProductIds } }
    })
    
    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        ...product,
        soldQuantity: item._sum.quantity,
        revenue: item._sum.total
      }
    })

    // Calculate growth
    const lastMonthTotal = lastMonthRevenue._sum.total || 0
    const currentMonthTotal = monthRevenue._sum.total || 0
    const growth = lastMonthTotal > 0 
      ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0

    // Get order stats for chart
    const last30Days = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      _count: true,
      _sum: {
        total: true
      }
    })

    return NextResponse.json({
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalCustomers,
        totalProducts,
        monthRevenue: currentMonthTotal,
        growth: growth.toFixed(1)
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      chartData: last30Days
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'İstatistikler yüklenemedi' },
      { status: 500 }
    )
  }
}